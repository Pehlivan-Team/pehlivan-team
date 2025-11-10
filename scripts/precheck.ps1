#!/usr/bin/env pwsh
<#
Short pre-check script for contributors and AI agents.

Usage (PowerShell / pwsh):
  ./scripts/precheck.ps1            # run lint and tests
  ./scripts/precheck.ps1 -InstallDependencies  # run `yarn install` first

This script assumes `yarn` is available in PATH and the repository uses the existing
`yarn` scripts (see `package.json`): `lint` and `test`.
#>

param(
    [switch]$InstallDependencies
)

$ErrorActionPreference = 'Stop'

function Run-Step([string]$name, [scriptblock]$action) {
    Write-Host "\n==> $name" -ForegroundColor Cyan
    try {
        & $action
        if ($LASTEXITCODE -ne 0) {
            Write-Host "`$name failed with exit code $LASTEXITCODE" -ForegroundColor Red
            return $LASTEXITCODE
        }
        Write-Host "$name completed successfully" -ForegroundColor Green
        return 0
    } catch {
        Write-Host "$name threw an exception: $_" -ForegroundColor Red
        return 1
    }
}

Write-Host "Running repository pre-checks: lint and tests" -ForegroundColor Yellow

if ($InstallDependencies) {
    $code = Run-Step "Install dependencies (yarn)" { yarn install }
    if ($code -ne 0) { exit $code }
}

$results = @()

$results += Run-Step "Lint (yarn lint)" { yarn lint }
$results += Run-Step "Tests (yarn test)" { yarn test }

if ($results | Where-Object { $_ -ne 0 }) {
    Write-Host "One or more pre-checks failed. See output above." -ForegroundColor Red
    exit 1
}

Write-Host "All pre-checks passed." -ForegroundColor Green
exit 0
