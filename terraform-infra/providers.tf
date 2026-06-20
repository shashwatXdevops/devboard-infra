terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.7"
    }
  }
  # Tell Terraform to use the vault we just created!
  backend "azurerm" {
    resource_group_name  = "tfstate-rg"
    storage_account_name = "tfstate998877" 
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }
}
provider "azurerm" {
  features {}
}