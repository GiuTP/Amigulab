"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateAmigurumi } from "@/lib/api"
import { Amigurumi } from "@/types"
import { getSession } from "next-auth/react"

export default function EditForm({ amigurumi }: { amigurumi: Amigurumi }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState(amigurumi.image_url)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setImagePreview(url)
        }
    }

    const onSubmit: React.SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        
        try {
            let image_url = amigurumi.image_url
            const imageFile = formData.get("image") as File
            
            if (imageFile && imageFile.size > 0) {
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                
                if (!cloudName || !uploadPreset) {
                    throw new Error("Configurações do Cloudinary ausentes nas variáveis de ambiente.")
                }

                const cloudinaryFormData = new FormData()
                cloudinaryFormData.append("file", imageFile)
                cloudinaryFormData.append("upload_preset", uploadPreset)

                const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: "POST",
                    body: cloudinaryFormData,
                })

                if (!cloudinaryRes.ok) {
                    throw new Error("Erro ao fazer upload da imagem para o Cloudinary")
                }

                const cloudinaryData = await cloudinaryRes.json()
                image_url = cloudinaryData.secure_url
            }

            const data = {
                name: formData.get("name") as string,
                image_url: image_url,
                difficulty: Number(formData.get("difficulty")),
                satisfaction: Number(formData.get("satisfaction")),
                time_spent_hours: Number(formData.get("time_spent_hours")),
                materials: String(formData.get("materials")).split(",").map(m => m.trim()),
                story: formData.get("story") as string,
            }

            const session = await getSession()
            console.log("Sessão atual:", session)
            const token = (session as any)?.id_token

            if (!token) throw new Error("Você precisa estar logado.")

            await updateAmigurumi(amigurumi.id, data, token)
            router.refresh()
            router.push(`/work/${amigurumi.id}`)
        } 
        catch (error: any) {
            console.error(error)
            alert(error.message || "Erro ao atualizar o projeto.")
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="bg-white p-6 md:p-10 rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-semibold text-zinc-900">Nome do Projeto</label>
                <input id="name" name="name" defaultValue={amigurumi.name} required className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm text-zinc-800 focus:outline-none focus:border-zinc-400 transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="image" className="text-sm font-semibold text-zinc-900">Nova Imagem do Projeto (Deixe vazio para manter a atual)</label>
                <input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm text-zinc-800 focus:outline-none focus:border-zinc-400 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-200 file:text-zinc-700 hover:file:bg-zinc-300 cursor-pointer" />
                {imagePreview && (
                    <div className="mt-4">
                        <img src={imagePreview} alt="Preview" className="w-full max-w-sm rounded-lg border border-zinc-200 object-cover" />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="difficulty" className="text-sm font-semibold text-zinc-900">Dificuldade (1-5)</label>
                    <input id="difficulty" name="difficulty" type="number" min="1" max="5" defaultValue={amigurumi.difficulty} required className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm text-zinc-800 focus:outline-none focus:border-zinc-400 transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="satisfaction" className="text-sm font-semibold text-zinc-900">Satisfação (1-5)</label>
                    <input id="satisfaction" name="satisfaction" type="number" min="1" max="5" defaultValue={amigurumi.satisfaction} required className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm text-zinc-800 focus:outline-none focus:border-zinc-400 transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="time_spent_hours" className="text-sm font-semibold text-zinc-900">Horas Gastas</label>
                    <input id="time_spent_hours" name="time_spent_hours" type="number" step="0.1" min="0" defaultValue={amigurumi.time_spent_hours} required className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm text-zinc-800 focus:outline-none focus:border-zinc-400 transition-colors" />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="materials" className="text-sm font-semibold text-zinc-900">Materiais (separados por vírgula)</label>
                <input id="materials" name="materials" defaultValue={amigurumi.materials.join(", ")} required className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm text-zinc-800 focus:outline-none focus:border-zinc-400 transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="story" className="text-sm font-semibold text-zinc-900">A História</label>
                <textarea id="story" name="story" rows={5} defaultValue={amigurumi.story} required className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm text-zinc-800 focus:outline-none focus:border-zinc-400 transition-colors resize-none"></textarea>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Atualizando..." : "Salvar Alterações"}
            </button>
        </form>
    )
}