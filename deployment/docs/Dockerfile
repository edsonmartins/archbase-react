# Dockerfile para documentação Archbase React
FROM nginx:alpine

# Remover configuração padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Adicionar label com timestamp para forçar atualização
ARG BUILD_DATE
LABEL build_date=$BUILD_DATE
LABEL version="1.0"
LABEL description="Archbase React Documentation"

# Copiar arquivos estáticos da documentação
COPY . /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
