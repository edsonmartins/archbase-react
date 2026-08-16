import {
  ActionIcon,
  Alert,
  AppShell,
  Badge,
  Container,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { useMonitorDeQuadros } from './monitorDeQuadros';
import { PainelNebula } from './paineis/PainelNebula';
import { PainelPoeira } from './paineis/PainelPoeira';
import { PainelGrade } from './paineis/PainelGrade';
import { PainelLoader } from './paineis/PainelLoader';
import { PainelBeamGrid, PainelVectorFlow, PainelElementos } from './paineis/PainelLote2';
import { PainelWave, PainelNeural, PainelAscii } from './paineis/PainelLote3';

export function App() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const quadros = useMonitorDeQuadros();

  // A regra e do proprio navegador; o demo so a reporta.
  const movimentoReduzido =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="xs">
            <Title order={4}>Archbase Effects</Title>
            <Badge variant="light" size="sm">
              banco de provas
            </Badge>
          </Group>

          <Group gap="sm">
            <Tooltip label="Quadros pedidos ao navegador no ultimo segundo. Role a pagina e veja cair.">
              <Badge
                size="lg"
                variant="filled"
                color={quadros.porSegundo > 45 ? 'red' : quadros.porSegundo > 5 ? 'yellow' : 'green'}
              >
                {quadros.porSegundo} quadros/s
              </Badge>
            </Tooltip>

            {movimentoReduzido && (
              <Badge size="lg" color="blue" variant="light">
                movimento reduzido ativo
              </Badge>
            )}

            <ActionIcon variant="default" size="lg" onClick={toggleColorScheme}>
              {colorScheme === 'dark' ? '☀' : '☾'}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          <Stack gap="xl">
            <Alert variant="light" title="Como validar">
              <Stack gap={4}>
                <Text size="sm">
                  <b>1. A pausa fora de tela.</b> Role a pagina ate um efeito sair de vista e olhe o
                  contador no topo. Ele precisa cair — se ficar em ~60, o laco nao parou, e essa e a
                  correcao principal deste pacote sobre o codigo original.
                </Text>
                <Text size="sm">
                  <b>2. O tema.</b> Troque claro/escuro no botao. A grade de pontos le a cor do
                  texto do Mantine por CSS custom property, sem importar Mantine.
                </Text>
                <Text size="sm">
                  <b>3. Movimento reduzido.</b> Ligue no sistema (macOS: Acessibilidade → Exibicao →
                  Reduzir movimento). Os fundos devem congelar e o loader deve virar texto — sem
                  deixar o usuario sem sinal de carregamento.
                </Text>
              </Stack>
            </Alert>

            <PainelNebula />
            <PainelPoeira />
            <PainelGrade />
            <PainelLoader />
            <PainelBeamGrid />
            <PainelVectorFlow />
            <PainelElementos />
            <PainelWave />
            <PainelNeural />
            <PainelAscii />

            <Text size="xs" c="dimmed" ta="center" pb="xl">
              Efeitos adaptados de Lightswind UI (MIT, Muhilan / codewithMUHILAN).
            </Text>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
