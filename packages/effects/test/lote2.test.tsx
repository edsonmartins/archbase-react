import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { criarRuidoPerlin } from '../src/math/perlin';
import { ArchbaseStardustButton } from '../src/elements/ArchbaseStardustButton';
import { ArchbaseElectroBorder } from '../src/elements/ArchbaseElectroBorder';
import { ArchbaseBeamGrid } from '../src/backgrounds/ArchbaseBeamGrid';
import { definirMovimentoReduzido } from './setup';

beforeEach(() => definirMovimentoReduzido(false));

describe('ruido de Perlin', () => {
  it('e deterministico para a mesma semente', () => {
    const a = criarRuidoPerlin(42);
    const b = criarRuidoPerlin(42);

    // O original semeava com Math.random(), entao o mesmo fundo nunca se
    // repetia entre recargas — e um visual aprovado nao podia ser reproduzido.
    for (const [x, y] of [[0.5, 1.5], [12.25, 8.75], [100.1, 0.9]] as const) {
      expect(a(x, y)).toBe(b(x, y));
    }
  });

  it('produz campos distintos para sementes distintas', () => {
    const a = criarRuidoPerlin(1);
    const b = criarRuidoPerlin(2);
    const amostras = [[1.5, 2.5], [3.25, 4.75], [5.1, 6.9]] as const;

    expect(amostras.some(([x, y]) => a(x, y) !== b(x, y))).toBe(true);
  });

  it('permanece no intervalo esperado', () => {
    const ruido = criarRuidoPerlin(7);
    for (let i = 0; i < 400; i += 1) {
      const v = ruido(i * 0.37, i * 0.11);
      expect(Number.isFinite(v)).toBe(true);
      expect(Math.abs(v)).toBeLessThanOrEqual(1.5);
    }
  });
});

describe('ArchbaseStardustButton', () => {
  it('e um botao de verdade, acionavel por teclado', async () => {
    const aoClicar = vi.fn();
    const user = userEvent.setup();
    render(<ArchbaseStardustButton onClick={aoClicar}>Publicar</ArchbaseStardustButton>);

    const botao = screen.getByRole('button', { name: 'Publicar' });
    botao.focus();
    await user.keyboard('{Enter}');

    // O original aplicava o efeito sobre um elemento fora da navegacao por
    // teclado; aqui o efeito nao pode custar acessibilidade.
    expect(aoClicar).toHaveBeenCalled();
  });

  it('repassa atributos ao elemento', () => {
    render(
      <ArchbaseStardustButton disabled type="submit" aria-describedby="dica">
        Salvar
      </ArchbaseStardustButton>,
    );
    const botao = screen.getByRole('button', { name: 'Salvar' });

    expect(botao.hasAttribute('disabled')).toBe(true);
    expect(botao.getAttribute('type')).toBe('submit');
    expect(botao.getAttribute('aria-describedby')).toBe('dica');
  });

  it('continua funcional sem particulas sob movimento reduzido', async () => {
    definirMovimentoReduzido(true);
    const aoClicar = vi.fn();
    const user = userEvent.setup();
    render(<ArchbaseStardustButton onClick={aoClicar}>Confirmar</ArchbaseStardustButton>);

    expect(document.querySelector('canvas')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(aoClicar).toHaveBeenCalled();
  });
});

describe('ArchbaseElectroBorder', () => {
  it('anima por SMIL quando o movimento e permitido', () => {
    const { container } = render(
      <ArchbaseElectroBorder>
        <div>cartao</div>
      </ArchbaseElectroBorder>,
    );
    expect(container.querySelector('animate')).not.toBeNull();
  });

  it('remove a animacao sob movimento reduzido, mantendo a borda', () => {
    definirMovimentoReduzido(true);
    const { container } = render(
      <ArchbaseElectroBorder>
        <div>cartao</div>
      </ArchbaseElectroBorder>,
    );

    // SMIL nao respeita a preferencia sozinho: e preciso tirar o elemento.
    expect(container.querySelector('animate')).toBeNull();
    expect(container.querySelector('filter')).not.toBeNull();
    expect(screen.getByText('cartao')).toBeDefined();
  });

  it('gera identificador de filtro unico por instancia', () => {
    const { container } = render(
      <>
        <ArchbaseElectroBorder>a</ArchbaseElectroBorder>
        <ArchbaseElectroBorder>b</ArchbaseElectroBorder>
      </>,
    );
    const ids = [...container.querySelectorAll('filter')].map((f) => f.id);

    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });

  it('mantem o conteudo fora da arvore decorativa', () => {
    const { container } = render(<ArchbaseElectroBorder>conteudo</ArchbaseElectroBorder>);
    const decorativos = container.querySelectorAll('[aria-hidden="true"]');

    expect(decorativos.length).toBeGreaterThan(0);
    expect(screen.getByText('conteudo')).toBeDefined();
  });
});

describe('ArchbaseBeamGrid', () => {
  it('renderiza conteudo sobreposto', () => {
    render(
      <ArchbaseBeamGrid>
        <span>painel</span>
      </ArchbaseBeamGrid>,
    );
    expect(screen.getByText('painel')).toBeDefined();
  });

  it('esconde o canvas de leitores de tela', () => {
    render(<ArchbaseBeamGrid />);
    expect(document.querySelector('canvas')?.getAttribute('aria-hidden')).toBe('true');
  });
});
