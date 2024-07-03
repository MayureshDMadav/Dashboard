import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./authconfig";
import { findUserByUserName } from "@/backend/query";
import bcrypt from "bcrypt";

const login = async (credentials) => {
  try {
    const {userData} = await findUserByUserName(credentials.username);
    if (!userData) throw console.log("Wrong UserName");

    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      userData.password
    );

    if (!isPasswordCorrect) console.log("Wrong Password");
    return userData;
  } catch (e) {
    console.log("Failed to Login");
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
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.username = token.username;
        session.user.isAdmin = token.isAdmin;
        session.user.id = token.id;
      }
      return session;
    },
  },
});
