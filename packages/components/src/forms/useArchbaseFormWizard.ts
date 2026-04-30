import { useState, useCallback, useMemo } from 'react';
import { ArchbaseDataSource } from '@archbase/data';

export interface FormWizardStep<T = any> {
  /** Identificador único do step */
  id: string;
  /** Título do step */
  title: string;
  /** Descrição do step */
  description?: string;
  /** Ícone do step */
  icon?: React.ReactNode;
  /** Função de validação do step - retorna true se válido, string com erro se inválido */
  validate?: (data: T) => boolean | string | Promise<boolean | string>;
  /** Se o step é opcional */
  optional?: boolean;
  /** Campos do DataSource que pertencem a este step (para validação parcial) */
  fields?: string[];
}

export interface UseArchbaseFormWizardOptions<T extends object, ID> {
  /** Lista de steps do wizard */
  steps: FormWizardStep<T>[];
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
  /** Se permite pular steps opcionais */
  allowSkipOptional?: boolean;
}

export interface UseArchbaseFormWizardReturn<T> {
  /** Step atual (0-indexed) */
  currentStep: number;
  /** Total de steps */
  totalSteps: number;
  /** Se está no primeiro step */
  isFirstStep: boolean;
  /** Se está no último step */
  isLastStep: boolean;
  /** Se o wizard foi completado */
  isCompleted: boolean;
  /** Se está validando */
  isValidating: boolean;
  /** Erro de validação do step atual */
  validationError: string | null;
  /** Dados do step atual */
  currentStepData: FormWizardStep<T>;
  /** Steps completados */
  completedSteps: Set<number>;
  /** Avançar para o próximo step */
  nextStep: () => Promise<boolean>;
  /** Voltar para o step anterior */
  prevStep: () => void;
  /** Ir para um step específico */
  goToStep: (step: number) => Promise<boolean>;
  /** Resetar o wizard */
  reset: () => void;
  /** Completar o wizard */
  complete: () => Promise<boolean>;
  /** Marcar step como completado */
  markStepCompleted: (step: number) => void;
  /** Verificar se um step está completado */
  isStepCompleted: (step: number) => boolean;
  /** Verificar se pode avançar */
  canGoNext: boolean;
  /** Verificar se pode voltar */
  canGoBack: boolean;
}

export function useArchbaseFormWizard<T extends object, ID = string>(
  options: UseArchbaseFormWizardOptions<T, ID>
): UseArchbaseFormWizardReturn<T> {
  const {
    steps,
    dataSource,
    initialStep = 0,
    onComplete,
    onStepChange,
    validateOnNext = true,
    allowBack = true,
    allowSkipOptional = false,
  } = options;

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const currentStepData = steps[currentStep];

  const getData = useCallback((): T => {
    if (dataSource) {
      return dataSource.getCurrentRecord() as T;
    }
    return {} as T;
  }, [dataSource]);

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const step = steps[currentStep];
    if (!step.validate) return true;

    setIsValidating(true);
    setValidationError(null);

    try {
      const result = await step.validate(getData());

      if (result === true) {
        return true;
      } else if (typeof result === 'string') {
        setValidationError(result);
        return false;
      } else {
        return false;
      }
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Erro de validação');
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [currentStep, getData, steps]);

  const markStepCompleted = useCallback((step: number) => {
    setCompletedSteps((prev) => new Set([...prev, step]));
  }, []);

  const isStepCompleted = useCallback(
    (step: number) => completedSteps.has(step),
    [completedSteps]
  );

  const nextStep = useCallback(async (): Promise<boolean> => {
    if (isLastStep) return false;

    if (validateOnNext) {
      const isValid = await validateCurrentStep();
      if (!isValid) return false;
    }

    markStepCompleted(currentStep);
    const nextStepIndex = currentStep + 1;

    onStepChange?.(currentStep, nextStepIndex, getData());
    setCurrentStep(nextStepIndex);
    setValidationError(null);

    return true;
  }, [
    currentStep,
    getData,
    isLastStep,
    markStepCompleted,
    onStepChange,
    validateCurrentStep,
    validateOnNext,
  ]);

  const prevStep = useCallback(() => {
    if (isFirstStep || !allowBack) return;

    const prevStepIndex = currentStep - 1;
    onStepChange?.(currentStep, prevStepIndex, getData());
    setCurrentStep(prevStepIndex);
    setValidationError(null);
  }, [allowBack, currentStep, getData, isFirstStep, onStepChange]);

  const goToStep = useCallback(
    async (step: number): Promise<boolean> => {
      if (step < 0 || step >= totalSteps) return false;
      if (step === currentStep) return true;

      // Se está indo para frente, valida o step atual
      if (step > currentStep && validateOnNext) {
        const isValid = await validateCurrentStep();
        if (!isValid) return false;
        markStepCompleted(currentStep);
      }

      // Verifica se pode ir para o step destino
      // Pode ir para qualquer step já completado ou o próximo não completado
      if (step > currentStep) {
        // Verificar se todos os steps anteriores ao destino estão completos
        for (let i = currentStep; i < step; i++) {
          if (!completedSteps.has(i) && !steps[i].optional) {
            return false;
          }
        }
      }

      onStepChange?.(currentStep, step, getData());
      setCurrentStep(step);
      setValidationError(null);

      return true;
    },
    [
      completedSteps,
      currentStep,
      getData,
      markStepCompleted,
      onStepChange,
      steps,
      totalSteps,
      validateCurrentStep,
      validateOnNext,
    ]
  );

  const complete = useCallback(async (): Promise<boolean> => {
    if (validateOnNext) {
      const isValid = await validateCurrentStep();
      if (!isValid) return false;
    }

    markStepCompleted(currentStep);
    setIsCompleted(true);

    if (onComplete) {
      try {
        await onComplete(getData());
      } catch (error) {
        setValidationError(error instanceof Error ? error.message : 'Erro ao completar');
        return false;
      }
    }

    return true;
  }, [currentStep, getData, markStepCompleted, onComplete, validateCurrentStep, validateOnNext]);

  const reset = useCallback(() => {
    setCurrentStep(initialStep);
    setIsCompleted(false);
    setValidationError(null);
    setCompletedSteps(new Set());
  }, [initialStep]);

  const canGoNext = useMemo(() => {
    if (isLastStep) return false;
    if (isValidating) return false;
    return true;
  }, [isLastStep, isValidating]);

  const canGoBack = useMemo(() => {
    if (isFirstStep) return false;
    if (!allowBack) return false;
    return true;
  }, [allowBack, isFirstStep]);

  return {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    isCompleted,
    isValidating,
    validationError,
    currentStepData,
    completedSteps,
    nextStep,
    prevStep,
    goToStep,
    reset,
    complete,
    markStepCompleted,
    isStepCompleted,
    canGoNext,
    canGoBack,
  };
}
