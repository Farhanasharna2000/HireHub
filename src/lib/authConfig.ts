import { loginUser } from "@/app/actions/auth/login";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect, { collectionNamesObj } from "./dbConnect";

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials?: Record<"email" | "password", string>) {
        // console.log(credentials)
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await loginUser(credentials);
        console.log(user);

        if (user) {
          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
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
      // console.log(user, account)
      if (!user || !account) return false;
      const { providerAccountId, provider } = account;
      const { email: user_email, image, name } = user;
      const usersCollection = dbConnect(collectionNamesObj.usersCollection);
      const isExist = await usersCollection.findOne({ providerAccountId });
      if (!isExist) {
        const payload = {
          providerAccountId,
          provider,
          email: user_email,
          image,
          name,
        };
        await usersCollection.insertOne(payload);
      }
      return true;
    },
  },
};
