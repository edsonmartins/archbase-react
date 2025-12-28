import React, { ReactNode, useState, useEffect } from 'react';
import { OnboardingTour as MantineOnboardingTour } from '@gfazioli/mantine-onboarding-tour';
import type { OnboardingTourStep } from '@gfazioli/mantine-onboarding-tour';

export interface ArchbaseOnboardingTourStep {
  /**
   * ID único do step
   */
  id: string;
  /**
   * Seletor CSS do elemento a ser destacado
   */
  target?: string;
  /**
   * Título do step
   */
  title?: ReactNode;
  /**
   * Conteúdo/descrição do step
   */
  content?: ReactNode;
}

export interface ArchbaseOnboardingTourProps {
  /**
   * Array de steps do tour
   */
  steps: ArchbaseOnboardingTourStep[];
  /**
   * Callback quando o tour é iniciado
   */
  onStart?: () => void;
  /**
   * Callback quando o tour é finalizado
   */
  onEnd?: () => void;
  /**
   * Callback quando o step muda
   */
  onChange?: (step: OnboardingTourStep) => void;
  /**
   * Iniciar o tour automaticamente ao montar o componente
   * @default false
   */
  autoStart?: boolean;
  /**
   * Se o tour deve ser repetido (loop)
   */
  loop?: boolean;
  /**
   * Conteúdo da aplicação (children é obrigatório no componente base)
   */
  children: ReactNode;
}

/**
 * Componente ArchbaseOnboardingTour
 *
 * Wrapper sobre @gfazioli/mantine-onboarding-tour para criar tours interativos
 * de onboarding em aplicações React. Ideal para introduzir novos usuários às
 * funcionalidades do sistema.
 *
 * @example
 * ```tsx
 * function App() {
 *   const tourSteps: ArchbaseOnboardingTourStep[] = [
 *     {
 *       id: 'welcome',
 *       target: '#dashboard',
 *       title: 'Bem-vindo ao Dashboard',
 *       content: 'Aqui você pode ver todas as suas métricas.',
 *     },
 *     {
 *       id: 'settings',
 *       target: '#settings',
 *       title: 'Configurações',
 *       content: 'Ajuste suas preferências aqui.',
 *     },
 *   ];
 *
 *   return (
 *     <ArchbaseOnboardingTour
 *       steps={tourSteps}
 *       autoStart={true}
 *       onEnd={() => console.log('Tour finalizado!')}
 *     >
 *       <YourAppContent />
 *     </ArchbaseOnboardingTour>
 *   );
 * }
 * ```
 */
export function ArchbaseOnboardingTour({
  steps,
  onStart,
  onEnd,
  onChange,
  autoStart = false,
  loop = false,
  children,
}: ArchbaseOnboardingTourProps) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (autoStart) {
      setStarted(true);
    }
  }, [autoStart]);

  // Converter steps para o formato esperado pelo mantine-onboarding-tour
  const tourSteps: OnboardingTourStep[] = steps.map((step) => ({
    id: step.id,
    title: step.title,
    content: step.content,
  }));

  return (
    <MantineOnboardingTour
      tour={tourSteps}
      started={started}
      onOnboardingTourStart={onStart}
      onOnboardingTourEnd={onEnd}
      onOnboardingTourChange={onChange}
      loop={loop}
    >
      {children}
    </MantineOnboardingTour>
  );
}

/**
 * Hook simplificado para controlar o tour programaticamente
 *
 * Para controle programático completo, use o hook `useOnboardingTour`
 * diretamente de @gfazioli/mantine-onboarding-tour
 */
export function useArchbaseOnboarding() {
  // Hook simplificado - para controle completo, use o hook da biblioteca base
  return {
    start: () => {
      console.warn('Para controle completo do tour, use o hook useOnboardingTour de @gfazioli/mantine-onboarding-tour');
    },
    stop: () => {
      console.warn('Para controle completo do tour, use o hook useOnboardingTour de @gfazioli/mantine-onboarding-tour');
    },
  };
}
