output "public_ip_address_id" {
    description = "Public IP Address of VM"
    value = azurerm_public_ip.public_ip.ip_address
}