"use client"

import { useRouter } from "next/navigation"
import { deleteAmigurumi } from "@/lib/api"
import { useState } from "react"
import { getSession } from "next-auth/react"

export default function DeleteWork({ id }: { id: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        if (!confirm("Tem certeza que deseja excluir este amigurumi para sempre?")) return

        setLoading(true)
        try {
            const session = await getSession()
            const token = (session as any)?.id_token

            if (!token) throw new Error("Você precisa estar logado.")

            await deleteAmigurumi(id, token)
            router.push("/galeria")
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Erro ao excluir o projeto.")
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
            {loading ? "Excluindo..." : "Excluir Projeto"}
        </button>
    )
}