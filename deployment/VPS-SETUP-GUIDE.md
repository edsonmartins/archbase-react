# Guia de Instalação e Deploy na VPS

Guia passo a passo para configurar o deployment automatizado da documentação Archbase React no VPS com Docker Swarm e Traefik.

## Pré-requisitos

- VPS com **Amazon Linux 2023** (2 vCPUs recomendado)
- Docker Swarm instalado
- Traefik configurado com rede `traefik-network`
- Acesso SSH ao VPS com sudo
- Domínio archbase.dev configurado

**Especificações testadas:**
- VPS: 2 vCPUs, 8GB RAM
- Tempo de build: ~6m15s

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

### 1.1 Atualizar sistema (Amazon Linux 2023)

```bash
# Conectar ao VPS
ssh ec2-user@seu-vps  # ou seu usuário

# Atualizar pacotes
sudo dnf update -y

# Instalar dependências básicas
sudo dnf install -y curl git wget

# Verificar versão do Amazon Linux
cat /etc/os-release
# Deve mostrar: Amazon Linux 2023
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

### 2.1 Instalar Node.js 20 (Amazon Linux 2023)

```bash
# Amazon Linux 2023 - usar NodeSource com RPM
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

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
# Na Amazon Linux, o usuário padrão é ec2-user
# Você pode usar ec2-user ou criar um usuário dedicado

# Opção 1: Usar ec2-user existente (mais simples)
sudo usermod -aG docker ec2-user

# Opção 2: Criar usuário dedicado actions-runner
sudo useradd -m -s /bin/bash actions-runner
sudo passwd actions-runner  # opcional, para login direto
sudo usermod -aG docker actions-runner

# Verificar se consegue usar docker sem sudo
# Se usar ec2-user:
sudo -u ec2-user docker ps

# Se usar actions-runner:
sudo -u actions-runner docker ps
```

> **Nota**: Nos exemplos abaixo, substitua `actions-runner` por `ec2-user` se decidir usar o usuário padrão da Amazon.

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

# Se usar ec2-user:
sudo chown ec2-user:ec2-user /opt/actions-runner

# Se usar actions-runner:
# sudo chown actions-runner:actions-runner /opt/actions-runner

# Trocar para usuário (usar ec2-user ou actions-runner)
sudo su - ec2-user
# ou
# sudo su - actions-runner

# Ir para o diretório
cd /opt/actions-runner

# Baixar (SUBSTITUA pela URL mais recente do GitHub)
curl -o actions-runner-linux-x64-<version>.tar.gz -L <DOWNLOAD_URL>
# Exemplo: curl -o actions-runner-linux-x64-2.317.0.tar.gz -L https://github.com/actions/...

# Extrair
tar xzf ./actions-runner-linux-x64-*.tar.gz

# Instalar dependências do Actions Runner manualmente
# O script installdependencies.sh pode não reconhecer Amazon Linux 2023
# Nota: Não incluir curl (já está instalado como curl-minimal)
# Importante: Instalar libicu (runtime) não libicu-devel (apenas headers)
sudo dnf install -y \
  openssl-devel \
  zlib-devel \
  libicu \
  tar \
  git \
  jq

# Verificar se ICU foi instalado corretamente
ldconfig -p | grep icu

# Tentar rodar o script (pode falhar, mas dependências já estão instaladas)
./bin/installdependencies.sh || echo "Script falhou, mas dependências foram instaladas manualmente"

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
# Se usar ec2-user:
sudo chown -R ec2-user:ec2-user /srv/archbase-react-docs

# Se usar actions-runner:
# sudo chown -R actions-runner:actions-runner /srv/archbase-react-docs
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

O runner precisa de sudo para copiar arquivos e gerenciar Docker.

**Opção 1: Usar o script automatizado (RECOMENDADO)**

```bash
# Clonar repositório ou copiar o script
cd /tmp
git clone https://github.com/edsonmartins/archbase-react.git
cd archbase-react

# Executar script de setup (detecta automaticamente o usuário)
sudo bash scripts/setup-sudoers.sh

# Ou especificar o usuário manualmente
sudo bash scripts/setup-sudoers.sh <nome_do_usuario>
```

**Opção 2: Configuração manual**

```bash
# Descobrir o usuário do Actions Runner
ls -la /opt/actions-runner | awk 'NR==2 {print $3}'

# Criar arquivo de regras sudo
sudo tee /etc/sudoers.d/actions-runner << 'EOF'
# Substitua <USUARIO> pelo usuário correto (ec2-user, actions-runner, etc)
<USUARIO> ALL=(ALL) NOPASSWD: /usr/bin/mkdir, /bin/mkdir
<USUARIO> ALL=(ALL) NOPASSWD: /bin/cp, /bin/rm, /bin/ln
<USUARIO> ALL=(ALL) NOPASSWD: /usr/bin/docker
<USUARIO> ALL=(ALL) NOPASSWD: /bin/df
EOF

# Definir permissões corretas
sudo chmod 0440 /etc/sudoers.d/actions-runner

# Validar configuração
sudo visudo -c /etc/sudoers.d/actions-runner
```

**Testar configuração:**

```bash
# Substitua <USUARIO> pelo usuário correto
sudo -u <USUARIO> sudo whoami
# Deve retornar "root" sem pedir senha
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

## Passo 10: Acessar Documentação

Acesse: https://react.archbase.dev

Se tudo estiver correto, você deve ver a documentação do Archbase React.

## Passo 11: Deploy Manual (Opcional)

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

# Build da documentação (com otimizações)
cd docs-site
export NODE_OPTIONS=--max_old_space_size=8192
export NEXT_PRIVATE_WORKER_THREADS=2
pnpm run build

# Copiar arquivos
sudo rm -rf /srv/archbase-react-docs/*
sudo cp -r out/* /srv/archbase-react-docs/

# Recrear stack
cd /opt/archbase-infrastructure
docker stack deploy -c docker-compose.yml archbase-react
```

## Otimizações Aplicadas

O build foi otimizado para reduzir o tempo de 10m35s para ~6m15s:

| Otimização | Descrição |
|------------|-----------|
| `turbo.json: concurrency: 50` | Aumenta paralelismo do build |
| `tsconfig: skipLibCheck: true` | Evita revalidar tipos |
| `tsconfig: declarationMap: false` | Geração mais rápida de declarações |
| `NEXT_PRIVATE_WORKER_THREADS=2` | Paraleliza geração de páginas estáticas |

## Troubleshooting

### Amazon Linux 2023 - installdependencies.sh falha

Se o script não reconhecer Amazon Linux 2023:

```bash
# Instalar dependências manualmente
# Nota: Pular curl (conflita com curl-minimal já instalado)
# Importante: libicu (runtime) não libicu-devel
sudo dnf install -y \
  openssl-devel \
  zlib-devel \
  libicu \
  tar \
  git \
  jq

# Verificar ICU
ldconfig -p | grep icu

# Continuar com a configuração
./config.sh --url https://github.com/edsonmartins/archbase-react --token <TOKEN>
```

### Erro "Couldn't find a valid ICU package"

Se aparecer o erro `Process terminated. Couldn't find a valid ICU package installed`:

```bash
# O pacote correto é libicu (runtime), não libicu-devel
sudo dnf install -y libicu

# Verificar se foi instalado
ldconfig -p | grep libicu

# Se ainda falhar, verificar bibliotecas disponíveis
sudo dnf search libicu
sudo dnf search icu

# Em alguns casos pode ser necessário
sudo dnf install -y libicu-${VERSION}  # ex: libicu-69.1
```

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

## Passo 8: Monitoramento e Visualização de Logs

### 8.1 Instalar Scripts de Log

Copiar os scripts do repositório para o VPS:

```bash
# Copiar scripts para o VPS (do repositório)
cd /tmp
git clone https://github.com/edsonmartins/archbase-react.git
cd archbase-react

# Instalar scripts
sudo cp scripts/save-build-logs.sh /usr/local/bin/
sudo cp scripts/view-logs.sh /usr/local/bin/
sudo chmod +x /usr/local/bin/*.sh

# Verificar
ls -la /usr/local/bin/*-logs.sh
```

### 8.2 Instalar Servidor de Logs e Dozzle

Usar o arquivo `docker-compose.logs.yml` do repositório:

```bash
# Copiar arquivo de configuração
cd /opt/archbase-infrastructure
cp /tmp/archbase-react/deployment/docker-compose.logs.yml .

# Adicionar serviços ao stack existente
docker stack deploy -c docker-compose.yml -c docker-compose.logs.yml archbase-react
```

Serviços incluídos:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **logs-server** | https://logs-internal.archbase.dev | Logs salvos em arquivo (nginx) |
| **dozzle** | https://logs.archbase.dev | Visualizador de logs Docker em tempo real |

> **Nota**: Configure o DNS para `logs-internal.archbase.dev` e `logs.archbase.dev` apontando para o IP do VPS.

### 8.3 Usar o Script Helper

```bash
# Ver logs do GitHub Actions Runner
view-logs.sh runner

# Ver logs do container nginx
view-logs.sh docs

# Ver logs do Traefik
view-logs.sh traefik

# Ver último build salvo
view-logs.sh build

# Ver todos os logs (resumo)
view-logs.sh all
```

### 8.4 Comandos úteis para visualizar logs

```bash
# Logs do GitHub Actions Runner (tempo real)
sudo journalctl -u actions-runner.* -f

# Logs específicos de um job
sudo journalctl -u actions-runner.* --since "5 minutes ago"

# Logs do container nginx
docker logs -f archbase-react_react-docs.1

# Logs do Traefik (para debug de certificados)
docker logs $(docker ps -q -f name=traefik) -f

# Ver todos os serviços da stack
docker stack ps archbase-react

# Ver logs de todos os containers da stack
docker service logs archbase-react_react-docs --tail 50

# Ver logs salvos em arquivo
cat /var/log/actions-runner/latest-build.log

# Ver log específico por data
ls -la /var/log/actions-runner/
cat /var/log/actions-runner/build-20250113_143022.log
```

### 8.5 Visualizar Logs via Web

Após configurar os serviços de log, você tem múltiplas opções:

| Método | URL | Quando usar |
|--------|-----|-------------|
| **GitHub Actions** | https://github.com/edsonmartins/archbase-react/actions | Debug detalhado de cada step |
| **Dozzle** | https://logs.archbase.dev | Visualizar logs de containers em tempo real |
| **Logs Server** | https://logs-internal.archbase.dev | Ver builds salvos em arquivo |
| **view-logs.sh** | Via SSH | Consulta rápida no terminal |

## Manutenção

### Gerenciamento de Espaço em Disco

Após muitos builds, o disco pode encher. O workflow de deploy já faz limpeza automática, mas você pode executar manualmente:

```bash
# Verificar espaço em disco
df -h

# Verificar uso do Docker
docker system df

# Limpar imagens não usadas (mantendo imagens dos últimos 3 dias)
docker image prune -a -f --filter "until=72h"

# Limpar containers parados, redes não usadas e imagens dangling
docker system prune -f

# Limpar tudo (cuidado - remove todas as imagens não usadas)
# docker system prune -a -f

# Verificar espaço após limpeza
df -h /var/lib/docker
```

### Limpar builds antigos do projeto

```bash
# Ver backups existentes
ls -la /srv/archbase-react-docs.backup/

# Manter apenas últimos 5
cd /srv/archbase-react-docs.backup
ls -t | tail -n +6 | xargs -I {} rm -rf {}

# Ou limpar todos os backups (apenas em emergência)
# sudo rm -rf /srv/archbase-react-docs.backup/*
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
