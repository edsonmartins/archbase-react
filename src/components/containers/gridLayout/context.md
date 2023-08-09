Internamente, todo componente que requer o `screenClass` atual (que é uma versão de string legível por humanos do `window.innerWidth` relacionado aos pontos de interrupção do usuário) se inscreve em um `ArchbaseScreenClassProvider`. O provedor utiliza a [API React Context](https://reactjs.org/docs/context.html) para enviar a `screenClass` atual conforme ela é atualizada. Por padrão, cada instância de cada componente se inscreve em um provedor separado, criando ouvintes `resize` para cada um. Isso pode reduzir as renderizações durante um evento de redimensionamento de ~300 para 4 (um para cada ponto de interrupção), tornando a grade muito mais eficiente.

---

### Preciso mudar alguma coisa no meu código?

Essa nova API é totalmente opcional e as implementações atuais continuarão a funcionar. No entanto, para um aumento de desempenho significativo, você precisará adicionar o `ArchbaseScreenClassProvider` ao seu aplicativo, normalmente no nível mais alto na árvore do nó React (ou seja, App.tsx).
