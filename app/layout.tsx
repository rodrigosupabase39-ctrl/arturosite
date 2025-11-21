import type { Metadata } from "next";
import { Oooh_Baby, Sora } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "sonner";

const ooohBaby = Oooh_Baby({
  subsets: ["latin"],
  variable: "--font-oooh-baby",
  weight: "400",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Club Semilla",
  description: "Club Semilla",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${ooohBaby.variable} ${sora.variable}`}>
      <body>
        <QueryProvider>
          <ThemeProvider>
            {children}
            <Toaster position="top-right" richColors />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
