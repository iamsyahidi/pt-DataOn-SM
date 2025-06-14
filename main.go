package main

import (
	"log"
	"pt-DataOn-SM/models"

	"github.com/gofiber/fiber/v2"
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

	app.Use(logger.New())

	app.Get("/guests", func(c *fiber.Ctx) error {
		var guests []models.Guest
		db.Find(&guests)
		return c.JSON(guests)
	})

	app.Post("/guests", func(c *fiber.Ctx) error {
		guest := new(models.Guest)
		if err := c.BodyParser(guest); err != nil {
			return c.Status(400).SendString(err.Error())
		}

		db.Create(&guest)
		return c.JSON(guest)
	})

	app.Get("/guests/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		var guest models.Guest
		db.First(&guest, id)
		return c.JSON(guest)
	})

	app.Put("/guests/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		var guest models.Guest
		db.First(&guest, id)

		updatedGuest := new(models.Guest)
		if err := c.BodyParser(updatedGuest); err != nil {
			return c.Status(400).SendString(err.Error())
		}

		guest.Name = updatedGuest.Name
		guest.Email = updatedGuest.Email
		guest.Phone = updatedGuest.Phone
		guest.IDCard = updatedGuest.IDCard
		guest.Remark = updatedGuest.Remark

		db.Save(&guest)
		return c.JSON(guest)
	})

	app.Delete("/guests/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		var guest models.Guest
		db.First(&guest, id)
		db.Delete(&guest)
		return c.SendString("Guest deleted")
	})

	log.Fatal(app.Listen(":3000"))
}
