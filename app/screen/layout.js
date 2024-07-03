export const metadata = {
  title: "Screen | DDP AI",
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
  return <>{children}</>;
}
