"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Amigurumi } from "@/types"

export default function GalleryClient({ items }: { items: Amigurumi[] }) {
    const [searchName, setSearchName] = useState("")
    const [difficultyFilter, setDifficultyFilter] = useState("all")
    const [satisfactionFilter, setSatisfactionFilter] = useState("all")
    const [maxHours, setMaxHours] = useState("")
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])

    const availableMaterials = useMemo(() => {
        const allMaterials = items.flatMap(item => item.materials)
        return Array.from(new Set(allMaterials)).sort()
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
        const matchDifficulty = difficultyFilter === "all" || item.difficulty === Number(difficultyFilter)
        const matchSatisfaction = satisfactionFilter === "all" || item.satisfaction === Number(satisfactionFilter)
        const matchHours = maxHours === "" || item.time_spent_hours <= Number(maxHours)
        
        const matchMaterial = selectedMaterials.length === 0 || 
                            selectedMaterials.some(m => item.materials.includes(m))
        
        return matchName && matchDifficulty && matchSatisfaction && matchHours && matchMaterial
    })

    return (
        <div className="flex flex-col md:flex-row gap-8">
        
        <aside className="w-full md:w-64 space-y-8 bg-muted/30 p-6 rounded-xl h-fit border">
            <div>
                <Label className="text-base font-semibold mb-3 block">Buscar por Nome</Label>
                <Input 
                    placeholder="Ex: Snoopy..." 
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
            </div>

            <div>
                <Label className="text-base font-semibold mb-3 block">Dificuldade</Label>
                <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                    <option value="all">Todas as dificuldades</option>
                    <option value="1">1 - Muito Fácil</option>
                    <option value="2">2 - Fácil</option>
                    <option value="3">3 - Médio</option>
                    <option value="4">4 - Difícil</option>
                    <option value="5">5 - Muito Difícil</option>
                </select>
            </div>

            <div>
                <Label className="text-base font-semibold mb-3 block">Satisfação</Label>
                <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={satisfactionFilter}
                    onChange={(e) => setSatisfactionFilter(e.target.value)}
                >
                    <option value="all">Qualquer nível</option>
                    <option value="1">1 - Não gostei</option>
                    <option value="2">2 - Razoável</option>
                    <option value="3">3 - Bom</option>
                    <option value="4">4 - Muito Bom</option>
                    <option value="5">5 - Excelente</option>
                </select>
            </div>

            <div>
                <Label className="text-base font-semibold mb-3 block">Tempo Máximo</Label>
                <Input 
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Horas (ex: 5)" 
                    value={maxHours}
                    onChange={(e) => setMaxHours(e.target.value)}
                />
            </div>

            <div>
                <Label className="text-base font-semibold mb-3 block">Materiais Utilizados</Label>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                    {availableMaterials.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum material cadastrado.</p>
                    ) : (
                    availableMaterials.map(material => (
                        <div key={material} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={`mat-${material}`}
                            className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={selectedMaterials.includes(material)}
                            onChange={() => toggleMaterial(material)}
                        />
                        <Label htmlFor={`mat-${material}`} className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {material}
                        </Label>
                        </div>
                    ))
                    )}
                </div>
            </div>
        </aside>

        <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.length === 0 && (
                <div className="col-span-full text-center py-12 border-2 border-dashed rounded-xl">
                <p className="text-lg text-muted-foreground">
                    Nenhum projeto encontrado com os filtros atuais.
                </p>
                <button 
                    onClick={() => {
                    setSearchName(""); setDifficultyFilter("all"); setSatisfactionFilter("all"); setMaxHours(""); setSelectedMaterials([]);
                    }}
                    className="mt-4 text-primary underline hover:text-primary/80"
                >
                    Limpar filtros
                </button>
                </div>
            )}

            {filteredItems.map((item) => (
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
                            <CardTitle className="leading-tight">{item.name}</CardTitle>
                            <CardDescription className="mt-1">
                            {item.time_spent_hours} horas
                            </CardDescription>
                        </div>
                        <Badge variant="secondary" className="whitespace-nowrap">
                            Dif: {item.difficulty}/5
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
        </div>
        
        </div>
    )
}