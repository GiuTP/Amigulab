package main

import (
	"log"
	"net/http"
	"os"

	"amigulab/backend/internal/database"
	"amigulab/backend/internal/handlers"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
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

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	r.Get("/api/amigurumis", handlers.GetAllAmigurumis)
	r.Post("/api/amigurumis", handlers.CreateAmigurumi)
	r.Get("/api/amigurumis/{id}", handlers.GetAmigurumiByID)
	r.Put("/api/amigurumis/{id}", handlers.UpdateAmigurumi)
	r.Delete("/api/amigurumis/{id}", handlers.DeleteAmigurumi)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Servidor da Amigulab rodando na porta %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
