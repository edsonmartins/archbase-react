/**
 * As abas não serializam elementos React.
 *
 * O componente usava `JSON.stringify(currentTabs)` como dependência de efeito. O item de aba
 * carrega `favicon`, que pode ser um elemento React; em desenvolvimento o React 19 grava no
 * elemento o dono dele (o fiber), que é circular — a primeira aba aberta derrubava a aplicação
 * com "Converting circular structure to JSON". Estes testes rodam em modo dev, que é onde quebra.
 */
import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { ArchbaseAdvancedTabItem, ArchbaseAdvancedTabs, buildTabsSignature } from './ArchbaseAdvancedTabs';

vi.mock('@archbase/core', () => ({
	useArchbaseTranslation: () => ({ t: (chave: string) => chave }),
}));

const Icone = () => <svg data-testid="icone" />;

/** Cria os itens DENTRO de um render, como faz quem monta a navegação com `useMemo`. */
function Abas({ ids, fechando, titulos = {} }: { ids: string[]; fechando?: string; titulos?: Record<string, string> }) {
	const itens: ArchbaseAdvancedTabItem[] = ids.map((id) => ({
		key: id,
		favicon: <Icone />,
		title: titulos[id] ?? `Aba ${id}`,
		closing: fechando === id,
	}));
	return (
		<MantineProvider>
			<ArchbaseAdvancedTabs
				currentTabs={itens}
				activeTab={ids[0]}
				buttonCloseOnlyActiveTab={false}
				dark={false}
				onTabChange={() => {}}
				onTabClose={() => {}}
				onClick={() => {}}
			/>
		</MantineProvider>
	);
}

const titulos = (container: HTMLElement) =>
	Array.from(container.querySelectorAll('.archbase_tab-title')).map((el) => el.textContent);

// O MantineProvider consulta o esquema de cores, e o jsdom não implementa matchMedia.
beforeAll(() => {
	window.matchMedia = ((query: string) => ({
		matches: false,
		media: query,
		addEventListener: () => {},
		removeEventListener: () => {},
		addListener: () => {},
		removeListener: () => {},
	})) as any;
});

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

describe('ArchbaseAdvancedTabs com itens que carregam elementos React', () => {
	it('o elemento criado num render é circular em dev — a premissa do defeito', () => {
		let itens: ArchbaseAdvancedTabItem[] = [];
		const Captura = () => {
			itens = [{ key: 'a', favicon: <Icone />, title: 'Aba a' }];
			return null;
		};
		render(<Captura />);

		expect(() => JSON.stringify(itens)).toThrow(/circular/i);
		expect(() => buildTabsSignature(itens)).not.toThrow();
	});

	it('abre, troca e fecha abas sem lançar, e os efeitos continuam disparando', () => {
		// jsdom não faz layout: sem largura o componente não posiciona aba nenhuma.
		vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(800);

		const { container, rerender } = render(<Abas ids={['a']} />);
		expect(titulos(container)).toEqual(['Aba a']);

		// abrir
		rerender(<Abas ids={['a', 'b']} />);
		expect(titulos(container)).toEqual(['Aba a', 'Aba b']);

		// trocar o título de uma aba
		rerender(<Abas ids={['a', 'b']} titulos={{ b: 'Pedido 42' }} />);
		expect(titulos(container)).toEqual(['Aba a', 'Pedido 42']);

		// fechamento em andamento: o X vira Loader
		rerender(<Abas ids={['a', 'b']} titulos={{ b: 'Pedido 42' }} fechando="b" />);
		expect(container.querySelectorAll('[aria-label="closing"]').length).toBe(1);

		// fechar
		rerender(<Abas ids={['a']} />);
		expect(titulos(container)).toEqual(['Aba a']);
	});
});

describe('buildTabsSignature', () => {
	const aba = (extra: Partial<ArchbaseAdvancedTabItem> = {}): ArchbaseAdvancedTabItem => ({
		key: 'a',
		favicon: undefined,
		title: 'Aba',
		...extra,
	});

	it('muda com cada campo que o strip desenha', () => {
		const base = buildTabsSignature([aba()]);
		expect(buildTabsSignature([aba({ key: 'b' })])).not.toBe(base);
		expect(buildTabsSignature([aba({ title: 'Outra' })])).not.toBe(base);
		expect(buildTabsSignature([aba({ customTitle: 'Outra' })])).not.toBe(base);
		expect(buildTabsSignature([aba({ closing: true })])).not.toBe(base);
		expect(buildTabsSignature([aba({ favicon: 'icone.png' })])).not.toBe(base);
		expect(buildTabsSignature([aba(), aba({ key: 'b' })])).not.toBe(base);
	});

	it('não muda quando só a identidade do elemento muda', () => {
		expect(buildTabsSignature([aba({ favicon: <Icone /> })])).toBe(buildTabsSignature([aba({ favicon: <Icone /> })]));
	});

	it('separador dentro do título não confunde duas listas', () => {
		expect(buildTabsSignature([aba({ title: 'a', customTitle: 'b:c' })])).not.toBe(
			buildTabsSignature([aba({ title: 'a:b', customTitle: 'c' })]),
		);
	});
});
