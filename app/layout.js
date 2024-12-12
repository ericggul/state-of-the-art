import Script from "next/script";
import StyledComponentsRegistry from "@/lib/registry";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Cardo } from "next/font/google";

export const metadata = {
  title: "SoTA | State-of-the-Art | XD Lab",
  description: "SoTA is a Multi-Device Web Artwork developed by XD Lab",
  openGraph: {
    type: "website",
    locale: "en_UK",
    siteName: "SoTA | State-of-the-Art | XD Lab",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "black",
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  minimumScale: 1.0,
  userScalable: false,
  viewportFit: "cover",
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
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
