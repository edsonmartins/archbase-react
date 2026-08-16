import { useState } from 'react';
import { Center, NumberInput, Switch, Text } from '@mantine/core';
import { ArchbaseDotGridBackground } from '@archbase/effects';
import { Painel } from './Painel';

export function PainelGrade() {
  const [tamanho, setTamanho] = useState(12);
  const [espacamento, setEspacamento] = useState(3.6);
  const [foco, setFoco] = useState(6);
  const [arrastavel, setArrastavel] = useState(true);
  const [inercia, setInercia] = useState(true);

  return (
    <Painel
      titulo="ArchbaseDotGridBackground"
      descricao="Grade arrastavel com inercia. Arraste e solte: o contador de quadros sobe durante o movimento e volta a zero ao parar."
      correcao="desenha sob demanda; o original mantinha laco eterno para uma inercia quase sempre em repouso"
      controles={
        <>
          <NumberInput label="Tamanho do ponto" value={tamanho} onChange={(v) => setTamanho(Number(v) || 0)} step={1} min={2} max={40} size="xs" />
          <NumberInput label="Espacamento" value={espacamento} onChange={(v) => setEspacamento(Number(v) || 0)} step={0.2} min={1.2} max={8} size="xs" />
          <NumberInput label="Foco central" value={foco} onChange={(v) => setFoco(Number(v) || 0)} step={0.5} min={1} max={14} size="xs" />
          <Switch label="Arrastavel" checked={arrastavel} onChange={(e) => setArrastavel(e.currentTarget.checked)} size="xs" />
          <Switch label="Inercia" checked={inercia} onChange={(e) => setInercia(e.currentTarget.checked)} size="xs" />
        </>
      }
    >
      <ArchbaseDotGridBackground
        dotSize={tamanho}
        dotSpacing={espacamento}
        scaleFactor={foco}
        draggable={arrastavel}
        inertia={inercia}
        style={{ height: 300, borderRadius: 8 }}
      >
        <Center h="100%">
          <Text fw={700} size="xl" style={{ pointerEvents: 'none' }}>
            conteudo sobreposto
          </Text>
        </Center>
      </ArchbaseDotGridBackground>
    </Painel>
  );
}
