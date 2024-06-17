
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./authconfig";
import { findUserByUserName } from "@/backend/query";
import bcrypt from "bcrypt";

const login = async (credentials) => {
  try {
    const { userData } = await findUserByUserName(credentials.username);
    if (!userData) throw new Error("Wrong Credentails");
    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      userData.password
    );
    if (!isPasswordCorrect) throw new Error("Wrong Credentails");
    return userData;
  } catch (e) {
    console.log(e)
    throw new Error("Failed to Login");
  }
};

export const { signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const user = await login(credentials);
          return user;
        } catch (e) {
          console.log(e)
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.username = token.username;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
});
