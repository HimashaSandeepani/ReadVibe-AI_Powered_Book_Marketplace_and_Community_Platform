# Schedules the recommendation retraining task in Windows Task Scheduler.
param(
    [switch]$Install,
    [string]$TaskName = "ReadVibe Recommendation Retraining",
    [string]$RunTime = "02:00"
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$pythonScript = Join-Path $scriptDir "retrain_recommendation.py"
$logDir = Join-Path $scriptDir "logs"
$logFile = Join-Path $logDir "retrain.log"

if (-not (Test-Path $pythonScript)) {
    throw "Cannot find retraining script at: $pythonScript"
}

New-Item -ItemType Directory -Force -Path $logDir | Out-Null

function Invoke-Retraining {
    $python = Get-Command python -ErrorAction SilentlyContinue
    if (-not $python) {
        $python = Get-Command py -ErrorAction SilentlyContinue
    }

    if (-not $python) {
        throw "Python was not found on PATH. Install Python or update this script to point to your interpreter."
    }

    & $python.Source $pythonScript 2>&1 | Tee-Object -FilePath $logFile -Append
}

if (-not $Install) {
    Invoke-Retraining
    return
}

$timeParts = $RunTime.Split(":")
if ($timeParts.Count -ne 2) {
    throw "RunTime must be in HH:MM format."
}

$hour = [int]$timeParts[0]
$minute = [int]$timeParts[1]
$startBoundary = (Get-Date).Date.AddHours($hour).AddMinutes($minute)
if ($startBoundary -lt (Get-Date)) {
    $startBoundary = $startBoundary.AddDays(1)
}

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
$trigger = New-ScheduledTaskTrigger -Daily -At $startBoundary
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null

Write-Host "Scheduled task registered: $TaskName"
Write-Host "First run: $($startBoundary.ToString('yyyy-MM-dd HH:mm'))"