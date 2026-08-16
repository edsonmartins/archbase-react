import { useEffect, useState } from 'react';

/*
 * Monitor de quadros.
 *
 * Substitui `requestAnimationFrame` por uma versao que conta chamadas antes de
 * repassar. E o instrumento central deste banco de provas: a afirmacao de que
 * "o laco para de verdade" so vale se der para ver o numero cair a zero quando
 * o efeito sai de tela.
 *
 * Vive apenas no demo. O pacote nao sabe que isto existe.
 */

let instalado = false;
let contador = 0;

function instalar() {
  if (instalado) return;
  instalado = true;

  const original = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (callback: FrameRequestCallback) => {
    contador += 1;
    return original(callback);
  };
}

export interface LeituraDeQuadros {
  /** Quadros pedidos no ultimo segundo. */
  porSegundo: number;
  /** Total acumulado desde que a pagina abriu. */
  total: number;
}

export function useMonitorDeQuadros(): LeituraDeQuadros {
  const [leitura, setLeitura] = useState<LeituraDeQuadros>({ porSegundo: 0, total: 0 });

  useEffect(() => {
    instalar();
    let anterior = contador;

    const intervalo = window.setInterval(() => {
      const agora = contador;
      setLeitura({ porSegundo: agora - anterior, total: agora });
      anterior = agora;
    }, 1000);

    return () => window.clearInterval(intervalo);
  }, []);

  return leitura;
}
