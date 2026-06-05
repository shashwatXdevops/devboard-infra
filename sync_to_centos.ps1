<#
.SYNOPSIS
Securely synchronizes the Devboard workspace from the Windows host to the CentOS VirtualBox VM.

.DESCRIPTION
This script uses standard native PowerShell 'scp' to mirror the contents of 'd:\Devboard'
to the target CentOS VM designated as the local development environment and GitHub runner.
#>

$sourceDir = "d:\Devboard\*"
# UPDATE THESE VARIABLES with your actual VM IP and username
$vmUser = "centos"
$vmIp = "192.168.56.10" # Default VirtualBox Host-Only IP, change if needed
$destDir = "/home/$vmUser/devboard"

Write-Host "Starting Secure Copy to CentOS VM ($vmUser@$vmIp)..." -ForegroundColor Cyan

# Create destination directory if it doesn't exist via ssh
ssh ${vmUser}@${vmIp} "mkdir -p $destDir"

# Sync the codebase
scp -r $sourceDir ${vmUser}@${vmIp}:$destDir

Write-Host "Sync Complete! You can now SSH into your CentOS VM and run 'docker compose up -d' inside ~/devboard." -ForegroundColor Green
