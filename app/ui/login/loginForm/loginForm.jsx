"use client";
import { authenticate } from "@/app/authentication";
import styles from "./loginForm.module.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { status } = await authenticate(formData.entries());

    if (status === 200) {
      toast.success("Login Successfull", { position: "top-right" });
      router.push("/dashboard");
    } else {
      toast.error("Invalid Credentails", { position: "top-right" });
    }
  };

  return (
    <form onSubmit={handleLogin} className={styles.form}>
      <h1>Login</h1>
      <input type="text" placeholder="username" name="username" />
      <input type="password" placeholder="password" name="password" />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
