import { ArchbaseObjectToInspect } from '@archbase/components';
import { ReactNode } from 'react';

export interface ArchbaseDebugOptions {
	debugLayoutHotKey?: string;
	debugObjectInspectorHotKey?: string;
	objectsToInspect?: ArchbaseObjectToInspect[];
}

/**
 * Props opcionais para integração de segurança em templates
 * Completamente opcionais - se não fornecidas, template funciona normalmente
 */
export interface ArchbaseTemplateSecurityProps {
	/** Nome do recurso - SE definido, ativa segurança */
	resourceName?: string;
	/** Descrição do recurso - opcional */
	resourceDescription?: string;
	/** Permissões obrigatórias - só válido SE resourceName definido */
	requiredPermissions?: string[];
	/** Fallback para acesso negado - só usado SE segurança ativa */
	fallbackComponent?: ReactNode;
	/** Configurações avançadas - só funciona SE segurança ativa */
	securityOptions?: {
		autoRegisterActions?: boolean;
		strictMode?: boolean;
		onSecurityReady?: (manager: any) => void;
		onAccessDenied?: () => void;
	};
}
