package main

import (
	"log"

	"amigulab/backend/internal/database"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Aviso: Arquivo .env não encontrado na raiz do backend.")
	}

	log.Println("Iniciando tentativa de conexão com o PostgreSQL...")
	err = database.Connect()
	if err != nil {
		log.Fatalf("Falha crítica na infraestrutura: %v", err)
	}
	log.Println("Teste concluído: O banco está vivo e pronto para as operações.")
}
