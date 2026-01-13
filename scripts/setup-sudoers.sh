#!/bin/bash
# Script para configurar sudoers para o GitHub Actions Runner
# Uso: sudo ./setup-sudoers.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Setup Sudoers para Actions Runner${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Este script deve ser executado como root (sudo)${NC}"
    echo "Use: sudo $0"
    exit 1
fi

# Detectar usuário do Actions Runner
# Método 1: Verificar owner do diretório do runner (mais confiável)
RUNNER_DIR="/opt/actions-runner"
if [ -d "$RUNNER_DIR" ]; then
    ACTIONS_USER=$(stat -c '%U' "$RUNNER_DIR" 2>/dev/null || stat -f '%Su' "$RUNNER_DIR" 2>/dev/null)
fi

# Método 2: Buscar processo do runner com nome completo
if [ -z "$ACTIONS_USER" ]; then
    ACTIONS_USER=$(ps -eo user=,comm= | grep -E 'actions.*runner' | grep -v grep | awk '{print $1}' | head -1)
fi

# Método 3: Listar usuários do sistema e procurar por "actions"
if [ -z "$ACTIONS_USER" ]; then
    ACTIONS_USER=$(getent passwd | grep -E 'actions' | cut -d: -f1 | head -1)
fi

# Se ainda não encontrou, pedir ao usuário
if [ -z "$ACTIONS_USER" ]; then
    echo -e "${YELLOW}Não foi possível detectar o usuário do Actions Runner automaticamente.${NC}"
    echo "Digite o nome do usuário do Actions Runner (ex: actions-runner, ec2-user, admin):"
    read -r ACTIONS_USER
fi

# Verificar se o usuário existe
if ! id "$ACTIONS_USER" &>/dev/null; then
    echo -e "${RED}Erro: Usuário '$ACTIONS_USER' não encontrado no sistema.${NC}"
    echo ""
    echo "Usuários disponíveis:"
    getent passwd | grep -E '(actions|ec2-user|admin)' | cut -d: -f1
    echo ""
    exit 1
fi

echo -e "${GREEN}Usuário do Actions Runner: $ACTIONS_USER${NC}"
echo ""

# Criar arquivo sudoers
SUDOERS_FILE="/etc/sudoers.d/actions-runner"

echo "Criando configuração sudoers em $SUDOERS_FILE..."

cat > "$SUDOERS_FILE" << EOF
# Sudoers configuration for GitHub Actions Runner
# Gerado por setup-sudoers.sh em $(date)

# Permitir comandos específicos do workflow sem senha
$ACTIONS_USER ALL=(ALL) NOPASSWD: /usr/bin/mkdir, /bin/mkdir
$ACTIONS_USER ALL=(ALL) NOPASSWD: /bin/cp, /bin/rm, /bin/ln
$ACTIONS_USER ALL=(ALL) NOPASSWD: /usr/bin/docker
$ACTIONS_USER ALL=(ALL) NOPASSWD: /bin/df
EOF

# Definir permissões corretas
chmod 0440 "$SUDOERS_FILE"

echo -e "${GREEN}✓ Arquivo criado com permissões 0440${NC}"
echo ""

# Validar configuração
echo "Validando configuração sudoers..."
if visudo -c -f "$SUDOERS_FILE" 2>&1 | grep -q "OK"; then
    echo -e "${GREEN}✓ Configuração válida!${NC}"
else
    echo -e "${RED}✗ Erro na configuração!${NC}"
    visudo -c -f "$SUDOERS_FILE"
    exit 1
fi

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Setup concluído com sucesso!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo "O usuário $ACTIONS_USER agora pode executar os comandos do workflow sem senha."
echo ""
echo "Para testar:"
echo "  sudo -u $ACTIONS_USER sudo mkdir -p /tmp/test-sudo"
echo "  sudo rm -rf /tmp/test-sudo"
echo ""
