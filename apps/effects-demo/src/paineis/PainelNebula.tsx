import { useState } from 'react';
import { ColorInput, NumberInput, Switch, Text } from '@mantine/core';
import { ArchbaseNebulaFlow } from '@archbase/effects';
import { Painel } from './Painel';

export function PainelNebula() {
  const [velocidade, setVelocidade] = useState(1);
  const [escala, setEscala] = useState(1.6);
  const [densidade, setDensidade] = useState(1);
  const [interativo, setInterativo] = useState(true);
  const [cor1, setCor1] = useState('#0b0a2a');
  const [cor2, setCor2] = useState('#3b1e6e');
  const [cor3, setCor3] = useState('#a855f7');

  return (
    <Painel
      titulo="ArchbaseNebulaFlow"
      descricao="Nebula em shader WebGL. Passe o ponteiro sobre ela para deformar o gas."
      correcao="os recursos de GPU nao eram liberados ao desmontar, vazando um contexto por montagem"
      controles={
        <>
          <NumberInput label="Velocidade" value={velocidade} onChange={(v) => setVelocidade(Number(v) || 0)} step={0.1} min={0} max={5} size="xs" />
          <NumberInput label="Escala" value={escala} onChange={(v) => setEscala(Number(v) || 0)} step={0.1} min={0.2} max={6} size="xs" />
          <NumberInput label="Densidade" value={densidade} onChange={(v) => setDensidade(Number(v) || 0)} step={0.1} min={0} max={4} size="xs" />
          <ColorInput label="Cor 1" value={cor1} onChange={setCor1} size="xs" format="hex" />
          <ColorInput label="Cor 2" value={cor2} onChange={setCor2} size="xs" format="hex" />
          <ColorInput label="Cor 3" value={cor3} onChange={setCor3} size="xs" format="hex" />
          <Switch label="Interativo" checked={interativo} onChange={(e) => setInterativo(e.currentTarget.checked)} size="xs" />
        </>
      }
    >
      <ArchbaseNebulaFlow
        speed={velocidade}
        scale={escala}
        density={densidade}
        interactive={interativo}
        colors={[cor1, cor2, cor3]}
        style={{ height: 300, borderRadius: 8 }}
        fallback={<Text p="md">Este navegador nao tem WebGL.</Text>}
      />
    </Painel>
  );
}
