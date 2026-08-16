import { useState } from 'react';
import { Center, ColorInput, Group, NumberInput, Switch, Text } from '@mantine/core';
import {
  ArchbaseBeamGrid,
  ArchbaseVectorFlow,
  ArchbaseStardustButton,
  ArchbaseElectroBorder,
} from '@archbase/effects';
import { Painel } from './Painel';

export function PainelBeamGrid() {
  const [celula, setCelula] = useState(40);
  const [feixes, setFeixes] = useState(6);
  const [halo, setHalo] = useState(true);
  const [interativo, setInterativo] = useState(true);

  return (
    <Painel
      titulo="ArchbaseBeamGrid"
      descricao="Grade tecnica com feixes percorrendo as linhas. Passe o ponteiro para acender as celulas proximas."
      correcao="a grade estatica e pre-renderizada fora de tela; o original redesenhava cada linha por quadro"
      controles={
        <>
          <NumberInput label="Celula (px)" value={celula} onChange={(v) => setCelula(Number(v) || 40)} step={4} min={12} max={120} size="xs" />
          <NumberInput label="Feixes" value={feixes} onChange={(v) => setFeixes(Number(v) || 1)} step={1} min={1} max={30} size="xs" />
          <Switch label="Halo (caro)" checked={halo} onChange={(e) => setHalo(e.currentTarget.checked)} size="xs" />
          <Switch label="Interativo" checked={interativo} onChange={(e) => setInterativo(e.currentTarget.checked)} size="xs" />
        </>
      }
    >
      <ArchbaseBeamGrid
        gridSize={celula}
        beamCount={feixes}
        glow={halo}
        interactive={interativo}
        style={{ height: 300, borderRadius: 8, background: '#08080f', color: '#fff' }}
      />
    </Painel>
  );
}

export function PainelVectorFlow() {
  const [quantidade, setQuantidade] = useState(900);
  const [velocidade, setVelocidade] = useState(1);
  const [rastro, setRastro] = useState(0.08);
  const [semente, setSemente] = useState(1);

  return (
    <Painel
      titulo="ArchbaseVectorFlow"
      descricao="Campo de fluxo com ruido de Perlin e deformacao de dominio."
      correcao="o campo agora e semeado: mesma semente, mesmo desenho — o original sorteava e nunca repetia"
      controles={
        <>
          <NumberInput label="Particulas" value={quantidade} onChange={(v) => setQuantidade(Number(v) || 100)} step={100} min={100} max={4000} size="xs" />
          <NumberInput label="Velocidade" value={velocidade} onChange={(v) => setVelocidade(Number(v) || 0.1)} step={0.1} min={0.1} max={4} size="xs" />
          <NumberInput label="Rastro" value={rastro} onChange={(v) => setRastro(Number(v) || 0.02)} step={0.01} min={0.01} max={0.5} decimalScale={2} size="xs" />
          <NumberInput label="Semente" value={semente} onChange={(v) => setSemente(Number(v) || 1)} step={1} min={1} max={9999} size="xs" />
        </>
      }
    >
      <ArchbaseVectorFlow
        particleCount={quantidade}
        particleSpeed={velocidade}
        trailFade={rastro}
        seed={semente}
        style={{ height: 300, borderRadius: 8 }}
      />
    </Painel>
  );
}

export function PainelElementos() {
  const [cor, setCor] = useState('#7c3aed');
  const [distorcao, setDistorcao] = useState(24);
  const [particulas, setParticulas] = useState(18);

  return (
    <Painel
      titulo="Efeitos de elemento"
      descricao="ArchbaseStardustButton e ArchbaseElectroBorder. O botao e focavel por teclado; a borda usa filtro SVG e nao consome quadro de JavaScript."
      correcao="SMIL ignora prefers-reduced-motion sozinho — a animacao e removida do DOM quando a preferencia esta ligada"
      controles={
        <>
          <ColorInput label="Cor da borda" value={cor} onChange={setCor} size="xs" format="hex" />
          <NumberInput label="Distorcao" value={distorcao} onChange={(v) => setDistorcao(Number(v) || 0)} step={2} min={0} max={80} size="xs" />
          <NumberInput label="Particulas do botao" value={particulas} onChange={(v) => setParticulas(Number(v) || 1)} step={2} min={1} max={80} size="xs" />
          <Text size="xs" c="dimmed">Use Tab para focar o botao: o efeito responde ao foco, nao so ao ponteiro.</Text>
        </>
      }
    >
      <Center style={{ height: 300, borderRadius: 8, background: '#08080f', color: '#fff' }}>
        <Group gap="xl">
          <ArchbaseStardustButton particleCount={particulas}>Publicar</ArchbaseStardustButton>
          <ArchbaseElectroBorder color={cor} distortion={distorcao} radius={12}>
            <div style={{ padding: '18px 26px', color: '#fff' }}>Cartao em destaque</div>
          </ArchbaseElectroBorder>
        </Group>
      </Center>
    </Painel>
  );
}
