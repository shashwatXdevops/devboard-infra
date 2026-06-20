output "vnet_id" {
    description = "The id of virtual network"
    value = azurerm_virtual_network.vnet.id
}

output "subnet_id" {
    description = "The id of subnet"
    value = azurerm_subnet.subnet.id
}

