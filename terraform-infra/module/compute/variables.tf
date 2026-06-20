variable "resource_group_name" {
    description = "The name of the Resource Group"
    type = string
}

variable "location" {
    description = "The azure region"
    type = string
}

variable "subnet_id" {
    description = "Subent if which we created"
    type = string
}

variable "vm_name" {
    description = "VM name"
    type = string
}

variable "vm_size" {
    description = "VM size for K3S"
    default = "Standard_B2s"
}

variable "admin_username" {
    description = "Default user name"
    default = "azureuser"
}