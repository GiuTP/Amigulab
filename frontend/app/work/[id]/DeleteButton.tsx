"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { deleteAmigurumi } from "@/lib/api"
import { useState } from "react"
import { getSession } from "next-auth/react"

export default function DeleteButton({ id }: { id: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        if (!confirm("Tem certeza que deseja excluir este amigurumi para sempre?")) {
            return
        }

        setLoading(true)
        try {
            const session = await getSession()
            const token = (session as any)?.id_token

            if (!token) throw new Error("Você precisa estar logado.")

            await deleteAmigurumi(id, token)
            router.refresh()
            router.push("/")
        } 
        catch (error) {
            console.error(error)
            alert("Erro ao excluir o projeto.")
            setLoading(false)
        }
    }

    return (
        <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={loading}
        >
            {loading ? "Excluindo..." : "Excluir Projeto"}
        </Button>
    )
}