import { ReactNode, useState } from "react";
import { Anchor, Button, Card, Checkbox, Divider, Group, PasswordInput, Select, Text, TextInput, Tooltip } from "@mantine/core";
import { useFocusTrap } from "@mantine/hooks";
import { getI18nextInstance, useArchbasePasswordRemember, useArchbaseTranslation } from "@archbase/core";
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
  options = {}
}: ArchbaseLoginProps) {
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
  const [selectedMockUser, setSelectedMockUser] = useState<string | null>(null);

  const handleInputChange = () => {
    setShowError(false);
  };

  const handleLogin = () => {
    if (usernameInput && passwordInput) {
      onLogin(usernameInput, passwordInput, rememberMe).finally(() => setShowError(true));
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
      
      {options?.customContentBefore}

      {showMockUsersSelector && (
        <>
          <Group gap="sm" mb="md">
            <Select
              placeholder="Selecione um usuário mock"
              data={getGroupedMockUsers()}
              value={selectedMockUser}
              onChange={setSelectedMockUser}
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
      {options?.afterInputs || afterInputs}
      <Button
        disabled={!passwordInput || !usernameInput}
        fullWidth
        mt="xl"
        onClick={handleLogin}
      >
        {getI18nextInstance().t("archbase:signIn")}
      </Button>
      {options?.customContentAfter}
      {showError && error && <Text c="red" mt="sm">{error}</Text>}
    </Card>
  );
}
