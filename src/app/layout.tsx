import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Contact List - SleekFlow',
  description: 'A contact list featuring characters from Rick and Morty',
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
