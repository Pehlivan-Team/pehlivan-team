param(
  [string]$ProjectRoot
)

if (-not $ProjectRoot) {
  $ProjectRoot = (Get-Location).Path
}

$ErrorActionPreference = 'Stop'

$target = Join-Path $ProjectRoot 'public'
if (-not (Test-Path $target)) {
  New-Item -ItemType Directory -Path $target | Out-Null
}

$sources = @('src/public','src/app/public')
foreach ($srcRel in $sources) {
  $src = Join-Path $ProjectRoot $srcRel
  if (Test-Path $src) {
    Get-ChildItem -Path $src -Recurse -File | ForEach-Object {
      $rel = $_.FullName.Substring($src.Length + 1)
      $dest = Join-Path $target $rel
      $destDir = Split-Path $dest
      if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
      if (-not (Test-Path $dest)) { Copy-Item $_.FullName -Destination $dest }
    }
  }
}

Write-Host "Assets consolidated into: $target"