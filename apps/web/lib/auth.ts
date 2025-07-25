import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import bcrypt from "bcrypt";

import { prismaClient } from "@repo/db/client";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return;
        }
        let username = credentials.username;
        let password = credentials.password;
        console.log(username);

        try {
          const user = await prismaClient.user.findFirst({
            where: { username },
          });

          if (!user) {
            console.log("userdoesntexist");

            return null;
          }

          if (!user.password) {
            console.log("Google account, use Google Sign-in");
            return null;
          }

          const verified = await bcrypt.compare(password, user.password);

          if (!verified) {
            console.log("Invalid password");
            return null;
          }

          return {
            name: user.username,
            email: user.email,
          };
        } catch (error) {
          console.log(error);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          let existingUser = await prismaClient.user.findUnique({
            where: { username: user.name || undefined },
          });

          if (existingUser) {
            if (!existingUser.googleId) {
              await prismaClient.user.update({
                where: { username: existingUser.username },
                data: {
                  googleId: account.providerAccountId,
                },
              });
            }

            user.name = existingUser.username;

            return true;
          } else {
            console.log(user);

            const newUser = await prismaClient.user.create({
              data: {
                email: user.email,
                username: user.name,

                googleId: account.providerAccountId,
              },
            });

            return true;
          }
        } catch (error) {
          console.error("Error during Google signIn callback:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
