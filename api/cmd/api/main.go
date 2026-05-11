package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/recipevault/api/internal/application/services"
	"github.com/recipevault/api/internal/infrastructure/http"
	"github.com/recipevault/api/internal/infrastructure/persistence"
	_ "github.com/lib/pq"
)

func main() {
	// Database connection
	connStr := fmt.Sprintf(
		"user=%s password=%s dbname=%s host=%s port=%s sslmode=disable",
		getEnv("DB_USER", "recipevault"),
		getEnv("DB_PASSWORD", "password"),
		getEnv("DB_NAME", "recipevault"),
		getEnv("DB_HOST", "localhost"),
		getEnv("DB_PORT", "5432"),
	)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Initialize repositories
	userRepo := persistence.NewPostgresUserRepository(db)
	recipeRepo := persistence.NewPostgresRecipeRepository(db)

	// Initialize services
	jwtSecret := getEnv("JWT_SECRET", "your-secret-key-change-in-production")
	authService := services.NewAuthService(userRepo, jwtSecret)
	recipeService := services.NewRecipeService(recipeRepo)

	// Initialize handlers
	handler := http.NewHandler(authService, recipeService)

	// Setup Echo
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// CORS middleware
	e.Use(middleware.CORS())

	// Public routes
	e.GET("/api/health", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"status": "healthy"})
	})
	e.POST("/api/auth/register", handler.Register)
	e.POST("/api/auth/login", handler.Login)

	// Protected routes
	api := e.Group("/api")
	api.Use(http.JWTAuthMiddleware(jwtSecret))
	{
		api.GET("/recipes", handler.ListRecipes)
		api.POST("/recipes", handler.CreateRecipe)
		api.GET("/recipes/:id", handler.GetRecipe)
		api.PUT("/recipes/:id", handler.UpdateRecipe)
		api.DELETE("/recipes/:id", handler.DeleteRecipe)
		api.POST("/ocr", handler.OCR)
		api.POST("/upload", handler.UploadImage)
	}

	// Start server
	port := getEnv("PORT", "8080")
	log.Printf("Server starting on port %s", port)
	e.Logger.Fatal(e.Start(":" + port))
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}