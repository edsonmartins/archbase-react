import { useState } from 'react';
import { Center, NumberInput, Switch, Text, TextInput } from '@mantine/core';
import { ArchbaseMagicLoader } from '@archbase/effects';
import { Painel } from './Painel';

export function PainelLoader() {
  const [tamanho, setTamanho] = useState(200);
  const [particulas, setParticulas] = useState(1);
  const [velocidade, setVelocidade] = useState(1);
  const [rotulo, setRotulo] = useState('Carregando relatorio');
  const [mostrarRotulo, setMostrarRotulo] = useState(true);

  return (
    <Painel
      titulo="ArchbaseMagicLoader"
      descricao="Indicador de carregamento. Anuncia estado por role=status, e o canvas fica fora da arvore de acessibilidade."
      correcao="removia particulas com splice durante o forEach que as percorria, pulando elementos"
      controles={
        <>
          <NumberInput label="Tamanho" value={tamanho} onChange={(v) => setTamanho(Number(v) || 0)} step={20} min={80} max={420} size="xs" />
          <NumberInput label="Particulas/quadro" value={particulas} onChange={(v) => setParticulas(Number(v) || 0)} step={1} min={1} max={8} size="xs" />
          <NumberInput label="Velocidade" value={velocidade} onChange={(v) => setVelocidade(Number(v) || 0)} step={0.1} min={0.1} max={3} size="xs" />
          <TextInput label="Rotulo" value={rotulo} onChange={(e) => setRotulo(e.currentTarget.value)} size="xs" />
          <Switch label="Mostrar rotulo em tela" checked={mostrarRotulo} onChange={(e) => setMostrarRotulo(e.currentTarget.checked)} size="xs" />
          <Text size="xs" c="dimmed">Desligado, o rotulo continua existindo como nome acessivel — so nao aparece.</Text>
        </>
      }
    >
      <Center style={{ height: 300, borderRadius: 8, background: '#05050f' }}>
        <ArchbaseMagicLoader size={tamanho} particleCount={particulas} speed={velocidade} label={rotulo} showLabel={mostrarRotulo} />
      </Center>
    </Painel>
  );
}
