import { Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/providers/SessionProviderWrapper";
import { Kanit } from "next/font/google";
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kanit = Kanit({
  subsets: ["thai"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  title: "eBooth Gamefactors",
  description: "eBooth Gamefactors",
};

export default function RootLayout({ children }) {
  return (
    <SessionProviderWrapper>
      <html lang="en">
        <body className={`${kanit.className} antialiased font-sans`}>
          {children}
        </body>
      </html>
    </SessionProviderWrapper>
  );
}
