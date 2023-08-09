```jsx static
import React from 'react';
import { ArchbaseScreenClassProvider } from 'rs-archbase-react';

export default function App() {
  return (
    <ArchbaseScreenClassProvider>
      <Header />
      <Page />
      <Footer />
    </ArchbaseScreenClassProvider>
  );
}
```

Internamente, o `ArchbaseScreenClassProvider` anexa um ouvinte `resize` e atualiza `state.screenClass` exclusivamente quando um novo ponto de interrupção é atingido. O valor `state.screenClass` é então anexado a `ArchbaseScreenClassContext.Provider`. Componentes dependentes de ScreenClass são agrupados com `ArchbaseScreenClassResolver`, que verifica se há um provedor válido acima dele e fornece um se não houver.

O benefício de desempenho vem de _você_ adicionando um `ArchbaseScreenClassProvider` ao seu aplicativo que permite que os componentes `rs-archbase-react` assinem **uma fonte de verdade** para o ScreenClass.