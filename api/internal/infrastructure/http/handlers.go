package http

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/recipevault/api/internal/application/dto"
	"github.com/recipevault/api/internal/application/services"
)

type Handler struct {
	authService *services.AuthService
	recipeService *services.RecipeService
}

func NewHandler(authService *services.AuthService, recipeService *services.RecipeService) *Handler {
	return &Handler{
		authService: authService,
		recipeService: recipeService,
	}
}

func (h *Handler) Register(c echo.Context) error {
	var req dto.RegisterRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	resp, err := h.authService.Register(req)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, resp)
}

func (h *Handler) Login(c echo.Context) error {
	var req dto.LoginRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	resp, err := h.authService.Login(req)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, resp)
}

func (h *Handler) ListRecipes(c echo.Context) error {
	recipes, err := h.recipeService.GetAll()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, recipes)
}

func (h *Handler) CreateRecipe(c echo.Context) error {
	var userID *string
	if uid := c.Get("user_id"); uid != nil {
		if s, ok := uid.(string); ok {
			userID = &s
		}
	}

	var req dto.CreateRecipeRequest

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	var puuid *uuid.UUID
	if userID != nil {
		id := parseUUID(*userID)
		puuid = &id
	}

	resp, err := h.recipeService.Create(puuid, req)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, resp)
}

func (h *Handler) GetRecipe(c echo.Context) error {
	id := c.Param("id")

	recipe, err := h.recipeService.GetByID(parseUUID(id))
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "recipe not found"})
	}

	return c.JSON(http.StatusOK, recipe)
}

func (h *Handler) UpdateRecipe(c echo.Context) error {
	id := c.Param("id")
	var req dto.UpdateRecipeRequest

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	resp, err := h.recipeService.Update(parseUUID(id), req)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, resp)
}

func (h *Handler) DeleteRecipe(c echo.Context) error {
	id := c.Param("id")

	if err := h.recipeService.Delete(parseUUID(id)); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *Handler) OCR(c echo.Context) error {
	file, err := c.FormFile("image")
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "no image file"})
	}

	src, err := file.Open()
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	defer src.Close()

	// TODO: Implement OCR with Tesseract
	// For now, return a placeholder response
	
	return c.JSON(http.StatusOK, dto.OCRResponse{
		Text: "OCR functionality coming soon. Please enter the recipe manually for now.",
	})
}

func (h *Handler) UploadImage(c echo.Context) error {
	file, err := c.FormFile("image")
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "no image file"})
	}

	src, err := file.Open()
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	defer src.Close()

	// TODO: Save file and return URL
	
	return c.JSON(http.StatusOK, map[string]string{
		"url": "/images/" + file.Filename,
	})
}