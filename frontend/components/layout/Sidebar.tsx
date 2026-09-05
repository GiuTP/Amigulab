"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Sidebar() {
    const pathname = usePathname()
    const [activeSection, setActiveSection] = useState("home")

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
    }, [pathname]) // Adicionamos pathname nas dependências para ele reagir a mudanças de rota

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
        <aside className="w-64 flex-shrink-0 bg-white border-r border-zinc-200 h-screen sticky top-0 flex flex-col justify-between p-10 hidden md:flex z-50">
        
        <div>
            {/* Usando <a> nativo para garantir a rolagem da âncora */}
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
                {/* Lógica condicional da linha indicadora */}
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
    )
}