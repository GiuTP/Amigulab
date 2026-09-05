import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/layout/Sidebar"
import Providers from "@/components/layout/Providers"
import CustomCursor from "@/components/ui/CustomCursor"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Amigulab",
  description: "Portfólio de amigurumis feitos à mão",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.className} bg-amigu-base text-zinc-800 flex min-h-screen antialiased`}>
        <CustomCursor />
        <Providers>
          <Sidebar />
          <main className="flex-1 overflow-x-hidden">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}