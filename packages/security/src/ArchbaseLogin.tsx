import { ReactNode, useEffect, useState } from "react";
import { Anchor, Button, Card, CardProps, Checkbox, Divider, Group, Loader, PasswordInput, Select, Stack, Text, TextInput, Tooltip } from "@mantine/core";
import { useFocusTrap } from "@mantine/hooks";
import { getI18nextInstance, useArchbasePasswordRemember } from "@archbase/core";
import { IconCopy } from "@tabler/icons-react";

export interface MockUser {
  email: string;
  password: string;
  type: string;
}

export interface ArchbaseLoginOptions {
  customContentBefore?: React.ReactNode;

  afterInputs?: React.ReactNode;

  customContentAfter?: React.ReactNode;

  cardProps?: CardProps
}

export interface ArchbaseLoginProps {
  onLogin: (username: string, password: string, rememberMe: boolean) => Promise<void>
  error?: string
  onClickForgotPassword?: () => void
  loginLabel?: string
  loginPlaceholder?: string
  afterInputs?: ReactNode
  showMockUsersSelector?: boolean
  mockUsers?: MockUser[]
  mockUsersGroupMap?: Record<string, string>
  options?: ArchbaseLoginOptions
  onChangeUsername?: (username: string) => void
  disabledLogin?: boolean
  isCheckingUsername?: boolean
  showSignIn?: boolean
  /** Login em duas etapas (MFA): quando `true`, exibe o painel de código em vez do formulário. */
  mfaRequired?: boolean
  /** Valida o código do segundo fator (TOTP ou de recuperação). */
  onVerifyMfa?: (code: string) => Promise<void>
  /** Mensagem de erro específica da etapa de MFA. */
  mfaError?: string
  /** Volta do painel de MFA para o formulário de login. */
  onCancelMfa?: () => void
  /** Indica verificação em andamento (desabilita o botão). */
  isVerifyingMfa?: boolean
}

export function ArchbaseLogin({
  onLogin,
  error,
  onClickForgotPassword,
  loginLabel = "Email",
  loginPlaceholder,
  afterInputs,
  showMockUsersSelector = false,
  mockUsers = [],
  mockUsersGroupMap,
  options = {},
  onChangeUsername,
  disabledLogin = false,
  isCheckingUsername = false,
  showSignIn = true,
  mfaRequired = false,
  onVerifyMfa,
  mfaError,
  onCancelMfa,
  isVerifyingMfa = false,
}: ArchbaseLoginProps) {
  const focusTrapRef = useFocusTrap();

  const {
    username,
    password,
    rememberMe: remember,
    clearRememberMe
  } = useArchbasePasswordRemember();
  const [usernameInput, setUsernameInput] = useState<string | null>(username);
  const [passwordInput, setPasswordInput] = useState<string | null>(password);
  const [rememberMe, setRememberMe] = useState<boolean>(remember);
  const [showError, setShowError] = useState<boolean>(false);
  const [selectedMockUser, setSelectedMockUser] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState<string>("");

  useEffect(() => {
    setShowError(!!error);
  }, [error]);

  useEffect(() => {
    if (username !== usernameInput) {
      setUsernameInput(username);
      onChangeUsername?.(username)
    }
    if (password !== passwordInput) {
      setPasswordInput(password);
    }
    if (remember !== rememberMe) {
      setRememberMe(remember);
    }
  }, [username, password, remember]);

  const handleInputChange = () => {
    setShowError(false);
  };

  const handleLogin = () => {
    if (usernameInput && passwordInput) {
      onLogin(usernameInput, passwordInput, rememberMe).finally(() => setShowError(true));
    }
  };

  const handleVerifyMfa = () => {
    const code = mfaCode.trim();
    if (code && onVerifyMfa) {
      onVerifyMfa(code);
    }
  };

  const getGroupedMockUsers = () => {
    if (!mockUsersGroupMap) {
      return mockUsers.map(user => ({
        value: user.email,
        label: user.email
      }));
    }

    const grouped = mockUsers.reduce((acc, user) => {
      const group = mockUsersGroupMap[user.type];
      if (!group) {
        return acc;
      }
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push({
        value: user.email,
        label: user.email
      });
      return acc;
    }, {} as Record<string, Array<{ value: string; label: string }>>);

    return Object.entries(grouped).map(([group, items]) => ({
      group,
      items
    }));
  };

  const handleApplyMockUser = () => {
    if (selectedMockUser) {
      const user = mockUsers.find(u => u.email === selectedMockUser);
      if (user) {
        setUsernameInput(user.email);
        setPasswordInput(user.password);
        handleInputChange();
      }
    }
  };

  const cardFinalProps = {
    withBorder: true,
    shadow: "md",
    p: 30,
    mt: 30,
    radius: "md",
    w: 400,
    ...options.cardProps
  }

  return (
    <Card
      {...cardFinalProps}
      pos="relative"
      ref={focusTrapRef}
    >
      {
        showSignIn &&
        <>
          <Text
            c="light-dark(var(--mantine-color-black), var(--mantine-color-white))"
            fw={800}
            fz={{ base: "20px", md: "35px" }}
            style={{ textAlign: "center", letterSpacing: "-1px" }}
            mt="xs"
          >
            {getI18nextInstance().t("archbase:signIn")}
          </Text>
          <Divider m="md" />
        </>
      }
      {options?.customContentBefore}

      {mfaRequired && (
        <Stack gap="md">
          <div>
            <Text fw={700} fz="lg">
              {getI18nextInstance().t("archbase:mfa.title", "Verificação em duas etapas")}
            </Text>
            <Text c="dimmed" fz="sm">
              {getI18nextInstance().t(
                "archbase:mfa.subtitle",
                "Digite o código do seu aplicativo autenticador (ou um código de recuperação).")}
            </Text>
          </div>
          <TextInput
            label={getI18nextInstance().t("archbase:mfa.code", "Código de verificação")}
            placeholder="000000"
            value={mfaCode}
            autoFocus
            onChange={(event) => setMfaCode(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleVerifyMfa();
              }
            }}
          />
          {mfaError && <Text c="red" fz="sm">{mfaError}</Text>}
          <Button
            fullWidth
            disabled={!mfaCode.trim() || isVerifyingMfa}
            loading={isVerifyingMfa}
            onClick={handleVerifyMfa}
          >
            {getI18nextInstance().t("archbase:mfa.verify", "Verificar")}
          </Button>
          {onCancelMfa && (
            <Anchor
              component="button"
              c="var(--mantine-text-color)"
              fz={14}
              ta="center"
              styles={{ root: { cursor: "pointer" } }}
              onClick={onCancelMfa}
            >
              {getI18nextInstance().t("archbase:mfa.back", "Voltar ao login")}
            </Anchor>
          )}
        </Stack>
      )}

      {!mfaRequired && (<>
      {showMockUsersSelector && (
        <>
          <Group gap="sm" mb="md">
            <Select
              placeholder="Selecione um usuário mock"
              data={getGroupedMockUsers()}
              value={selectedMockUser}
              onChange={(value) => setSelectedMockUser(value ?? '')}
              searchable
              clearable
              style={{ flexGrow: 1 }}
            />
            <Tooltip label="Aplicar">
              <Button
                variant="light"
                size="sm"
                onClick={handleApplyMockUser}
                disabled={!selectedMockUser}
                aria-label="Aplicar usuário mock selecionado"
              >
                <IconCopy size={16} />
              </Button>
            </Tooltip>
          </Group>
          <Divider mb="md" />
        </>
      )}
      <TextInput
        label={loginLabel}
        placeholder={loginPlaceholder ?? getI18nextInstance().t("archbase:usuario@email.com")}
        rightSection={isCheckingUsername ? <Loader size="xs" /> : null}
        value={usernameInput || ""}
        required
        onChange={(event) => {
          setUsernameInput(event.currentTarget.value);
          onChangeUsername?.(event.currentTarget.value)
          handleInputChange();
        }}
      />
      <PasswordInput
        label={getI18nextInstance().t("archbase:Password")}
        placeholder={getI18nextInstance().t("archbase:Sua senha")}
        onChange={(event) => {
          setPasswordInput(event.currentTarget.value);
          handleInputChange();
        }}
        value={passwordInput || ""}
        required
        mt="md"
      />
      <Group justify="space-between" mt="md">
        <Checkbox
          label={getI18nextInstance().t("archbase:Lembre-me")}
          checked={rememberMe}
          onChange={(event) => {
            const checked = event.currentTarget.checked;
            setRememberMe(checked);
            if (!checked) {
              clearRememberMe();
            }
          }}
        />
        {onClickForgotPassword && (
          <Anchor
            component="button"
            c="var(--mantine-text-color)"
            fz={14}
            lh="20px"
            styles={{ root: { cursor: "pointer" } }}
            onClick={onClickForgotPassword}
          >
            {getI18nextInstance().t("archbase:Esqueci minha senha")}
          </Anchor>
        )}
      </Group>
      {options?.afterInputs || afterInputs}
      <Button
        disabled={!passwordInput || !usernameInput || disabledLogin}
        fullWidth
        mt="xl"
        onClick={handleLogin}
      >
        {getI18nextInstance().t("archbase:signIn")}
      </Button>
      </>)}
      {options?.customContentAfter}
      {showError && error && <Text c="red" mt="sm">{error}</Text>}
    </Card>
  );
}
