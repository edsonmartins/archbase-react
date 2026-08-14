import { Alert, Center, Loader, Stack, Text } from '@mantine/core';
import {
  interpolate,
  type AnalyticsError,
  type AnalyticsStrings,
  type ReconcileResult,
} from '@archbase/analytics-core';

export function LoadingState({ strings }: { strings: AnalyticsStrings }) {
  return (
    <Center p="xl">
      <Stack align="center" gap="xs">
        <Loader size="sm" />
        <Text size="sm" c="dimmed">
          {strings.loading}
        </Text>
      </Stack>
    </Center>
  );
}

export function EmptyState({ strings }: { strings: AnalyticsStrings }) {
  return (
    <Center p="xl">
      <Text size="sm" c="dimmed">
        {strings.emptyExploration}
      </Text>
    </Center>
  );
}

export function NoResultsState({ strings }: { strings: AnalyticsStrings }) {
  return (
    <Center p="xl">
      <Text size="sm" c="dimmed">
        {strings.noResults}
      </Text>
    </Center>
  );
}

export function TruncatedNotice({ strings }: { strings: AnalyticsStrings }) {
  return (
    <Alert color="yellow" variant="light" title={undefined}>
      <Text size="sm">{strings.truncatedWarning}</Text>
    </Alert>
  );
}

/**
 * Mensagem de falha derivada exclusivamente do codigo.
 *
 * A mensagem textual do servidor nunca e interpretada nem exibida ao usuario:
 * o conjunto de codigos e fechado justamente para que a interface possa reagir
 * sem ler texto livre.
 */
export function ErrorState({
  error,
  strings,
}: {
  error: AnalyticsError;
  strings: AnalyticsStrings;
}) {
  const mensagem = {
    QUERY_TIMEOUT: strings.timeoutError,
    CONCURRENCY_LIMIT: strings.concurrencyError,
    FORBIDDEN_MEMBER: strings.forbiddenMemberError,
    UPSTREAM_ERROR: strings.upstreamError,
    NETWORK: strings.networkError,
  }[error.code];

  return (
    <Alert color="red" variant="light">
      <Text size="sm">{mensagem}</Text>
    </Alert>
  );
}

/**
 * Aviso de degradacao: quantitativo, nunca nominal.
 *
 * Identificar os membros removidos revelaria a existencia de dados restritos ao
 * leitor — vazamento de metadado. Por isso o componente recebe a contagem e nao
 * tem como exibir nomes mesmo que quisesse.
 */
export function DegradedNotice({
  reconciliation,
  strings,
}: {
  reconciliation: ReconcileResult;
  strings: AnalyticsStrings;
}) {
  if (!reconciliation.degraded) return null;

  if (reconciliation.allRemoved) {
    return (
      <Alert color="gray" variant="light">
        <Text size="sm">{strings.degradedAllMembers}</Text>
      </Alert>
    );
  }

  const texto =
    reconciliation.removedCount === 1
      ? strings.degradedOneMember
      : interpolate(strings.degradedManyMembers, { count: reconciliation.removedCount });

  return (
    <Alert color="yellow" variant="light">
      <Text size="sm">{texto}</Text>
    </Alert>
  );
}
