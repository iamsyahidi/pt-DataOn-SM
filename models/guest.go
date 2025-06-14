package models

import "gorm.io/gorm"

type Guest struct {
	gorm.Model
	Name   string `json:"name"`
	Email  string `json:"email"`
	Phone  string `json:"phone"`
	IDCard string `json:"id_card"`
	Remark string `json:"remark"`
	Status string `json:"status"`
}
