import type { Metadata } from "next";
import { Oswald, Sora } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "sonner";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["200", "300", "400", "500", "600", "700"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Arturo Villanueva",
  description: "Arturo Villanueva",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${oswald.variable} ${sora.variable}`}>
      <body>
        <QueryProvider>
          <ThemeProvider>
            {children}
            <Toaster 
              position="top-right" 
              toastOptions={{
                style: {
                  background: 'white',
                  color: 'black',
                  border: '1px solid #e0e0e0',
                },
                className: 'toast-custom',
              }}
            />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
