import Link from "next/link"
import { getAmigurumis } from "@/lib/api"
import { Amigurumi } from "@/types"
import ContactForm from "@/components/ContactForm"

export const dynamic = "force-dynamic"

export default async function Home() {
  let featured: Amigurumi[] = []
  try {
    const all = await getAmigurumis()
    featured = all.slice(0, 3)
  } catch (error) {
    console.error("Erro ao carregar destaques da home:", error)
  }
  return (
    <>
      <div id="home" className="relative min-h-screen w-full flex items-center">
        
        <div className="w-full max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <div className="flex flex-col items-start gap-4 z-10">
          <span className="text-emerald-800 font-bold tracking-wider uppercase text-sm">
            Bem-vindo(a)
          </span>
          
          <h1 className="text-6xl md:text-8xl font-bold text-zinc-900 tracking-tight">
            Amigulab
          </h1>
          
          <p className="text-lg text-zinc-500 max-w-md leading-relaxed mt-2">
            Amostra de trabalhos artesanais em crochê, unindo linhas, agulhas e muita dedicação nas peças criadas por Giuliano.
          </p>
          
          <Link 
            href="/galeria" 
            className="mt-6 px-10 py-5 bg-amigu-dark text-emerald-950 rounded-full text-lg font-semibold hover:brightness-95 hover:scale-105 transition-all flex items-center gap-3 group shadow-sm"
          >
            Explorar Galeria
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>

        <div className="w-full h-[60vh] lg:h-[80vh] rounded-2xl bg-indigo-100 relative overflow-hidden flex items-center justify-center border-2 border-dashed border-indigo-300">
            <span className="text-indigo-400 font-medium text-center px-4">
              [Foto com filtro de opacidade aqui]
            </span>
        </div>

      </div>

      <div className="absolute bottom-10 left-8 md:left-16 hidden md:flex z-20">
        <a href="#sobre" className="flex items-center justify-center w-8 h-12 border-2 border-zinc-300 rounded-full hover:border-amigu-dark transition-colors">
          <div className="w-1 h-3 bg-zinc-400 rounded-full animate-scroll-wheel"></div>
        </a>
      </div>
      
    </div>

    <div className="w-full bg-white border-y border-zinc-100">
        <section id="sobre" className="py-24 px-8 md:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Coluna da Esquerda (Imagem) */}
          <div className="w-full h-[500px] lg:h-[600px] rounded-2xl bg-indigo-100 relative overflow-hidden flex items-center justify-center border-2 border-dashed border-indigo-300 shadow-sm">
              <span className="text-indigo-400 font-medium text-center px-4">
                [Foto com filtro de opacidade aqui]
              </span>
          </div>

          {/* Coluna da Direita (Texto e Contatos) */}
          <div className="flex flex-col items-start gap-6">
            <span className="text-emerald-800 font-bold tracking-wider uppercase text-sm">
              Sobre o Autor
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight">
              Olá, eu sou o Giuliano
            </h2>
            
            <div className="text-lg text-zinc-600 leading-relaxed flex flex-col gap-4">
              <p>
                Sou estudante de Ciência da Computação na UFPR e a Amiguteca nasceu da vontade de criar um espaço próprio para registrar meus projetos manuais.
              </p>
              <p>
                Quando não estou no terminal do Linux ou lidando com desafios de código, estou com uma agulha na mão, transformando fios em personagens únicos — desde criações inspiradas nos meus amigos da faculdade até peças exclusivas.
              </p>
            </div>
            
            <div className="w-full mt-6 pt-8 border-t border-zinc-200 flex flex-col gap-6">
            
              {/* Localização redimensionada */}
              <div>
                <p className="text-3xl md:text-4xl font-serif text-zinc-900 tracking-tight">
                  Curitiba, Paraná, <span className="text-emerald-700 font-medium text-2xl md:text-3xl">Brasil.</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                
                {/* E-mail */}
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-amigu-dark flex items-center justify-center text-emerald-950 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 font-medium">E-mail</p>
                    <a href="mailto:giulianotpt@gmail.com" className="text-zinc-900 font-medium hover:text-emerald-700 transition-colors">
                      giulianotpt@gmail.com
                    </a>
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-amigu-dark flex items-center justify-center text-emerald-950 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 font-medium">Instagram</p>
                    <a
                      href="https://www.instagram.com/giuliano.thiago/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-900 font-medium hover:text-emerald-700 transition-colors"
                    >
                      @giuliano.thiago
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>
      </div>

      {/* Seção Galeria (destaques) */}
      <section id="galeria-amostra" className="w-full py-32 px-8 md:px-16 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Cabeçalho da Seção */}
        <div className="w-full flex flex-col items-start mb-16 text-left">
          <span className="text-emerald-800 font-bold tracking-wider uppercase text-sm mb-4">
            Portfólio
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight">
            Trabalhos em Destaque
          </h2>
        </div>

        {/* Grade Desalinhada (3 Colunas) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-20">
          {featured.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center text-zinc-400 font-medium">
              Nenhum projeto em destaque no momento.
            </div>
          ) : (
            featured.map((item, index) => {
              const offsetClass = index === 1 ? "md:mt-24" : index === 2 ? "md:mt-12" : ""
              return (
                <Link
                  key={item.id}
                  href={`/work/${item.id}`}
                  className={`flex flex-col gap-4 group ${offsetClass}`}
                >
                  <div className="w-full aspect-[4/5] rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:-translate-y-2 shadow-sm">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-zinc-400 font-medium px-4 text-center text-sm">
                        [Sem foto]
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 group-hover:text-emerald-700 transition-colors text-center">
                    {item.name}
                  </h3>
                </Link>
              )
            })
          )}
        </div>

        {/* Botão Centralizado para a Galeria Completa */}
        <Link 
          href="/galeria" 
          className="px-10 py-5 bg-zinc-900 text-white rounded-full text-lg font-semibold hover:bg-zinc-800 hover:scale-105 transition-all flex items-center gap-3 shadow-sm"
        >
          Explorar Galeria Completa
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="22" 
            height="22" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          >
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </Link>

      </section>

      {/* Seção contato*/}
      <div className="w-full bg-zinc-900 text-zinc-50 border-t border-zinc-800">
        <section id="contato" className="py-24 px-8 md:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Coluna da Esquerda (Formulário e Títulos) */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
                Gostou do que viu?
              </h2>
              <p className="text-4xl md:text-5xl font-serif text-amigu-dark tracking-tight">
                Entre em contato!
              </p>
            </div>

            <ContactForm />
          </div>

          {/* Coluna da Direita (Informações de Contato) */}
          <div className="flex flex-col gap-10 md:pl-10 mt-10 lg:mt-0">
            <div>
              <p className="text-2xl md:text-3xl font-serif text-zinc-300 tracking-tight leading-snug">
                Curitiba, Paraná,<br/>
                <span className="text-amigu-dark font-medium">Brasil.</span>
              </p>
            </div>

            <div className="flex flex-col gap-8">
              {/* Card de Instagram */}
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-amigu-dark group-hover:bg-amigu-dark group-hover:text-emerald-950 transition-colors shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 font-medium mb-1">Instagram</p>
                  <a
                    href="https://www.instagram.com/giuliano.thiago/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-200 font-medium group-hover:text-amigu-dark transition-colors"
                  >
                    @giuliano.thiago
                  </a>
                </div>
              </div>

              {/* Card de E-mail */}
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-amigu-dark group-hover:bg-amigu-dark group-hover:text-emerald-950 transition-colors shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 font-medium mb-1">E-mail</p>
                  <a href="mailto:giulianotpt@gmail.com" className="text-zinc-200 font-medium hover:text-amigu-dark transition-colors">giulianotpt@gmail.com</a>
                </div>
              </div>
            </div>
          </div>

        </section>
      </div>
  </>
  )
}