import Script from "next/script";
import StyledComponentsRegistry from "@/lib/registry";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Cardo } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata = {
  metadataBase: new URL("https://sota-xdlab.net"),
  title: "SoTA | State-of-the-Art | XD Lab",
  description:
    "SoTA is a multi-device web artwork exploring the evolution of AI through Abstract Expressionism, featuring 118 neural network architectures across 4 displays, 2 projections, and 4-channel sound. Created by XD Lab, KAIST.",
  keywords: [
    "Neural Network Architecture",
    "Interactive Art",
    "New Media Art",
    "Web Art",
    "Multi-Device Installation",
    "Abstract Expressionism",
    "AI Visualization",
    "Generative Art",
    "Machine Learning Art",
    "KAIST",
    "XD Lab",
    "State-of-the-Art AI",
    "Deep Learning",
    "Art Technology",
    "Digital Art Installation",
    "Computational Art",
    "AI Research",
    "Interactive Installation",
    "Media Art",
    "Contemporary Art",
  ],
  openGraph: {
    type: "website",
    locale: "en_UK",
    url: "https://sota-xdlab.net",
    siteName: "SoTA | State-of-the-Art | XD Lab",
    title: "SoTA | State-of-the-Art | XD Lab",
    description:
      "A multi-device web artwork visualizing the evolution of AI from representational neural architectures to abstract expressionism, featuring 118 State-of-the-Art models.",
    images: [
      {
        url: "/images/icon.png",
        width: 1200,
        height: 630,
        alt: "SoTA - Abstract visualization of neural network architectures",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SoTA | State-of-the-Art",
    description:
      "Interactive web artwork exploring AI evolution through Abstract Expressionism",
    images: ["/images/icon.png"],
    creator: "@xdlab_kaist",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://sota-xdlab.net",
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
      <body suppressHydrationWarning={true}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
      <GoogleAnalytics gaId="G-8QQYWE73S3" />
    </html>
  );
}
