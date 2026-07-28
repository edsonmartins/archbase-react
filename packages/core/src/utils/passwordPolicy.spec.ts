import { describe, expect, it } from 'vitest';
import {
	ARCHBASE_DEFAULT_PASSWORD_POLICY,
	isArchbasePasswordValid,
	resolveArchbasePasswordPolicy,
	validateArchbasePassword,
} from './passwordPolicy';

describe('validateArchbasePassword', () => {
	it('aceita uma senha que atende à política padrão', () => {
		const result = validateArchbasePassword('Archbase@2026');

		expect(result.valid).toBe(true);
		expect(result.unmetRequirements).toHaveLength(0);
		expect(result.error).toBeUndefined();
		expect(result.strength).toBe('strong');
	});

	it('reporta cada critério não atendido', () => {
		const result = validateArchbasePassword('senha');

		expect(result.valid).toBe(false);
		expect(result.unmetRequirements.map((requirement) => requirement.key)).toEqual([
			'minLength',
			'minUppercase',
			'minNumbers',
			'minSymbols',
		]);
		expect(result.error).toBe(result.unmetRequirements[0].label);
	});

	it('trata senha vazia como inválida e sem pontuação', () => {
		const result = validateArchbasePassword('');

		expect(result.valid).toBe(false);
		expect(result.score).toBe(0);
		expect(result.strength).toBe('empty');
		// Mesmo vazia, devolve a lista completa de critérios para a UI exibir.
		expect(result.requirements).toHaveLength(6);
	});

	it('não classifica como forte uma senha longa que viola a política', () => {
		const result = validateArchbasePassword('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

		expect(result.valid).toBe(false);
		expect(['weak', 'fair']).toContain(result.strength);
	});

	it('rejeita espaços quando forbidWhitespace está ativo', () => {
		expect(isArchbasePasswordValid('Arch base@2026')).toBe(false);
	});

	it('avalia somente os critérios configurados', () => {
		const result = validateArchbasePassword('somenteminusculas', { minLength: 10 });

		expect(result.requirements).toHaveLength(1);
		expect(result.valid).toBe(true);
	});

	it('detecta caracteres repetidos e sequências', () => {
		const policy = { minLength: 6, forbidRepeated: 3, forbidSequential: 4 };

		expect(isArchbasePasswordValid('abcaaadef', policy)).toBe(false);
		expect(isArchbasePasswordValid('xk1234pq', policy)).toBe(false);
		expect(isArchbasePasswordValid('4321xkpq', policy)).toBe(false);
		expect(isArchbasePasswordValid('xkpqbr79', policy)).toBe(true);
	});

	it('bloqueia termos da blocklist sem diferenciar maiúsculas', () => {
		const policy = { ...ARCHBASE_DEFAULT_PASSWORD_POLICY, blocklist: ['edson'] };

		expect(isArchbasePasswordValid('Edson@2026x', policy)).toBe(false);
		expect(isArchbasePasswordValid('Arqbz@2026x', policy)).toBe(true);
	});

	it('ignora maxLength/minLength iguais a zero', () => {
		const result = validateArchbasePassword('a', { minLength: 0, maxLength: 0 });

		expect(result.requirements).toHaveLength(0);
		expect(result.valid).toBe(true);
	});
});

describe('resolveArchbasePasswordPolicy', () => {
	it('converte true na política padrão', () => {
		expect(resolveArchbasePasswordPolicy(true)).toEqual(ARCHBASE_DEFAULT_PASSWORD_POLICY);
	});

	it('devolve undefined quando desativada', () => {
		expect(resolveArchbasePasswordPolicy(false)).toBeUndefined();
		expect(resolveArchbasePasswordPolicy(undefined)).toBeUndefined();
	});

	it('mantém a política informada', () => {
		const policy = { minLength: 12 };

		expect(resolveArchbasePasswordPolicy(policy)).toBe(policy);
	});
});
