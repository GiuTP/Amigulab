import Link from "next/link"
import { getAmigurumiByID } from "@/lib/api"
import EditForm from "./EditForm"

export default async function EditWork({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const amigurumi = await getAmigurumiByID(id)

    return (
        <main className="min-h-screen bg-zinc-50 text-zinc-900 pb-20">
            
            {/* Header Unificado */}
            <div className="w-full border-b border-zinc-200 mb-10 bg-zinc-50">
                <header className="max-w-[1600px] mx-auto px-6 md:px-8 pt-12 pb-8 flex flex-col gap-4">
                    <Link
                        href={`/work/${id}`}
                        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors w-fit group font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                            <path d="m15 18-6-6 6-6"/>
                        </svg>
                        Voltar para o projeto
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Editando: {amigurumi.name}
                    </h1>
                </header>
            </div>

            {/* Conteúdo Centralizado do Formulário */}
            <div className="max-w-3xl mx-auto px-6 md:px-8">
                <EditForm amigurumi={amigurumi} />
            </div>
        </main>
    )
}