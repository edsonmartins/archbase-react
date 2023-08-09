Redimensione o seu navegador ou carregue em dispositivos diferentes para testar os componentes utilitários de responsividade.
```js
import { ArchbaseRow, ArchbaseCol, ArchbaseVisible, ArchbaseHidden } from '.';

<p>
  <span>Sua classe de tela atual é </span>
  <ArchbaseVisible xs><strong>xs</strong></ArchbaseVisible>
  <ArchbaseVisible sm><strong>sm</strong></ArchbaseVisible>
  <ArchbaseVisible md><strong>md</strong></ArchbaseVisible>
  <ArchbaseVisible lg><strong>lg</strong></ArchbaseVisible>
  <ArchbaseVisible xl><strong>xl</strong></ArchbaseVisible>
  <ArchbaseVisible xxl><strong>xxl</strong></ArchbaseVisible>
  <span>.</span>
</p>
```

Nos exemplos abaixo, verde indica que o elemento está visível em sua viewport atual.

```js
import { ArchbaseRow, ArchbaseCol, ArchbaseVisible, ArchbaseHidden } from '.';

<ArchbaseRow>
  <ArchbaseCol xs={6} sm={2}>
    <ArchbaseHidden xs><div style={{ ArchbaseColor: 'gray' }}>x-small</div></ArchbaseHidden>
    <ArchbaseVisible xs><div style={{ ArchbaseColor: 'green' }}>Visível em x-small</div></ArchbaseVisible>
  </ArchbaseCol>
  <ArchbaseCol xs={6} sm={2}>
    <ArchbaseHidden sm><div style={{ ArchbaseColor: 'gray' }}>Small</div></ArchbaseHidden>
    <ArchbaseVisible sm><div style={{ ArchbaseColor: 'green' }}>Visível em small</div></ArchbaseVisible>
  </ArchbaseCol>
  <ArchbaseCol xs={6} sm={2}>
    <ArchbaseHidden md><div style={{ ArchbaseColor: 'gray' }}>Medium</div></ArchbaseHidden>
    <ArchbaseVisible md><div style={{ ArchbaseColor: 'green' }}>Visível em medium</div></ArchbaseVisible>
  </ArchbaseCol>
  <ArchbaseCol xs={6} sm={2}>
    <ArchbaseHidden lg><div style={{ ArchbaseColor: 'gray' }}>Large</div></ArchbaseHidden>
    <ArchbaseVisible lg><div style={{ ArchbaseColor: 'green' }}>Visível em large</div></ArchbaseVisible>
  </ArchbaseCol>
  <ArchbaseCol xs={6} sm={2}>
    <ArchbaseHidden xl><div style={{ ArchbaseColor: 'gray' }}>x-large</div></ArchbaseHidden>
    <ArchbaseVisible xl><div style={{ ArchbaseColor: 'green' }}>Visível em x-large</div></ArchbaseVisible>
  </ArchbaseCol>
  <ArchbaseCol xs={6} sm={2}>
    <ArchbaseHidden xxl><div style={{ ArchbaseColor: 'gray' }}>xx-large</div></ArchbaseHidden>
    <ArchbaseVisible xxl><div style={{ ArchbaseColor: 'green' }}>Visível em xx-large</div></ArchbaseVisible>
  </ArchbaseCol>
</ArchbaseRow>
```

```js
import { ArchbaseRow, ArchbaseCol, ArchbaseVisible, ArchbaseHidden } from '.';

<ArchbaseRow>
  <ArchbaseCol xs={4}>
    <ArchbaseHidden xs sm><div style={{ ArchbaseColor: 'gray' }}>Extra small e small</div></ArchbaseHidden>
    <ArchbaseVisible xs sm><div style={{ ArchbaseColor: 'green' }}>Visível em extra small e small</div></ArchbaseVisible>
  </ArchbaseCol>
  <ArchbaseCol xs={4}>
    <ArchbaseHidden md lg><div style={{ ArchbaseColor: 'gray' }}>Medium e large</div></ArchbaseHidden>
    <ArchbaseVisible md lg><div style={{ ArchbaseColor: 'green' }}>Visível em medium e large</div></ArchbaseVisible>
  </ArchbaseCol>
  <ArchbaseCol xs={4}>
    <ArchbaseHidden xl xxl><div style={{ ArchbaseColor: 'gray' }}>x-large and xx-large</div></ArchbaseHidden>
    <ArchbaseVisible xl xxl><div style={{ ArchbaseColor: 'green' }}>Visível em x-large e xx-large</div></ArchbaseVisible>
  </ArchbaseCol>
</ArchbaseRow>
```
