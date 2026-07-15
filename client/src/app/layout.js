import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CrowdPulse - Fund What Matters",
  description:
    "CrowdPulse is a crowdfunding platform that connects creators with supporters to bring innovative projects to life.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} cz-shortcut-listen="true">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
