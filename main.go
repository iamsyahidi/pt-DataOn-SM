package main

import (
	"fmt"
	"log"
	"pt-DataOn-SM/models"
	"regexp"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {

	db, err := gorm.Open(sqlite.Open("guest.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect database")
	}

	db.AutoMigrate(&models.Guest{})

	app := fiber.New()

	app.Use(logger.New(), cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PUT,DELETE",
		AllowHeaders: "Content-Type",
	}))

	// GET ALL GUESTS
	app.Get("/guests", func(c *fiber.Ctx) error {
		var guests []models.Guest

		if err := db.Find(&guests).Where("status = 'active'").Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"error":   "Failed to fetch guests",
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"success": true,
			"data":    guests,
		})
	})

	// CREATE GUEST
	app.Post("/guests", func(c *fiber.Ctx) error {
		guest := new(models.Guest)

		if err := c.BodyParser(guest); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"error":   "Invalid request body",
			})
		}

		if err := sanitizeInput(guest); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"error":   err.Error(),
			})
		}

		guest.Status = "active"
		result := db.Create(&guest)
		if result.Error != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"error":   "Failed to create guest record",
			})
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"success": true,
			"data":    guest,
		})
	})

	// GET GUEST BY ID
	app.Get("/guests/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		var guest models.Guest

		if err := db.First(&guest, id).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"error":   "Failed to fetch guest record",
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"success": true,
			"data":    guest,
		})
	})

	// UPDATE GUEST
	app.Put("/guests/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		var guest models.Guest

		if err := db.First(&guest, id).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"error":   "Failed to fetch guest record",
			})
		}

		updatedGuest := new(models.Guest)
		if err := c.BodyParser(updatedGuest); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"error":   "Invalid request body",
			})
		}

		if err := sanitizeInput(updatedGuest); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"error":   err.Error(),
			})
		}

		guest.Name = updatedGuest.Name
		guest.Email = updatedGuest.Email
		guest.Phone = updatedGuest.Phone
		guest.IDCard = updatedGuest.IDCard
		guest.Remark = updatedGuest.Remark
		guest.Status = updatedGuest.Status
		if err := db.Save(&guest).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"error":   "Failed to update guest record",
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"success": true,
			"data":    guest,
		})
	})

	app.Delete("/guests/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		var guest models.Guest

		if err := db.First(&guest, id).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"error":   "Failed to fetch guest record",
			})
		}

		guest.Status = "deleted"
		if err := db.Save(&guest).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"error":   "Failed to delete guest record",
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"success": true,
			"data":    guest,
		})
	})

	log.Fatal(app.Listen(":3000"))
}

// Custom validation functions
func validateEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}

func validatePhone(phone string) bool {
	phoneRegex := regexp.MustCompile(`^[0-9]{10,13}$`)
	return phoneRegex.MatchString(phone)
}

func validateIDCard(idCard string) bool {
	return len(idCard) >= 12 && len(idCard) <= 20
}

func sanitizeInput(guest *models.Guest) (err error) {
	guest.Name = strings.TrimSpace(guest.Name)
	guest.Email = strings.TrimSpace(guest.Email)
	guest.Phone = strings.TrimSpace(guest.Phone)
	guest.IDCard = strings.TrimSpace(guest.IDCard)
	guest.Remark = strings.TrimSpace(guest.Remark)

	if guest.Name == "" {
		return fmt.Errorf("Name is required")
	}

	if !validateEmail(guest.Email) {
		return fmt.Errorf("Invalid email format")
	}

	if !validatePhone(guest.Phone) {
		return fmt.Errorf("Phone number must be 10-13 digits")
	}

	if !validateIDCard(guest.IDCard) {
		return fmt.Errorf("ID Card must be 12-20 characters")
	}

	if guest.Remark == "" {
		return fmt.Errorf("Remark is required")
	}

	if guest.Status == "" {
		guest.Status = "active"
	}

	return nil
}
