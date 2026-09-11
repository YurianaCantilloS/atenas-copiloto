import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Copiloto creativo — Atenas Style Shop",
  description:
    "Tu copiloto de contenido para Atenas Style Shop: conceptos, hooks, guiones, carruseles y captions con voz femenina, humana y colombiana.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${poppins.variable} ${playfair.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}