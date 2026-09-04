"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { deleteAmigurumi } from "@/lib/api"
import { useState } from "react"

export default function DeleteButton({ id }: { id: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        if (!window.confirm("Tem certeza que deseja excluir este amigurumi para sempre?")) {
            return
        }

        setLoading(true)
        try {
            await deleteAmigurumi(id)
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