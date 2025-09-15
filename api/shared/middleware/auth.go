package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/nomyx/resonance-platform/shared/types"
)

// AuthMiddleware validates API keys and JWT tokens
func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := types.NewRequestID()
		c.Set("request_id", requestID)

		// Check for API key first
		apiKey := c.GetHeader("X-API-Key")
		if apiKey != "" {
			// TODO: Validate API key against database
			if validateAPIKey(apiKey) {
				c.Set("auth_type", "api_key")
				c.Set("user_id", extractUserIDFromAPIKey(apiKey))
				c.Next()
				return
			}
		}

		// Check for JWT token
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, types.NewAPIError(
				"AUTH_001",
				"Missing authentication",
				"Provide either X-API-Key header or Authorization bearer token",
				requestID,
			))
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, types.NewAPIError(
				"AUTH_002",
				"Invalid authorization format",
				"Authorization header must be in format 'Bearer <token>'",
				requestID,
			))
			c.Abort()
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, types.NewAPIError(
				"AUTH_003",
				"Invalid token",
				err.Error(),
				requestID,
			))
			c.Abort()
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			c.Set("auth_type", "jwt")
			c.Set("user_id", claims["user_id"])
			c.Set("scopes", claims["scopes"])
		}

		c.Next()
	}
}

// validateAPIKey validates an API key (stub implementation)
func validateAPIKey(apiKey string) bool {
	// TODO: Implement actual API key validation
	// For now, accept any key that starts with "ak_"
	return strings.HasPrefix(apiKey, "ak_")
}

// extractUserIDFromAPIKey extracts user ID from API key (stub implementation)
func extractUserIDFromAPIKey(apiKey string) string {
	// TODO: Implement actual user ID extraction
	// For now, return a mock user ID
	return "user_" + apiKey[3:8]
}

// RateLimitMiddleware implements rate limiting
func RateLimitMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// TODO: Implement rate limiting using Redis
		// For now, just pass through
		c.Next()
	}
}

// CORSMiddleware handles CORS headers
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, X-API-Key")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}