# Como usar IOC no Archbase React v3

## Configuração do Container IOC

```typescript
import axios from "axios";
import { PlataformaRemoteService } from "@/service/PlataformaRemoteService";
import { API_TYPE } from "./MentorsIOCTypes";
import { MentorsAuthenticator } from "../auth/MentorsAuthenticator";

// Imports do Archbase v3 (separados por pacote)
import { IOCContainer, ARCHBASE_IOC_API_TYPE } from '@archbase/core';
import { ArchbaseAxiosRemoteApiClient } from '@archbase/data';
import type { ArchbaseRemoteApiClient } from '@archbase/data';
import { 
  ArchbaseAuthenticator,
  ArchbaseGroupService, 
  ArchbaseProfileService, 
  ArchbaseResourceService, 
  ArchbaseUserService,
  DefaultArchbaseTokenManager 
} from '@archbase/security';

axios.defaults.baseURL = import.meta.env.VITE_API;

axios.interceptors.request.use(
  (config) => {
    config.headers["X-TENANT-ID"] = "a9f814d2-4dae-41f3-851b-8aa3d4706561";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Configuração do Container (v3)
const container = IOCContainer.getContainer(); 

// 1. Registrar Token Manager
IOCContainer.registerTokenManager(DefaultArchbaseTokenManager);

// 2. Registrar serviços de segurança
IOCContainer.registerSecurityServices({
  userService: ArchbaseUserService,
  profileService: ArchbaseProfileService,
  groupService: ArchbaseGroupService,
  resourceService: ArchbaseResourceService
});

// 3. Registrar serviços customizados
container
  .bind<ArchbaseAuthenticator>(API_TYPE.Authenticator)
  .to(MentorsAuthenticator);
container
  .bind<ArchbaseRemoteApiClient>(API_TYPE.ApiClient)
  .to(ArchbaseAxiosRemoteApiClient);
container.bind<PlataformaRemoteService>(API_TYPE.Plataforma).to(PlataformaRemoteService);
container.bind<ProdutoRemoteService>(API_TYPE.Produto).to(ProdutoRemoteService);
// ... resto dos seus serviços

export default container;
```

## Migração da v2 para v3

### Na v2 você fazia:
```typescript
import { IOCContainer } from "archbase-react";

IOCContainer.registerDefaultContainers(); // ❌ Não funciona mais automaticamente
```

### Na v3 você deve fazer:
```typescript
import { IOCContainer } from '@archbase/core';
import { DefaultArchbaseTokenManager, ArchbaseUserService, ... } from '@archbase/security';

// Registrar explicitamente
IOCContainer.registerTokenManager(DefaultArchbaseTokenManager);
IOCContainer.registerSecurityServices({
  userService: ArchbaseUserService,
  profileService: ArchbaseProfileService,
  groupService: ArchbaseGroupService,
  resourceService: ArchbaseResourceService
});
```

## Vantagens da v3

1. **Imports explícitos** - Você vê exatamente de onde vem cada classe
2. **Tree shaking** - Só empacota o que você usar
3. **Sem dependências circulares** - Arquitetura mais limpa
4. **Type safety** - Melhor experiência com TypeScript

## Métodos disponíveis no IOCContainer v3

- `getContainer()` - Retorna o container Inversify
- `registerService<T>(id, implementation)` - Registra um serviço
- `getService<T>(id)` - Obtém um serviço
- `hasService(id)` - Verifica se serviço existe
- `registerTokenManager(class)` - Registra token manager
- `registerSecurityServices(services)` - Registra serviços de segurança
- `registerInstance<T>(id, instance)` - Registra instância
- `registerFactory<T>(id, factory)` - Registra factory
- `unbindService(id)` - Remove serviço
- `unbindAll()` - Remove todos os serviços