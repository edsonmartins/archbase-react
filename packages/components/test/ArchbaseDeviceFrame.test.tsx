import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { ArchbaseDeviceFrame } from '../src/display/ArchbaseDeviceFrame';

function Wrapper({ children }: { children: ReactNode }) {
  return <MantineProvider>{children}</MantineProvider>;
}

describe('ArchbaseDeviceFrame', () => {
  it('exibe conteudo vivo na tela, nao so imagem', () => {
    render(
      <ArchbaseDeviceFrame>
        <button type="button">Entrar</button>
      </ArchbaseDeviceFrame>,
      { wrapper: Wrapper },
    );

    // O original so aceitava `src` de imagem ou video, recortado por SVG.
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeDefined();
  });

  it('duas molduras convivem na mesma pagina', () => {
    // O original recortava a tela com clipPath id="screen" fixo: a segunda
    // instancia colidia com a primeira.
    const { container } = render(
      <>
        <ArchbaseDeviceFrame>
          <span>um</span>
        </ArchbaseDeviceFrame>
        <ArchbaseDeviceFrame>
          <span>dois</span>
        </ArchbaseDeviceFrame>
      </>,
      { wrapper: Wrapper },
    );

    expect(screen.getByText('um')).toBeDefined();
    expect(screen.getByText('dois')).toBeDefined();
    expect(container.querySelectorAll('clipPath')).toHaveLength(0);
  });

  it('aplica a cor recebida de fato', () => {
    const { container } = render(
      <ArchbaseDeviceFrame frameColor="rgb(255, 0, 0)">
        <span>tela</span>
      </ArchbaseDeviceFrame>,
      { wrapper: Wrapper },
    );

    // O original montava `fill-${frameColor}` como classe do Tailwind, que o
    // compilador nao enxerga: a prop nao surtia efeito em producao.
    const moldura = screen.getByText('tela').closest('[style*="background"]')?.parentElement;
    expect(container.innerHTML).toContain('rgb(255, 0, 0)');
    expect(moldura).not.toBeNull();
  });

  it('muda de proporcao conforme a variante', () => {
    const { container: telefone } = render(
      <ArchbaseDeviceFrame variant="phone" width={100} />, { wrapper: Wrapper },
    );
    const alturaTelefone = (telefone.querySelector('[style*="height"]') as HTMLElement).style.height;

    const { container: tablet } = render(
      <ArchbaseDeviceFrame variant="tablet" width={100} />, { wrapper: Wrapper },
    );
    const alturaTablet = (tablet.querySelector('[style*="height"]') as HTMLElement).style.height;

    expect(alturaTelefone).not.toBe(alturaTablet);
  });

  it('a moldura e decorativa por padrao', () => {
    render(<ArchbaseDeviceFrame><span>conteudo</span></ArchbaseDeviceFrame>, { wrapper: Wrapper });
    expect(screen.queryByRole('figure')).toBeNull();
  });

  it('vira figura descritivel quando recebe rotulo', () => {
    render(
      <ArchbaseDeviceFrame aria-label="Aplicativo no celular">
        <span>conteudo</span>
      </ArchbaseDeviceFrame>,
      { wrapper: Wrapper },
    );
    expect(screen.getByRole('figure', { name: 'Aplicativo no celular' })).toBeDefined();
  });

  it('recorte e botoes ficam fora da arvore de acessibilidade', () => {
    const { container } = render(
      <ArchbaseDeviceFrame variant="phone"><span>x</span></ArchbaseDeviceFrame>,
      { wrapper: Wrapper },
    );
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });
});
