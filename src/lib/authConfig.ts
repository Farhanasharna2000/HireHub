import { loginUser } from "@/app/actions/auth/login";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect, { collectionNamesObj } from "./dbConnect";
import { ObjectId } from "mongodb";

declare module "next-auth" {
  interface User {
    username?: string;
    role?: string;
    companyName?: string;
    companyLogo?: string;
    website?: string;
    location?: string;
    description?: string;
    teamSize?: string;
    foundedYear?: number;
  }
  interface Session {
    user: {
      id?: string;
      username?: string;
      role?: string;
      companyName?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      companyLogo?: string | null;
      website?: string | null;
      location?: string | null;
      description?: string | null;
      teamSize?: string | null;
      foundedYear?: number | null;
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
            companyName: user.companyName,
            companyLogo: user.companyLogo || null,
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
          role: "recruiter", // default role
          companyName: 'N/A', // default company name
          companyLogo: null, // default company logo

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
      user.companyName = existingUser.companyName;
      user.companyLogo = existingUser.companyLogo;
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id && session.user) {
        const usersCollection = dbConnect(collectionNamesObj.usersCollection);
        const freshUser = await usersCollection.findOne({
          _id: new ObjectId(token.id as string),
        });

        if (freshUser) {
          session.user.id = freshUser._id.toString();
          session.user.username = freshUser.username;
          session.user.role = freshUser.role;
          session.user.companyName = freshUser.companyName;
          session.user.companyLogo = freshUser.companyLogo;
          session.user.website = freshUser.website;
          session.user.location = freshUser.location;
          session.user.description = freshUser.description;
          session.user.teamSize = freshUser.teamSize;
          session.user.foundedYear = freshUser.foundedYear;
        }
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};