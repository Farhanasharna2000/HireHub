import { loginUser } from "@/app/actions/auth/login";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect, { collectionNamesObj } from "./dbConnect";

declare module "next-auth" {
  interface User {
    username?: string;
    role?: string;
  }
  interface Session {
    user: {
      id?: string;
      username?: string;
      role?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials?: Record<"email" | "password", string>) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await loginUser(credentials);

        if (user) {
          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            role: user.role,
          };
        } else {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (!user || !account) return false;

      const { providerAccountId, provider } = account;
      const { email: user_email, image, name } = user;

      const usersCollection = dbConnect(collectionNamesObj.usersCollection);

      let existingUser = await usersCollection.findOne({
        $or: [{ providerAccountId }, { email: user_email }],
      });

      if (!existingUser) {
        // Create new user
        const newUser = {
          providerAccountId,
          provider,
          email: user_email,
          image,
          username: name,
          role: "job_seeker", // default role
        };
        const insertResult = await usersCollection.insertOne(newUser);
        existingUser = { ...newUser, _id: insertResult.insertedId };
      } else {
        // If existing user has no image but Google provides one, update it
        if (!existingUser.image && user.image) {
          await usersCollection.updateOne(
            { _id: existingUser._id },
            { $set: { image: user.image } }
          );
          existingUser.image = user.image;
        }

        // Also update providerAccountId if it doesn't exist
        if (!existingUser.providerAccountId && providerAccountId) {
          await usersCollection.updateOne(
            { _id: existingUser._id },
            { $set: { providerAccountId } }
          );
          existingUser.providerAccountId = providerAccountId;
        }
      }

      // Attach to session
      user.id = existingUser._id.toString();
      user.username = existingUser.username;
      user.role = existingUser.role;

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
