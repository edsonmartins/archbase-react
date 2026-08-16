import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ArchbaseBorderBeam } from '../src/elements/ArchbaseBorderBeam';

beforeEach(() => document.getElementById('archbase-effects-border-beam')?.remove());

describe('ArchbaseBorderBeam', () => {
  it('registra o angulo como propriedade animavel', () => {
    render(<ArchbaseBorderBeam />);
    const folha = document.getElementById('archbase-effects-border-beam');

    // Sem @property o navegador trata a custom property como texto, e a
    // animacao salta em vez de girar.
    expect(folha?.textContent).toContain('@property --archbase-beam-angle');
    expect(folha?.textContent).toContain("syntax: '<angle>'");
  });

  it('aplica a espessura recebida', () => {
    const { container } = render(<ArchbaseBorderBeam thickness={6} />);
    const feixe = container.querySelector('.archbase-border-beam') as HTMLElement;

    // No original, `borderThickness` existia como prop mas o estilo que a
    // usaria estava comentado no fonte.
    expect(feixe.style.padding).toBe('6px');
  });

  it('inverte o sentido', () => {
    const { container } = render(<ArchbaseBorderBeam reverse />);
    const feixe = container.querySelector('.archbase-border-beam') as HTMLElement;
    expect(feixe.style.animation).toContain('reverse');
  });

  it('trata movimento reduzido por midia', () => {
    render(<ArchbaseBorderBeam />);
    expect(document.getElementById('archbase-effects-border-beam')?.textContent)
      .toContain('prefers-reduced-motion');
  });

  it('e decorativo e nao intercepta ponteiro', () => {
    const { container } = render(<ArchbaseBorderBeam />);
    const feixe = container.querySelector('.archbase-border-beam') as HTMLElement;

    expect(feixe.getAttribute('aria-hidden')).toBe('true');
    expect(feixe.style.pointerEvents).toBe('none');
  });

  it('injeta a folha uma unica vez', () => {
    render(<><ArchbaseBorderBeam /><ArchbaseBorderBeam /><ArchbaseBorderBeam /></>);
    expect(document.querySelectorAll('#archbase-effects-border-beam')).toHaveLength(1);
  });

  it('nao consome quadro de animacao', () => {
    let pedidos = 0;
    const original = globalThis.requestAnimationFrame;
    globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      pedidos += 1;
      return original(cb);
    }) as typeof globalThis.requestAnimationFrame;

    render(<ArchbaseBorderBeam />);
    globalThis.requestAnimationFrame = original;

    // Puro CSS, diferente do original que animava por framer-motion.
    expect(pedidos).toBe(0);
  });
});
