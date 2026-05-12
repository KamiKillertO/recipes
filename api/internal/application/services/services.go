package services

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/recipevault/api/internal/domain/entities"
	"github.com/recipevault/api/internal/domain/ports"
	"github.com/recipevault/api/internal/application/dto"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrUserNotFound = errors.New("user not found")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrUsernameTaken = errors.New("username already taken")
)

type AuthService struct {
	userRepo ports.UserRepository
	jwtSecret string
}

func NewAuthService(userRepo ports.UserRepository, secret string) *AuthService {
	return &AuthService{
		userRepo: userRepo,
		jwtSecret: secret,
	}
}

func (s *AuthService) Register(req dto.RegisterRequest) (dto.AuthResponse, error) {
	existing, _ := s.userRepo.FindByUsername(req.Username)
	if existing != nil {
		return dto.AuthResponse{}, ErrUsernameTaken
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return dto.AuthResponse{}, err
	}

	user := &entities.User{
		Username: req.Username,
		PasswordHash: string(hashedPassword),
	}

	if err := s.userRepo.Create(user); err != nil {
		return dto.AuthResponse{}, err
	}

	token, err := s.generateToken(user.ID)
	if err != nil {
		return dto.AuthResponse{}, err
	}

	return dto.AuthResponse{
		Token: token,
		User: dto.UserDTO{
			ID: user.ID.String(),
			Username: user.Username,
			CreatedAt: user.CreatedAt,
		},
	}, nil
}

func (s *AuthService) Login(req dto.LoginRequest) (dto.AuthResponse, error) {
	user, err := s.userRepo.FindByUsername(req.Username)
	if err != nil {
		return dto.AuthResponse{}, ErrUserNotFound
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return dto.AuthResponse{}, ErrInvalidCredentials
	}

	token, err := s.generateToken(user.ID)
	if err != nil {
		return dto.AuthResponse{}, err
	}

	return dto.AuthResponse{
		Token: token,
		User: dto.UserDTO{
			ID: user.ID.String(),
			Username: user.Username,
			CreatedAt: user.CreatedAt,
		},
	}, nil
}

func (s *AuthService) generateToken(userID uuid.UUID) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID.String(),
		"exp": time.Now().Add(time.Hour * 24 * 7).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}

type RecipeService struct {
	recipeRepo ports.RecipeRepository
}

func NewRecipeService(recipeRepo ports.RecipeRepository) *RecipeService {
	return &RecipeService{recipeRepo: recipeRepo}
}

func (s *RecipeService) Create(userID *uuid.UUID, req dto.CreateRecipeRequest) (dto.RecipeDTO, error) {
	recipe := &entities.Recipe{
		UserID:      userID,
		Title:       req.Title,
		Description: req.Description,
		ImagePath: req.ImagePath,
		Servings: req.Servings,
		PrepTime: req.PrepTime,
		CookTime: req.CookTime,
		SourceType: req.SourceType,
		Ingredients: convertIngredients(req.Ingredients),
		Instructions: convertInstructions(req.Instructions),
		Tags: req.Tags,
	}

	if err := s.recipeRepo.Create(recipe); err != nil {
		return dto.RecipeDTO{}, err
	}

	return toRecipeDTO(recipe), nil
}

func (s *RecipeService) GetByID(id uuid.UUID) (dto.RecipeDTO, error) {
	recipe, err := s.recipeRepo.FindByID(id)
	if err != nil {
		return dto.RecipeDTO{}, err
	}
	return toRecipeDTO(recipe), nil
}

func (s *RecipeService) GetAll() ([]dto.RecipeDTO, error) {
	recipes, err := s.recipeRepo.FindAll()
	if err != nil {
		return nil, err
	}

	dtos := make([]dto.RecipeDTO, len(recipes))
	for i, recipe := range recipes {
		dtos[i] = toRecipeDTO(&recipe)
	}
	return dtos, nil
}

func (s *RecipeService) Update(id uuid.UUID, req dto.UpdateRecipeRequest) (dto.RecipeDTO, error) {
	recipe, err := s.recipeRepo.FindByID(id)
	if err != nil {
		return dto.RecipeDTO{}, err
	}

	recipe.Title = req.Title
	recipe.Description = req.Description
	recipe.ImagePath = req.ImagePath
	recipe.Servings = req.Servings
	recipe.PrepTime = req.PrepTime
	recipe.CookTime = req.CookTime
	recipe.Ingredients = convertIngredients(req.Ingredients)
	recipe.Instructions = convertInstructions(req.Instructions)
	recipe.Tags = req.Tags

	if err := s.recipeRepo.Update(recipe); err != nil {
		return dto.RecipeDTO{}, err
	}

	return toRecipeDTO(recipe), nil
}

func (s *RecipeService) Delete(id uuid.UUID) error {
	return s.recipeRepo.Delete(id)
}

func convertIngredients(ingDTOs []dto.IngredientDTO) []entities.Ingredient {
	ing := make([]entities.Ingredient, len(ingDTOs))
	for i, ingDTO := range ingDTOs {
		ing[i] = entities.Ingredient{
			Name: ingDTO.Name,
			Quantity: ingDTO.Quantity,
			Unit: ingDTO.Unit,
		}
	}
	return ing
}

func convertInstructions(instDTOs []dto.InstructionDTO) []entities.Instruction {
	inst := make([]entities.Instruction, len(instDTOs))
	for i, instDTO := range instDTOs {
		inst[i] = entities.Instruction{
			StepNumber: instDTO.StepNumber,
			Text: instDTO.Text,
		}
	}
	return inst
}

func toRecipeDTO(recipe *entities.Recipe) dto.RecipeDTO {
	ingDTOs := make([]dto.IngredientDTO, len(recipe.Ingredients))
	for i, ing := range recipe.Ingredients {
		ingDTOs[i] = dto.IngredientDTO{
			Name: ing.Name,
			Quantity: ing.Quantity,
			Unit: ing.Unit,
		}
	}

	instDTOs := make([]dto.InstructionDTO, len(recipe.Instructions))
	for i, inst := range recipe.Instructions {
		instDTOs[i] = dto.InstructionDTO{
			StepNumber: inst.StepNumber,
			Text: inst.Text,
		}
	}

	return dto.RecipeDTO{
		ID: recipe.ID.String(),
		UserID: recipe.UserID.String(),
		Title: recipe.Title,
		Description: recipe.Description,
		ImageURL: recipe.ImagePath,
		Servings: recipe.Servings,
		PrepTime: recipe.PrepTime,
		CookTime: recipe.CookTime,
		SourceType: recipe.SourceType,
		Ingredients: ingDTOs,
		Instructions: instDTOs,
		Tags: recipe.Tags,
		CreatedAt: recipe.CreatedAt.Format(time.RFC3339),
		UpdatedAt: recipe.UpdatedAt.Format(time.RFC3339),
	}
}