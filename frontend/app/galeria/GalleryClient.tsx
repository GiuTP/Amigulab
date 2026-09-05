"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { Amigurumi } from "@/types"

// Capitaliza apenas a primeira letra da string inteira
function capitalizeFirst(str: string) {
    if (!str) return str
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export default function GalleryClient({ items }: { items: Amigurumi[] }) {
    const [expandedCardId, setExpandedCardId] = useState<string | null>(null)
    const [searchName, setSearchName] = useState("")
    const [difficultyFilter, setDifficultyFilter] = useState("")
    const [maxHours, setMaxHours] = useState("")
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])

    const charThreshold = 75

    // Materiais únicos extraídos dinamicamente do banco
    const availableMaterials = useMemo(() => {
        const all = items.flatMap(item => item.materials)
        return Array.from(new Set(all)).sort()
    }, [items])

    const toggleMaterial = (material: string) => {
        setSelectedMaterials(prev =>
            prev.includes(material)
                ? prev.filter(m => m !== material)
                : [...prev, material]
        )
    }

    const filteredItems = items.filter((item) => {
        const matchName = item.name.toLowerCase().includes(searchName.toLowerCase())
        const matchDifficulty = difficultyFilter === "" || item.difficulty === Number(difficultyFilter)
        const matchHours = maxHours === "" || item.time_spent_hours <= Number(maxHours)
        const matchMaterial =
            selectedMaterials.length === 0 ||
            selectedMaterials.some(m => item.materials.includes(m))

        return matchName && matchDifficulty && matchHours && matchMaterial
    })

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-16 items-start">

            {/* Sidebar de filtros */}
            <aside className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-5 sticky top-10">

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-zinc-900">Buscar por Nome</label>
                    <input
                        type="text"
                        placeholder="Ex: Snoopy..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:border-zinc-400 transition-colors"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-zinc-900">Dificuldade</label>
                    <select
                        value={difficultyFilter}
                        onChange={(e) => setDifficultyFilter(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:border-zinc-400 transition-colors"
                    >
                        <option value="">Todas as dificuldades</option>
                        <option value="1">1 - Muito fácil</option>
                        <option value="2">2 - Fácil</option>
                        <option value="3">3 - Intermediário</option>
                        <option value="4">4 - Difícil</option>
                        <option value="5">5 - Muito difícil</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-zinc-900">Tempo Máximo</label>
                    <input
                        type="number"
                        placeholder="Horas (ex: 5)"
                        value={maxHours}
                        onChange={(e) => setMaxHours(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:border-zinc-400 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-zinc-900">Materiais Utilizados</label>
                    {availableMaterials.length === 0 ? (
                        <p className="text-xs text-zinc-400">Nenhum material cadastrado.</p>
                    ) : (
                        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                            {availableMaterials.map(material => (
                                <div key={material} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`mat-${material}`}
                                        checked={selectedMaterials.includes(material)}
                                        onChange={() => toggleMaterial(material)}
                                        className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                    />
                                    <label htmlFor={`mat-${material}`} className="text-sm text-zinc-600 cursor-pointer">
                                        {capitalizeFirst(material)}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Botão limpar filtros */}
                {(searchName || difficultyFilter || maxHours || selectedMaterials.length > 0) && (
                    <button
                        onClick={() => {
                            setSearchName("")
                            setDifficultyFilter("")
                            setMaxHours("")
                            setSelectedMaterials([])
                        }}
                        className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors self-start"
                    >
                        Limpar filtros
                    </button>
                )}
            </aside>

            {/* Grid de cards */}
            <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3 border-2 border-dashed border-zinc-200 rounded-2xl">
                        <p className="text-zinc-400 text-sm font-medium">Nenhum projeto encontrado com os filtros atuais.</p>
                        <button
                            onClick={() => {
                                setSearchName("")
                                setDifficultyFilter("")
                                setMaxHours("")
                                setSelectedMaterials([])
                            }}
                            className="text-xs font-semibold text-zinc-900 hover:text-emerald-700 transition-colors underline"
                        >
                            Limpar filtros
                        </button>
                    </div>
                ) : (
                    filteredItems.map((item) => {
                        const isExpanded = expandedCardId === item.id
                        const showButton = item.story.length > charThreshold

                        return (
                            <div key={item.id} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm flex flex-col h-full transition-all hover:shadow-md">

                                {/* Imagem */}
                                <div className="w-full h-56 bg-zinc-100 flex items-center justify-center relative border-b border-zinc-100 shrink-0 overflow-hidden">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-zinc-400 font-medium text-sm">[Sem foto]</span>
                                    )}
                                </div>

                                {/* Conteúdo */}
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-start gap-4 mb-1">
                                        <h3 className="font-semibold text-lg text-zinc-900 leading-tight">
                                            {item.name}
                                        </h3>
                                        <span className="bg-zinc-100 text-zinc-600 text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap">
                                            Dif: {item.difficulty}/5
                                        </span>
                                    </div>

                                    <span className="text-xs text-zinc-500 mb-4">{item.time_spent_hours} horas</span>

                                    <p className={`text-sm text-zinc-600 leading-relaxed mb-1 ${isExpanded ? "" : "line-clamp-2"}`}>
                                        {item.story}
                                    </p>

                                    {showButton && (
                                        <button
                                            onClick={() => setExpandedCardId(isExpanded ? null : item.id)}
                                            className="text-xs font-semibold text-zinc-900 hover:text-emerald-700 transition-colors self-start mb-4 mt-1"
                                        >
                                            {isExpanded ? "Ver menos" : "Ver mais"}
                                        </button>
                                    )}

                                    <Link
                                        href={`/work/${item.id}`}
                                        className="mt-auto w-full py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors text-center"
                                    >
                                        Ver detalhes
                                    </Link>
                                </div>
                            </div>
                        )
                    })
                )}
            </main>
        </div>
    )
}