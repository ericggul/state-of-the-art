import Script from "next/script";
import StyledComponentsRegistry from "@/lib/registry";

import { Fira_Code, Fira_Mono, Fira_Sans, Cardo } from "next/font/google";

export const metadata = {
  title: "KAIST Museum Opening Exhibition",
  description: "KAIST Museum",
  openGraph: {
    type: "website",
    locale: "en_UK",
    // url: "portfolio-jyc.org",
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

//FONTS SETUP

export const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--fira-code",
  //all from 300 to 700
  weight: ["300", "400", "500", "600", "700"],
});

export const firaMono = Fira_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--fira-mono",
  weight: ["400", "500", "700"],
});

export const firaSans = Fira_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--fira-sans",
  //all 9 from 100 to 900
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const cardo = Cardo({
  subsets: ["latin"],
  display: "swap",
  variable: "--cardo",
  //400, 700 & italic
  weight: ["400", "700"],
  style: ["italic"],
});

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en" className={`${firaCode.variable} ${firaMono.variable} ${firaSans.variable} ${cardo.variable}`}>
        <body suppressHydrationWarning={true}>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </body>
      </html>
    </>
  );
}
