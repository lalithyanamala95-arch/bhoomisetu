import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BhoomiSetu",
    template: "%s | BhoomiSetu",
  },

  description:
    "Land intelligence platform for discovering, evaluating and listing land.",

  applicationName:
    "BhoomiSetu",

  icons: {
    icon: [
      {
        url: "/bhoomisetu-logo.png",
        type: "image/png",
      },
    ],

    shortcut:
      "/bhoomisetu-logo.png",

    apple:
      "/bhoomisetu-logo.png",
  },

  manifest:
    "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#070908] text-white antialiased">
        {children}
      </body>
    </html>
  );
}