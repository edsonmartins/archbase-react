import { useState } from 'react';
import { NumberInput, Switch } from '@mantine/core';
import { ArchbaseCosmicDust } from '@archbase/effects';
import { Painel } from './Painel';

export function PainelPoeira() {
  const [quantidade, setQuantidade] = useState(120);
  const [velocidade, setVelocidade] = useState(1);
  const [tamanho, setTamanho] = useState(1.5);
  const [interativo, setInterativo] = useState(true);

  return (
    <Painel
      titulo="ArchbaseCosmicDust"
      descricao="Particulas em deriva que orbitam o ponteiro. Sem ponteiro, o foco orbita o centro sozinho."
      correcao="dividia por zero quando o ponteiro caia sobre a particula, e ouvia o mouse na pagina inteira"
      controles={
        <>
          <NumberInput label="Particulas" value={quantidade} onChange={(v) => setQuantidade(Number(v) || 0)} step={20} min={10} max={600} size="xs" />
          <NumberInput label="Velocidade" value={velocidade} onChange={(v) => setVelocidade(Number(v) || 0)} step={0.1} min={0.1} max={4} size="xs" />
          <NumberInput label="Tamanho" value={tamanho} onChange={(v) => setTamanho(Number(v) || 0)} step={0.1} min={0.4} max={6} size="xs" />
          <Switch label="Interativo" checked={interativo} onChange={(e) => setInterativo(e.currentTarget.checked)} size="xs" />
        </>
      }
    >
      <ArchbaseCosmicDust
        particleCount={quantidade}
        speedMultiplier={velocidade}
        particleSize={tamanho}
        interactive={interativo}
        style={{ height: 300, borderRadius: 8, background: '#05050f', color: '#fff' }}
      />
    </Painel>
  );
}
