import Script from "next/script";
import StyledComponentsRegistry from "@/lib/registry";
import { Fira_Code, Fira_Mono, Fira_Sans, Cardo } from "next/font/google";

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

// Font configurations
const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--fira-code",
  weight: ["300", "400", "500", "600", "700"],
});

const firaMono = Fira_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--fira-mono",
  weight: ["400", "500", "700"],
});

const firaSans = Fira_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--fira-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const cardo = Cardo({
  subsets: ["latin"],
  display: "swap",
  variable: "--cardo",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${firaCode.variable} ${firaMono.variable} ${firaSans.variable} ${cardo.variable}`}>
      <body suppressHydrationWarning={true}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
