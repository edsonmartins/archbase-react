import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ArchbaseAuroraBackground } from '../src/backgrounds/ArchbaseAuroraBackground';
import { ArchbaseGooeyBlobs } from '../src/backgrounds/ArchbaseGooeyBlobs';

beforeEach(() => {
  // As folhas sao injetadas uma unica vez por documento; limpar evita que um
  // caso dependa do que outro deixou.
  document.getElementById('archbase-effects-aurora')?.remove();
  document.getElementById('archbase-effects-gooey')?.remove();
});

describe('ArchbaseAuroraBackground', () => {
  it('injeta a animacao uma unica vez, mesmo com varias instancias', () => {
    render(
      <>
        <ArchbaseAuroraBackground />
        <ArchbaseAuroraBackground />
        <ArchbaseAuroraBackground />
      </>,
    );

    expect(document.querySelectorAll('#archbase-effects-aurora')).toHaveLength(1);
  });

  it('trata movimento reduzido por midia, nao por JavaScript', () => {
    render(<ArchbaseAuroraBackground />);
    const folha = document.getElementById('archbase-effects-aurora');

    // A preferencia e aplicada pelo navegador: o componente nao observa nada.
    expect(folha?.textContent).toContain('prefers-reduced-motion');
    expect(folha?.textContent).toContain('animation: none');
  });

  it('mantem a camada fora da arvore de acessibilidade', () => {
    const { container } = render(<ArchbaseAuroraBackground>conteudo</ArchbaseAuroraBackground>);

    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
    expect(screen.getByText('conteudo')).toBeDefined();
  });

  it('nao consome quadro de animacao', () => {
    // Puro CSS: nenhum requestAnimationFrame, diferente dos fundos em canvas.
    let pedidos = 0;
    const original = globalThis.requestAnimationFrame;
    globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      pedidos += 1;
      return original(cb);
    }) as typeof globalThis.requestAnimationFrame;

    render(<ArchbaseAuroraBackground />);
    globalThis.requestAnimationFrame = original;

    expect(pedidos).toBe(0);
  });
});

describe('ArchbaseGooeyBlobs', () => {
  it('gera filtro proprio por instancia', () => {
    const { container } = render(
      <>
        <ArchbaseGooeyBlobs />
        <ArchbaseGooeyBlobs />
      </>,
    );

    const ids = [...container.querySelectorAll('filter')].map((f) => f.id);
    expect(ids).toHaveLength(2);
    // Filtros com o mesmo id fariam uma instancia roubar o efeito da outra.
    expect(new Set(ids).size).toBe(2);
  });

  it('cria uma bolha por cor', () => {
    const { container } = render(
      <ArchbaseGooeyBlobs colors={['#f00', '#0f0', '#00f', '#ff0']} />,
    );

    expect(container.querySelectorAll('.archbase-gooey-blob')).toHaveLength(4);
  });

  it('aplica o filtro de fusao a camada das bolhas', () => {
    const { container } = render(<ArchbaseGooeyBlobs />);
    const camada = container.querySelector('[style*="filter: url"]') as HTMLElement | null;

    expect(camada).not.toBeNull();
    expect(camada?.getAttribute('aria-hidden')).toBe('true');
  });

  it('desliga a animacao sob movimento reduzido', () => {
    render(<ArchbaseGooeyBlobs />);
    const folha = document.getElementById('archbase-effects-gooey');

    expect(folha?.textContent).toContain('prefers-reduced-motion');
  });

  it('sobrepoe o conteudo do hospedeiro', () => {
    render(
      <ArchbaseGooeyBlobs>
        <h2>Titulo</h2>
      </ArchbaseGooeyBlobs>,
    );
    expect(screen.getByText('Titulo')).toBeDefined();
  });
});
