import { useState } from 'react';
import { Center, Code, Group, NumberInput, Stack, Switch, Text, TextInput } from '@mantine/core';
import { IconBell, IconHome, IconSearch, IconSettings, IconUser } from '@tabler/icons-react';
import {
  ArchbaseSlideToConfirm,
  ArchbaseReorderList,
  ArchbaseMagnifyDock,
  ArchbaseGlowingCards,
  ArchbaseGlowingCard,
  ArchbaseDeviceFrame,
} from '@archbase/components';
import { Painel } from './Painel';

export function PainelSlideToConfirm() {
  const [ultimo, setUltimo] = useState('—');
  const [desabilitado, setDesabilitado] = useState(false);
  const [falhar, setFalhar] = useState(false);

  return (
    <Painel
      titulo="ArchbaseSlideToConfirm"
      descricao="Confirmacao por deslize. Arraste, OU use Tab e depois setas, Home, End, Enter ou Espaco."
      correcao="o original era um div arrastavel: nao havia como confirmar sem ponteiro"
      controles={
        <>
          <Switch label="Desabilitado" checked={desabilitado} onChange={(e) => setDesabilitado(e.currentTarget.checked)} size="xs" />
          <Switch label="Simular falha" checked={falhar} onChange={(e) => setFalhar(e.currentTarget.checked)} size="xs" />
          <Text size="xs" c="dimmed">Ultimo evento:</Text>
          <Code>{ultimo}</Code>
          <Text size="xs" c="dimmed">Foque com Tab e pressione End: confirma sem mouse.</Text>
        </>
      }
    >
      <Center style={{ height: 300 }}>
        <ArchbaseSlideToConfirm
          label="Deslize para excluir"
          successLabel="Excluido"
          disabled={desabilitado}
          resetAfter={2500}
          onConfirm={async () => {
            await new Promise((r) => setTimeout(r, 700));
            if (falhar) throw new Error('backend recusou');
            setUltimo('confirmado ' + new Date().toLocaleTimeString());
          }}
          onError={(e) => setUltimo('falhou: ' + String((e as Error).message))}
        />
      </Center>
    </Painel>
  );
}

interface Tarefa {
  id: string;
  nome: string;
  descricao: string;
}

const TAREFAS: Tarefa[] = [
  { id: '1', nome: 'Conferir faturamento', descricao: 'Fechamento mensal' },
  { id: '2', nome: 'Revisar inadimplencia', descricao: 'Acima de 90 dias' },
  { id: '3', nome: 'Aprovar reembolsos', descricao: '4 pendentes' },
  { id: '4', nome: 'Publicar relatorio', descricao: 'Diretoria' },
];

export function PainelReorderList() {
  const [itens, setItens] = useState(TAREFAS);
  const [removivel, setRemovivel] = useState(true);

  return (
    <Painel
      titulo="ArchbaseReorderList"
      descricao="Arraste pela alca, OU foque um item com Tab e use Alt+Setas. O leitor de tela anuncia cada movimento."
      correcao="unifica dois componentes do Lightswind e acrescenta reordenacao por teclado, que arrastar nunca oferece"
      controles={
        <>
          <Switch label="Permitir remover" checked={removivel} onChange={(e) => setRemovivel(e.currentTarget.checked)} size="xs" />
          <Text size="xs" c="dimmed">Ordem atual:</Text>
          <Code block>{itens.map((t) => t.nome.split(' ')[0]).join(' → ')}</Code>
          <Text size="xs" c="dimmed">Tab no item, depois Alt+↑ ou Alt+↓.</Text>
        </>
      }
    >
      <div style={{ height: 300, overflow: 'auto', padding: 4 }}>
        <ArchbaseReorderList
          items={itens}
          getItemId={(t) => t.id}
          getItemLabel={(t) => t.nome}
          getItemDescription={(t) => t.descricao}
          onReorder={setItens}
          onRemove={removivel ? (t) => setItens((atual) => atual.filter((i) => i.id !== t.id)) : undefined}
        />
      </div>
    </Painel>
  );
}

export function PainelDock() {
  const [ultimo, setUltimo] = useState('—');
  const [magnificacao, setMagnificacao] = useState(68);
  const [alcance, setAlcance] = useState(140);

  return (
    <Painel
      titulo="ArchbaseMagnifyDock"
      descricao="Barra de icones com magnificacao. Navegue por Tab: cada item responde a Enter e Espaco."
      correcao="no original os itens eram div com role=button e tabIndex=0, mas sem tratador de teclado"
      controles={
        <>
          <NumberInput label="Magnificacao" value={magnificacao} onChange={(v) => setMagnificacao(Number(v) || 44)} step={4} min={44} max={140} size="xs" />
          <NumberInput label="Alcance" value={alcance} onChange={(v) => setAlcance(Number(v) || 40)} step={20} min={40} max={400} size="xs" />
          <Text size="xs" c="dimmed">Ultimo acionado:</Text>
          <Code>{ultimo}</Code>
        </>
      }
    >
      <Center style={{ height: 300 }}>
        <ArchbaseMagnifyDock
          magnification={magnificacao}
          distance={alcance}
          aria-label="Atalhos do sistema"
          items={[
            { id: 'inicio', icon: <IconHome size={22} />, label: 'Inicio', onClick: () => setUltimo('Inicio') },
            { id: 'busca', icon: <IconSearch size={22} />, label: 'Buscar', onClick: () => setUltimo('Buscar') },
            { id: 'alertas', icon: <IconBell size={22} />, label: 'Alertas', badge: 7, onClick: () => setUltimo('Alertas') },
            { id: 'perfil', icon: <IconUser size={22} />, label: 'Perfil', onClick: () => setUltimo('Perfil') },
            { id: 'config', icon: <IconSettings size={22} />, label: 'Configuracoes', disabled: true },
          ]}
        />
      </Center>
    </Painel>
  );
}

export function PainelGlowingCards() {
  const [colunas, setColunas] = useState(3);
  const [raio, setRaio] = useState(280);
  const [ultimo, setUltimo] = useState('—');

  return (
    <Painel
      titulo="ArchbaseGlowingCards"
      descricao="Um unico brilho atravessa a grade acompanhando o ponteiro. Cartoes clicaveis respondem a Tab e Enter."
      correcao="a posicao vai para custom properties: mover o ponteiro nao dispara render, ao contrario do original"
      controles={
        <>
          <NumberInput label="Colunas" value={colunas} onChange={(v) => setColunas(Number(v) || 1)} step={1} min={1} max={6} size="xs" />
          <NumberInput label="Raio do brilho" value={raio} onChange={(v) => setRaio(Number(v) || 60)} step={20} min={60} max={600} size="xs" />
          <Text size="xs" c="dimmed">Ultimo clicado:</Text>
          <Code>{ultimo}</Code>
        </>
      }
    >
      <div style={{ height: 300, overflow: 'auto', padding: 4 }}>
        <ArchbaseGlowingCards columns={colunas} glowRadius={raio}>
          {['Receita', 'Inadimplencia', 'Ticket medio', 'Cobertura', 'Churn', 'Margem'].map((nome) => (
            <ArchbaseGlowingCard key={nome} onClick={() => setUltimo(nome)}>
              <Stack gap={2}>
                <Text size="xs" c="dimmed">{nome}</Text>
                <Text fw={700} size="lg">R$ {(Math.random() * 900 + 100).toFixed(0)}k</Text>
              </Stack>
            </ArchbaseGlowingCard>
          ))}
        </ArchbaseGlowingCards>
      </div>
    </Painel>
  );
}

export function PainelDeviceFrame() {
  const [variante, setVariante] = useState<'phone' | 'tablet' | 'desktop'>('phone');
  const [largura, setLargura] = useState(190);
  const [texto, setTexto] = useState('Aplicacao viva dentro da moldura');

  return (
    <Painel
      titulo="ArchbaseDeviceFrame"
      descricao="Moldura de aparelho. A tela aceita conteudo React de verdade — o botao abaixo funciona."
      correcao="o original so aceitava src de imagem ou video, e a prop de cor nao funcionava em build de producao"
      controles={
        <>
          <Group gap={4}>
            {(['phone', 'tablet', 'desktop'] as const).map((v) => (
              <Switch key={v} label={v} checked={variante === v} onChange={() => setVariante(v)} size="xs" />
            ))}
          </Group>
          <NumberInput label="Largura" value={largura} onChange={(v) => setLargura(Number(v) || 120)} step={10} min={120} max={420} size="xs" />
          <TextInput label="Texto na tela" value={texto} onChange={(e) => setTexto(e.currentTarget.value)} size="xs" />
        </>
      }
    >
      <Center style={{ height: 420, overflow: 'auto' }}>
        <ArchbaseDeviceFrame variant={variante} width={largura} aria-label="Previa do aplicativo">
          <Stack gap="xs" p="md" pt={variante === 'phone' ? 40 : 'md'} align="center" justify="center" h="100%">
            <Text size="sm" ta="center">{texto}</Text>
            <ArchbaseSlideToConfirm width={Math.min(220, largura - 40)} height={40} label="Deslize" onConfirm={() => {}} />
          </Stack>
        </ArchbaseDeviceFrame>
      </Center>
    </Painel>
  );
}
