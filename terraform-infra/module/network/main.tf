resource "azurerm_virtual_network" "vnet"{
    name = var.vnet_name
    location = var.location
    resource_group_name = var.resource_group_name
    address_space = var.vnet_address_space

}


# The formula is: cidrsubnet(prefix, newbits, netnum)
# If your vnet_address_space variable is set to ["10.0.0.0/16"], and you want to slice out a /24 subnet:
# prefix: The base network (10.0.0.0/16)
# newbits: How many bits to add to the prefix (Going from /16 to /24 is 8 bits)
# netnum: Which network slice you want (e.g., the 1st slice)


resource "azurerm_subnet" "subnet"{
    name = var.subnet_name
    virtual_network_name = azurerm_virtual_network.vnet.name
    resource_group_name = var.resource_group_name
    address_prefixes = [cidrsubnet(var.vnet_address_space[0], 8, 1)]
    

}


resource "azurerm_network_security_group" "nsg" {
    name                = var.security_group
    location            = var.location
    resource_group_name = var.resource_group_name
    dynamic "security_rule" {
        for_each = var.security_rules
        content {
            name                       = security_rule.value.name
            priority                   = security_rule.value.priority
            direction                  = security_rule.value.direction
            access                     = security_rule.value.access
            protocol                   = security_rule.value.protocol
            source_port_range          = security_rule.value.source_port_range
            destination_port_range     = security_rule.value.destination_port_range
            source_address_prefix      = security_rule.value.source_address_prefix
            destination_address_prefix = security_rule.value.destination_address_prefix
        }
    }
}

resource "azurerm_subnet_network_security_group_association" "nsg_association" {
    subnet_id = azurerm_subnet.subnet.id
    network_security_group_id = azurerm_network_security_group.nsg.id
}