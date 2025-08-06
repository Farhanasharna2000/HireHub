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

      // Check if user exists by providerAccountId
      let existingUser = await usersCollection.findOne({ providerAccountId });

      if (!existingUser) {
        // Create new user with defaults
        const newUser = {
          providerAccountId,
          provider,
          email: user_email,
          image,
          username: name,
          role: "job_seeker", // default role for Google users
        };
        const insertResult = await usersCollection.insertOne(newUser);
        existingUser = { ...newUser, _id: insertResult.insertedId };
      }

      // Attach to user object so jwt callback can use
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
