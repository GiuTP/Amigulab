"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateAmigurumi } from "@/lib/api"
import { Amigurumi } from "@/types"
import { getSession } from "next-auth/react"

export default function EditForm({ amigurumi }: { amigurumi: Amigurumi }) {
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
            const session = await getSession()
            console.log("Sessão atual:", session) // Adicione esta linha
            const token = (session as any)?.id_token

            if (!token) throw new Error("Você precisa estar logado.")

            await updateAmigurumi(amigurumi.id, data, token)
            router.refresh()
            router.push(`/work/${amigurumi.id}`)
        } 
        catch (error) {
            console.error(error)
            alert("Erro ao atualizar o projeto.")
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Nome do Projeto</Label>
                <Input id="name" name="name" defaultValue={amigurumi.name} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="image_url">URL da Imagem</Label>
                <Input id="image_url" name="image_url" defaultValue={amigurumi.image_url} required />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="difficulty">Dificuldade (1-5)</Label>
                    <Input id="difficulty" name="difficulty" type="number" min="1" max="5" defaultValue={amigurumi.difficulty} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="satisfaction">Satisfação (1-5)</Label>
                    <Input id="satisfaction" name="satisfaction" type="number" min="1" max="5" defaultValue={amigurumi.satisfaction} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="time_spent_hours">Horas Gastas</Label>
                    <Input id="time_spent_hours" name="time_spent_hours" type="number" step="0.1" min="0" defaultValue={amigurumi.time_spent_hours} required />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="materials">Materiais (separados por vírgula)</Label>
                <Input id="materials" name="materials" defaultValue={amigurumi.materials.join(", ")} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="story">A História</Label>
                <Textarea id="story" name="story" rows={5} defaultValue={amigurumi.story} required />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Atualizando..." : "Salvar Alterações"}
            </Button>
        </form>
    )
}