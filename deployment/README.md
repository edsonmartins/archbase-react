# Deploy da Documentação Archbase React

Este guia explica como configurar o deployment automatizado da documentação no VPS com Traefik.

## Arquitetura

```
Push para main → GitHub Actions → Self-Hosted Runner (VPS)
                                      ↓
                            Build packages + docs
                                      ↓
                            Copiar para /srv/archbase-react-docs
                                      ↓
                            Nginx Container (Docker)
                                      ↓
                            Traefik → react.archbase.dev
```

## Passo 1: Instalar GitHub Actions Self-Hosted Runner

### 1.1 No GitHub

1. Vá para: https://github.com/edsonmartins/archbase-react/settings/actions
2. Clique em "New self-hosted runner"
3. Escolha Linux e arquitetura x64
4. Copie o token de configuração

### 1.2 No VPS

```bash
# Criar usuário para o runner
sudo useradd -m -s /bin/bash actions-runner

# Criar diretório
sudo mkdir -p /opt/actions-runner
sudo chown actions-runner:actions-runner /opt/actions-runner

# Baixar e configurar (como actions-runner)
sudo su - actions-runner
cd /opt/actions-runner

# Baixar (substituir URL pela última versão)
curl -o actions-runner-linux-x64-<version>.tar.gz -L <DOWNLOAD_URL>
tar xzf ./actions-runner-linux-x64-<version>.tar.gz

# Instalar dependências
./bin/installdependencies.sh

# Configurar (usar token do GitHub)
./config.sh --url https://github.com/edsonmartins/archbase-react --token <TOKEN>

# Sair e instalar como serviço
exit
sudo ./svc.sh install actions-runner
sudo ./svc.sh start

# Verificar status
sudo ./svc.sh status
```

### 1.3 Permissões Docker

```bash
# Adicionar ao grupo docker
sudo usermod -aG docker actions-runner

# Verificar (sem sudo)
sudo -u actions-runner docker ps
```

## Passo 2: Configurar Infraestrutura Docker

### 2.1 Copiar docker-compose.yml

```bash
# No VPS, criar diretório de infraestrutura
sudo mkdir -p /opt/archbase-infrastructure
cd /opt/archbase-infrastructure

# Copiar arquivo do projeto
# Ou criar manualmente baseado em deployment/docker-compose.example.yml
sudo nano docker-compose.yml
```

### 2.2 Criar diretório de deploy

```bash
sudo mkdir -p /srv/archbase-react-docs
```

### 2.3 Iniciar container

```bash
cd /opt/archbase-infrastructure
docker-compose up -d
```

## Passo 3: Configurar DNS

Adicionar registro DNS:

| Tipo | Nome | Valor |
|------|------|-------|
| A | react.archbase.dev | IP do VPS |

## Passo 4: Testar Deploy

### 4.1 Deploy manual

```bash
# No VPS, no diretório do projeto
./scripts/deploy-vps.sh vps
```

### 4.2 Deploy via GitHub Actions

1. Fazer push para branch `main`
2. Verificar em: https://github.com/edsonmartins/archbase-react/actions
3. O workflow `deploy-docs-vps.yml` será executado

## Troubleshooting

### Runner não aparece no GitHub

```bash
# Verificar status do runner
sudo ./svc.sh status

# Ver logs
sudo journalctl -u actions-runner.* -f

# Reiniciar
sudo ./svc.sh restart
```

### Container não sobe

```bash
# Ver logs do container
docker logs archbase-react-docs

# Ver se o Traefik detectou
docker ps | grep react-docs

# Ver labels do Traefik
docker inspect archbase-react-docs | grep -A 20 Labels
```

### HTTPS não funciona

1. Verificar se `letsencrypt` é o certresolver correto no Traefik
2. Verificar se a rede `traefik-public` existe: `docker network ls`
3. Verificar logs do Traefik: `docker logs traefik`

## Estrutura de Arquivos

```
VPS:
/opt/actions-runner/          # GitHub Actions Runner
/opt/archbase-infrastructure/  # docker-compose.yml
/srv/archbase-react-docs/     # Arquivos estáticos (Next.js build)

Projeto:
.github/workflows/deploy-docs-vps.yml  # Workflow de deploy
docs-site/next.config.mjs              # Config Next.js
scripts/deploy-vps.sh                  # Script manual
deployment/docker-compose.example.yml  # Exemplo para VPS
```

## Extendendo para Outras Tecnologias

Para Java (java.archbase.dev) e Flutter (flutter.archbase.dev):

1. Criar novos containers no docker-compose.yml
2. Ajustar labels do Traefik para cada subdomínio
3. Criar workflows específicos se necessário
