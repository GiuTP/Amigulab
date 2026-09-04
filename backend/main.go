package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"strings"

	"amigulab/backend/internal/database"
	"amigulab/backend/internal/handlers"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	"google.golang.org/api/idtoken"
)

func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer") {
			http.Error(w, "Token ausente ou mal formatado", http.StatusUnauthorized)
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		clientID := os.Getenv("GOOGLE_CLIENT_ID")

		payload, err := idtoken.Validate(context.Background(), token, clientID)
		if err != nil {
			http.Error(w, "Token inválido ou expirado", http.StatusUnauthorized)
			return
		}

		email, ok := payload.Claims["email"].(string)
		adminEmail := os.Getenv("ADMIN_EMAIL")
		if !ok || email != adminEmail {
			http.Error(w, "Acesso negado: e-mail não autorizado", http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	}
}

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
	r.Get("/api/amigurumis/{id}", handlers.GetAmigurumiByID)

	r.Post("/api/amigurumis", AuthMiddleware(handlers.CreateAmigurumi))
	r.Put("/api/amigurumis/{id}", AuthMiddleware(handlers.UpdateAmigurumi))
	r.Delete("/api/amigurumis/{id}", AuthMiddleware(handlers.DeleteAmigurumi))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Servidor da Amigulab rodando na porta %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
