import { useState } from "react";
import { Alert, Button, Card, Code, CopyButton, Group, SimpleGrid, Stack, Text, TextInput } from "@mantine/core";
import { getI18nextInstance } from "@archbase/core";
import { ArchbaseQRCode } from "@archbase/components";

/** Resultado do início da configuração de MFA (espelha o backend MfaSetup). */
export interface ArchbaseMfaSetupData {
  secret: string;
  provisioningUri: string;
}

export interface ArchbaseMfaSetupProps {
  /** Estado atual do MFA do usuário (vindo de GET /mfa/status). */
  enabled: boolean;
  /** Inicia a configuração: POST /mfa/setup → segredo + URI do QR. */
  onSetup: () => Promise<ArchbaseMfaSetupData>;
  /** Confirma o primeiro código: POST /mfa/enable → códigos de recuperação. */
  onEnable: (code: string) => Promise<string[]>;
  /** Desativa o MFA: POST /mfa/disable. */
  onDisable: () => Promise<void>;
  /** Notifica o app quando o estado de habilitação muda. */
  onStatusChange?: (enabled: boolean) => void;
}

type Phase = "idle" | "setup" | "recovery";

const t = (key: string, fallback: string) => getI18nextInstance().t(key, fallback);

/**
 * ArchbaseMfaSetup — configuração genérica do segundo fator (TOTP) do usuário autenticado.
 * Presentational: recebe callbacks para os endpoints {@code /mfa/setup|enable|disable}. Fluxo:
 * ativar → ler o QR / segredo no app autenticador → confirmar o código → guardar os códigos
 * de recuperação. Também permite desativar quando já ativo.
 */
export function ArchbaseMfaSetup({
  enabled,
  onSetup,
  onEnable,
  onDisable,
  onStatusChange,
}: ArchbaseMfaSetupProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [setupData, setSetupData] = useState<ArchbaseMfaSetupData | null>(null);
  const [code, setCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const iniciar = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await onSetup();
      setSetupData(data);
      setCode("");
      setPhase("setup");
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const confirmar = async () => {
    const codigo = code.trim();
    if (!codigo) return;
    setLoading(true);
    setError(null);
    try {
      const codes = await onEnable(codigo);
      setRecoveryCodes(codes);
      setPhase("recovery");
      onStatusChange?.(true);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const desativar = async () => {
    setLoading(true);
    setError(null);
    try {
      await onDisable();
      setSetupData(null);
      setRecoveryCodes([]);
      setPhase("idle");
      onStatusChange?.(false);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const concluir = () => {
    setRecoveryCodes([]);
    setSetupData(null);
    setCode("");
    setPhase("idle");
  };

  return (
    <Card withBorder radius="md" p="lg">
      <Stack gap="md">
        <div>
          <Text fw={700} fz="lg">
            {t("archbase:mfa.setup.title", "Autenticação em duas etapas (MFA)")}
          </Text>
          <Text c="dimmed" fz="sm">
            {t("archbase:mfa.setup.subtitle",
              "Proteja o acesso exigindo um código do seu aplicativo autenticador no login.")}
          </Text>
        </div>

        {error && <Alert color="red">{error}</Alert>}

        {/* Já ativo — permite desativar */}
        {enabled && phase === "idle" && (
          <Group justify="space-between">
            <Text c="teal" fw={600}>{t("archbase:mfa.setup.active", "MFA ativo")}</Text>
            <Button color="red" variant="light" loading={loading} onClick={desativar}>
              {t("archbase:mfa.setup.disable", "Desativar")}
            </Button>
          </Group>
        )}

        {/* Inativo — inicia a configuração */}
        {!enabled && phase === "idle" && (
          <Button loading={loading} onClick={iniciar}>
            {t("archbase:mfa.setup.enable", "Ativar MFA")}
          </Button>
        )}

        {/* Configuração — QR + segredo + confirmação do código */}
        {phase === "setup" && setupData && (
          <Stack gap="sm" align="center">
            <Text fz="sm" ta="center">
              {t("archbase:mfa.setup.scan",
                "Escaneie o QR Code no seu app autenticador (Google Authenticator, Authy…):")}
            </Text>
            <ArchbaseQRCode value={setupData.provisioningUri} size={180} level="M" />
            <Text fz="xs" c="dimmed" ta="center">
              {t("archbase:mfa.setup.manual", "Ou informe o código manualmente:")}
            </Text>
            <Group gap="xs">
              <Code>{setupData.secret}</Code>
              <CopyButton value={setupData.secret}>
                {({ copied, copy }) => (
                  <Button size="xs" variant="subtle" onClick={copy}>
                    {copied ? t("archbase:mfa.setup.copied", "Copiado") : t("archbase:mfa.setup.copy", "Copiar")}
                  </Button>
                )}
              </CopyButton>
            </Group>
            <TextInput
              w="100%"
              label={t("archbase:mfa.setup.confirmCode", "Digite o código gerado para confirmar")}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmar();
              }}
            />
            <Group w="100%" justify="flex-end">
              <Button variant="default" onClick={concluir} disabled={loading}>
                {t("archbase:mfa.setup.cancel", "Cancelar")}
              </Button>
              <Button onClick={confirmar} loading={loading} disabled={!code.trim()}>
                {t("archbase:mfa.setup.confirm", "Confirmar e ativar")}
              </Button>
            </Group>
          </Stack>
        )}

        {/* Códigos de recuperação — exibidos uma única vez */}
        {phase === "recovery" && (
          <Stack gap="sm">
            <Alert color="yellow">
              {t("archbase:mfa.setup.recoveryWarning",
                "Guarde estes códigos de recuperação em local seguro. Cada um funciona uma única vez e " +
                "permite entrar se você perder o acesso ao app autenticador. Eles não serão exibidos novamente.")}
            </Alert>
            <SimpleGrid cols={2} spacing="xs">
              {recoveryCodes.map((rc) => (
                <Code key={rc} fz="sm">{rc}</Code>
              ))}
            </SimpleGrid>
            <Group justify="space-between">
              <CopyButton value={recoveryCodes.join("\n")}>
                {({ copied, copy }) => (
                  <Button variant="subtle" onClick={copy}>
                    {copied
                      ? t("archbase:mfa.setup.copied", "Copiado")
                      : t("archbase:mfa.setup.copyAll", "Copiar todos")}
                  </Button>
                )}
              </CopyButton>
              <Button onClick={concluir}>
                {t("archbase:mfa.setup.done", "Guardei os códigos")}
              </Button>
            </Group>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
