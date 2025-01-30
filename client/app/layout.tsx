import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Providers from "@/providers/Providers";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "ERP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground  ">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
