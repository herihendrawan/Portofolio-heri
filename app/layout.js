import { Chakra_Petch, Inter } from "next/font/google";
import "./globals.css";

const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-chakra",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Heri — Portofolio",
  description:
    "Kumpulan project: web development full-stack, AI automation dengan n8n, dan eksperimen lainnya.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${chakra.variable} ${inter.variable}`}>
      <body className="antialiased">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
