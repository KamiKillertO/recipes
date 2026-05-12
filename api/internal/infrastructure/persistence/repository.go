package persistence

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
	"github.com/recipevault/api/internal/domain/entities"
	"github.com/recipevault/api/internal/domain/ports"
)

type PostgresUserRepository struct {
	db *sql.DB
}

func NewPostgresUserRepository(db *sql.DB) *PostgresUserRepository {
	return &PostgresUserRepository{db: db}
}

func (r *PostgresUserRepository) Create(user *entities.User) error {
	user.ID = uuid.New()
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	query := `
		INSERT INTO users (id, username, password_hash, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5)
	`
	_, err := r.db.ExecContext(context.Background(), query,
		user.ID, user.Username, user.PasswordHash, user.CreatedAt, user.UpdatedAt)
	return err
}

func (r *PostgresUserRepository) FindByID(id uuid.UUID) (*entities.User, error) {
	query := `SELECT id, username, password_hash, created_at, updated_at FROM users WHERE id = $1`
	row := r.db.QueryRowContext(context.Background(), query, id)

	var user entities.User
	err := row.Scan(&user.ID, &user.Username, &user.PasswordHash, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *PostgresUserRepository) FindByUsername(username string) (*entities.User, error) {
	query := `SELECT id, username, password_hash, created_at, updated_at FROM users WHERE username = $1`
	row := r.db.QueryRowContext(context.Background(), query, username)

	var user entities.User
	err := row.Scan(&user.ID, &user.Username, &user.PasswordHash, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

type PostgresRecipeRepository struct {
	db *sql.DB
}

func NewPostgresRecipeRepository(db *sql.DB) *PostgresRecipeRepository {
	return &PostgresRecipeRepository{db: db}
}

var _ ports.RecipeRepository = (*PostgresRecipeRepository)(nil)

func (r *PostgresRecipeRepository) Create(recipe *entities.Recipe) error {
	recipe.ID = uuid.New()
	recipe.CreatedAt = time.Now()
	recipe.UpdatedAt = time.Now()

	query := `
		INSERT INTO recipes (id, user_id, title, description, image_path, servings, prep_time, cook_time, source_type, ingredients, instructions, tags, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
	`
	_, err := r.db.ExecContext(context.Background(), query,
		recipe.ID, recipe.UserID, recipe.Title, recipe.Description, recipe.ImagePath,
		recipe.Servings, recipe.PrepTime, recipe.CookTime, recipe.SourceType,
		recipe.Ingredients, recipe.Instructions, recipe.Tags,
		recipe.CreatedAt, recipe.UpdatedAt)
	return err
}

func (r *PostgresRecipeRepository) FindByID(id uuid.UUID) (*entities.Recipe, error) {
	query := `SELECT id, user_id, title, description, image_path, servings, prep_time, cook_time, source_type, ingredients, instructions, tags, created_at, updated_at FROM recipes WHERE id = $1`
	row := r.db.QueryRowContext(context.Background(), query, id)

	var recipe entities.Recipe
	err := row.Scan(&recipe.ID, &recipe.UserID, &recipe.Title, &recipe.Description,
		&recipe.ImagePath, &recipe.Servings, &recipe.PrepTime, &recipe.CookTime,
		&recipe.SourceType, &recipe.Ingredients, &recipe.Instructions, &recipe.Tags,
		&recipe.CreatedAt, &recipe.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &recipe, nil
}

func (r *PostgresRecipeRepository) FindAll() ([]entities.Recipe, error) {
	query := `SELECT id, user_id, title, description, image_path, servings, prep_time, cook_time, source_type, ingredients, instructions, tags, created_at, updated_at FROM recipes ORDER BY created_at DESC`
	rows, err := r.db.QueryContext(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var recipes []entities.Recipe
	for rows.Next() {
		var recipe entities.Recipe
		var userID *uuid.UUID
		err := rows.Scan(&recipe.ID, &userID, &recipe.Title, &recipe.Description,
			&recipe.ImagePath, &recipe.Servings, &recipe.PrepTime, &recipe.CookTime,
			&recipe.SourceType, &recipe.Ingredients, &recipe.Instructions, &recipe.Tags,
			&recipe.CreatedAt, &recipe.UpdatedAt)
		if err != nil {
			return nil, err
		}
		recipe.UserID = userID
		recipes = append(recipes, recipe)
	}
	return recipes, nil
}

func (r *PostgresRecipeRepository) Update(recipe *entities.Recipe) error {
	recipe.UpdatedAt = time.Now()

	query := `
		UPDATE recipes SET 
			title = $1, description = $2, image_path = $3, servings = $4, prep_time = $5, cook_time = $6,
			ingredients = $7, instructions = $8, tags = $9, updated_at = $10
		WHERE id = $11
	`
	_, err := r.db.ExecContext(context.Background(), query,
		recipe.Title, recipe.Description, recipe.ImagePath, recipe.Servings,
		recipe.PrepTime, recipe.CookTime, recipe.Ingredients, recipe.Instructions,
		recipe.Tags, recipe.UpdatedAt, recipe.ID)
	return err
}

func (r *PostgresRecipeRepository) Delete(id uuid.UUID) error {
	query := `DELETE FROM recipes WHERE id = $1`
	_, err := r.db.ExecContext(context.Background(), query, id)
	return err
}