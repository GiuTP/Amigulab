import { getAmigurumis } from "@/lib/api"
import GalleryClient from "./GalleryClient"
import GalleryHeader from "./GalleryHeader"
import { Amigurumi } from "@/types"

export const dynamic = "force-dynamic"

export default async function Gallery() {
    let amigurumis: Amigurumi[] = []
    let error: string | null = null

    try {
        amigurumis = await getAmigurumis()
    } catch (err) {
        console.error("Erro ao carregar galeria:", err)
        error = "Não foi possível carregar os projetos. Tente novamente mais tarde."
    }

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-20">
            <GalleryHeader />

            <div className="max-w-[1600px] mx-auto px-6 md:px-8">
                {error ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="m15 9-6 6"/>
                            <path d="m9 9 6 6"/>
                        </svg>
                        <p className="text-zinc-500 text-center max-w-md">{error}</p>
                    </div>
                ) : (
                    <GalleryClient items={amigurumis} />
                )}
            </div>
        </div>
    )
}