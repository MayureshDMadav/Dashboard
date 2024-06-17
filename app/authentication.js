"use server";
import { signIn, signOut } from "@/app/auth";

export const authenticate = async (formData) => {
  const { username, password } = Object.fromEntries(formData);
  try {
    const response = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    return { status: 200 ,response };
  } catch (e) {
    console.log(e);
    return { error: "Invalid Credentails", status: 500 };
  }
};

export const useSignOut = async () => {
  try {
    await signOut();
  } catch (e) {
    throw e;
  }
};
