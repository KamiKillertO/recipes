package entities

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID           uuid.UUID `json:"id"`
	Username    string    `json:"username"`
	PasswordHash string   `json:"-"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Recipe struct {
	ID           uuid.UUID       `json:"id"`
	UserID      uuid.UUID       `json:"user_id"`
	Title       string         `json:"title"`
	Description string       `json:"description"`
	ImagePath   string         `json:"image_path,omitempty"`
	ImageURL   string         `json:"image_url,omitempty"`
	Servings    int           `json:"servings"`
	PrepTime   int            `json:"prep_time"`
	CookTime   int            `json:"cook_time"`
	SourceType string        `json:"source_type"`
	Ingredients []Ingredient `json:"ingredients"`
	Instructions []Instruction `json:"instructions"`
	Tags       []string      `json:"tags"`
	CreatedAt  time.Time     `json:"created_at"`
	UpdatedAt time.Time     `json:"updated_at"`
}

type Ingredient struct {
	Name     string `json:"name"`
	Quantity string `json:"quantity"`
	Unit     string `json:"unit"`
}

type Instruction struct {
	StepNumber int    `json:"step_number"`
	Text      string `json:"text"`
}