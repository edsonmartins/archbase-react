import { useSyncExternalStore } from 'react';
import { ArchbaseSecurityManager } from './ArchbaseSecurityManager';

/**
 * As telas montadas agora, para o inspetor de ações.
 *
 * <p><b>Por que um registro de módulo e não um contexto.</b> O inspetor é renderizado uma vez, no
 * topo da aplicação; as telas ficam abaixo dele, em abas que montam e desmontam. Contexto só desce,
 * então o inspetor nunca enxergaria os providers de view por baixo dele. Um registro de módulo é o
 * caminho de volta — cada {@link ArchbaseViewSecurityProvider} se anuncia ao montar e se retira ao
 * desmontar.
 *
 * <p><b>Por que uma lista e não "a tela atual".</b> Aplicações com abas mantêm várias telas montadas
 * ao mesmo tempo. Eleger uma como "a atual" exigiria saber qual aba está visível — informação que o
 * módulo de segurança não tem e não deveria ter. O inspetor mostra todas e deixa a escolha para
 * quem olha.
 *
 * <p>O registro é <b>puramente observacional</b>: nada aqui participa de decisão de acesso. Se este
 * arquivo sumisse, a autorização continuaria idêntica.
 */

const telas = new Set<ArchbaseSecurityManager>();
const ouvintes = new Set<() => void>();

/** Fatia imutável, recriada só quando o conjunto muda — `useSyncExternalStore` compara por referência. */
let instantaneo: ArchbaseSecurityManager[] = [];

function notificar() {
    instantaneo = Array.from(telas);
    ouvintes.forEach(ouvinte => ouvinte());
}

/**
 * Anuncia uma tela ao inspetor e devolve a função que a retira.
 *
 * <p>A forma de devolver o cancelamento é deliberada: é exatamente o que um `useEffect` espera como
 * retorno, o que torna impossível registrar sem desregistrar.
 */
export function registrarTelaInspecionada(manager: ArchbaseSecurityManager): () => void {
    telas.add(manager);
    notificar();
    return () => {
        telas.delete(manager);
        notificar();
    };
}

function assinar(ouvinte: () => void): () => void {
    ouvintes.add(ouvinte);
    return () => {
        ouvintes.delete(ouvinte);
    };
}

function lerInstantaneo(): ArchbaseSecurityManager[] {
    return instantaneo;
}

/**
 * As telas montadas agora. Re-renderiza quando alguma monta ou desmonta.
 *
 * <p>O terceiro argumento (servidor) devolve a mesma lista vazia sempre — na renderização de
 * servidor não há tela montada, e devolver um array novo a cada chamada faria o React acusar
 * instantâneo instável.
 */
const VAZIO: ArchbaseSecurityManager[] = [];

export function useTelasInspecionadas(): ArchbaseSecurityManager[] {
    return useSyncExternalStore(assinar, lerInstantaneo, () => VAZIO);
}
