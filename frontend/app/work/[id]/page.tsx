import Link from "next/link"
import { getAmigurumiByID } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import DeleteButton from "./DeleteButton"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function ProjetoDetalhes({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const amigurumi = await getAmigurumiByID(id)

  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL

  return (
    <main className="container mx-auto p-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8 -ml-4">
        <Link 
          href="/galeria" 
          className={buttonVariants({ variant: "ghost" })}
        >
          ← Voltar para a galeria
        </Link>

        {isAdmin && (
          <div className="flex gap-2">
            <Link 
              href={`/work/${amigurumi.id}/edit`} 
              className={buttonVariants({ variant: "outline" })}
            >
              Editar
            </Link>
            <DeleteButton id={amigurumi.id} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="rounded-xl overflow-hidden bg-muted aspect-square shadow-sm">
          <img 
            src={amigurumi.image_url} 
            alt={amigurumi.name} 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{amigurumi.name}</h1>
          
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="secondary">Dificuldade: {amigurumi.difficulty}/5</Badge>
            <Badge variant="secondary">Satisfação: {amigurumi.satisfaction}/5</Badge>
            <Badge variant="secondary">{amigurumi.time_spent_hours} horas</Badge>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">A História</h2>
            <p className="text-muted-foreground leading-relaxed">
              {amigurumi.story}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">Materiais Utilizados</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              {amigurumi.materials.map((material, index) => (
                <li key={index}>{material}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}