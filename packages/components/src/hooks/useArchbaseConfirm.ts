import { useCallback } from 'react';
import { modals } from '@mantine/modals';
import { MantineColor } from '@mantine/core';

// =============================================================================
// Types
// =============================================================================

export interface ArchbaseConfirmOptions {
  /** Título do modal */
  title?: React.ReactNode;
  /** Mensagem do modal */
  message?: React.ReactNode;
  /** Texto do botão confirmar */
  confirmLabel?: string;
  /** Texto do botão cancelar */
  cancelLabel?: string;
  /** Cor do botão confirmar */
  confirmColor?: MantineColor;
  /** Cor do botão cancelar */
  cancelColor?: MantineColor;
  /** Callback ao confirmar */
  onConfirm?: () => void;
  /** Callback ao cancelar */
  onCancel?: () => void;
  /** Se o modal pode ser fechado clicando fora */
  closeOnClickOutside?: boolean;
  /** Se o modal pode ser fechado com ESC */
  closeOnEscape?: boolean;
  /** Centrar o modal */
  centered?: boolean;
  /** Tamanho do modal */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Ícone do modal */
  icon?: React.ReactNode;
  /** Agrupar botões */
  groupProps?: Record<string, any>;
}

export interface ArchbaseDeleteConfirmOptions extends Omit<ArchbaseConfirmOptions, 'confirmColor'> {
  /** Nome do item a ser deletado */
  itemName?: string;
}

export interface UseArchbaseConfirmReturn {
  /** Abre um modal de confirmação e retorna Promise<boolean> */
  confirm: (options: ArchbaseConfirmOptions) => Promise<boolean>;
  /** Abre um modal de confirmação de exclusão */
  confirmDelete: (options?: ArchbaseDeleteConfirmOptions) => Promise<boolean>;
  /** Abre um modal de alerta (apenas OK) */
  alert: (options: Omit<ArchbaseConfirmOptions, 'cancelLabel' | 'onCancel'>) => Promise<void>;
  /** Fecha todos os modais */
  closeAll: () => void;
}

// =============================================================================
// Default Labels (pt-BR)
// =============================================================================

const defaultLabels = {
  confirm: 'Confirmar',
  cancel: 'Cancelar',
  ok: 'OK',
  deleteTitle: 'Confirmar exclusão',
  deleteMessage: 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
  deleteConfirm: 'Excluir',
};

// =============================================================================
// useArchbaseConfirm Hook
// =============================================================================

export function useArchbaseConfirm(): UseArchbaseConfirmReturn {
  /**
   * Abre um modal de confirmação genérico
   */
  const confirm = useCallback((options: ArchbaseConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      modals.openConfirmModal({
        title: options.title || 'Confirmação',
        children: options.message,
        labels: {
          confirm: options.confirmLabel || defaultLabels.confirm,
          cancel: options.cancelLabel || defaultLabels.cancel,
        },
        confirmProps: {
          color: options.confirmColor || 'blue',
        },
        cancelProps: {
          color: options.cancelColor || 'gray',
          variant: 'outline',
        },
        closeOnClickOutside: options.closeOnClickOutside ?? false,
        closeOnEscape: options.closeOnEscape ?? true,
        centered: options.centered ?? true,
        size: options.size || 'sm',
        groupProps: options.groupProps,
        onConfirm: () => {
          options.onConfirm?.();
          resolve(true);
        },
        onCancel: () => {
          options.onCancel?.();
          resolve(false);
        },
        onClose: () => {
          resolve(false);
        },
      });
    });
  }, []);

  /**
   * Abre um modal de confirmação de exclusão
   */
  const confirmDelete = useCallback((options?: ArchbaseDeleteConfirmOptions): Promise<boolean> => {
    const itemName = options?.itemName;
    const message = options?.message || (
      itemName
        ? `Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`
        : defaultLabels.deleteMessage
    );

    return confirm({
      title: options?.title || defaultLabels.deleteTitle,
      message,
      confirmLabel: options?.confirmLabel || defaultLabels.deleteConfirm,
      cancelLabel: options?.cancelLabel || defaultLabels.cancel,
      confirmColor: 'red',
      cancelColor: options?.cancelColor,
      onConfirm: options?.onConfirm,
      onCancel: options?.onCancel,
      closeOnClickOutside: options?.closeOnClickOutside,
      closeOnEscape: options?.closeOnEscape,
      centered: options?.centered,
      size: options?.size,
      icon: options?.icon,
    });
  }, [confirm]);

  /**
   * Abre um modal de alerta (apenas OK)
   */
  const alert = useCallback((options: Omit<ArchbaseConfirmOptions, 'cancelLabel' | 'onCancel'>): Promise<void> => {
    return new Promise((resolve) => {
      modals.openConfirmModal({
        title: options.title || 'Aviso',
        children: options.message,
        labels: {
          confirm: options.confirmLabel || defaultLabels.ok,
          cancel: '', // Hidden
        },
        confirmProps: {
          color: options.confirmColor || 'blue',
        },
        cancelProps: {
          display: 'none',
        },
        closeOnClickOutside: options.closeOnClickOutside ?? true,
        closeOnEscape: options.closeOnEscape ?? true,
        centered: options.centered ?? true,
        size: options.size || 'sm',
        withCloseButton: true,
        onConfirm: () => {
          options.onConfirm?.();
          resolve();
        },
        onClose: () => {
          resolve();
        },
      });
    });
  }, []);

  /**
   * Fecha todos os modais abertos
   */
  const closeAll = useCallback(() => {
    modals.closeAll();
  }, []);

  return {
    confirm,
    confirmDelete,
    alert,
    closeAll,
  };
}

// =============================================================================
// Standalone Functions (for use without hook)
// =============================================================================

/**
 * Abre um modal de confirmação (uso imperativo sem hook)
 */
export function archbaseConfirm(options: ArchbaseConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    modals.openConfirmModal({
      title: options.title || 'Confirmação',
      children: options.message,
      labels: {
        confirm: options.confirmLabel || defaultLabels.confirm,
        cancel: options.cancelLabel || defaultLabels.cancel,
      },
      confirmProps: {
        color: options.confirmColor || 'blue',
      },
      cancelProps: {
        color: options.cancelColor || 'gray',
        variant: 'outline',
      },
      closeOnClickOutside: options.closeOnClickOutside ?? false,
      closeOnEscape: options.closeOnEscape ?? true,
      centered: options.centered ?? true,
      size: options.size || 'sm',
      onConfirm: () => {
        options.onConfirm?.();
        resolve(true);
      },
      onCancel: () => {
        options.onCancel?.();
        resolve(false);
      },
      onClose: () => {
        resolve(false);
      },
    });
  });
}

/**
 * Abre um modal de confirmação de exclusão (uso imperativo)
 */
export function archbaseConfirmDelete(options?: ArchbaseDeleteConfirmOptions): Promise<boolean> {
  const itemName = options?.itemName;
  const message = options?.message || (
    itemName
      ? `Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`
      : defaultLabels.deleteMessage
  );

  return archbaseConfirm({
    title: options?.title || defaultLabels.deleteTitle,
    message,
    confirmLabel: options?.confirmLabel || defaultLabels.deleteConfirm,
    cancelLabel: options?.cancelLabel || defaultLabels.cancel,
    confirmColor: 'red',
    cancelColor: options?.cancelColor,
    onConfirm: options?.onConfirm,
    onCancel: options?.onCancel,
    closeOnClickOutside: options?.closeOnClickOutside,
    closeOnEscape: options?.closeOnEscape,
    centered: options?.centered,
    size: options?.size,
  });
}

/**
 * Abre um modal de alerta (uso imperativo)
 */
export function archbaseAlert(options: Omit<ArchbaseConfirmOptions, 'cancelLabel' | 'onCancel'>): Promise<void> {
  return new Promise((resolve) => {
    modals.openConfirmModal({
      title: options.title || 'Aviso',
      children: options.message,
      labels: {
        confirm: options.confirmLabel || defaultLabels.ok,
        cancel: '',
      },
      confirmProps: {
        color: options.confirmColor || 'blue',
      },
      cancelProps: {
        display: 'none',
      },
      closeOnClickOutside: options.closeOnClickOutside ?? true,
      closeOnEscape: options.closeOnEscape ?? true,
      centered: options.centered ?? true,
      size: options.size || 'sm',
      withCloseButton: true,
      onConfirm: () => {
        options.onConfirm?.();
        resolve();
      },
      onClose: () => {
        resolve();
      },
    });
  });
}

export default useArchbaseConfirm;
