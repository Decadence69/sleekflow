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
        {/* <header className="bg-gray-800 text-white py-4 shadow-md">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">Rick & Morty Contact List</h1>
          </div>
        </header> */}
        {/* <main className="container mx-auto px-4 py-8"> */}
          {children}
        {/* </main> */}
      </body>
    </html>
  )
}
