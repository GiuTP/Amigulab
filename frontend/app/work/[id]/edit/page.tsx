import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { getAmigurumiByID } from "@/lib/api"
import EditForm from "./EditForm"

export default async function EditarProjeto({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const amigurumi = await getAmigurumiByID(id)

    return (
        <main className="container mx-auto p-8 max-w-2xl">
        <Link 
            href={`/work/${id}`} 
            className={buttonVariants({ variant: "ghost", className: "mb-8 -ml-4" })}
        >
            ← Voltar para o projeto
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mb-8">
            Editando: {amigurumi.name}
        </h1>

        <EditForm amigurumi={amigurumi} />
        </main>
    )
}