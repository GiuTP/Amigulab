package repository

import (
	"amigulab/backend/internal/database"
	"amigulab/backend/internal/models"
	"context"
	"fmt"
)

func Create(ctx context.Context, amiguruimi *models.Amigurumi) error {
	query := `
		INSERT INTO amigurimis (name, image_url, difficulty, satisfaction, time_spent_hours, materials, story)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, created_at
	`

	err := database.DBConn.QueryRow(ctx, query,
		amiguruimi.Name,
		amiguruimi.ImageURL,
		amiguruimi.Difficulty,
		amiguruimi.Satisfaction,
		amiguruimi.TimeSpentHours,
		amiguruimi.Materials,
		amiguruimi.Story,
	).Scan(&amiguruimi.ID, &amiguruimi.CreatedAt)
	if err != nil {
		return fmt.Errorf("Erro ao salvar o trabalho no banco: %w", err)
	}

	return nil
}

func GetByID(ctx context.Context, id string) (*models.Amigurumi, error) {
	query := `
		SELECT id, name, image_url, difficulty, satisfaction, time_spent_hours, materials, story, created_at
		FROM amigurumis
		WHERE id = $1
	`

	var a models.Amigurumi

	err := database.DBConn.QueryRow(ctx, query, id).Scan(
		&a.ID,
		&a.Name,
		&a.ImageURL,
		&a.Difficulty,
		&a.Satisfaction,
		&a.TimeSpentHours,
		&a.Materials,
		&a.Story,
		&a.CreatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("Trabalho não encontrado ou erro de leitura: %w", err)
	}

	return &a, nil
}

func GetAll(ctx context.Context, limit, offset int) ([]models.Amigurumi, error) {
	query := `
		SELECT id, name, image_url, difficulty, satisfaction, time_spent_hours, materials, story, created_at
		FROM amigurumis
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := database.DBConn.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("Erro ao executar a busca: %w", err)
	}

	defer rows.Close()

	var amigurimis []models.Amigurumi

	for rows.Next() {
		var a models.Amigurumi
		err := rows.Scan(
			&a.ID,
			&a.Name,
			&a.ImageURL,
			&a.Difficulty,
			&a.Satisfaction,
			&a.TimeSpentHours,
			&a.Materials,
			&a.Story,
			&a.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("Erro ao escanear linha: %w", err)
		}

		amigurimis = append(amigurimis, a)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("Erro durante iteração das linhas: %w", err)
	}

	if amigurimis == nil {
		amigurimis = []models.Amigurumi{}
	}

	return amigurimis, nil
}

func Update(ctx context.Context, a *models.Amigurumi) error {
	query := `i
		UPDATE amigurimis
		SET name = $1, image_url = $2, difficulty = $3, satisfaction = $4, time_spent_hours = $5, materials = $6, story = $7
		WHERE id = $8
	`

	tag, err := database.DBConn.Exec(ctx, query,
		a.Name,
		a.ImageURL,
		a.Difficulty,
		a.Satisfaction,
		a.TimeSpentHours,
		a.Materials,
		a.Story,
		a.ID,
	)
	if err != nil {
		return fmt.Errorf("Erro ao tentar atualizar o trabalho: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return fmt.Errorf("Nenhum projeto encontrado com o ID fornecido")
	}

	return nil
}

func Delete(ctx context.Context, id string) error {
	query := `
		DELETE FROM amigurimis
		WHERE id = $1
	`

	tag, err := database.DBConn.Exec(ctx, query, id)
	if err != nil {
		return fmt.Errorf("Erro ao tentar deletar o trabalho: %w", err)
	}

	if tag.RowsAffected() == 0 {
		return fmt.Errorf("Nenhum projeto encontrado com o ID fornecido")
	}

	return nil
}
