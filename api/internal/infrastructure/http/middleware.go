package http

import (
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"github.com/google/uuid"
)

func JWTAuthMiddleware(secret string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return c.JSON(401, map[string]string{"error": "missing authorization header"})
			}

			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			if tokenString == authHeader {
				return c.JSON(401, map[string]string{"error": "invalid authorization format"})
			}

			token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}
				return []byte(secret), nil
			})

			if err != nil || !token.Valid {
				return c.JSON(401, map[string]string{"error": "invalid token"})
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				return c.JSON(401, map[string]string{"error": "invalid token claims"})
			}

			userID, ok := claims["user_id"].(string)
			if !ok {
				return c.JSON(401, map[string]string{"error": "invalid user_id in token"})
			}

			c.Set("user_id", userID)
			return next(c)
		}
	}
}

func parseUUID(s string) uuid.UUID {
	id, _ := uuid.Parse(s)
	return id
}