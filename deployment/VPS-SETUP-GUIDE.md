# Guia de Instalação e Deploy na VPS

Guia passo a passo para configurar o deployment automatizado da documentação Archbase React no VPS com Docker Swarm e Traefik.

## Pré-requisitos

- VPS com Docker Swarm instalado
- Traefik configurado com rede `traefik-network`
- Acesso SSH ao VPS com sudo
- Domínio archbase.dev configurado

## Visão Geral

```
┌─────────────────┐
│  Push para main │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  GitHub Actions (trigger)       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Self-Hosted Runner (VPS)       │
│  - Build packages               │
│  - Build docs                   │
│  - Copia para /srv/             │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Docker Swarm                   │
│  - Container nginx:alpine       │
│  - Traefik labels               │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  react.archbase.dev (HTTPS)     │
└─────────────────────────────────┘
```

## Passo 1: Preparar o VPS

### 1.1 Atualizar sistema

```bash
# Conectar ao VPS
ssh usuario@seu-vps

# Atualizar pacotes
sudo apt update && sudo apt upgrade -y

# Instalar dependências básicas
sudo apt install -y curl git wget
```

### 1.2 Verificar Docker Swarm

```bash
# Verificar se Docker está instalado
docker --version

# Verificar se está em modo Swarm
docker node ls

# Se não estiver, inicializar Swarm
docker swarm init
```

### 1.3 Verificar Traefik

```bash
# Verificar se Traefik está rodando
docker service ls | grep traefik

# Verificar rede traefik-network
docker network ls | grep traefik

# Se não existir, pode ser necessário criar:
# docker network create --driver overlay traefik-network
```

## Passo 2: Instalar Node.js e pnpm

### 2.1 Instalar Node.js 20

```bash
# Usar o script de instalação do Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar versões
node --version  # deve ser v20.x.x
npm --version
```

### 2.2 Instalar pnpm

```bash
# Instalar pnpm globalmente
npm install -g pnpm

# Ou usar o script oficial
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Verificar versão
pnpm --version  # deve ser 9.x.x
```

## Passo 3: Instalar GitHub Actions Self-Hosted Runner

### 3.1 Criar usuário para o runner

```bash
# Criar usuário dedicado
sudo useradd -m -s /bin/bash actions-runner
sudo passwd actions-runner  # opcional, para login direto

# Adicionar ao grupo docker
sudo usermod -aG docker actions-runner

# Verificar se consegue usar docker sem sudo
sudo -u actions-runner docker ps
```

### 3.2 Obter token do GitHub

1. Acesse: https://github.com/edsonmartins/archbase-react/settings/actions
2. Clique em "New self-hosted runner"
3. Escolha: Linux → x64
4. Copie o **token** que aparece
5. Anote também a **URL de download**

### 3.3 Baixar e configurar o runner

```bash
# Criar diretório
sudo mkdir -p /opt/actions-runner
sudo chown actions-runner:actions-runner /opt/actions-runner

# Trocar para usuário actions-runner
sudo su - actions-runner

# Ir para o diretório
cd /opt/actions-runner

# Baixar (SUBSTITUA pela URL mais recente do GitHub)
curl -o actions-runner-linux-x64-<version>.tar.gz -L <DOWNLOAD_URL>
# Exemplo: curl -o actions-runner-linux-x64-2.317.0.tar.gz -L https://github.com/actions/...

# Extrair
tar xzf ./actions-runner-linux-x64-*.tar.gz

# Instalar dependências
./bin/installdependencies.sh

# Configurar (SUBSTITUA pelo token)
./config.sh \
  --url https://github.com/edsonmartins/archbase-react \
  --token <SEU_TOKEN_AQUI>

# Sair do usuário actions-runner
exit
```

### 3.4 Instalar como serviço

```bash
# Ainda no diretório /opt/actions-runner
cd /opt/actions-runner

# Instalar serviço
sudo ./svc.sh install actions-runner

# Iniciar serviço
sudo ./svc.sh start

# Verificar status
sudo ./svc.sh status

# Ver logs
sudo journalctl -u actions-runner.* -f
```

### 3.5 Verificar no GitHub

1. Volte para: https://github.com/edsonmartins/archbase-react/settings/actions
2. O runner deve aparecer como "online" com status verde

## Passo 4: Configurar Diretórios e Arquivos

### 4.1 Criar diretório de deploy

```bash
# Criar diretório para arquivos estáticos
sudo mkdir -p /srv/archbase-react-docs

# Ajustar permissões para o runner poder escrever
sudo chown -R actions-runner:actions-runner /srv/archbase-react-docs
```

### 4.2 Criar diretório de infraestrutura

```bash
# Criar diretório para configs docker
sudo mkdir -p /opt/archbase-infrastructure
```

### 4.3 Copiar docker-compose.yml

```bash
# Criar o arquivo
sudo nano /opt/archbase-infrastructure/docker-compose.yml
```

Copie o conteúdo de `deployment/docker-compose.example.yml`:

```yaml
version: '3.9'

x-default-opts:
  &default-opts
  logging:
    options:
      max-size: "10m"

networks:
  traefik-network:
    external: true

services:
  react-docs:
    <<: *default-opts
    image: nginx:alpine
    networks:
      - traefik-network
    volumes:
      - /srv/archbase-react-docs:/usr/share/nginx/html:ro
    deploy:
      mode: replicated
      replicas: 1
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      update_config:
        parallelism:1
        delay: 10s
        failure_action: rollback
        order: start-first
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.react-docs.rule=Host(`react.archbase.dev`)"
        - "traefik.http.routers.react-docs.entrypoints=websecure"
        - "traefik.http.routers.react-docs.tls=true"
        - "traefik.http.routers.react-docs.tls.certresolver=letsencrypt"
        - "traefik.http.services.react-docs.loadbalancer.server.port=80"
        - "traefik.http.routers.react-docs-http.rule=Host(`react.archbase.dev`)"
        - "traefik.http.routers.react-docs-http.entrypoints=web"
        - "traefik.http.routers.react-docs-http.middlewares=redirect-to-https"
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s
```

### 4.4 Dar permissão de sudo sem senha para o runner

O runner precisa de sudo para copiar arquivos e gerenciar Docker:

```bash
# Criar arquivo de regras sudo
sudo visudo

# Adicionar a seguinte linha:
actions-runner ALL=(ALL) NOPASSWD: /bin/mkdir, /bin/chown, /bin/chmod, /bin/cp, /bin/rm, /usr/bin/docker
```

Ou criar um arquivo específico:

```bash
echo "actions-runner ALL=(ALL) NOPASSWD: /srv/archbase-react-docs*, /opt/archbase-infrastructure/docker-compose.yml, /usr/bin/docker" | sudo tee /etc/sudoers.d/actions-runner
sudo chmod 0440 /etc/sudoers.d/actions-runner
```

## Passo 5: Deploy Inicial

### 5.1 Fazer deploy da stack Docker

```bash
cd /opt/archbase-infrastructure
docker stack deploy -c docker-compose.yml archbase-react
```

### 5.2 Verificar se o container está rodando

```bash
# Ver serviços da stack
docker stack ps archbase-react

# Ver logs
docker logs -f archbase-react_react-docs.1

# Ver se Traefik detectou
docker service inspect archbase-react_react-docs --format '{{json .Spec.TaskTemplate.ContainerSpec.Labels}}' | jq
```

## Passo 6: Configurar DNS

### 6.1 Adicionar registro DNS

No seu provedor de DNS, adicione:

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| A | react.archbase.dev | IP_DO_VPS | 300 |

### 6.2 Verificar propagação

```bash
# No VPS ou local
dig react.archbase.dev
nslookup react.archbase.dev
```

## Passo 7: Testar Deploy Automático

### 7.1 Trigger manual do workflow

1. Vá para: https://github.com/edsonmartins/archbase-react/actions/workflows/deploy-docs-vps.yml
2. Clique em "Run workflow"
3. Selecione a branch `main`
4. Clique em "Run workflow"

### 7.2 Acompanhar execução

```bash
# No VPS, ver logs do runner
sudo journalctl -u actions-runner.* -f

# Ou ver a execução no GitHub
```

### 7.3 Verificar arquivos

```bash
# Verificar se arquivos foram copiados
ls -la /srv/archbase-react-docs/

# Ver conteúdo
cat /srv/archbase-react-docs/index.html
```

## Passo 8: Acessar Documentação

Acesse: https://react.archbase.dev

Se tudo estiver correto, você deve ver a documentação do Archbase React.

## Troubleshooting

### Runner não aparece no GitHub

```bash
# Ver status
sudo ./svc.sh status

# Reiniciar
sudo ./svc.sh restart

# Ver logs detalhados
sudo journalctl -u actions-runner.* -n 100
```

### Permissão negada ao copiar arquivos

```bash
# Ver permissões do diretório
ls -la /srv/ | grep archbase

# Ajustar permissões
sudo chown -R actions-runner:actions-runner /srv/archbase-react-docs
sudo chmod -R 755 /srv/archbase-react-docs
```

### Docker não funciona para o runner

```bash
# Ver se usuário está no grupo docker
groups actions-runner

# Adicionar novamente
sudo usermod -aG docker actions-runner

# Fazer logout e login do usuário
# Ou usar newgrp
sudo -u actions-runner -s /bin/bash -c "newgrp docker; docker ps"
```

### Traefik não detecta o container

```bash
# Ver labels do serviço
docker service inspect archbase-react_react-docs --format '{{json .Spec.TaskTemplate.ContainerSpec.Labels}}' | jq

# Ver rede
docker network ls | grep traefik

# Ver se container está na rede correta
docker service ps archbase-react
```

### HTTPS não funciona (certificado)

```bash
# Ver logs do Traefik para erros de certificado
docker logs $(docker ps -q -f name=traefik) | grep -i error

# Verificar se letsencrypt é o resolver correto
# No traefik-stack.yml, deve ter:
# --certificatesresolvers.letsencrypt.acme.tlschallenge=true
```

### Container sobe mas página não carrega

```bash
# Ver se arquivos existem
ls -la /srv/archbase-react-docs/

# Ver logs do container
docker logs archbase-react_react-docs.1

# Entrar no container para debug
docker exec -it $(docker ps -q -f name=react-docs) sh
ls -la /usr/share/nginx/html/
```

## Deploy Manual (Opcional)

Caso precise fazer deploy manual sem passar pelo GitHub Actions:

```bash
# Clonar repositório
cd /tmp
git clone https://github.com/edsonmartins/archbase-react.git
cd archbase-react

# Instalar dependências
pnpm install

# Build dos pacotes
pnpm run build:dev

# Build da documentação
cd docs-site
export NODE_OPTIONS=--max_old_space_size=8192
pnpm run build

# Copiar arquivos
sudo rm -rf /srv/archbase-react-docs/*
sudo cp -r out/* /srv/archbase-react-docs/

# Recrear stack
cd /opt/archbase-infrastructure
docker stack deploy -c docker-compose.yml archbase-react
```

## Manutenção

### Verificar espaço em disco

```bash
df -h

# Limpar builds antigos
ls -la /srv/archbase-react-docs.backup/
# Manter apenas últimos 5
cd /srv/archbase-react-docs.backup
ls -t | tail -n +6 | xargs -I {} rm -rf {}
```

### Atualizar runner

```bash
cd /opt/actions-runner
./bin/updatesvc.sh
sudo ./svc.sh restart
```

### Ver logs de deploy

```bash
# Logs do runner
sudo journalctl -u actions-runner.* -n 500

# Logs do container
docker logs archbase-react_react-docs.1 --tail 100
```

## Próximos Passos

Após configurar a documentação React, você pode seguir o mesmo padrão para:

- **java.archbase.dev** - Documentação Java
- **flutter.archbase.dev** - Documentação Flutter

Basta duplicar o serviço no docker-compose.yml e ajustar as labels do Traefik.
