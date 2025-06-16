# Guest Registration System - Backend API Documentation

## Base URL

```
http://localhost:3000/api/v1
```

## API Endpoints

This server provides the following APIs:

| METHOD    | ENDPOINT              | DESCRIPTON                                           |
|-----------|-----------------------|------------------------------------------------------|
| GET       | /api/v1/guests        | List guests                                          |
| GET       | /api/v1/guests/:id    | Get guest                                            |
| POST      | /api/v1/guests        | Create guest                                         |
| PUT       | /api/v1/guests/:id    | Update guest                                         |
| DELETE    | /api/v1/guests/:id    | Delete guest                                         |



## Setup Instructions

1. Install dependencies:
   ```bash
   go mod tidy -v
   go mod download
   ```

2. Run the application:
   ```bash
   go run main.go
   ```

3. The API will be available at `http://localhost:3000`

## Database Schema

```go
type Guest struct {
	gorm.Model
	Name   string `json:"name" gorm:"not null"`
	Email  string `json:"email" gorm:"not null;unique"`
	Phone  string `json:"phone" gorm:"not null"`
	IDCard string `json:"id_card" gorm:"not null;unique"`
	Remark string `json:"remark" gorm:"not null"`
	Status string `json:"status" gorm:"not null;default:'active'"`
}
```