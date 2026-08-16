import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ArchbaseAsciiWave } from '../src/backgrounds/ArchbaseAsciiWave';
import { ArchbaseNeuralLink } from '../src/backgrounds/ArchbaseNeuralLink';
import { ArchbaseWaveBackground } from '../src/backgrounds/ArchbaseWaveBackground';
import { ArchbaseNebulaFlow } from '../src/backgrounds/ArchbaseNebulaFlow';
import { ResizeObserverMock, definirMovimentoReduzido } from './setup';

beforeEach(() => {
  definirMovimentoReduzido(false);
  ResizeObserverMock.instancias.length = 0;
});

describe('efeitos em shader', () => {
  // O setup devolve null para contexto webgl, entao este e o caminho de
  // navegador sem aceleracao — que precisa degradar, nao quebrar.
  it('a onda mostra o fallback sem WebGL', async () => {
    render(<ArchbaseWaveBackground fallback={<span>sem aceleracao</span>} />);
    await waitFor(() => expect(ResizeObserverMock.instancias.length).toBeGreaterThan(0));

    expect(screen.getByText('sem aceleracao')).toBeDefined();
  });

  it('a nebula mostra o fallback sem WebGL', async () => {
    render(<ArchbaseNebulaFlow fallback={<span>sem aceleracao</span>} />);
    await waitFor(() => expect(ResizeObserverMock.instancias.length).toBeGreaterThan(0));

    expect(screen.getByText('sem aceleracao')).toBeDefined();
  });

  it('nenhum dos dois quebra a montagem sem WebGL', () => {
    expect(() => render(<ArchbaseWaveBackground />)).not.toThrow();
    expect(() => render(<ArchbaseNebulaFlow />)).not.toThrow();
  });

  it('mantem o conteudo sobreposto visivel mesmo sem aceleracao', async () => {
    render(
      <ArchbaseWaveBackground fallback={<span>degradado</span>}>
        <h2>Titulo sobre a onda</h2>
      </ArchbaseWaveBackground>,
    );
    await waitFor(() => expect(ResizeObserverMock.instancias.length).toBeGreaterThan(0));

    // O fallback nao pode engolir o conteudo do hospedeiro.
    expect(screen.getByText('Titulo sobre a onda')).toBeDefined();
  });
});

describe('ArchbaseAsciiWave', () => {
  it('monta e esconde o canvas de leitores de tela', () => {
    render(<ArchbaseAsciiWave />);
    expect(document.querySelector('canvas')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('nao depende de framework de tema para montar', () => {
    // O original importava `useTheme` de next-themes; fora do Next isso
    // derrubava o componente.
    expect(() => render(<ArchbaseAsciiWave color="#00ff88" />)).not.toThrow();
  });
});

describe('ArchbaseNeuralLink', () => {
  it('renderiza conteudo sobreposto', () => {
    render(
      <ArchbaseNeuralLink>
        <span>malha</span>
      </ArchbaseNeuralLink>,
    );
    expect(screen.getByText('malha')).toBeDefined();
  });

  it('aceita contagem de nos absurda sem quebrar', () => {
    // A deteccao de vizinhanca e O(n²); ha teto interno para que um numero
    // distraido na prop nao derrube a taxa de quadros.
    expect(() => render(<ArchbaseNeuralLink nodeCount={100000} />)).not.toThrow();
  });

  it('aceita contagem minima sem quebrar', () => {
    expect(() => render(<ArchbaseNeuralLink nodeCount={0} />)).not.toThrow();
  });
});
