import { useState } from 'react';
import { ColorInput, NumberInput, Switch, Text } from '@mantine/core';
import { ArchbaseAsciiWave, ArchbaseNeuralLink, ArchbaseWaveBackground } from '@archbase/effects';
import { Painel } from './Painel';

export function PainelWave() {
  const [amplitude, setAmplitude] = useState(1);
  const [c1, setC1] = useState('#0f172a');
  const [c2, setC2] = useState('#1d4ed8');
  const [c3, setC3] = useState('#38bdf8');

  return (
    <Painel
      titulo="ArchbaseWaveBackground"
      descricao="Ondas em shader. Passe o ponteiro: a onda irradia do ponto tocado."
      correcao="primeiro efeito construido sobre useArchbaseShader — o shader tem 30 linhas, o resto vem do hook"
      controles={
        <>
          <NumberInput label="Amplitude" value={amplitude} onChange={(v) => setAmplitude(Number(v) || 0)} step={0.1} min={0} max={4} size="xs" />
          <ColorInput label="Cor 1" value={c1} onChange={setC1} size="xs" format="hex" />
          <ColorInput label="Cor 2" value={c2} onChange={setC2} size="xs" format="hex" />
          <ColorInput label="Cor 3" value={c3} onChange={setC3} size="xs" format="hex" />
        </>
      }
    >
      <ArchbaseWaveBackground
        amplitude={amplitude}
        colors={[c1, c2, c3]}
        style={{ height: 300, borderRadius: 8 }}
        fallback={<Text p="md">Sem WebGL neste navegador.</Text>}
      />
    </Painel>
  );
}

export function PainelNeural() {
  const [nos, setNos] = useState(70);
  const [distancia, setDistancia] = useState(110);
  const [intervalo, setIntervalo] = useState(900);
  const [interativo, setInterativo] = useState(true);

  return (
    <Painel
      titulo="ArchbaseNeuralLink"
      descricao="Malha de nos que se ligam quando proximos, com pacotes viajando pelas ligacoes."
      correcao="teto de nos: a vizinhanca e O(n²) e o original nao limitava — tente 200 e veja o contador"
      controles={
        <>
          <NumberInput label="Nos (teto 200)" value={nos} onChange={(v) => setNos(Number(v) || 2)} step={10} min={2} max={400} size="xs" />
          <NumberInput label="Distancia de ligacao" value={distancia} onChange={(v) => setDistancia(Number(v) || 40)} step={10} min={40} max={300} size="xs" />
          <NumberInput label="Intervalo de pacote (ms)" value={intervalo} onChange={(v) => setIntervalo(Number(v) || 0)} step={100} min={0} max={5000} size="xs" />
          <Switch label="Interativo" checked={interativo} onChange={(e) => setInterativo(e.currentTarget.checked)} size="xs" />
        </>
      }
    >
      <ArchbaseNeuralLink
        nodeCount={nos}
        maxDistance={distancia}
        packetInterval={intervalo}
        interactive={interativo}
        style={{ height: 300, borderRadius: 8, background: '#05050f' }}
      />
    </Painel>
  );
}

export function PainelAscii() {
  const [velocidade, setVelocidade] = useState(1);
  const [corpo, setCorpo] = useState(12);
  const [coluna, setColuna] = useState(10);
  const [cor, setCor] = useState('#ff4500');

  return (
    <Painel
      titulo="ArchbaseAsciiWave"
      descricao="Colunas de caracteres que pulsam e escorrem para cima."
      correcao="o tempo avancava +=16 por quadro, presumindo 60 Hz — em tela de 120 Hz rodava ao dobro"
      controles={
        <>
          <NumberInput label="Velocidade" value={velocidade} onChange={(v) => setVelocidade(Number(v) || 0.1)} step={0.1} min={0.1} max={5} size="xs" />
          <NumberInput label="Corpo da fonte" value={corpo} onChange={(v) => setCorpo(Number(v) || 8)} step={1} min={6} max={32} size="xs" />
          <NumberInput label="Largura da coluna" value={coluna} onChange={(v) => setColuna(Number(v) || 6)} step={1} min={4} max={40} size="xs" />
          <ColorInput label="Cor" value={cor} onChange={setCor} size="xs" format="hex" />
        </>
      }
    >
      <ArchbaseAsciiWave
        speed={velocidade}
        fontSize={corpo}
        columnWidth={coluna}
        color={cor}
        style={{ height: 300, borderRadius: 8, background: '#05050f' }}
      />
    </Painel>
  );
}
