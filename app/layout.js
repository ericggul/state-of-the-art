import Script from "next/script";
import StyledComponentsRegistry from "@/lib/registry";

export const metadata = {
  title: "DDP AI Exhibition",
  description: "DDP AI Solo Exhibition | Yiyun Kang",
  openGraph: {
    type: "website",
    locale: "en_UK",
    // url: "portfolio-jyc.org",
    siteName: "DDP AI Exhibition",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <body>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </body>
      </html>
    </>
  );
}
