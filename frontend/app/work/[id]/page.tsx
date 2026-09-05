import Link from "next/link"
import { getAmigurumiByID } from "@/lib/api"
import DeleteButton from "./DeleteButton"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function ProjetoDetalhes({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const amigurumi = await getAmigurumiByID(id)

  const session = await getServerSession(authOptions)
  const isAdmin = !!session && session.user?.email === process.env.ADMIN_EMAIL

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 pb-20">

      {/* Header Unificado com o estilo da Galeria*/}
      <div className="w-full border-b border-zinc-200 mb-10 bg-zinc-50">
        <header className="max-w-[1600px] mx-auto px-6 md:px-8 pt-12 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">

          <div className="flex flex-col gap-4">
            <Link
              href="/galeria"
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors w-fit group font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Voltar para a Galeria
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {amigurumi.name}
            </h1>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-3">
              <Link
                href={`/work/${amigurumi.id}/edit`}
                className="px-6 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-lg text-sm font-semibold hover:bg-zinc-50 transition-colors shadow-sm"
              >
                Editar
              </Link>
              <DeleteButton id={amigurumi.id} />
            </div>
          )}
        </header>
      </div>

      {/* Conteúdo */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Imagem */}
          <div className="rounded-2xl overflow-hidden bg-white aspect-square shadow-sm border border-zinc-200 sticky top-10">
            {amigurumi.image_url ? (
              <img
                src={amigurumi.image_url}
                alt={amigurumi.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                <span className="text-zinc-400 font-medium text-sm">[Sem foto]</span>
              </div>
            )}
          </div>

          {/* Detalhes */}
          <div className="flex flex-col gap-10 pt-4">

            {/* Bloco de Estatísticas para preencher visualmente */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tempo Investido</span>
                <span className="text-2xl font-bold text-zinc-900">{amigurumi.time_spent_hours}h</span>
              </div>
              <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Dificuldade</span>
                <span className="text-2xl font-bold text-zinc-900">{amigurumi.difficulty}/5</span>
              </div>
              <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Satisfação</span>
                <span className="text-2xl font-bold text-zinc-900">{amigurumi.satisfaction}/5</span>
              </div>
            </div>

            {/* História */}
            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">A História por trás</h2>
              <p className="text-base text-zinc-600 leading-relaxed whitespace-pre-wrap">
                {amigurumi.story}
              </p>
            </div>

            {/* Materiais em formato de Pills */}
            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">Materiais Utilizados</h2>
              <div className="flex flex-wrap gap-2">
                {amigurumi.materials.map((material, index) => (
                  <span key={index} className="bg-white border border-zinc-200 text-zinc-700 text-sm font-medium px-4 py-2 rounded-full shadow-sm capitalize">
                    {material}
                  </span>
                ))}
              </div>
            </div>

            {/* Espaço para ideias futuras */}
            {/* <div className="bg-amigu-base/30 border border-emerald-100 rounded-xl p-6 mt-4">
              <h3 className="text-sm font-bold text-emerald-900 mb-2">💡 Ideia para preencher mais no futuro:</h3>
              <p className="text-sm text-emerald-800 leading-relaxed">
                Neste espaço, podemos incluir no banco de dados posteriormente campos como <strong>Custo de Material</strong> (para você ter um registro de quanto investiu) ou o <strong>Destino da Peça</strong> (ex: "Presente para a Thamiris" ou "Acervo Pessoal").
              </p>
            </div> */}

          </div>

        </div>
      </div>
    </main>
  )
}