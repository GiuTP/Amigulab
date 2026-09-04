import Link from "next/link"
import { getAmigurumis } from "@/lib/api"
import { buttonVariants } from "@/components/ui/button"
import GalleryClient from "./GalleryClient"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function Galeria() {
    const amigurumis = await getAmigurumis()
    
    const session = await getServerSession(authOptions)
    const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL

    return (
        <main className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-10">
            <div>
                <Link href="/" className="text-sm text-muted-foreground hover:underline mb-2 inline-block">
                    ← Voltar para a Home
                </Link>
                <h1 className="text-4xl font-bold tracking-tight">Galeria Completa</h1>
            </div>
            
            {isAdmin && (
            <Link href="/novo" className={buttonVariants({ variant: "default" })}>
                Novo Projeto
            </Link>
            )}
        </div>

        <GalleryClient items={amigurumis} />
        </main>
    )
}