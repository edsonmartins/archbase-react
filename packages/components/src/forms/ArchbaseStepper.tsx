import React, { forwardRef, ReactNode, useState, useCallback } from 'react';
import {
  Stepper,
  StepperProps,
  StepperStepProps,
  Button,
  Group,
  MantineColor,
  MantineSize,
} from '@mantine/core';
import { getI18nextInstance } from '@archbase/core';

export interface ArchbaseStepperStep {
  /** Identificador único do step */
  id?: string;
  /** Título do step */
  title: string;
  /** Descrição do step */
  description?: string;
  /** Ícone do step */
  icon?: ReactNode;
  /** Cor do step quando ativo */
  color?: MantineColor;
  /** Se o step pode ser clicado para navegar diretamente */
  allowStepSelect?: boolean;
  /** Se o step está desabilitado */
  disabled?: boolean;
  /** Conteúdo do step */
  children?: ReactNode;
  /** Estado de carregamento do step */
  loading?: boolean;
}

export interface ArchbaseStepperProps extends Omit<StepperProps, 'children' | 'active' | 'onStepClick'> {
  /** Lista de steps */
  steps: ArchbaseStepperStep[];
  /** Step ativo (controlado) */
  active?: number;
  /** Step ativo inicial (não controlado) */
  defaultActive?: number;
  /** Callback quando o step muda */
  onStepChange?: (nextStep: number, prevStep: number) => void;
  /** Se permite clicar nos steps para navegar */
  allowStepClick?: boolean;
  /** Orientação do stepper */
  orientation?: 'horizontal' | 'vertical';
  /** Tamanho do stepper */
  size?: MantineSize;
  /** Cor do stepper */
  color?: MantineColor;
  /** Ícone de step completado */
  completedIcon?: ReactNode;
  /** Ícone de step em progresso */
  progressIcon?: ReactNode;
  /** Raio do ícone do step */
  iconSize?: number;
  /** Estilo do conector entre steps */
  contentPadding?: number;
  /** Se deve mostrar a barra de progresso */
  withProgress?: boolean;
}

export const ArchbaseStepper = forwardRef<HTMLDivElement, ArchbaseStepperProps>(
  (
    {
      steps,
      active: controlledActive,
      defaultActive = 0,
      onStepChange,
      allowStepClick = false,
      orientation = 'horizontal',
      size = 'md',
      color,
      completedIcon,
      progressIcon,
      iconSize,
      contentPadding,
      withProgress = false,
      ...rest
    },
    ref
  ) => {
    const [uncontrolledActive, setUncontrolledActive] = useState(defaultActive);
    const active = controlledActive !== undefined ? controlledActive : uncontrolledActive;

    const handleStepClick = useCallback(
      (stepIndex: number) => {
        if (!allowStepClick) return;

        const step = steps[stepIndex];
        if (step?.disabled || step?.allowStepSelect === false) return;

        const prevStep = active;
        if (controlledActive === undefined) {
          setUncontrolledActive(stepIndex);
        }
        onStepChange?.(stepIndex, prevStep);
      },
      [active, allowStepClick, controlledActive, onStepChange, steps]
    );

    return (
      <Stepper
        ref={ref}
        active={active}
        onStepClick={allowStepClick ? handleStepClick : undefined}
        orientation={orientation}
        size={size}
        color={color}
        completedIcon={completedIcon}
        progressIcon={progressIcon}
        iconSize={iconSize}
        contentPadding={contentPadding}
        {...rest}
      >
        {steps.map((step, index) => (
          <Stepper.Step
            key={step.id || index}
            label={step.title}
            description={step.description}
            icon={step.icon}
            color={step.color}
            allowStepSelect={step.allowStepSelect ?? allowStepClick}
            loading={step.loading}
          >
            {step.children}
          </Stepper.Step>
        ))}
        <Stepper.Completed>
          {getI18nextInstance().t('archbase:Todos os passos foram concluídos!')}
        </Stepper.Completed>
      </Stepper>
    );
  }
);

ArchbaseStepper.displayName = 'ArchbaseStepper';
