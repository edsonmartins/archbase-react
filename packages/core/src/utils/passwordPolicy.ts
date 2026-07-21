import i18next from 'i18next';

/**
 * Critérios que definem o que é uma senha forte.
 * Todos os campos são opcionais: um critério ausente (ou zero) simplesmente não é avaliado.
 */
export interface ArchbasePasswordPolicy {
	/** Quantidade mínima de caracteres */
	minLength?: number;
	/** Quantidade máxima de caracteres */
	maxLength?: number;
	/** Quantidade mínima de letras minúsculas */
	minLowercase?: number;
	/** Quantidade mínima de letras maiúsculas */
	minUppercase?: number;
	/** Quantidade mínima de dígitos */
	minNumbers?: number;
	/** Quantidade mínima de símbolos (caracteres não alfanuméricos) */
	minSymbols?: number;
	/** Proíbe espaços em branco na senha */
	forbidWhitespace?: boolean;
	/** Proíbe N ou mais caracteres iguais em sequência. Ex: 3 rejeita "aaa" */
	forbidRepeated?: number;
	/** Proíbe N ou mais caracteres em sequência crescente/decrescente. Ex: 4 rejeita "1234" e "dcba" */
	forbidSequential?: number;
	/**
	 * Termos proibidos dentro da senha (comparação sem diferenciar maiúsculas).
	 * Use para impedir que a senha contenha o login, o e-mail ou o nome do usuário.
	 */
	blocklist?: string[];
}

export type ArchbasePasswordStrength = 'empty' | 'weak' | 'fair' | 'good' | 'strong';

/** Identificador estável de cada critério, útil para customizar rótulos ou testes */
export type ArchbasePasswordRequirementKey =
	| 'minLength'
	| 'maxLength'
	| 'minLowercase'
	| 'minUppercase'
	| 'minNumbers'
	| 'minSymbols'
	| 'forbidWhitespace'
	| 'forbidRepeated'
	| 'forbidSequential'
	| 'blocklist';

export interface ArchbasePasswordRequirement {
	/** Identificador do critério */
	key: ArchbasePasswordRequirementKey;
	/** Descrição do critério já traduzida */
	label: string;
	/** Indicador se o critério foi atendido pela senha informada */
	satisfied: boolean;
}

export interface ArchbasePasswordValidationResult {
	/** Indicador se a senha atende a todos os critérios da política */
	valid: boolean;
	/** Pontuação de 0 a 100 combinando critérios atendidos e comprimento */
	score: number;
	/** Classificação da força derivada da pontuação */
	strength: ArchbasePasswordStrength;
	/** Todos os critérios avaliados, atendidos ou não */
	requirements: ArchbasePasswordRequirement[];
	/** Somente os critérios não atendidos */
	unmetRequirements: ArchbasePasswordRequirement[];
	/** Mensagem do primeiro critério não atendido, pronta para exibir no campo */
	error?: string;
}

/**
 * Política padrão: 8 caracteres com ao menos uma minúscula, uma maiúscula,
 * um dígito e um símbolo, sem espaços em branco.
 */
export const ARCHBASE_DEFAULT_PASSWORD_POLICY: ArchbasePasswordPolicy = {
	minLength: 8,
	minLowercase: 1,
	minUppercase: 1,
	minNumbers: 1,
	minSymbols: 1,
	forbidWhitespace: true,
};

const translate = (key: string, options?: Record<string, unknown>): string => {
	const translated = i18next?.t?.(`archbase:${key}`, options as any);
	// Antes do i18next inicializar o retorno é a própria chave: mantém o texto padrão legível.
	if (typeof translated !== 'string' || translated === `archbase:${key}`) {
		return interpolateFallback(key, options);
	}
	return translated;
};

const interpolateFallback = (key: string, options?: Record<string, unknown>): string => {
	if (!options) {
		return key;
	}
	return Object.keys(options).reduce(
		(acc, name) => acc.replace(new RegExp(`{{\\s*${name}\\s*}}`, 'g'), String(options[name])),
		key
	);
};

const countMatches = (value: string, regex: RegExp): number => (value.match(regex) || []).length;

const hasRepeatedRun = (value: string, size: number): boolean => {
	let run = 1;
	for (let index = 1; index < value.length; index++) {
		run = value[index] === value[index - 1] ? run + 1 : 1;
		if (run >= size) {
			return true;
		}
	}
	return false;
};

const hasSequentialRun = (value: string, size: number): boolean => {
	let ascending = 1;
	let descending = 1;
	for (let index = 1; index < value.length; index++) {
		const delta = value.charCodeAt(index) - value.charCodeAt(index - 1);
		ascending = delta === 1 ? ascending + 1 : 1;
		descending = delta === -1 ? descending + 1 : 1;
		if (ascending >= size || descending >= size) {
			return true;
		}
	}
	return false;
};

const findBlockedTerm = (value: string, blocklist: string[]): string | undefined => {
	const lowerValue = value.toLowerCase();
	return blocklist
		.filter((term) => typeof term === 'string' && term.trim().length > 0)
		.find((term) => lowerValue.includes(term.trim().toLowerCase()));
};

/**
 * Avalia uma senha contra uma política e devolve o resultado detalhado, critério a critério.
 * Para obter apenas a lista de critérios (sem senha digitada), chame com uma string vazia.
 */
export function validateArchbasePassword(
	value: string | undefined | null,
	policy: ArchbasePasswordPolicy = ARCHBASE_DEFAULT_PASSWORD_POLICY
): ArchbasePasswordValidationResult {
	const password = value ?? '';
	const requirements: ArchbasePasswordRequirement[] = [];

	const addRequirement = (
		key: ArchbasePasswordRequirementKey,
		label: string,
		satisfied: boolean
	) => {
		requirements.push({ key, label, satisfied });
	};

	if (policy.minLength && policy.minLength > 0) {
		addRequirement(
			'minLength',
			translate('Mínimo de {{min}} caracteres', { min: policy.minLength }),
			password.length >= policy.minLength
		);
	}
	if (policy.maxLength && policy.maxLength > 0) {
		addRequirement(
			'maxLength',
			translate('Máximo de {{min}} caracteres', { min: policy.maxLength }),
			password.length <= policy.maxLength
		);
	}
	if (policy.minLowercase && policy.minLowercase > 0) {
		addRequirement(
			'minLowercase',
			translate('Pelo menos {{min}} letra minúscula', { min: policy.minLowercase }),
			countMatches(password, /[a-z]/g) >= policy.minLowercase
		);
	}
	if (policy.minUppercase && policy.minUppercase > 0) {
		addRequirement(
			'minUppercase',
			translate('Pelo menos {{min}} letra maiúscula', { min: policy.minUppercase }),
			countMatches(password, /[A-Z]/g) >= policy.minUppercase
		);
	}
	if (policy.minNumbers && policy.minNumbers > 0) {
		addRequirement(
			'minNumbers',
			translate('Pelo menos {{min}} número', { min: policy.minNumbers }),
			countMatches(password, /[0-9]/g) >= policy.minNumbers
		);
	}
	if (policy.minSymbols && policy.minSymbols > 0) {
		addRequirement(
			'minSymbols',
			translate('Pelo menos {{min}} símbolo', { min: policy.minSymbols }),
			countMatches(password, /[^a-zA-Z0-9\s]/g) >= policy.minSymbols
		);
	}
	if (policy.forbidWhitespace) {
		addRequirement(
			'forbidWhitespace',
			translate('Não pode conter espaços'),
			!/\s/.test(password)
		);
	}
	if (policy.forbidRepeated && policy.forbidRepeated > 1) {
		addRequirement(
			'forbidRepeated',
			translate('Não pode repetir o mesmo caractere {{min}} vezes seguidas', {
				min: policy.forbidRepeated,
			}),
			!hasRepeatedRun(password, policy.forbidRepeated)
		);
	}
	if (policy.forbidSequential && policy.forbidSequential > 1) {
		addRequirement(
			'forbidSequential',
			translate('Não pode conter sequências de {{min}} caracteres', {
				min: policy.forbidSequential,
			}),
			!hasSequentialRun(password, policy.forbidSequential)
		);
	}
	if (policy.blocklist && policy.blocklist.length > 0) {
		addRequirement(
			'blocklist',
			translate('Não pode conter dados pessoais ou termos comuns'),
			findBlockedTerm(password, policy.blocklist) === undefined
		);
	}

	const unmetRequirements = requirements.filter((requirement) => !requirement.satisfied);
	// Sem nenhum critério configurado a senha é considerada válida desde que preenchida.
	const valid = password.length > 0 && unmetRequirements.length === 0;
	const score = calculateScore(password, policy, requirements);

	return {
		valid,
		score,
		strength: calculateStrength(password, score, valid),
		requirements,
		unmetRequirements,
		error: unmetRequirements.length > 0 ? unmetRequirements[0].label : undefined,
	};
}

const calculateScore = (
	password: string,
	policy: ArchbasePasswordPolicy,
	requirements: ArchbasePasswordRequirement[]
): number => {
	if (password.length === 0) {
		return 0;
	}
	const satisfied = requirements.filter((requirement) => requirement.satisfied).length;
	const criteriaScore =
		requirements.length > 0 ? (satisfied / requirements.length) * 70 : 70;
	// Comprimento excedente rende até 30 pontos extras, 3 por caractere além do mínimo.
	const minLength = policy.minLength ?? ARCHBASE_DEFAULT_PASSWORD_POLICY.minLength ?? 0;
	const lengthScore = Math.min(30, Math.max(0, password.length - minLength) * 3);

	return Math.round(Math.min(100, criteriaScore + lengthScore));
};

const calculateStrength = (
	password: string,
	score: number,
	valid: boolean
): ArchbasePasswordStrength => {
	if (password.length === 0) {
		return 'empty';
	}
	// Uma senha que viola a política nunca é anunciada como boa/forte, por mais longa que seja.
	if (!valid) {
		return score < 40 ? 'weak' : 'fair';
	}
	if (score < 60) {
		return 'fair';
	}
	return score < 80 ? 'good' : 'strong';
};

/** Atalho para quando só interessa saber se a senha atende à política */
export function isArchbasePasswordValid(
	value: string | undefined | null,
	policy: ArchbasePasswordPolicy = ARCHBASE_DEFAULT_PASSWORD_POLICY
): boolean {
	return validateArchbasePassword(value, policy).valid;
}

/** Rótulo traduzido da classificação de força, para exibir junto ao medidor */
export function getArchbasePasswordStrengthLabel(strength: ArchbasePasswordStrength): string {
	switch (strength) {
		case 'weak':
			return translate('Senha fraca');
		case 'fair':
			return translate('Senha razoável');
		case 'good':
			return translate('Senha boa');
		case 'strong':
			return translate('Senha forte');
		default:
			return '';
	}
}

/**
 * Normaliza o atalho `passwordPolicy={true}` usado pelos componentes:
 * `true` aplica a política padrão, `false`/`undefined` desativa a validação.
 */
export function resolveArchbasePasswordPolicy(
	policy?: ArchbasePasswordPolicy | boolean
): ArchbasePasswordPolicy | undefined {
	if (policy === true) {
		return ARCHBASE_DEFAULT_PASSWORD_POLICY;
	}
	if (!policy) {
		return undefined;
	}
	return policy;
}
