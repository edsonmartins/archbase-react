import { useCallback, useContext, useMemo } from 'react';
import { ArchbaseViewSecurityContext, RegisterActionOptions } from '@archbase/security';

/**
 * A segurança da tela, para quem pode estar fora dela.
 *
 * <p><b>O que este hook era.</b> Um esqueleto: {@code isAvailable} nascia `false`,
 * {@code hasPermission} devolvia `true` e {@code registerAction} não fazia nada, com o comentário
 * "a integração será implementada posteriormente". Nove componentes de template o consumiam, e
 * portanto a segurança deles inteira era decorativa — o botão aparecia sempre, e a ação nunca
 * chegava ao catálogo. Não foi regressão: nasceu assim, no commit que criou o pacote.
 *
 * <h2>As duas travas</h2>
 *
 * <p>Ligar uma verificação que estava inerte esconde botões que hoje aparecem, e é assim que se
 * quebra um produto em produção. Duas regras impedem que isso aconteça por acidente:
 *
 * <ol>
 *   <li><b>Sem contexto, sem opinião.</b> Fora de um {@code ArchbaseViewSecurityProvider} o hook
 *       responde exatamente como antes: permite tudo. Template usado solto não muda em nada.</li>
 *   <li><b>Nunca negar pelo que o catálogo não conhece.</b> Enquanto as permissões carregam, se a
 *       carga falhou, ou se a capacidade não está no catálogo da tela, a resposta é permitir.
 *       Negar nesses três casos confundiria "você não pode" com "ainda não sei" — e foi assim que
 *       uma política de endpoint administrativo deixou telas inteiras cinzas quando o que faltava
 *       era a resposta chegar.</li>
 * </ol>
 *
 * <p>Ou seja: só há negação quando existe contexto, as permissões chegaram, a capacidade está
 * declarada, e ela não foi concedida. Em qualquer outra combinação, permite.
 */
export const useOptionalTemplateSecurity = (config?: {
  resourceName?: string;
  resourceDescription?: string;
  autoRegisterActions?: boolean;
}) => {
  // useContext e não useArchbaseViewSecurity: aquele LANÇA quando não há provider, e estar fora
  // dele é o caso normal deste hook.
  const contexto = useContext(ArchbaseViewSecurityContext);

  const manager = contexto?.securityManager ?? null;
  const carregando = contexto?.isLoading ?? false;
  const comFalha = Boolean(contexto?.error);

  // "Disponível" é mais estreito que "existe contexto": é existe contexto E dá para confiar na
  // resposta. Enquanto carrega ou depois de falhar, o template segue permitindo.
  const isAvailable = Boolean(contexto) && !carregando && !comFalha;

  const declarada = useCallback((actionName: string): boolean => {
    if (!manager) {
      return false;
    }
    return manager.getRegisteredActions().some((acao: { actionName: string }) => acao.actionName === actionName)
      || manager.getPermissions().includes(actionName);
  }, [manager]);

  const hasPermission = useCallback((actionName?: string): boolean => {
    if (!contexto || !actionName || !isAvailable) {
      return true;
    }
    if (!declarada(actionName)) {
      return true;
    }
    return contexto.hasPermission(actionName);
  }, [contexto, isAvailable, declarada]);

  const registerAction = useCallback((
    actionName?: string,
    actionDescription?: string,
    opcoes?: RegisterActionOptions,
  ): void => {
    if (!contexto || !actionName) {
      return;
    }
    contexto.registerAction(actionName, actionDescription ?? actionName, opcoes);
  }, [contexto]);

  return useMemo(() => ({
    isAvailable,
    hasPermission,
    registerAction,
    canCreate: hasPermission('create'),
    canEdit: hasPermission('edit'),
    canDelete: hasPermission('delete'),
    canView: hasPermission('view'),
  }), [isAvailable, hasPermission, registerAction]);
};

/**
 * Se há contexto de segurança de tela em volta.
 *
 * <p>Respondia `false` sempre. Agora responde a verdade, com o mesmo critério estreito do
 * {@code isAvailable}: há contexto e dá para confiar na resposta dele.
 */
export const useTemplateSecurityAvailable = (): boolean => {
  const contexto = useContext(ArchbaseViewSecurityContext);
  return Boolean(contexto) && !contexto?.isLoading && !contexto?.error;
};
