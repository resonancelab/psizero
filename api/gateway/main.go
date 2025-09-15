package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/nomyx/resonance-platform/gateway/router"
	"github.com/nomyx/resonance-platform/shared/middleware"
	"github.com/nomyx/resonance-platform/shared/types"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title Nomyx Resonance Platform API
// @version 1.0
// @description Advanced Resonance-Based API Suite for quantum and symbolic computing
// @termsOfService https://api.nomyx.dev/terms

// @contact.name API Support
// @contact.url https://api.nomyx.dev/support
// @contact.email support@nomyx.dev

// @license.name MIT
// @license.url https://opensource.org/licenses/MIT

// @host api.nomyx.dev
// @BasePath /v1

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name X-API-Key

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

func main() {
	// Load configuration
	config := loadConfig()
	
	// Set Gin mode
	if config.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Create Gin router
	r := gin.New()

	// Add middleware
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(middleware.CORSMiddleware())
	r.Use(middleware.RateLimitMiddleware())

	// Health check endpoint (no auth required)
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
			"service": "nomyx-gateway",
			"version": "1.0.0",
		})
	})

	// Swagger documentation (no auth required)
	r.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// API routes with authentication
	v1 := r.Group("/v1")
	v1.Use(middleware.AuthMiddleware(config.JWTSecret))
	
	// Initialize service routers
	router.SetupSRSRoutes(v1)
	router.SetupHQERoutes(v1)
	router.SetupQSEMRoutes(v1)
	router.SetupNLCRoutes(v1)
	router.SetupQCRRoutes(v1)
	router.SetupIChingRoutes(v1)
	router.SetupUnifiedRoutes(v1)
	router.SetupWebhookRoutes(v1)

	// Start server
	port := config.Port
	if port == 0 {
		port = 8080
	}

	log.Printf("Starting Nomyx Resonance API Gateway on port %d", port)
	log.Printf("Documentation available at http://localhost:%d/docs/", port)
	
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func loadConfig() *types.Config {
	return &types.Config{
		Port:        getEnvInt("PORT", 8080),
		DatabaseURL: getEnv("DATABASE_URL", "postgres://localhost/nomyx_resonance?sslmode=disable"),
		RedisURL:    getEnv("REDIS_URL", "redis://localhost:6379"),
		JWTSecret:   getEnv("JWT_SECRET", "your-secret-key"),
		LogLevel:    getEnv("LOG_LEVEL", "info"),
		Environment: getEnv("ENVIRONMENT", "development"),
		ServiceName: "nomyx-gateway",
		MetricsPort: getEnvInt("METRICS_PORT", 9090),
		HealthPort:  getEnvInt("HEALTH_PORT", 8081),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		// Simple conversion, in production use strconv.Atoi with error handling
		return defaultValue
	}
	return defaultValue
}