resource "azurerm_public_ip" "public_ip" {
  name                = "${var.vm_name}-pip"
  resource_group_name = var.resource_group_name
  location            = var.location
  allocation_method   = "Static"
  sku = "Standard"
}

resource "azurerm_network_interface" "nic" {
    name = "${var.vm_name}-nic"
    location = var.location
    resource_group_name = var.resource_group_name

    ip_configuration {
        name = "internal"
        subnet_id = var.subnet_id
        private_ip_address_allocation = "Dynamic"
        public_ip_address_id = azurerm_public_ip.public_ip.id
    }
}

resource "azurerm_linux_virtual_machine" "vm" {
  name                = var.vm_name
  resource_group_name = var.resource_group_name
  location            = var.location
  size                = var.vm_size
  admin_username      = var.admin_username
  
  # Plugging the VM into the NIC we created earlier
  network_interface_ids = [
    azurerm_network_interface.nic.id,
  ]

  # Injecting your computer's public SSH key into the VM
  admin_ssh_key {
    username   = var.admin_username
    public_key = file("~/.ssh/id_rsa.pub")
  }

  # The Windows Key we just transferred
  admin_ssh_key {
    username   = var.admin_username
    public_key = file(pathexpand("~/.ssh/windows_id_rsa.pub"))
  }

  # Defining the Hard Drive
  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  # Defining the Operating System (Ubuntu 22.04)
  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }
}