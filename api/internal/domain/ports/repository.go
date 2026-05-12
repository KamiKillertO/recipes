package ports

import (
	"github.com/google/uuid"
	domain "github.com/recipevault/api/internal/domain/entities"
)

type UserRepository interface {
	Create(user *domain.User) error
	FindByID(id uuid.UUID) (*domain.User, error)
	FindByUsername(username string) (*domain.User, error)
}

type RecipeRepository interface {
	Create(recipe *domain.Recipe) error
	FindByID(id uuid.UUID) (*domain.Recipe, error)
	FindAll() ([]domain.Recipe, error)
	Update(recipe *domain.Recipe) error
	Delete(id uuid.UUID) error
}