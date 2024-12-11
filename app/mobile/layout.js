export const metadata = {
  title: "SoTA | XD Lab",
  description: "SoTA is a Multi-Device Web Artwork developed by XD Lab",
  openGraph: {
    type: "website",
    locale: "en_UK",
    siteName: "SoTA | XD Lab",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover"
      />
      {children}
    </>
  );
}
