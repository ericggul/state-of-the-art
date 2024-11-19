import Script from "next/script";
import StyledComponentsRegistry from "@/lib/registry";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Cardo } from "next/font/google";

export const metadata = {
  title: "KAIST Museum Opening Exhibition",
  description: "KAIST Museum",
  openGraph: {
    type: "website",
    locale: "en_UK",
    siteName: "KAIST Museum Opening Exhibition",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "black",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: "no",
};

const cardo = Cardo({
  subsets: ["latin"],
  display: "swap",
  variable: "--cardo",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${GeistMono.variable} ${GeistSans.variable} ${cardo.variable}`}
    >
      <body suppressHydrationWarning={true}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
