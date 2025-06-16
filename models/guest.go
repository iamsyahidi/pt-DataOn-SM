package models

import "gorm.io/gorm"

type Guest struct {
	gorm.Model
	Name   string `json:"name" gorm:"not null"`
	Email  string `json:"email" gorm:"not null;unique"`
	Phone  string `json:"phone" gorm:"not null"`
	IDCard string `json:"id_card" gorm:"not null;unique"`
	Remark string `json:"remark" gorm:"not null"`
	Status string `json:"status" gorm:"not null;default:'active'"`
}
