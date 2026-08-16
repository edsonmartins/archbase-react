import { type CSSProperties, type ReactNode } from 'react';
import { useMantineColorScheme } from '@mantine/core';

export type ArchbaseDeviceVariant = 'phone' | 'tablet' | 'desktop';

export interface ArchbaseDeviceFrameProps {
  /** Conteudo exibido na tela. Aceita imagem, video ou aplicacao viva. */
  children?: ReactNode;
  variant?: ArchbaseDeviceVariant;
  /** Largura da moldura em pixels. A altura segue a proporcao do aparelho. */
  width?: number;
  /** Cor do corpo. Ausente, acompanha o esquema de cor. */
  frameColor?: string;
  /** Recorte superior (a "ilha"), so em telefone. */
  showNotch?: boolean;
  /** Botoes laterais desenhados no corpo. */
  showButtons?: boolean;
  shadow?: boolean;
  /** Descricao para leitores de tela. A moldura em si e decorativa. */
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
}

interface Perfil {
  /** Altura dividida pela largura. */
  proporcao: number;
  /** Espessura do corpo em torno da tela, em pixels. */
  moldura: number;
  /** Arredondamento externo. */
  raio: number;
  notch: boolean;
}

const PERFIS: Record<ArchbaseDeviceVariant, Perfil> = {
  phone: { proporcao: 2.16, moldura: 12, raio: 44, notch: true },
  tablet: { proporcao: 1.4, moldura: 16, raio: 28, notch: false },
  desktop: { proporcao: 0.62, moldura: 14, raio: 12, notch: false },
};

/**
 * Moldura de aparelho para apresentar uma tela.
 *
 * Inspirado no `iphone16-pro` de Lightswind UI (MIT, Muhilan /
 * codewithMUHILAN). Tres diferencas deliberadas:
 *
 * - **Nome generico.** Componente de biblioteca batizado de um modelo especifico
 *   envelhece junto com o modelo; `variant` cobre telefone, tablet e monitor.
 * - **HTML e CSS, nao SVG.** O original recortava a tela com `clipPath` e so
 *   aceitava `src` de imagem ou video. Aqui a tela e um elemento comum, entao
 *   cabe qualquer conteudo — inclusive a aplicacao rodando de verdade, que e o
 *   uso mais interessante numa demonstracao.
 * - **Cores por prop, nao por classe montada em runtime.** O original fazia
 *   `className={`fill-${frameColor}`}`; o compilador do Tailwind nao enxerga
 *   classe formada em execucao, entao aquelas regras nunca chegavam ao CSS e a
 *   prop de cor nao surtia efeito em build de producao.
 *
 * O `clipPath` do original tambem usava `id="screen"` fixo — duas molduras na
 * mesma pagina colidiam. Sem SVG, o problema deixa de existir.
 */
export function ArchbaseDeviceFrame({
  children,
  variant = 'phone',
  width = 320,
  frameColor,
  showNotch,
  showButtons = true,
  shadow = true,
  'aria-label': ariaLabel,
  className,
  style,
}: ArchbaseDeviceFrameProps) {
  const { colorScheme } = useMantineColorScheme();
  const perfil = PERFIS[variant];

  const altura = Math.round(width * perfil.proporcao);
  const corDoCorpo =
    frameColor ?? (colorScheme === 'dark' ? 'var(--mantine-color-dark-4)' : '#1f2937');
  const exibirNotch = showNotch ?? perfil.notch;

  return (
    <div
      className={className}
      // A moldura e decoracao; quem carrega significado e o conteudo. Com
      // rotulo, vira uma figura descritivel.
      role={ariaLabel ? 'figure' : undefined}
      aria-label={ariaLabel}
      style={{
        position: 'relative',
        width,
        height: altura,
        borderRadius: perfil.raio,
        background: corDoCorpo,
        padding: perfil.moldura,
        boxShadow: shadow ? 'var(--mantine-shadow-xl)' : undefined,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: Math.max(4, perfil.raio - perfil.moldura),
          overflow: 'hidden',
          background: 'var(--mantine-color-body)',
        }}
      >
        {children}

        {exibirNotch && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: Math.round(width * 0.3),
              height: Math.round(width * 0.085),
              borderRadius: 999,
              background: corDoCorpo,
              zIndex: 2,
            }}
          />
        )}
      </div>

      {showButtons && variant !== 'desktop' && (
        <>
          <div aria-hidden style={botaoLateral(corDoCorpo, altura * 0.14, altura * 0.22, 'left')} />
          <div aria-hidden style={botaoLateral(corDoCorpo, altura * 0.09, altura * 0.38, 'left')} />
          <div aria-hidden style={botaoLateral(corDoCorpo, altura * 0.13, altura * 0.3, 'right')} />
        </>
      )}

      {variant === 'desktop' && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: -14,
            left: '50%',
            transform: 'translateX(-50%)',
            width: width * 0.28,
            height: 14,
            borderRadius: '0 0 6px 6px',
            background: corDoCorpo,
          }}
        />
      )}
    </div>
  );
}

function botaoLateral(
  cor: string,
  comprimento: number,
  deslocamento: number,
  lado: 'left' | 'right',
): CSSProperties {
  return {
    position: 'absolute',
    [lado]: -3,
    top: deslocamento,
    width: 3,
    height: comprimento,
    borderRadius: 2,
    background: cor,
  };
}
