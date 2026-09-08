# PowerShell script to push to GitHub
param (
    [string]$Token
)

$git = "d:\mingit\cmd\git.exe"
$repo = "divdivyesh932-blip/AI-BASED-SMART-STUDY.git"

if ($Token) {
    Write-Host "Pushing using provided Personal Access Token..." -ForegroundColor Cyan
    & $git push "https://$Token@github.com/$repo" main
} else {
    Write-Host "Pushing to https://github.com/$repo..." -ForegroundColor Cyan
    & $git push -u origin main
}
