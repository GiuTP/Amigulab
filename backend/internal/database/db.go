package database

import (
	"context"
	"errors"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DBConn *pgxpool.Pool

func Connect() error {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		return errors.New("DATABASE_URL não configurado no .env")
	}

	pool, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		return fmt.Errorf("Erro ao criar o pool de conexão: %w", err)
	}

	if err = pool.Ping(context.Background()); err != nil {
		return fmt.Errorf("Banco de dados não respondeu ao ping: %w", err)
	}

	DBConn = pool
	fmt.Println("Conexão com o PostgreSQL (Neon) estabelecida com sucesso!")
	
	return nil
}
