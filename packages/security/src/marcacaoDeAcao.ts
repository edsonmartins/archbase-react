/**
 * A marcação que liga um elemento da tela à capacidade que o governa.
 *
 * <p><b>Por que um atributo, e não um componente.</b> O inspetor precisa saber qual botão pertence a
 * qual ação, e nada no DOM diz isso: a proteção mora em `disabled={!can('aprovar_custo')}`, dentro
 * do JSX, e desaparece na renderização. Envolver cada controle num componente de guarda resolveria,
 * ao preço de reescrever telas inteiras. Um atributo é uma linha por controle, não muda a árvore
 * renderizada e não interfere em estilo, layout ou acessibilidade.
 *
 * <p><b>É opcional e não protege nada.</b> Marcar um botão não o torna seguro, e deixar de marcar
 * não o torna inseguro — a autorização continua sendo o `can()`. O atributo serve para o realce
 * saber onde desenhar. O que não estiver marcado continua aparecendo na lista do inspetor.
 *
 * @example
 * ```tsx
 * <Button
 *   disabled={!can('aprovar_custo')}
 *   {...archbaseActionProps('aprovar_custo')}
 * >
 *   Aprovar custo
 * </Button>
 * ```
 */
export const ATRIBUTO_DE_ACAO = 'data-archbase-action';

/**
 * Os atributos que marcam um elemento como pertencente a uma capacidade.
 *
 * <p>Aceita o nome simples (`'aprovar_custo'`), que o inspetor resolve contra o recurso da tela em
 * que o elemento está.
 */
export function archbaseActionProps(actionName: string): Record<string, string> {
    return { [ATRIBUTO_DE_ACAO]: actionName };
}
