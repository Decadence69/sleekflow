import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Contact List - SleekFlow',
  description: 'View our list of contacts with their related information.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-700">
        {children}
      </body>
    </html>
  )
}
