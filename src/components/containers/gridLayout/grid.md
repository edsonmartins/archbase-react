Redimensione seu browser ou carregue em diferentes dispositivos para testar o sistema de grade.

### Exemplo: largura igual

```js
import { ArchbaseGridContainer, ArchbaseRow, ArchbaseCol } from '.';

<ArchbaseGridContainer fluid>
  <ArchbaseRow debug>
    <ArchbaseCol debug>1 de 2</ArchbaseCol>
    <ArchbaseCol debug>2 de 2</ArchbaseCol>
  </ArchbaseRow>
  <br />
  <ArchbaseRow debug>
    <ArchbaseCol debug>1 de 3</ArchbaseCol>
    <ArchbaseCol debug>2 de 3</ArchbaseCol>
    <ArchbaseCol debug>3 de 3</ArchbaseCol>
  </ArchbaseRow>
</ArchbaseGridContainer>
```

### Exemplo: empilhado na horizontal

```js
import { ArchbaseGridContainer, ArchbaseRow, ArchbaseCol } from '.';

<ArchbaseGridContainer fluid>
  <ArchbaseRow debug>
    <ArchbaseCol md={1} debug>md=1</ArchbaseCol>
    <ArchbaseCol md={1} debug>md=1</ArchbaseCol>
    <ArchbaseCol md={1} debug>md=1</ArchbaseCol>
    <ArchbaseCol md={1} debug>md=1</ArchbaseCol>
    <ArchbaseCol md={1} debug>md=1</ArchbaseCol>
    <ArchbaseCol md={1} debug>md=1</ArchbaseCol>
    <ArchbaseCol md={1} debug>md=1</ArchbaseCol>
    <ArchbaseCol md={1} debug>md=1</ArchbaseCol>
    <ArchbaseCol md={1} debug>md=1</ArchbaseCol>
    <ArchbaseCol md={1} debug>md=1</ArchbaseCol>
    <ArchbaseCol md={1} debug>md=1</ArchbaseCol>
    <ArchbaseCol md={1} debug>md=1</ArchbaseCol>
  </ArchbaseRow>
  <br />
  <ArchbaseRow debug>
    <ArchbaseCol md={8} debug>md=8</ArchbaseCol>
    <ArchbaseCol md={4} debug>md=4</ArchbaseCol>
  </ArchbaseRow>
  <br />
  <ArchbaseRow debug>
    <ArchbaseCol md={4} debug>md=4</ArchbaseCol>
    <ArchbaseCol md={4} debug>md=4</ArchbaseCol>
    <ArchbaseCol md={4} debug>md=4</ArchbaseCol>
  </ArchbaseRow>
  <br />
  <ArchbaseRow debug>
    <ArchbaseCol md={6} debug>md=6</ArchbaseCol>
    <ArchbaseCol md={6} debug>md=6</ArchbaseCol>
  </ArchbaseRow>
</ArchbaseGridContainer>
```

### Exemplo: misturar e combinar

```js
import { ArchbaseGridContainer, ArchbaseRow, ArchbaseCol } from '.';

<ArchbaseGridContainer fluid>
  <ArchbaseRow debug>
    <ArchbaseCol xs={12} md={8} debug>xs=12 md=8</ArchbaseCol>
    <ArchbaseCol xs={6} md={4} debug>xs=6 md=4</ArchbaseCol>
  </ArchbaseRow>
  <br />
  <ArchbaseRow debug>
    <ArchbaseCol xs={6} md={4} debug>xs=6 md=4</ArchbaseCol>
    <ArchbaseCol xs={6} md={4} debug>xs=6 md=4</ArchbaseCol>
    <ArchbaseCol xs={6} md={4} debug>xs=6 md=4</ArchbaseCol>
  </ArchbaseRow>
  <br />
  <ArchbaseRow debug>
    <ArchbaseCol xs={6} debug>xs=6</ArchbaseCol>
    <ArchbaseCol xs={6} debug>xs=6</ArchbaseCol>
  </ArchbaseRow>
</ArchbaseGridContainer>
```

### Exemplo: encapsulamento ArchbaseColumn

```js
import { ArchbaseGridContainer, ArchbaseRow, ArchbaseCol } from '.';

<ArchbaseGridContainer fluid>
  <ArchbaseRow debug>
    <ArchbaseCol xs={9} debug>xs=9</ArchbaseCol>
    <ArchbaseCol xs={4} debug>xs=4<br/>Uma vez que 9 + 4 = 13 &gt; 12, este ArchbaseCol de 4 ArchbaseColumn é agrupado em uma nova linha como uma unidade contígua.</ArchbaseCol>
    <ArchbaseCol xs={6} debug>xs=6<br/>ArchbaseColumns subseqüentes continuam ao longo da nova linha.</ArchbaseCol>
  </ArchbaseRow>
</ArchbaseGridContainer>
```

### Exemplo: alinhamento vertical

```js
import { ArchbaseGridContainer, ArchbaseRow, ArchbaseCol } from '.';

<ArchbaseGridContainer fluid>
  <ArchbaseRow align="start" style={{ height: '75px' }} debug>
    <ArchbaseCol debug>1 de 3</ArchbaseCol>
    <ArchbaseCol debug>2 de 3</ArchbaseCol>
    <ArchbaseCol debug>3 de 3</ArchbaseCol>
  </ArchbaseRow>
  <br />
  <ArchbaseRow align="center" style={{ height: '75px' }} debug>
    <ArchbaseCol debug>1 de 3</ArchbaseCol>
    <ArchbaseCol debug>2 de 3</ArchbaseCol>
    <ArchbaseCol debug>3 de 3</ArchbaseCol>
  </ArchbaseRow>
  <br />
  <ArchbaseRow align="end" style={{ height: '75px' }} debug>
    <ArchbaseCol debug>1 de 3</ArchbaseCol>
    <ArchbaseCol debug>2 de 3</ArchbaseCol>
    <ArchbaseCol debug>3 de 3</ArchbaseCol>
  </ArchbaseRow>
  <br />
  <ArchbaseRow align="stretch" style={{ height: '75px' }} debug>
    <ArchbaseCol debug>1 de 3</ArchbaseCol>
    <ArchbaseCol debug>2 de 3</ArchbaseCol>
    <ArchbaseCol debug>3 de 3</ArchbaseCol>
  </ArchbaseRow>
</ArchbaseGridContainer>
```

### Exemplo: alinhamento horizontal

```js
import { ArchbaseGridContainer, ArchbaseRow, ArchbaseCol } from '.';

<ArchbaseGridContainer fluid>
  <ArchbaseRow justify="start" debug>
    <ArchbaseCol xs={3} debug>1 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>2 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>3 de 3</ArchbaseCol>
  </ArchbaseRow>
  <br />
  <ArchbaseRow justify="center" debug>
    <ArchbaseCol xs={3} debug>1 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>2 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>3 de 3</ArchbaseCol>
  </ArchbaseRow>
  <br />
  <ArchbaseRow justify="end" debug>
    <ArchbaseCol xs={3} debug>1 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>2 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>3 de 3</ArchbaseCol>
  </ArchbaseRow>
  <br />
  <ArchbaseRow justify="between" debug>
    <ArchbaseCol xs={3} debug>1 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>2 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>3 de 3</ArchbaseCol>
  </ArchbaseRow>
  <br />
  <ArchbaseRow justify="around" debug>
    <ArchbaseCol xs={3} debug>1 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>2 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>3 de 3</ArchbaseCol>
  </ArchbaseRow>
  <br />
  <ArchbaseRow justify="initial" debug>
    <ArchbaseCol xs={3} debug>1 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>2 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>3 de 3</ArchbaseCol>
  </ArchbaseRow>
  <br />
  <ArchbaseRow justify="inherit" debug>
    <ArchbaseCol xs={3} debug>1 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>2 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>3 de 3</ArchbaseCol>
  </ArchbaseRow>
</ArchbaseGridContainer>
```

### Exemplo: Prop de direção para ordem e orientação de ArchbaseRow filhos

```js
import { ArchbaseGridContainer, ArchbaseRow, ArchbaseCol } from '.';

<ArchbaseGridContainer fluid>
  <ArchbaseRow align="center" justify="center" direction="row" style={{ height: '300px' }} debug>
    <ArchbaseCol xs={3} debug>1 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>2 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>3 de 3</ArchbaseCol>
  </ArchbaseRow>
  <br />
    <ArchbaseRow align="center" justify="center" direction="row-reverse" style={{ height: '300px' }} debug>
    <ArchbaseCol xs={3} debug>1 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>2 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>3 de 3</ArchbaseCol>
  </ArchbaseRow>
  <br />
    <ArchbaseRow align="center" justify="center" direction="column" style={{ height: '300px' }} debug>
    <ArchbaseCol xs={3} debug>1 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>2 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>3 de 3</ArchbaseCol>
  </ArchbaseRow>
  <br />
    <ArchbaseRow align="center" justify="center" direction="column-reverse" style={{ height: '300px' }} debug>
    <ArchbaseCol xs={3} debug>1 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>2 de 3</ArchbaseCol>
    <ArchbaseCol xs={3} debug>3 de 3</ArchbaseCol>
  </ArchbaseRow>
  <br />

</ArchbaseGridContainer>
```

### Exemplo: compensando ArchbaseColumns

```js
import { ArchbaseGridContainer, ArchbaseRow, ArchbaseCol } from '.';

<ArchbaseGridContainer fluid>
  <ArchbaseRow debug>
    <ArchbaseCol md={4} debug>md=4</ArchbaseCol>
    <ArchbaseCol md={4} offset={{ md: 4 }} debug>md=4 offset-md=4</ArchbaseCol>
  </ArchbaseRow>
  <br />
  <ArchbaseRow debug>
    <ArchbaseCol md={3} offset={{ md: 3 }} debug>md=3 offset-md=3</ArchbaseCol>
    <ArchbaseCol md={3} offset={{ md: 3 }} debug>md=3 offset-md=3</ArchbaseCol>
  </ArchbaseRow>
  <br />
  <ArchbaseRow debug>
    <ArchbaseCol md={6} offset={{ md: 3 }} debug>md=6 offset-md=3</ArchbaseCol>
  </ArchbaseRow>
</ArchbaseGridContainer>
```

### Exemplo: Aninhando ArchbaseColumns

```js
import { ArchbaseGridContainer, ArchbaseRow, ArchbaseCol } from '.';

<ArchbaseGridContainer fluid>
  <ArchbaseRow debug>
    <ArchbaseCol sm={9} debug>
      Nível 1: sm=9
      <ArchbaseRow>
        <ArchbaseCol xs={8} sm={6} debug>
          Nível 2: xs=8 sm=6
        </ArchbaseCol>
        <ArchbaseCol xs={4} sm={6} debug>
          Nível 2: xs=4 sm=6
        </ArchbaseCol>
      </ArchbaseRow>
    </ArchbaseCol>
  </ArchbaseRow>
</ArchbaseGridContainer>
```

### Exemplo: ordenação ArchbaseColumn

```js
import { ArchbaseGridContainer, ArchbaseRow, ArchbaseCol } from '.';

<ArchbaseGridContainer fluid>
  <ArchbaseRow debug>
    <ArchbaseCol md={9} push={{ md: 3 }} debug>md=9 push-md=3</ArchbaseCol>
    <ArchbaseCol md={3} pull={{ md: 9 }} debug>md=3 pull-md=9</ArchbaseCol>
  </ArchbaseRow>
</ArchbaseGridContainer>
```

### Exemplo: Largura da medianiz personalizada

```js
import { ArchbaseGridContainer, ArchbaseRow, ArchbaseCol } from '.';

<ArchbaseGridContainer fluid>
  <ArchbaseRow nogutter debug>
    <ArchbaseCol md={8} debug>md=8</ArchbaseCol>
    <ArchbaseCol md={4} debug>md=4</ArchbaseCol>
  </ArchbaseRow>
  <br />
  <ArchbaseRow gutterWidth={16} debug>
    <ArchbaseCol md={8} debug>md=8</ArchbaseCol>
    <ArchbaseCol md={4} debug>md=4</ArchbaseCol>
  </ArchbaseRow>
</ArchbaseGridContainer>
```

### Exemplo: Largura da ArchbaseColumn adaptada ao conteúdo

```js
import { ArchbaseGridContainer, ArchbaseRow, ArchbaseCol } from '.';

<ArchbaseGridContainer fluid>
  <ArchbaseRow debug>
    <ArchbaseCol debug>Logo (Flexible ArchbaseColumn)</ArchbaseCol>
    <ArchbaseCol xs="content" debug> Menu com x-items</ArchbaseCol>
  </ArchbaseRow>
</ArchbaseGridContainer>
```



### Example: Ordenando ArchbaseCols adaptados ao conteúdo

```js
import { ArchbaseGridContainer, ArchbaseRow, ArchbaseCol } from '.';

<ArchbaseGridContainer fluid>
  <ArchbaseRow debug>
    <ArchbaseCol debug order={{md: 1, xl: 2}}>Primeiro em md, último em xl </ArchbaseCol>
    <ArchbaseCol order={{md: 2, xl: 1}} debug>Primeiro em xl, último em md</ArchbaseCol>
  </ArchbaseRow>
</ArchbaseGridContainer>
```
