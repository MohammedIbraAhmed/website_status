import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers"; // Import the Providers component
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Is It Working?",
  description: "Check if websites are online and capture screenshots",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Remove suppressHydrationWarning if Providers handles mounting check */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers> {/* Wrap children with Providers */}
      </body>
    </html>
  );
}
