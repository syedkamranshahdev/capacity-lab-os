import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: { default: "Capacity Lab", template: "%s | Capacity Lab" },
  description: "Connect energy, sleep, stress regulation, recovery, training readiness and optional cycle context in one private Capacity Map.",
  metadataBase: new URL("https://capacity-lab-os.vercel.app"),
  applicationName: "Capacity Lab",
  authors: [{ name: "Capacity Lab" }],
  creator: "Capacity Lab",
  openGraph: {
    title: "Capacity Lab",
    description: "Understand your signals in context and build capacity that lasts.",
    url: "https://capacity-lab-os.vercel.app",
    siteName: "Capacity Lab",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Capacity Lab",
    description: "Understand your signals in context and build capacity that lasts.",
  },
  robots: { index: false, follow: false },
  icons: { icon: "/icon.png", shortcut: "/icon.png", apple: "/icon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning><body className="min-h-screen bg-background text-foreground antialiased"><AuthProvider><main className="relative min-h-screen">{children}</main></AuthProvider></body></html>;
}
