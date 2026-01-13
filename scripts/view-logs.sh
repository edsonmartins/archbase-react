#!/bin/bash
# Script helper para visualizar logs no VPS
# Uso: ./view-logs.sh {runner|docs|traefik|build|all}

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

function print_header() {
    echo -e "${BLUE}=================================$NC"
    echo -e "${BLUE} $1 ${NC}"
    echo -e "${BLUE}=================================$NC"
}

function view_runner_logs() {
    print_header "GitHub Actions Runner"

    # Ver logs dos últimos 5 minutos
    echo -e "${GREEN}Logs dos últimos 5 minutos:${NC}"
    journalctl -u actions-runner.* --since "5 minutes ago" --no-pager | tail -30

    echo ""
    echo -e "${YELLOW}Para acompanhar em tempo real:${NC}"
    echo "  sudo journalctl -u actions-runner.* -f"
}

function view_docs_logs() {
    print_header "Container nginx (docs)"

    if docker ps | grep -q react-docs; then
        docker logs archbase-react_react-docs.1 --tail 30
        echo ""
        echo -e "${YELLOW}Para acompanhar em tempo real:${NC}"
        echo "  docker logs -f archbase-react_react-docs.1"
    else
        echo -e "${RED}Container não está rodando${NC}"
    fi
}

function view_traefik_logs() {
    print_header "Traefik"

    TRAEFIK_CONTAINER=$(docker ps -q -f name=traefik)

    if [ -n "$TRAEFIK_CONTAINER" ]; then
        docker logs "$TRAEFIK_CONTAINER" --tail 30
        echo ""
        echo -e "${YELLOW}Para acompanhar em tempo real:${NC}"
        echo "  docker logs -f $TRAEFIK_CONTAINER"
    else
        echo -e "${RED}Traefik não está rodando${NC}"
    fi
}

function view_build_log() {
    print_header "Último Build Salvo"

    LOG_FILE="/var/log/actions-runner/latest-build.log"

    if [ -f "$LOG_FILE" ]; then
        LINES=$(wc -l < "$LOG_FILE")
        SIZE=$(du -h "$LOG_FILE" | cut -f1)

        echo -e "${GREEN}Arquivo: $LOG_FILE${NC}"
        echo -e "${GREEN}Linhas: $LINES | Tamanho: $SIZE${NC}"
        echo ""

        # Mostrar últimas 50 linhas
        tail -50 "$LOG_FILE"

        echo ""
        echo -e "${YELLOW}Para ver o arquivo completo:${NC}"
        echo "  less $LOG_FILE"
        echo "  cat $LOG_FILE"
    else
        echo -e "${RED}Nenhum log salvo encontrado${NC}"
        echo "Execute: sudo /usr/local/bin/save-build-logs.sh"
    fi
}

function view_all() {
    view_runner_logs
    echo ""
    echo ""
    view_docs_logs
    echo ""
    echo ""
    view_traefik_logs
}

# Menu principal
case "${1:-}" in
  runner)
    view_runner_logs
    ;;
  docs)
    view_docs_logs
    ;;
  traefik)
    view_traefik_logs
    ;;
  build)
    view_build_log
    ;;
  all)
    view_all
    ;;
  *)
    echo "Uso: $0 {runner|docs|traefik|build|all}"
    echo ""
    echo "Opções:"
    echo "  runner   - Logs do GitHub Actions Runner"
    echo "  docs     - Logs do container nginx"
    echo "  traefik  - Logs do Traefik"
    echo "  build    - Último build salvo em arquivo"
    echo "  all      - Todos os logs acima"
    exit 1
    ;;
esac
