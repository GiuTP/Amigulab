import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { getAmigurumis } from "@/lib/api"

export default async function Home() {
  const amigurumis = await getAmigurumis()

  return (
    <main className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Amiguteca</h1>
          <p className="text-muted-foreground mt-2">
            Meu portfólio de amigurumis e projetos artesanais.
          </p>
        </div>
        <Link href="/new" className={buttonVariants({ variant: "default" })}>
          Novo Projeto
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {amigurumis.length === 0 && (
          <p className="text-muted-foreground col-span-3 text-center py-10">
            Nenhum projeto encontrado. Comece a criar!
          </p>
        )}

        {amigurumis.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <div className="aspect-square bg-muted rounded-t-xl overflow-hidden">
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>
                    {new Date(item.created_at).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="whitespace-nowrap">
                  Dificuldade: {item.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {item.story}
              </p>
            </CardContent>
            
            <CardFooter>
              <Link 
                href={`/work/${item.id}`} 
                className={buttonVariants({ variant: "default", className: "w-full" })}
              >
                Ver detalhes
              </Link>
            </CardFooter>
          </Card>
        ))}

      </div>
    </main>
  )
}