import { useCallback, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { ActionIcon, Group, Paper, Text, VisuallyHidden } from '@mantine/core';
import { IconGripVertical, IconX } from '@tabler/icons-react';
import { Reorder, useDragControls } from 'framer-motion';

export interface ArchbaseReorderListProps<T> {
  /** Itens na ordem corrente. Componente controlado. */
  items: T[];
  /** Identidade estavel do item. */
  getItemId: (item: T) => string | number;
  /** Nova ordem. Sem isto o componente nao teria como refletir o arrasto. */
  onReorder: (items: T[]) => void;
  /** Conteudo do item. Ausente, usa `getItemLabel`. */
  renderItem?: (item: T, estado: { arrastando: boolean; indice: number }) => ReactNode;
  /** Rotulo textual, usado no conteudo padrao e nos anuncios de acessibilidade. */
  getItemLabel?: (item: T) => string;
  /** Descricao secundaria no conteudo padrao. */
  getItemDescription?: (item: T) => string | undefined;
  onRemove?: (item: T) => void;
  disabled?: boolean;
  gap?: number;
  className?: string;
  labels?: {
    dragHandle?: string;
    remove?: string;
    /** `{item}`, `{de}` e `{para}` sao substituidos. */
    moved?: string;
    instructions?: string;
  };
}

const ROTULOS_PADRAO = {
  dragHandle: 'Arrastar para reordenar',
  remove: 'Remover',
  moved: '{item} movido da posicao {de} para {para}',
  instructions:
    'Use as setas para cima e para baixo com a tecla Alt para mover o item selecionado.',
};

function interpolar(texto: string, valores: Record<string, string | number>): string {
  return texto.replace(/\{(\w+)\}/g, (m, chave: string) => String(valores[chave] ?? m));
}

/**
 * Lista reordenavel por arrasto e por teclado.
 *
 * Unifica dois componentes do Lightswind UI (MIT, Muhilan / codewithMUHILAN) —
 * `drag-order-list` e `draggable-reorder-list` — que resolviam o mesmo problema
 * com implementacoes diferentes. Entregar os dois seria oferecer duas respostas
 * para uma pergunta.
 *
 * Diferencas em relacao aos originais:
 *
 * - **Reordenacao por teclado.** Arrastar e, por natureza, inacessivel: quem
 *   navega por teclado nao tem gesto equivalente. Aqui `Alt+Setas` move o item
 *   focado, e cada movimento e anunciado por regiao viva. Sem isso, a
 *   funcionalidade simplesmente nao existe para parte dos usuarios.
 * - **Controlado.** O original copiava `items` para estado interno e disparava
 *   `onReorder` num efeito com `[list]` na dependencia — o que notificava ja na
 *   montagem, sem ninguem ter reordenado nada, e ignorava mudancas vindas de
 *   fora depois disso.
 * - **Generico.** O `drag-order-list` fixava a forma do item em `{ title,
 *   subtitle, date, link }`. Numa biblioteca isso obriga o consumidor a
 *   traduzir o dominio dele para um formato alheio.
 */
export function ArchbaseReorderList<T>({
  items,
  getItemId,
  onReorder,
  renderItem,
  getItemLabel,
  getItemDescription,
  onRemove,
  disabled = false,
  gap = 8,
  className,
  labels,
}: ArchbaseReorderListProps<T>) {
  const textos = { ...ROTULOS_PADRAO, ...labels };
  const [anuncio, setAnuncio] = useState('');

  const rotuloDe = useCallback(
    (item: T) => getItemLabel?.(item) ?? String(getItemId(item)),
    [getItemLabel, getItemId],
  );

  const mover = useCallback(
    (de: number, para: number) => {
      if (disabled) return;
      if (para < 0 || para >= items.length || de === para) return;

      const proximos = [...items];
      const [movido] = proximos.splice(de, 1);
      if (movido === undefined) return;
      proximos.splice(para, 0, movido);

      onReorder(proximos);
      setAnuncio(
        interpolar(textos.moved, { item: rotuloDe(movido), de: de + 1, para: para + 1 }),
      );
    },
    [items, onReorder, disabled, textos.moved, rotuloDe],
  );

  return (
    <>
      {/* Regiao viva: o leitor de tela precisa saber que a ordem mudou, senao a
          reordenacao por teclado acontece sem retorno algum. */}
      <VisuallyHidden aria-live="polite" role="status">
        {anuncio}
      </VisuallyHidden>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={onReorder}
        className={className}
        style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap }}
      >
        {items.map((item, indice) => (
          <ArchbaseReorderItem
            key={getItemId(item)}
            item={item}
            indice={indice}
            total={items.length}
            disabled={disabled}
            rotulo={rotuloDe(item)}
            descricao={getItemDescription?.(item)}
            renderItem={renderItem}
            onMover={mover}
            onRemove={onRemove}
            textos={textos}
          />
        ))}
      </Reorder.Group>
    </>
  );
}

interface ItemProps<T> {
  item: T;
  indice: number;
  total: number;
  disabled: boolean;
  rotulo: string;
  descricao?: string;
  renderItem?: (item: T, estado: { arrastando: boolean; indice: number }) => ReactNode;
  onMover: (de: number, para: number) => void;
  onRemove?: (item: T) => void;
  textos: typeof ROTULOS_PADRAO;
}

function ArchbaseReorderItem<T>({
  item,
  indice,
  total,
  disabled,
  rotulo,
  descricao,
  renderItem,
  onMover,
  onRemove,
  textos,
}: ItemProps<T>) {
  const controles = useDragControls();
  const [arrastando, setArrastando] = useState(false);
  const referencia = useRef<HTMLLIElement>(null);

  const aoTeclar = useCallback(
    (evento: KeyboardEvent<HTMLLIElement>) => {
      if (disabled || !evento.altKey) return;

      if (evento.key === 'ArrowUp') {
        evento.preventDefault();
        onMover(indice, indice - 1);
        // O foco acompanha o item, nao a posicao: sem isto, mover duas vezes
        // seguidas exigiria reencontrar o item na lista.
        requestAnimationFrame(() => referencia.current?.focus());
      } else if (evento.key === 'ArrowDown') {
        evento.preventDefault();
        onMover(indice, indice + 1);
        requestAnimationFrame(() => referencia.current?.focus());
      }
    },
    [disabled, indice, onMover],
  );

  return (
    <Reorder.Item
      ref={referencia}
      value={item}
      dragListener={false}
      dragControls={controles}
      onDragStart={() => setArrastando(true)}
      onDragEnd={() => setArrastando(false)}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={aoTeclar}
      aria-roledescription="Item reordenavel"
      aria-label={`${rotulo}. ${indice + 1} de ${total}. ${textos.instructions}`}
      style={{ listStyle: 'none' }}
    >
      <Paper withBorder p="xs" radius="md" shadow={arrastando ? 'md' : undefined}>
        <Group gap="sm" wrap="nowrap">
          <ActionIcon
            variant="subtle"
            color="gray"
            aria-label={textos.dragHandle}
            disabled={disabled}
            // O arrasto so comeca pela alca: arrastar o item inteiro impede
            // selecionar texto e clicar em controles dentro dele.
            onPointerDown={(evento) => !disabled && controles.start(evento)}
            style={{ cursor: disabled ? 'not-allowed' : 'grab', touchAction: 'none' }}
          >
            <IconGripVertical size={18} />
          </ActionIcon>

          <div style={{ flex: 1, minWidth: 0 }}>
            {renderItem ? (
              renderItem(item, { arrastando, indice })
            ) : (
              <>
                <Text size="sm" fw={500} truncate>
                  {rotulo}
                </Text>
                {descricao && (
                  <Text size="xs" c="dimmed" truncate>
                    {descricao}
                  </Text>
                )}
              </>
            )}
          </div>

          {onRemove && (
            <ActionIcon
              variant="subtle"
              color="red"
              aria-label={`${textos.remove}: ${rotulo}`}
              disabled={disabled}
              onClick={() => onRemove(item)}
            >
              <IconX size={16} />
            </ActionIcon>
          )}
        </Group>
      </Paper>
    </Reorder.Item>
  );
}
