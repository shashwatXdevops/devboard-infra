#1. Create the RG

resource "azurerm_resource_group" "rg" { 
    name = "devboard-rg"
    location = "East US"
}

#2. Call the Network module

module "my_network" {
    source = "./module/network"
    resource_group_name = azurerm_resource_group.rg.name
    location = azurerm_resource_group.rg.location
    vnet_name = "devboard-vnet"
    subnet_name = "k3s-subnet"
    security_group = "devboard-nsg"

    security_rules = [
    {
        name                       = "Allow-SSH"
        priority                   = 100
        direction                  = "Inbound"
        access                     = "Allow"
        protocol                   = "Tcp"
        source_port_range          = "*"
        destination_port_range     = "22"
        source_address_prefix      = "*"
        destination_address_prefix = "*"
    }
    ]
}

#3. Call compute module

module "my_compute" {
    source = "./module/compute"
    resource_group_name = azurerm_resource_group.rg.name
    location = azurerm_resource_group.rg.location
    vm_name = "devboard-k3s-master"

    #grabbing subnetid from network module's output

    subnet_id = module.my_network.subnet_id
}

# 4. Call Compute Module again for the Worker Node!
module "my_worker_node" {
  source              = "./module/compute"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  
  # Notice how we just change the name!
  vm_name             = "devboard-k3s-worker-1"
  
  subnet_id           = module.my_network.subnet_id
}

# 5. Call Compute Module for the GitHub Runner
module "github_runner" {
  source              = "./module/compute"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  
  vm_name             = "github-runner-vm"
  
  # Override the default size to use the Free Tier!
  vm_size             = "Standard_B1s"
  
  subnet_id           = module.my_network.subnet_id
}