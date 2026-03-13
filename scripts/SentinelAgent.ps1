# =============================================================================
#  PC Sentinel — Heartbeat Agent
#  File:    SentinelAgent.ps1
#  Purpose: Silently pings the PC Sentinel backend every 60 seconds.
#           Self-healing: retries on network failure with exponential backoff.
#  Run:     Hidden via Windows Task Scheduler (see SETUP_GUIDE.md)
# =============================================================================

# ── Configuration ─────────────────────────────────────────────────────────────
$SERVER_URL  = "https://backend url/api/heartbeat"   # <-- CHANGE THIS
$API_KEY     = "heartbeat-key"            # <-- CHANGE THIS
$INTERVAL    = 15          # Seconds between pings
$MAX_RETRIES = 5           # Max retries on failure before waiting next cycle
$LOG_FILE    = "$env:APPDATA\PCsentinel\sentinel.log"
$MAX_LOG_KB  = 512         # Rotate log when it exceeds this size (KB)

# ── Setup log directory ───────────────────────────────────────────────────────
$logDir = Split-Path $LOG_FILE
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

# ── Logger ────────────────────────────────────────────────────────────────────
function Write-Log {
    param([string]$Level, [string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$timestamp] [$Level] $Message"

    # Rotate log if too large
    if (Test-Path $LOG_FILE) {
        $sizeKB = (Get-Item $LOG_FILE).Length / 1KB
        if ($sizeKB -gt $MAX_LOG_KB) {
            $archive = $LOG_FILE -replace '\.log$', "_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
            Rename-Item -Path $LOG_FILE -NewName $archive -Force
        }
    }

    Add-Content -Path $LOG_FILE -Value $line -Encoding UTF8
}

# ── Send heartbeat with retry logic ──────────────────────────────────────────
function Send-Heartbeat {
    $headers = @{ "x-api-key" = $API_KEY; "Content-Type" = "application/json" }
    $body    = '{"source":"powershell-agent"}'
    $attempt = 0
    $delay   = 5  # Initial retry delay in seconds

    while ($attempt -lt $MAX_RETRIES) {
        try {
            $response = Invoke-RestMethod `
                -Uri     $SERVER_URL `
                -Method  POST `
                -Headers $headers `
                -Body    $body `
                -TimeoutSec 15

            Write-Log "OK" "Heartbeat sent. Server: $($response.timestamp)"
            return $true
        }
        catch {
            $attempt++
            $errMsg = $_.Exception.Message

            if ($attempt -ge $MAX_RETRIES) {
                Write-Log "FAIL" "All $MAX_RETRIES retries failed. Last error: $errMsg"
                return $false
            }

            Write-Log "WARN" "Attempt $attempt failed ($errMsg). Retrying in ${delay}s..."
            Start-Sleep -Seconds $delay
            $delay = [Math]::Min($delay * 2, 60)   # Exponential backoff, cap 60s
        }
    }
    return $false
}

# ── Main loop ─────────────────────────────────────────────────────────────────
Write-Log "START" "PC Sentinel Agent started. Interval: ${INTERVAL}s | Target: $SERVER_URL"

while ($true) {
    Send-Heartbeat | Out-Null
    Start-Sleep -Seconds $INTERVAL
}
