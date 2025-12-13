import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import MenuLateral from "@/components/MenuLateral";
import styles from "@/styles/layout.module.css";
import { BotaoProvider } from "@/services/provider/BotaoAtivoProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scale Generator",
  description: "Gerador de escalas automáticas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <main className={styles.container}>
          <BotaoProvider>
            <MenuLateral />
          </BotaoProvider>
          <div className={styles.div}>{children}</div>
        </main>
      </body>
    </html>
  );
}
