import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ArchbaseGridContainer } from './grid/Container';
import { ArchbaseRow } from './grid/Row';
import { ArchbaseCol } from './grid/Col';
import { ArchbaseScreenClassProvider } from './context/ScreenClassProvider';
import { Card, Group, Text } from '@mantine/core';

export const ArchbaseGridLayoutExample = () => {
  return (
    <ArchbaseScreenClassProvider useOwnWidth={true}>
      <ArchbaseGridContainer>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="1rem">
            <Group position="apart">
              <Text weight={500}>Largura igual</Text>
            </Group>
          </Card.Section>
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
        </Card>
      </ArchbaseGridContainer>
      <ArchbaseGridContainer>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="1rem">
            <Group position="apart">
              <Text weight={500}>Empilhado na horizontal</Text>
            </Group>
          </Card.Section>
          <ArchbaseRow debug>
            <ArchbaseCol md={1} debug>
              md=1
            </ArchbaseCol>
            <ArchbaseCol md={1} debug>
              md=1
            </ArchbaseCol>
            <ArchbaseCol md={1} debug>
              md=1
            </ArchbaseCol>
            <ArchbaseCol md={1} debug>
              md=1
            </ArchbaseCol>
            <ArchbaseCol md={1} debug>
              md=1
            </ArchbaseCol>
            <ArchbaseCol md={1} debug>
              md=1
            </ArchbaseCol>
            <ArchbaseCol md={1} debug>
              md=1
            </ArchbaseCol>
            <ArchbaseCol md={1} debug>
              md=1
            </ArchbaseCol>
            <ArchbaseCol md={1} debug>
              md=1
            </ArchbaseCol>
            <ArchbaseCol md={1} debug>
              md=1
            </ArchbaseCol>
            <ArchbaseCol md={1} debug>
              md=1
            </ArchbaseCol>
            <ArchbaseCol md={1} debug>
              md=1
            </ArchbaseCol>
          </ArchbaseRow>
          <br />
          <ArchbaseRow debug>
            <ArchbaseCol md={8} debug>
              md=8
            </ArchbaseCol>
            <ArchbaseCol md={4} debug>
              md=4
            </ArchbaseCol>
          </ArchbaseRow>
          <br />
          <ArchbaseRow debug>
            <ArchbaseCol md={4} debug>
              md=4
            </ArchbaseCol>
            <ArchbaseCol md={4} debug>
              md=4
            </ArchbaseCol>
            <ArchbaseCol md={4} debug>
              md=4
            </ArchbaseCol>
          </ArchbaseRow>
          <br />
          <ArchbaseRow debug>
            <ArchbaseCol md={6} debug>
              md=6
            </ArchbaseCol>
            <ArchbaseCol md={6} debug>
              md=6
            </ArchbaseCol>
          </ArchbaseRow>
        </Card>
      </ArchbaseGridContainer>
      <ArchbaseGridContainer>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="1rem">
            <Group position="apart">
              <Text weight={500}>Misturar e combinar</Text>
            </Group>
          </Card.Section>
          <ArchbaseRow debug>
            <ArchbaseCol xs={12} md={8} debug>
              xs=12 md=8
            </ArchbaseCol>
            <ArchbaseCol xs={6} md={4} debug>
              xs=6 md=4
            </ArchbaseCol>
          </ArchbaseRow>
          <br />
          <ArchbaseRow debug>
            <ArchbaseCol xs={6} md={4} debug>
              xs=6 md=4
            </ArchbaseCol>
            <ArchbaseCol xs={6} md={4} debug>
              xs=6 md=4
            </ArchbaseCol>
            <ArchbaseCol xs={6} md={4} debug>
              xs=6 md=4
            </ArchbaseCol>
          </ArchbaseRow>
          <br />
          <ArchbaseRow debug>
            <ArchbaseCol xs={6} debug>
              xs=6
            </ArchbaseCol>
            <ArchbaseCol xs={6} debug>
              xs=6
            </ArchbaseCol>
          </ArchbaseRow>
        </Card>
      </ArchbaseGridContainer>
      <ArchbaseGridContainer fluid>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="1rem">
            <Group position="apart">
              <Text weight={500}>Encapsulamento ArchbaseColumn</Text>
            </Group>
          </Card.Section>
          <ArchbaseRow debug>
            <ArchbaseCol xs={9} debug>
              xs=9
            </ArchbaseCol>
            <ArchbaseCol xs={4} debug>
              xs=4
              <br />
              Uma vez que 9 + 4 = 13 &gt; 12, este ArchbaseCol de 4 ArchbaseColumn é agrupado em uma nova linha como uma
              unidade contígua.
            </ArchbaseCol>
            <ArchbaseCol xs={6} debug>
              xs=6
              <br />
              ArchbaseColumns subseqüentes continuam ao longo da nova linha.
            </ArchbaseCol>
          </ArchbaseRow>
        </Card>
      </ArchbaseGridContainer>
      <ArchbaseGridContainer>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="1rem">
            <Group position="apart">
              <Text weight={500}>Alinhamento vertical</Text>
            </Group>
          </Card.Section>
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
        </Card>
      </ArchbaseGridContainer>
      <ArchbaseGridContainer>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="1rem">
            <Group position="apart">
              <Text weight={500}>Alinhamento horizontal</Text>
            </Group>
          </Card.Section>
          <ArchbaseRow justify="start" debug>
            <ArchbaseCol xs={3} debug>
              1 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              2 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              3 de 3
            </ArchbaseCol>
          </ArchbaseRow>
          <br />
          <ArchbaseRow justify="center" debug>
            <ArchbaseCol xs={3} debug>
              1 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              2 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              3 de 3
            </ArchbaseCol>
          </ArchbaseRow>
          <br />
          <ArchbaseRow justify="end" debug>
            <ArchbaseCol xs={3} debug>
              1 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              2 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              3 de 3
            </ArchbaseCol>
          </ArchbaseRow>
          <br />
          <ArchbaseRow justify="between" debug>
            <ArchbaseCol xs={3} debug>
              1 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              2 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              3 de 3
            </ArchbaseCol>
          </ArchbaseRow>
          <br />
          <ArchbaseRow justify="around" debug>
            <ArchbaseCol xs={3} debug>
              1 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              2 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              3 de 3
            </ArchbaseCol>
          </ArchbaseRow>
          <br />
          <ArchbaseRow justify="initial" debug>
            <ArchbaseCol xs={3} debug>
              1 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              2 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              3 de 3
            </ArchbaseCol>
          </ArchbaseRow>
          <br />
          <ArchbaseRow justify="inherit" debug>
            <ArchbaseCol xs={3} debug>
              1 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              2 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              3 de 3
            </ArchbaseCol>
          </ArchbaseRow>
        </Card>
      </ArchbaseGridContainer>
      <ArchbaseGridContainer>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="1rem">
            <Group position="apart">
              <Text weight={500}>Prop de direção para ordem e orientação de ArchbaseRow filhos</Text>
            </Group>
          </Card.Section>
          <ArchbaseRow align="center" justify="center" direction="row" style={{ height: '300px' }} debug>
            <ArchbaseCol xs={3} debug>
              1 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              2 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              3 de 3
            </ArchbaseCol>
          </ArchbaseRow>
          <br />
          <ArchbaseRow align="center" justify="center" direction="row-reverse" style={{ height: '300px' }} debug>
            <ArchbaseCol xs={3} debug>
              1 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              2 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              3 de 3
            </ArchbaseCol>
          </ArchbaseRow>
          <br />
          <ArchbaseRow align="center" justify="center" direction="column" style={{ height: '300px' }} debug>
            <ArchbaseCol xs={3} debug>
              1 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              2 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              3 de 3
            </ArchbaseCol>
          </ArchbaseRow>
          <br />
          <ArchbaseRow align="center" justify="center" direction="column-reverse" style={{ height: '300px' }} debug>
            <ArchbaseCol xs={3} debug>
              1 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              2 de 3
            </ArchbaseCol>
            <ArchbaseCol xs={3} debug>
              3 de 3
            </ArchbaseCol>
          </ArchbaseRow>
          <br />
        </Card>
      </ArchbaseGridContainer>
      <ArchbaseGridContainer>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="1rem">
            <Group position="apart">
              <Text weight={500}>Compensando ArchbaseColumns</Text>
            </Group>
          </Card.Section>
          <ArchbaseRow debug>
            <ArchbaseCol md={4} debug>
              md=4
            </ArchbaseCol>
            <ArchbaseCol md={4} offset={{ md: 4 }} debug>
              md=4 offset-md=4
            </ArchbaseCol>
          </ArchbaseRow>
          <br />
          <ArchbaseRow debug>
            <ArchbaseCol md={3} offset={{ md: 3 }} debug>
              md=3 offset-md=3
            </ArchbaseCol>
            <ArchbaseCol md={3} offset={{ md: 3 }} debug>
              md=3 offset-md=3
            </ArchbaseCol>
          </ArchbaseRow>
          <br />
          <ArchbaseRow debug>
            <ArchbaseCol md={6} offset={{ md: 3 }} debug>
              md=6 offset-md=3
            </ArchbaseCol>
          </ArchbaseRow>
        </Card>
      </ArchbaseGridContainer>
      <ArchbaseGridContainer>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="1rem">
            <Group position="apart">
              <Text weight={500}>Aninhando ArchbaseColumns</Text>
            </Group>
          </Card.Section>
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
        </Card>
      </ArchbaseGridContainer>
      <ArchbaseGridContainer fluid>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="1rem">
            <Group position="apart">
              <Text weight={500}>Ordenação ArchbaseColumn</Text>
            </Group>
          </Card.Section>
          <ArchbaseRow debug>
            <ArchbaseCol md={9} push={{ md: 3 }} debug>
              md=9 push-md=3
            </ArchbaseCol>
            <ArchbaseCol md={3} pull={{ md: 9 }} debug>
              md=3 pull-md=9
            </ArchbaseCol>
          </ArchbaseRow>
        </Card>
      </ArchbaseGridContainer>
      <ArchbaseGridContainer fluid>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="1rem">
            <Group position="apart">
              <Text weight={500}>Largura da medianiz personalizada</Text>
            </Group>
          </Card.Section>
          <ArchbaseRow nogutter debug>
            <ArchbaseCol md={8} debug>
              md=8
            </ArchbaseCol>
            <ArchbaseCol md={4} debug>
              md=4
            </ArchbaseCol>
          </ArchbaseRow>
          <br />
          <ArchbaseRow gutterWidth={16} debug>
            <ArchbaseCol md={8} debug>
              md=8
            </ArchbaseCol>
            <ArchbaseCol md={4} debug>
              md=4
            </ArchbaseCol>
          </ArchbaseRow>
        </Card>
      </ArchbaseGridContainer>
      <ArchbaseGridContainer fluid>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="1rem">
            <Group position="apart">
              <Text weight={500}>Largura da ArchbaseColumn adaptada ao conteúdo</Text>
            </Group>
          </Card.Section>
          <ArchbaseRow debug>
            <ArchbaseCol debug>Logo (Flexible ArchbaseColumn)</ArchbaseCol>
            <ArchbaseCol xs="content" debug>
              {' '}
              Menu com x-items
            </ArchbaseCol>
          </ArchbaseRow>
        </Card>
      </ArchbaseGridContainer>
      <ArchbaseGridContainer fluid>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="1rem">
            <Group position="apart">
              <Text weight={500}>Ordenando ArchbaseCols adaptados ao conteúdo</Text>
            </Group>
          </Card.Section>
          <ArchbaseRow debug>
            <ArchbaseCol debug order={{ md: 1, xl: 2 }}>
              Primeiro em md, último em xl{' '}
            </ArchbaseCol>
            <ArchbaseCol order={{ md: 2, xl: 1 }} debug>
              Primeiro em xl, último em md
            </ArchbaseCol>
          </ArchbaseRow>
        </Card>
      </ArchbaseGridContainer>
    </ArchbaseScreenClassProvider>
  );
};

export default {
  title: 'Containers/GridLayout',
  component: ArchbaseGridLayoutExample,
} as Meta;

export const Example: StoryObj<typeof ArchbaseGridLayoutExample> = {
  args: {
    render: () => {
      <ArchbaseGridLayoutExample />;
    },
  },
};
