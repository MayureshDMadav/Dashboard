import { Inter } from "next/font/google";
import "./ui/globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lama Dev Next.js Admin Dashboard",
  description: "Next.js Tutorial",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster reverseOrder={false} />
      </body>
    </html>
  );
}
