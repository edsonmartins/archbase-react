#!/bin/bash
# Script para salvar logs do Actions Runner no VPS
# Uso: ./save-build-logs.sh [--tail N]

set -e

LOG_DIR="/var/log/actions-runner"
mkdir -p "$LOG_DIR"

# Criar arquivo de log com timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$LOG_DIR/build-$TIMESTAMP.log"
LATEST_LINK="$LOG_DIR/latest-build.log"

# Salvar logs recentes
SINCE="${1:-1 hour ago}"

echo "Salvando logs do Actions Runner..."
echo "Período: últimos 1 hora"
echo "Destino: $LOG_FILE"

# Salvar logs com cabeçalho
cat > "$LOG_FILE" << EOF
===============================================
Build Log - $(date)
===============================================
EOF

# Adicionar logs do journalctl
journalctl -u actions-runner.* --since "$SINCE" --no-pager >> "$LOG_FILE"

# Criar link simbólico para o log mais recente
ln -sf "$LOG_FILE" "$LATEST_LINK"

# Estatísticas
LINES=$(wc -l < "$LOG_FILE")
SIZE=$(du -h "$LOG_FILE" | cut -f1)

echo ""
echo "Logs salvos com sucesso!"
echo "  Linhas: $LINES"
echo "  Tamanho: $SIZE"
echo "  Arquivo: $LOG_FILE"
echo "  Link: $LATEST_LINK"

# Manter apenas os últimos 20 arquivos de log
cd "$LOG_DIR"
ls -t build-*.log 2>/dev/null | tail -n +21 | xargs -I {} rm -f {}

REMAINING=$(ls build-*.log 2>/dev/null | wc -l)
echo "  Logs mantidos: $REMAINING"

# Mostrar últimas 50 linhas
echo ""
echo "=== Últimas 50 linhas do build ==="
tail -50 "$LOG_FILE"
