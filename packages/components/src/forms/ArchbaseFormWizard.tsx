import React, { forwardRef, ReactNode, useCallback, useMemo } from 'react';
import {
  Stepper,
  Button,
  Group,
  Stack,
  Paper,
  MantineColor,
  MantineSize,
  Box,
  Alert,
  Loader,
} from '@mantine/core';
import { IconAlertCircle, IconCheck, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { ArchbaseDataSource } from '@archbase/data';
import { getI18nextInstance } from '@archbase/core';
import { useArchbaseFormWizard, FormWizardStep } from './useArchbaseFormWizard';

export interface ArchbaseFormWizardStep<T = any> extends FormWizardStep<T> {
  /** Componente React a ser renderizado no step */
  component: ReactNode | ((props: { data: T; stepIndex: number }) => ReactNode);
}

export interface ArchbaseFormWizardProps<T extends object, ID = string> {
  /** Lista de steps do wizard */
  steps: ArchbaseFormWizardStep<T>[];
  /** DataSource vinculado ao formulário */
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Step inicial */
  initialStep?: number;
  /** Callback ao completar todos os steps */
  onComplete?: (data: T) => void | Promise<void>;
  /** Callback ao mudar de step */
  onStepChange?: (fromStep: number, toStep: number, data: T) => void;
  /** Se deve validar ao avançar */
  validateOnNext?: boolean;
  /** Se permite voltar para steps anteriores */
  allowBack?: boolean;
  /** Se permite clicar nos steps para navegar */
  allowStepClick?: boolean;
  /** Orientação do stepper */
  orientation?: 'horizontal' | 'vertical';
  /** Tamanho do stepper */
  size?: MantineSize;
  /** Cor do stepper */
  color?: MantineColor;
  /** Label do botão anterior */
  backLabel?: string;
  /** Label do botão próximo */
  nextLabel?: string;
  /** Label do botão finalizar */
  completeLabel?: string;
  /** Ícone do botão anterior */
  backIcon?: ReactNode;
  /** Ícone do botão próximo */
  nextIcon?: ReactNode;
  /** Ícone do botão finalizar */
  completeIcon?: ReactNode;
  /** Se deve mostrar os botões de navegação */
  showNavigation?: boolean;
  /** Posição dos botões de navegação */
  navigationPosition?: 'top' | 'bottom' | 'both';
  /** Componente de revisão final (opcional) */
  reviewComponent?: ReactNode | ((props: { data: T }) => ReactNode);
  /** Componente de conclusão */
  completedComponent?: ReactNode | ((props: { data: T; onReset: () => void }) => ReactNode);
  /** Se deve mostrar o step de revisão */
  showReviewStep?: boolean;
  /** Padding do conteúdo */
  contentPadding?: number | string;
  /** Altura mínima do conteúdo */
  contentMinHeight?: number | string;
  /** Classe CSS adicional */
  className?: string;
  /** Estilos adicionais */
  style?: React.CSSProperties;
}

export const ArchbaseFormWizard = forwardRef<HTMLDivElement, ArchbaseFormWizardProps<any, any>>(
  <T extends object, ID = string>(
    {
      steps,
      dataSource,
      initialStep = 0,
      onComplete,
      onStepChange,
      validateOnNext = true,
      allowBack = true,
      allowStepClick = false,
      orientation = 'horizontal',
      size = 'md',
      color,
      backLabel,
      nextLabel,
      completeLabel,
      backIcon = <IconChevronLeft size={16} />,
      nextIcon = <IconChevronRight size={16} />,
      completeIcon = <IconCheck size={16} />,
      showNavigation = true,
      navigationPosition = 'bottom',
      reviewComponent,
      completedComponent,
      showReviewStep = false,
      contentPadding = 'md',
      contentMinHeight = 300,
      className,
      style,
    }: ArchbaseFormWizardProps<T, ID>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const t = getI18nextInstance().t;

    const wizardSteps = useMemo(() => {
      const baseSteps = [...steps];
      if (showReviewStep && reviewComponent) {
        baseSteps.push({
          id: '__review__',
          title: t('archbase:Revisão'),
          description: t('archbase:Revise suas informações'),
          component: reviewComponent,
        });
      }
      return baseSteps;
    }, [steps, showReviewStep, reviewComponent, t]);

    const wizard = useArchbaseFormWizard<T, ID>({
      steps: wizardSteps,
      dataSource,
      initialStep,
      onComplete,
      onStepChange,
      validateOnNext,
      allowBack,
    });

    const getData = useCallback((): T => {
      if (dataSource) {
        return dataSource.getCurrentRecord() as T;
      }
      return {} as T;
    }, [dataSource]);

    const handleStepClick = useCallback(
      async (stepIndex: number) => {
        if (!allowStepClick) return;
        await wizard.goToStep(stepIndex);
      },
      [allowStepClick, wizard]
    );

    const renderStepContent = useCallback(
      (step: ArchbaseFormWizardStep<T>, index: number) => {
        if (typeof step.component === 'function') {
          return step.component({ data: getData(), stepIndex: index });
        }
        return step.component;
      },
      [getData]
    );

    const renderNavigation = useCallback(() => {
      if (!showNavigation) return null;

      return (
        <Group justify="space-between" mt="xl">
          <Button
            variant="default"
            onClick={wizard.prevStep}
            disabled={!wizard.canGoBack}
            leftSection={backIcon}
          >
            {backLabel || t('archbase:Anterior')}
          </Button>

          {wizard.isLastStep ? (
            <Button
              onClick={wizard.complete}
              loading={wizard.isValidating}
              rightSection={completeIcon}
              color={color}
            >
              {completeLabel || t('archbase:Finalizar')}
            </Button>
          ) : (
            <Button
              onClick={wizard.nextStep}
              loading={wizard.isValidating}
              rightSection={nextIcon}
              color={color}
            >
              {nextLabel || t('archbase:Próximo')}
            </Button>
          )}
        </Group>
      );
    }, [
      backIcon,
      backLabel,
      color,
      completeIcon,
      completeLabel,
      nextIcon,
      nextLabel,
      showNavigation,
      t,
      wizard,
    ]);

    const renderCompleted = useCallback(() => {
      if (completedComponent) {
        if (typeof completedComponent === 'function') {
          return completedComponent({ data: getData(), onReset: wizard.reset });
        }
        return completedComponent;
      }

      return (
        <Stack align="center" gap="md" py="xl">
          <IconCheck size={64} color="var(--mantine-color-green-6)" />
          <Box ta="center">
            <h3>{t('archbase:Concluído!')}</h3>
            <p>{t('archbase:Todos os passos foram completados com sucesso.')}</p>
          </Box>
          <Button variant="light" onClick={wizard.reset}>
            {t('archbase:Recomeçar')}
          </Button>
        </Stack>
      );
    }, [completedComponent, getData, t, wizard.reset]);

    if (wizard.isCompleted) {
      return (
        <Paper ref={ref} p={contentPadding} className={className} style={style}>
          {renderCompleted()}
        </Paper>
      );
    }

    return (
      <Stack ref={ref} className={className} style={style} gap="md">
        {navigationPosition === 'top' && renderNavigation()}

        <Stepper
          active={wizard.currentStep}
          onStepClick={allowStepClick ? handleStepClick : undefined}
          orientation={orientation}
          size={size}
          color={color}
        >
          {wizardSteps.map((step, index) => (
            <Stepper.Step
              key={step.id || index}
              label={step.title}
              description={step.description}
              icon={step.icon}
              allowStepSelect={allowStepClick && wizard.isStepCompleted(index)}
              completedIcon={wizard.isStepCompleted(index) ? <IconCheck size={16} /> : undefined}
            >
              <Box mih={contentMinHeight} py={contentPadding}>
                {wizard.validationError && (
                  <Alert
                    icon={<IconAlertCircle size={16} />}
                    title={t('archbase:Erro de validação')}
                    color="red"
                    mb="md"
                  >
                    {wizard.validationError}
                  </Alert>
                )}
                {renderStepContent(step, index)}
              </Box>
            </Stepper.Step>
          ))}
        </Stepper>

        {(navigationPosition === 'bottom' || navigationPosition === 'both') && renderNavigation()}
      </Stack>
    );
  }
) as <T extends object, ID = string>(
  props: ArchbaseFormWizardProps<T, ID> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement;

(ArchbaseFormWizard as any).displayName = 'ArchbaseFormWizard';
