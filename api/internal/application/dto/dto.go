package dto

import "time"

type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  UserDTO `json:"user"`
}

type UserDTO struct {
	ID        string `json:"id"`
	Username  string `json:"username"`
	CreatedAt time.Time `json:"created_at"`
}

type CreateRecipeRequest struct {
	Title        string `json:"title"`
	Description string `json:"description"`
	ImagePath   string `json:"image_path,omitempty"`
	Servings    int    `json:"servings"`
	PrepTime    int    `json:"prep_time"`
	CookTime    int    `json:"cook_time"`
	SourceType string  `json:"source_type"`
	Ingredients []IngredientDTO `json:"ingredients"`
	Instructions []InstructionDTO `json:"instructions"`
	Tags        []string `json:"tags"`
}

type UpdateRecipeRequest struct {
	Title        string `json:"title"`
	Description string `json:"description"`
	ImagePath   string `json:"image_path,omitempty"`
	Servings    int    `json:"servings"`
	PrepTime    int    `json:"prep_time"`
	CookTime    int    `json:"cook_time"`
	Ingredients []IngredientDTO `json:"ingredients"`
	Instructions []InstructionDTO `json:"instructions"`
	Tags        []string `json:"tags"`
}

type RecipeDTO struct {
	ID           string `json:"id"`
	UserID      string `json:"user_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	ImageURL   string `json:"image_url"`
	Servings    int    `json:"servings"`
	PrepTime   int    `json:"prep_time"`
	CookTime   int    `json:"cook_time"`
	SourceType string `json:"source_type"`
	Ingredients []IngredientDTO `json:"ingredients"`
	Instructions []InstructionDTO `json:"instructions"`
	Tags       []string `json:"tags"`
	CreatedAt  string `json:"created_at"`
	UpdatedAt  string `json:"updated_at"`
}

type IngredientDTO struct {
	Name     string `json:"name"`
	Quantity string `json:"quantity"`
	Unit     string `json:"unit"`
}

type InstructionDTO struct {
	StepNumber int    `json:"step_number"`
	Text      string `json:"text"`
}

type OCRResponse struct {
	Text string `json:"text"`
}