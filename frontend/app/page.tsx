import Link from "next/link"
import { getAmigurumis } from "@/lib/api"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function LandingPage() {
  const allAmigurumis = await getAmigurumis()
  const destaques = allAmigurumis.filter(a => a.satisfaction === 5).slice(0, 3)
  const displayDestaques = destaques.length > 0 ? destaques : allAmigurumis.slice(0, 3)

  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL

  return (
    <main className="flex flex-col min-h-screen">
      
      <section className="bg-muted/50 py-32 px-8 text-center flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Amiguteca
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Um espaço onde linhas e agulhas ganham vida. Explore o portfólio 
          completo das minhas criações em amigurumi.
        </p>
        
        <div className="flex gap-4 items-center justify-center">
          <Link href="/gallery" className={buttonVariants({ size: "lg" })}>
            Explorar Galeria
          </Link>
          
          {isAdmin && (
            <Link href="/novo" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Novo Projeto
            </Link>
          )}

          {session ? (
            <Link href="/api/auth/signout" className={buttonVariants({ variant: "ghost", size: "lg" })}>
              Sair
            </Link>
          ) : (
            <Link href="/api/auth/signin" className={buttonVariants({ variant: "ghost", size: "lg" })}>
              Login Admin
            </Link>
          )}
        </div>
      </section>

      <section className="py-24 px-8 container mx-auto max-w-5xl grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Sobre o Projeto</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Sou estudante de Ciência da Computação na UFPR e a Amiguteca nasceu da vontade de criar 
            um espaço próprio para registrar meus projetos manuais. 
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Quando não estou no terminal do Linux ou lidando com linguagens de baixo nível, estou com uma 
            agulha na mão, transformando fios em personagens únicos — desde criações inspiradas 
            nos meus amigos da faculdade até peças exclusivas.
          </p>
        </div>
        <div className="aspect-square bg-muted rounded-2xl overflow-hidden shadow-sm flex items-center justify-center">
          <span className="text-muted-foreground">Coloque uma foto sua ou do seu setup aqui</span>
        </div>
      </section>

      <section className="bg-muted/30 py-24 px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Projetos em Destaque</h2>
              <p className="text-muted-foreground mt-2">Algumas das minhas peças favoritas.</p>
            </div>
            <Link href="/gallery" className="text-primary hover:underline font-medium">
              Ver todos →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayDestaques.length === 0 ? (
              <p className="text-muted-foreground">Nenhum projeto cadastrado ainda.</p>
            ) : (
              displayDestaques.map((item) => (
                <Card key={item.id} className="flex flex-col group border-transparent shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-square bg-muted rounded-t-xl overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                  </CardHeader>
                  <CardFooter className="mt-auto">
                    <Link 
                      href={`/work/${item.id}`} 
                      className={buttonVariants({ variant: "secondary", className: "w-full" })}
                    >
                      Ver detalhes
                    </Link>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
      
    </main>
  )
}