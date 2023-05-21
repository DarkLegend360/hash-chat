import "./globals.css";
import { Inter } from "next/font/google";
import ToasterContext from "./context/ToasterContext";
import AuthContext from "./context/AuthContext";
import ActionStatus from "./components/ActiveStatus/layout";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hash Messenger",
  description: "a real-time messenger",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <ToasterContext />
          <ActionStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
