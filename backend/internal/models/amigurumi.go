package models

import "time"

type Amigurumi struct {
	ID             string    `json:"id"`
	Name           string    `json:"name"`
	ImageURL       string    `json:"image_url"`
	Difficulty     int       `json:"difficulty"`
	Satisfaction   int       `json:"satisfaction"`
	TimeSpentHours float64   `json:"time_spent_hours"`
	Materials      []string  `json:"materials"`
	Story          string    `json:"story"`
	CreatedAt      time.Time `json:"created_at"`
}
