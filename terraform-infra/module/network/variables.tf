variable "resource_group_name" {
    description = "The name of the Resource Group created in the root module"
    type = string
}

variable "location" {
    description = "The Azure region where the network will be created"
    type = string
}

variable "vnet_name" {
    description = "The vnet name that need to create or reference"
    type = string
}

variable "vnet_address_space" {
    type = list(string)
    default = ["10.0.0.0/16"]
}

variable "subnet_name" {
    description =  "Subnet name"
    type = string
}

variable  "security_group" {
    description = "Network security group name"
    type = string
}

variable "security_rules" {
  description = "A list of security rules to apply to the NSG"
  type = list(object({
    name                       = string
    priority                   = number
    direction                  = string
    access                     = string
    protocol                   = string
    source_port_range          = string
    destination_port_range     = string
    source_address_prefix      = string
    destination_address_prefix = string
  }))
  default = []
}