"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { buttonVariants, Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createAmigurumi } from "@/lib/api"

export default function NovoProjeto() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const onSubmit: React.SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        
        const data = {
            name: formData.get("name") as string,
            image_url: formData.get("image_url") as string,
            difficulty: Number(formData.get("difficulty")),
            satisfaction: Number(formData.get("satisfaction")),
            time_spent_hours: Number(formData.get("time_spent_hours")),
            materials: String(formData.get("materials")).split(",").map(m => m.trim()),
            story: formData.get("story") as string,
        }

        try {
            await createAmigurumi(data)
            router.refresh()
            router.push("/")
        } 
        catch (error) {
            console.error(error)
            alert("Erro ao salvar projeto. O servidor Go está rodando?")
            setLoading(false)
        }
    }

    return (
        <main className="container mx-auto p-8 max-w-2xl">
        <Link 
            href="/" 
            className={buttonVariants({ variant: "ghost", className: "mb-8 -ml-4" })}
        >
            ← Voltar para a galeria
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mb-8">Novo Amigurumi</h1>

        <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Nome do Projeto</Label>
                <Input id="name" name="name" placeholder="Ex: Soobin" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="image_url">URL da Imagem (Provisório)</Label>
                <Input id="image_url" name="image_url" placeholder="https://..." required />
            </div>

            <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
                <Label htmlFor="difficulty">Dificuldade (1-5)</Label>
                <Input id="difficulty" name="difficulty" type="number" min="1" max="5" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="satisfaction">Satisfação (1-5)</Label>
                <Input id="satisfaction" name="satisfaction" type="number" min="1" max="5" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="time_spent_hours">Horas Gastas</Label>
                <Input id="time_spent_hours" name="time_spent_hours" type="number" step="0.1" min="0" placeholder="Ex: 4.5" required />
            </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="materials">Materiais (separados por vírgula)</Label>
                <Input id="materials" name="materials" placeholder="Fio vermelho, Agulha 2.5mm..." required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="story">A História</Label>
                <Textarea 
                    id="story" 
                    name="story"
                    placeholder="Como foi criar essa peça, quem inspirou..." 
                    rows={5} 
                    required 
                />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Projeto"}
            </Button>
        </form>
        </main>
    )
}