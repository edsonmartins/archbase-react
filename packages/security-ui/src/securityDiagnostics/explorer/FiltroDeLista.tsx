import { CloseButton, TextInput } from '@mantine/core';
import { useMemo, useState } from 'react';

export interface FiltroDeListaProps {
	value: string;
	onChange: (valor: string) => void;
	/** O que se está filtrando, para compor o texto de apoio. Ex.: "capacidades". */
	assunto?: string;
	/** Quantos itens sobraram e quantos existem, para dizer que o filtro está escondendo coisa. */
	visiveis?: number;
	total?: number;
}

/**
 * Campo de busca das listas do explorador.
 *
 * <p>Existe porque as listas aqui são naturalmente longas: uma pessoa com muitos perfis chega a
 * centenas de capacidades, e procurar "aprovar" percorrendo a rolagem é pior do que não ter a lista.
 * Filtrar no cliente é adequado <b>porque estas listas vêm inteiras</b> do backend — não há página
 * seguinte escondendo resultado, então o que o filtro não mostra realmente não existe.
 */
export const FiltroDeLista = ({ value, onChange, assunto, visiveis, total }: FiltroDeListaProps) => {
	const escondendo = typeof visiveis === 'number' && typeof total === 'number' && visiveis < total;

	return (
		<TextInput
			size="xs"
			value={value}
			onChange={(e) => onChange(e.currentTarget.value)}
			placeholder={assunto ? `Filtrar ${assunto}…` : 'Filtrar…'}
			aria-label={assunto ? `Filtrar ${assunto}` : 'Filtrar'}
			// A contagem some quando não há filtro: dizer "120 de 120" a toda hora é ruído.
			description={escondendo ? `${visiveis} de ${total}` : undefined}
			rightSection={
				value ? <CloseButton size="sm" onClick={() => onChange('')} aria-label="Limpar filtro" /> : null
			}
		/>
	);
};

// NFD separa a letra do acento, e este intervalo é o dos sinais combinantes. Remover os dois é o
// que faz "serviço" e "servico" baterem.
const SINAIS_COMBINANTES = /[̀-ͯ]/g;

const normalizar = (v: string) => v.toLocaleLowerCase().normalize('NFD').replace(SINAIS_COMBINANTES, '');

/**
 * Guarda o texto digitado e devolve a lista já filtrada.
 *
 * <p>A comparação ignora maiúsculas e acentos: quem procura "servico" precisa achar "serviço", e
 * quem procura "APROVAR" precisa achar "aprovar". Sem isso o filtro devolve vazio e passa a
 * impressão de que a capacidade não existe — o mesmo falso negativo que a árvore veio corrigir.
 */
export const useFiltroDeTexto = <T,>(itens: T[], textoDe: (item: T) => (string | undefined)[]) => {
	const [filtro, setFiltro] = useState('');

	const filtrados = useMemo(() => {
		const alvo = normalizar(filtro.trim());
		if (!alvo) {
			return itens;
		}
		return itens.filter((item) =>
			textoDe(item).some((campo) => (campo ? normalizar(campo).includes(alvo) : false)),
		);
		// textoDe é recriado a cada render pelos chamadores; incluí-lo na lista refiltraria sempre e
		// a memoização não valeria nada.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [itens, filtro]);

	return { filtro, setFiltro, filtrados };
};
