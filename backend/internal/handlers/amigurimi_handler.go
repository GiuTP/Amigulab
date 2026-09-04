package handlers

import (
	"amigulab/backend/internal/models"
	"amigulab/backend/internal/repository"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func GetAllAmigurumis(w http.ResponseWriter, r *http.Request) {
	limitStr := r.URL.Query().Get("limit")
	pageStr := r.URL.Query().Get("page")

	limit := 10
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}

	page := 1
	if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
		page = p
	}

	offset := (page - 1) * limit

	amigurumis, err := repository.GetAll(r.Context(), limit, offset)
	if err != nil {
		http.Error(w, "Erro ao buscar os projetos", http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(amigurumis); err != nil {
		http.Error(w, "Erro ao processa a resposta JSON", http.StatusInternalServerError)
	}
}

func GetAmigurumiByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	amigurumi, err := repository.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, "Trabalho não encontrado", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(amigurumi)
}

func UpdateAmigurumi(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var a models.Amigurumi
	if err := json.NewDecoder(r.Body).Decode(&a); err != nil {
		http.Error(w, "Formato de JSON invĺaido", http.StatusBadRequest)
		return
	}

	a.ID = id
	if err := repository.Update(r.Context(), &a); err != nil {
		http.Error(w, "Erro ao atualizar ou trabalho não encontrado", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Projeto atualizado com sucesso"}`))
}

func DeleteAmigurumi(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if err := repository.Delete(r.Context(), id); err != nil {
		http.Error(w, "Erro ao deletar ou trabalho não encontrado", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Trabalho deletado com sucesso"}`))
}

func CreateAmigurumi(w http.ResponseWriter, r *http.Request) {
	var a models.Amigurumi

	if err := json.NewDecoder(r.Body).Decode(&a); err != nil {
		http.Error(w, "Formato de JSON inválido", http.StatusBadRequest)
		return
	}

	if a.Name == "" || a.Story == "" {
		http.Error(w, "Nome e História são campos obrigatórios", http.StatusBadRequest)
		return
	}
	if a.Difficulty < 1 || a.Difficulty > 5 {
		http.Error(w, "A dificuldade deve ser uma nota de 1 a 5", http.StatusBadRequest)
		return
	}

	if err := repository.Create(r.Context(), &a); err != nil {
		http.Error(w, "Erro interno ao salvar o trabalho", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(a)
}
