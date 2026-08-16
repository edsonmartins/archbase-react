import { useState } from 'react';
import { Box, Center, ColorInput, NumberInput, Paper, Switch, Text } from '@mantine/core';
import { ArchbaseBorderBeam } from '@archbase/effects';
import { ArchbaseStickyTopBar } from '@archbase/components';
import { Painel } from './Painel';

export function PainelBorderBeam() {
  const [espessura, setEspessura] = useState(2);
  const [duracao, setDuracao] = useState(6);
  const [comprimento, setComprimento] = useState(0.25);
  const [inverso, setInverso] = useState(false);
  const [c1, setC1] = useState('#7400ff');
  const [c2, setC2] = useState('#9b41ff');

  return (
    <Painel
      titulo="ArchbaseBorderBeam"
      descricao="Feixe percorrendo a borda. Puro CSS: gradiente conico com mascara, sem framer-motion."
      correcao="no original, pauseOnHover usava classe Tailwind inexistente e borderThickness tinha o estilo comentado"
      controles={
        <>
          <NumberInput label="Espessura" value={espessura} onChange={(v) => setEspessura(Number(v) || 1)} step={1} min={1} max={12} size="xs" />
          <NumberInput label="Duracao (s)" value={duracao} onChange={(v) => setDuracao(Number(v) || 1)} step={1} min={1} max={30} size="xs" />
          <NumberInput label="Comprimento" value={comprimento} onChange={(v) => setComprimento(Number(v) || 0.05)} step={0.05} min={0.05} max={1} decimalScale={2} size="xs" />
          <Switch label="Sentido inverso" checked={inverso} onChange={(e) => setInverso(e.currentTarget.checked)} size="xs" />
          <ColorInput label="Cor inicial" value={c1} onChange={setC1} size="xs" format="hex" />
          <ColorInput label="Cor final" value={c2} onChange={setC2} size="xs" format="hex" />
        </>
      }
    >
      <Center style={{ height: 300 }}>
        <Paper withBorder radius="lg" p="xl" style={{ position: 'relative', width: 300 }}>
          <Text fw={600}>Cartao em destaque</Text>
          <Text size="sm" c="dimmed">O feixe percorre a borda deste cartao.</Text>
          <ArchbaseBorderBeam
            thickness={espessura}
            duration={duracao}
            length={comprimento}
            reverse={inverso}
            colorFrom={c1}
            colorTo={c2}
            radius={16}
          />
        </Paper>
      </Center>
    </Painel>
  );
}

export function PainelStickyBar() {
  const [visivel, setVisivel] = useState(true);
  const [dispensavel, setDispensavel] = useState(true);
  const [cor, setCor] = useState('blue');
  const [eventos, setEventos] = useState(0);

  return (
    <Painel
      titulo="ArchbaseStickyTopBar"
      descricao="Barra de aviso no topo. Fecha, e com dismissStorageKey nao volta para quem ja fechou."
      correcao="o original nao fechava e era um div mudo: sem papel, sem rotulo, sem anuncio"
      controles={
        <>
          <Switch label="Visivel" checked={visivel} onChange={(e) => setVisivel(e.currentTarget.checked)} size="xs" />
          <Switch label="Dispensavel" checked={dispensavel} onChange={(e) => setDispensavel(e.currentTarget.checked)} size="xs" />
          <ColorInput label="Cor" value={cor} onChange={setCor} size="xs" withEyeDropper={false} format="hex" disabled />
          <Text size="xs" c="dimmed">Fechada {eventos}x nesta sessao.</Text>
          <Text size="xs" c="dimmed">Ligue Visivel de novo para reexibir.</Text>
        </>
      }
    >
      <Box style={{ height: 300, overflow: 'auto', border: '1px dashed var(--mantine-color-default-border)', borderRadius: 8 }}>
        <ArchbaseStickyTopBar
          visible={visivel}
          dismissible={dispensavel}
          onDismiss={() => { setEventos((n) => n + 1); setVisivel(false); }}
          role="status"
          aria-label="Aviso do sistema"
        >
          <Text size="sm">Manutencao programada para domingo, das 2h as 4h.</Text>
        </ArchbaseStickyTopBar>

        <Box p="md">
          <Text size="sm" c="dimmed">
            Role esta area: a barra fica fixa no topo dela, nao da janela.
          </Text>
          {Array.from({ length: 12 }, (_, i) => (
            <Text key={i} size="sm" mt="sm">Linha de conteudo {i + 1}</Text>
          ))}
        </Box>
      </Box>
    </Painel>
  );
}
