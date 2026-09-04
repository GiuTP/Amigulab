import { Amigurumi } from "../types"

export async function getAmigurumis(): Promise<Amigurumi[]>{
    const res = await fetch("http:localhost:8080/api/amigurumis", {
        cache: "no-store",
    })

    if (!res.ok){
        throw new Error("Falha ao carregar os dados da vitrine")
    }

    return res.json()
}

export async function getAmigurumiByID(id:string): Promise<Amigurumi> {
    const res = await fetch(`http://localhost:8080/api/amigurumis/${id}`, {
        cache:"no-store",
    })
    
    if (!res.ok){
        throw new Error("Trabalho não encontrado")
    }

    return res.json()
}

export type CreateAmigurumiInput = Omit<Amigurumi, 'id' | 'created_at'>;

export async function createAmigurumi(data: CreateAmigurumiInput, token:string) {
    const res = await fetch("http://localhost:8080/api/amigurumis", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        throw new Error("Erro ao salvar o projeto no banco de dados")
    }

    return res.json()
}

export async function deleteAmigurumi(id: string, token: string) {
    const res = await fetch(`http://localhost:8080/api/amigurumis/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    if (!res.ok) throw new Error("Erro ao deletar")
}

export async function updateAmigurumi(id: string, data: CreateAmigurumiInput, token: string) {
    const res = await fetch(`http://localhost:8080/api/amigurumis/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Erro ao atualizar")
    return res.json()
}