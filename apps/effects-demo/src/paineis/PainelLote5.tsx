import { useState } from 'react';
import { Center, ColorInput, NumberInput, Text } from '@mantine/core';
import { ArchbaseAuroraBackground, ArchbaseGooeyBlobs } from '@archbase/effects';
import { Painel } from './Painel';

export function PainelAurora() {
  const [duracao, setDuracao] = useState(60);
  const [desfoque, setDesfoque] = useState(10);
  const [opacidade, setOpacidade] = useState(0.5);

  return (
    <Painel
      titulo="ArchbaseAuroraBackground"
      descricao="Faixas de cor deslizando devagar. Puro CSS — nao consome quadro de JavaScript."
      correcao="reconstruido: o original era inteiramente classes utilitarias do Tailwind com valores arbitrarios"
      controles={
        <>
          <NumberInput label="Ciclo (s)" value={duracao} onChange={(v) => setDuracao(Number(v) || 10)} step={5} min={5} max={200} size="xs" />
          <NumberInput label="Desfoque" value={desfoque} onChange={(v) => setDesfoque(Number(v) || 0)} step={1} min={0} max={40} size="xs" />
          <NumberInput label="Opacidade" value={opacidade} onChange={(v) => setOpacidade(Number(v) || 0.1)} step={0.05} min={0.05} max={1} decimalScale={2} size="xs" />
          <Text size="xs" c="dimmed">O contador de quadros nao sobe com este efeito — e essa a ideia.</Text>
        </>
      }
    >
      <ArchbaseAuroraBackground
        duration={duracao}
        blur={desfoque}
        opacity={opacidade}
        style={{ height: 300, borderRadius: 8, background: '#0b1020' }}
      >
        <Center h="100%">
          <Text fw={700} size="xl" c="white">
            conteudo sobre a aurora
          </Text>
        </Center>
      </ArchbaseAuroraBackground>
    </Painel>
  );
}

export function PainelGooey() {
  const [fusao, setFusao] = useState(18);
  const [tamanho, setTamanho] = useState(180);
  const [desfoque, setDesfoque] = useState(12);
  const [c1, setC1] = useState('#7c3aed');
  const [c2, setC2] = useState('#2563eb');
  const [c3, setC3] = useState('#db2777');

  return (
    <Painel
      titulo="ArchbaseGooeyBlobs"
      descricao="Bolhas que se derretem umas nas outras. Baixe a fusao para zero e veja as formas se separarem."
      correcao="a fusao vem de filtro SVG, nao de fisica: nenhum quadro de JavaScript e consumido"
      controles={
        <>
          <NumberInput label="Fusao" value={fusao} onChange={(v) => setFusao(Number(v) || 0)} step={2} min={0} max={40} size="xs" />
          <NumberInput label="Tamanho" value={tamanho} onChange={(v) => setTamanho(Number(v) || 40)} step={20} min={40} max={400} size="xs" />
          <NumberInput label="Desfoque" value={desfoque} onChange={(v) => setDesfoque(Number(v) || 0)} step={1} min={0} max={40} size="xs" />
          <ColorInput label="Cor 1" value={c1} onChange={setC1} size="xs" format="hex" />
          <ColorInput label="Cor 2" value={c2} onChange={setC2} size="xs" format="hex" />
          <ColorInput label="Cor 3" value={c3} onChange={setC3} size="xs" format="hex" />
        </>
      }
    >
      <ArchbaseGooeyBlobs
        gooeyness={fusao}
        size={tamanho}
        blur={desfoque}
        colors={[c1, c2, c3]}
        style={{ height: 300, borderRadius: 8, background: '#08080f' }}
      />
    </Painel>
  );
}
