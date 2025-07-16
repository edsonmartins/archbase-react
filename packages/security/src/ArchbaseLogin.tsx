import { ReactNode, useState } from "react";
import { Anchor, Button, Card, Checkbox, Divider, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import { useFocusTrap } from "@mantine/hooks";
import { getI18nextInstance, useArchbasePasswordRemember, useArchbaseTranslation } from "@archbase/core";

export interface ArchbaseLoginProps {
  onLogin: (username: string, password: string, rememberMe: boolean) => Promise<void>
  error?: string
  onClickForgotPassword?: () => void
  loginLabel?: string
  loginPlaceholder?: string
  afterInputs?: ReactNode
}

export function ArchbaseLogin({
  onLogin,
  error,
  onClickForgotPassword,
  loginLabel = "Email",
  loginPlaceholder,
  afterInputs,
}: ArchbaseLoginProps) {
  const { t } = useArchbaseTranslation();
  const focusTrapRef = useFocusTrap();
  
  const {
    username,
    password,
    rememberMe: remember,
  } = useArchbasePasswordRemember();
  const [usernameInput, setUsernameInput] = useState<string | null>(username);
  const [passwordInput, setPasswordInput] = useState<string | null>(password);
  const [rememberMe, setRememberMe] = useState<boolean>(remember);
  const [showError, setShowError] = useState<boolean>(!!error);

  const handleInputChange = () => {
    setShowError(false);
  };

  const handleLogin = () => {
    if (usernameInput && passwordInput) {
      onLogin(usernameInput, passwordInput, rememberMe).finally(() => setShowError(true));
    }
  };

  return (
    <Card
      withBorder
      shadow="md"
      p={30}
      mt={30}
      radius="md"
      w={400}
      pos="relative"
      ref={focusTrapRef}
    >
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
      <TextInput
        label={loginLabel}
        placeholder={loginPlaceholder ?? getI18nextInstance().t("archbase:usuario@email.com")}
        value={usernameInput || ""}
        required
        onChange={(event) => {
          setUsernameInput(event.currentTarget.value);
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
            setRememberMe(event.currentTarget.checked);
            handleInputChange();
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
      {afterInputs}
      <Button
        disabled={!passwordInput || !usernameInput}
        fullWidth
        mt="xl"
        onClick={handleLogin}
      >
        {getI18nextInstance().t("archbase:signIn")}
      </Button>
      {showError && error && <Text c="red" mt="sm">{error}</Text>}
    </Card>
  );
}
