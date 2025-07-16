# 🌍 Sistema de Localização Archbase React v3

O Archbase React v3 fornece um sistema de localização robusto e flexível baseado em i18next, com inicialização precoce e suporte completo a múltiplos idiomas.

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Configuração Inicial](#configuração-inicial)
- [Uso em Componentes React](#uso-em-componentes-react)
- [Uso Fora de Componentes React](#uso-fora-de-componentes-react)
- [Namespaces](#namespaces)
- [Exemplos Práticos](#exemplos-práticos)
- [Migração da v2 para v3](#migração-da-v2-para-v3)
- [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

O sistema de localização do Archbase React v3 oferece:

- ✅ **Inicialização Precoce**: Traduções disponíveis antes da renderização
- ✅ **Híbrido**: Suporte tanto para componentes React quanto funções
- ✅ **Namespaces**: Separação clara entre traduções da lib e da aplicação
- ✅ **Performance**: Sem overhead de contexto React
- ✅ **TypeScript**: Suporte completo com tipagem

### Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     main.tsx                                │
│  initArchbaseI18nEarly() → Inicializa i18next global       │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                ArchbaseGlobalProvider                       │
│  Detecta inicialização e configura estado                  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                 Componentes da Aplicação                    │
│  useArchbaseTranslation() → Hook para React                │
│  archbaseI18next.t() → Função para não-React               │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Configuração Inicial

### 1. Estrutura de Arquivos

```
src/
├── locales/
│   ├── en/
│   │   └── translation.json
│   ├── pt-BR/
│   │   └── translation.json
│   └── es/
│       └── translation.json
└── main.tsx
```

### 2. Arquivo de Tradução

```json
// src/locales/pt-BR/translation.json
{
  "Seja Bem-vindo": "Seja Bem-vindo",
  "Dashboard": "Dashboard",
  "Usuários": "Usuários",
  "Configurações": "Configurações",
  "Sair": "Sair"
}
```

### 3. Configuração no main.tsx

```typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initArchbaseI18nEarly } from '@archbase/core'
import translation_en from './locales/en/translation.json'
import translation_ptbr from './locales/pt-BR/translation.json'
import translation_es from './locales/es/translation.json'

// 🔥 IMPORTANTE: Inicializar ANTES de renderizar
initArchbaseI18nEarly('minha-app', {
  en: translation_en,
  'pt-BR': translation_ptbr,
  es: translation_es
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
```

### 4. Configuração do Provider

```typescript
// src/App.tsx
import { ArchbaseGlobalProvider } from '@archbase/core'
import translation_en from './locales/en/translation.json'
import translation_ptbr from './locales/pt-BR/translation.json'
import translation_es from './locales/es/translation.json'

function App() {
  return (
    <ArchbaseGlobalProvider
      translationName="minha-app"
      translationResource={{
        en: translation_en,
        'pt-BR': translation_ptbr,
        es: translation_es
      }}
      // ... outras props
    >
      <MinhaAplicacao />
    </ArchbaseGlobalProvider>
  )
}
```

## ⚛️ Uso em Componentes React

### Hook useArchbaseTranslation

O hook `useArchbaseTranslation` é a forma padrão de usar traduções em componentes React:

```typescript
import { useArchbaseTranslation } from '@archbase/core'

function MeuComponente() {
  const { t, i18n, ready } = useArchbaseTranslation()

  return (
    <div>
      <h1>{t('Seja Bem-vindo')}</h1>
      <p>{t('Dashboard')}</p>
      <button>{t('Sair')}</button>
    </div>
  )
}
```

### Retorno do Hook

```typescript
const { t, i18n, ready } = useArchbaseTranslation()

// t: função de tradução
// i18n: instância do i18next
// ready: boolean indicando se as traduções estão prontas
```

### Usando com Namespace Específico

```typescript
// Para usar apenas o namespace 'archbase'
const { t } = useArchbaseTranslation('archbase')

return <button>{t('signIn')}</button> // Busca apenas em 'archbase'
```

### Usando sem Namespace (Recomendado)

```typescript
// Busca em todos os namespaces disponíveis
const { t } = useArchbaseTranslation()

return (
  <div>
    <h1>{t('minha-app:Seja Bem-vindo')}</h1>  {/* Namespace explícito */}
    <p>{t('archbase:signIn')}</p>             {/* Namespace da lib */}
    <span>{t('Dashboard')}</span>              {/* Namespace padrão */}
  </div>
)
```

## 🔧 Uso Fora de Componentes React

Para funções, classes, utilitários e qualquer código que não seja um componente React:

### Usando archbaseI18next

```typescript
import { archbaseI18next } from '@archbase/core'

// Em uma função utilitária
export function formatUserMessage(userName: string): string {
  return archbaseI18next.t('minha-app:Seja Bem-vindo', { userName })
}

// Em uma classe
export class DataService {
  getErrorMessage(): string {
    return archbaseI18next.t('archbase:errorSavingRecord')
  }
}

// Em um datasource
export class ArchbaseRemoteDataSource {
  private throwError(): void {
    const msg = archbaseI18next.t('archbase:operationNotAllowed', {
      dataSourceName: this.name,
      operation: 'save'
    })
    throw new Error(msg)
  }
}
```

### Usando getI18nextInstance

```typescript
import { getI18nextInstance } from '@archbase/core'

// Alternativa à archbaseI18next
const i18next = getI18nextInstance()
const message = i18next.t('minha-app:Dashboard')
```

## 📦 Namespaces

O sistema suporta múltiplos namespaces para organizar traduções:

### Namespace da Aplicação

```typescript
// Definido no ArchbaseGlobalProvider
translationName="minha-app"
```

### Namespace da Lib Archbase

```typescript
// Sempre disponível automaticamente
t('archbase:signIn')      // ✅ Tradução da lib
t('archbase:Password')    // ✅ Tradução da lib
t('archbase:Save')        // ✅ Tradução da lib
```

### Namespace Explícito vs Implícito

```typescript
// Explícito (recomendado para clareza)
t('minha-app:Dashboard')
t('archbase:signIn')

// Implícito (usa o namespace padrão)
t('Dashboard')  // Busca em 'minha-app' (defaultNS)
```

## 💡 Exemplos Práticos

### Exemplo 1: Componente de Login

```typescript
import { useArchbaseTranslation } from '@archbase/core'

function LoginForm() {
  const { t } = useArchbaseTranslation()

  return (
    <form>
      <h1>{t('minha-app:Seja Bem-vindo')}</h1>
      <input placeholder={t('archbase:usuario@email.com')} />
      <input 
        type="password" 
        placeholder={t('archbase:Sua senha')} 
      />
      <button>{t('archbase:signIn')}</button>
    </form>
  )
}
```

### Exemplo 2: Hook Customizado

```typescript
import { useArchbaseTranslation } from '@archbase/core'

function useMenuItems() {
  const { t } = useArchbaseTranslation()

  return [
    { label: t('Dashboard'), path: '/dashboard' },
    { label: t('Usuários'), path: '/users' },
    { label: t('Configurações'), path: '/settings' }
  ]
}
```

### Exemplo 3: Classe de Validação

```typescript
import { archbaseI18next } from '@archbase/core'

export class UserValidator {
  static validateEmail(email: string): string | null {
    if (!email) {
      return archbaseI18next.t('minha-app:Email é obrigatório')
    }
    
    if (!email.includes('@')) {
      return archbaseI18next.t('minha-app:Email inválido')
    }
    
    return null
  }
}
```

### Exemplo 4: Tradução com Interpolação

```typescript
// JSON
{
  "Bem-vindo {{name}}": "Bem-vindo {{name}}",
  "{{count}} usuários": "{{count}} usuários"
}

// Componente
function Welcome({ user, userCount }) {
  const { t } = useArchbaseTranslation()

  return (
    <div>
      <h1>{t('Bem-vindo {{name}}', { name: user.name })}</h1>
      <p>{t('{{count}} usuários', { count: userCount })}</p>
    </div>
  )
}
```

## 🔄 Migração da v2 para v3

### Antes (v2)

```typescript
// ❌ Versão antiga
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

function MeuComponente() {
  const { t } = useTranslation()
  
  return <div>{t('message')}</div>
}

// Em funções
const message = i18next.t('message')
```

### Depois (v3)

```typescript
// ✅ Versão nova
import { useArchbaseTranslation, archbaseI18next } from '@archbase/core'

function MeuComponente() {
  const { t } = useArchbaseTranslation()
  
  return <div>{t('message')}</div>
}

// Em funções
const message = archbaseI18next.t('message')
```

### Checklist de Migração

- [ ] Substituir `useTranslation` por `useArchbaseTranslation`
- [ ] Substituir `i18next.t` por `archbaseI18next.t` em funções
- [ ] Adicionar `initArchbaseI18nEarly` no main.tsx
- [ ] Configurar `translationName` e `translationResource` no provider
- [ ] Revisar namespaces das traduções

## 🛠️ Troubleshooting

### Problema: Traduções retornam chaves ao invés de valores

```typescript
// ❌ Retorna "Dashboard" ao invés de "Painel"
t('Dashboard')
```

**Solução**: Verificar se:
1. `initArchbaseI18nEarly` foi chamado no main.tsx
2. Os JSONs de tradução têm a chave correspondente
3. O namespace está correto

### Problema: Hook não funciona

```typescript
// ❌ Erro: Cannot read properties of undefined
const { t } = useArchbaseTranslation()
```

**Solução**: Verificar se:
1. O componente está dentro do `ArchbaseGlobalProvider`
2. A inicialização foi feita corretamente
3. Não há imports conflitantes

### Problema: Traduções não carregam

**Solução**: Verificar se:
1. Os arquivos JSON estão sendo importados corretamente
2. Os paths dos arquivos estão corretos
3. O build está incluindo os arquivos de tradução

### Problema: Namespace não encontrado

```typescript
// ❌ Retorna "minha-app:message" ao invés da tradução
t('minha-app:message')
```

**Solução**: Verificar se:
1. O namespace está configurado no provider
2. O JSON tem a estrutura correta
3. O `translationName` está correto

## 📚 API Reference

### initArchbaseI18nEarly

```typescript
initArchbaseI18nEarly(
  translationName: string | string[],
  translationResource: any
): void
```

### useArchbaseTranslation

```typescript
useArchbaseTranslation(namespace?: string): {
  t: (key: string, options?: any) => string
  i18n: i18n
  ready: boolean
}
```

### archbaseI18next

```typescript
archbaseI18next.t(key: string, options?: any): string
```

### getI18nextInstance

```typescript
getI18nextInstance(): i18n
```

## 🌟 Boas Práticas

1. **Use `useArchbaseTranslation()` sem namespace** para máxima flexibilidade
2. **Especifique namespaces explicitamente** para clareza
3. **Inicialize sempre no main.tsx** antes de renderizar
4. **Use `archbaseI18next` para funções** que não são componentes React
5. **Organize traduções em namespaces** para evitar conflitos
6. **Teste com múltiplos idiomas** durante o desenvolvimento

---

**Developed with ❤️ by Archbase Team**