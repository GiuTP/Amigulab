"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Sidebar() {
    const pathname = usePathname()
    const [activeSection, setActiveSection] = useState("home")
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        // Se não estivermos na Home, nem perde tempo criando o observador
        if (pathname !== "/") return

        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setActiveSection(entry.target.id)
            }
            })
        },
        // Baixamos para 0.3: basta 30% da seção aparecer para o menu atualizar
        { threshold: 0.3 } 
        )

        const sectionIds = ["home", "sobre", "galeria-amostra", "contato"]
        
        sectionIds.forEach((id) => {
        const element = document.getElementById(id)
        if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [pathname])

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [mobileMenuOpen])

    // Se a página atual não for a raiz (Home), retorna null para a Sidebar não aparecer
    if (pathname !== "/") {
        return null
    }

    const navLinks = [
        { id: "home", label: "Home", href: "#home" },
        { id: "sobre", label: "Sobre Mim", href: "#sobre" },
        { id: "galeria-amostra", label: "Galeria", href: "#galeria-amostra" },
        { id: "contato", label: "Contato", href: "#contato" },
    ]

    return (
        <>
            {/* Header / Menu Hamburguer Mobile */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-6 flex items-center justify-between z-50">
                <a href="#home" className="text-2xl font-bold tracking-tighter text-zinc-900">
                    Amigulab
                </a>
                <button
                    onClick={() => setMobileMenuOpen(prev => !prev)}
                    aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                    className="p-2 -mr-2 text-zinc-700 hover:text-zinc-900 focus:outline-none"
                >
                    {mobileMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="12" x2="20" y2="12"/>
                            <line x1="4" y1="6" x2="20" y2="6"/>
                            <line x1="4" y1="18" x2="20" y2="18"/>
                        </svg>
                    )}
                </button>
            </div>

            {/* Menu Drawer Mobile */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40">
                    <div 
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="fixed top-16 right-0 bottom-0 w-64 max-w-[80vw] bg-white border-l border-zinc-200 p-8 flex flex-col justify-between shadow-2xl z-50">
                        <nav className="flex flex-col gap-6 text-lg font-medium text-zinc-600">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 transition-colors ${
                                        activeSection === item.id ? "text-emerald-700 font-semibold" : "hover:text-zinc-900"
                                    }`}
                                >
                                    <span className={`w-2 h-2 rounded-full transition-all ${
                                        activeSection === item.id ? "bg-emerald-700 scale-100" : "bg-transparent scale-0"
                                    }`} />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="text-center text-xs text-zinc-400 font-medium pt-6 border-t border-zinc-100">
                            <p>&copy; 2026 Amigulab</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar Desktop */}
            <aside className="w-64 flex-shrink-0 bg-white border-r border-zinc-200 h-screen sticky top-0 flex flex-col justify-between p-10 hidden md:flex z-50">
                <div>
                    <a href="#home" className="text-4xl font-bold tracking-tighter text-zinc-900">
                        Amigulab
                    </a>
                </div>

                <nav className="flex flex-col gap-10 text-base font-medium text-zinc-500">
                    {navLinks.map((item) => (
                    <Link 
                        key={item.id} 
                        href={item.href} 
                        className={`relative flex items-center transition-colors group ${
                        activeSection === item.id ? "text-emerald-700" : "hover:text-zinc-900"
                        }`}
                    >
                        <span className={`absolute -left-8 h-[2px] transition-all duration-300 ${
                        activeSection === item.id 
                            ? "w-6 bg-emerald-700" 
                            : "w-0 bg-zinc-300 group-hover:w-4"
                        }`}></span>
                        {item.label}
                    </Link>
                    ))}
                </nav>

                <div className="flex flex-col w-full">
                    <div className="w-24 h-[1px] bg-zinc-300 mb-6 mx-auto"></div>
                    <div className="text-center text-xs text-zinc-400 font-medium leading-relaxed">
                        <p>&copy; 2026 Amigulab</p>
                    </div>
                </div>
            </aside>
        </>
    )
}