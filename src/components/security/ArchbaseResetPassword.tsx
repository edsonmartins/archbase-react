import React, { useEffect, useState } from "react";
import { Button, Card, CSSProperties, Divider, PasswordInput, Text, TextInput } from "@mantine/core";
import { useFocusTrap } from "@mantine/hooks";
import { useArchbaseTheme } from "@hooks/index";
import { ArchbaseDialog } from "@components/notification";
import { isEmail } from "@components/validator";
import { t } from "i18next";

export interface ArchbaseResetPasswordProps {
  error?: string
  initialEmail?: string
  description?: string
  onSendResetPasswordEmail: (email: string) => Promise<void>
  onResetPassword: (email: string, passwordResetToken: string, newPassword: string) => Promise<void>
  onClickBackToLogin: () => void
  validatePassword?: () => string
  validateToken?: () => string
  /** Estilo do card */
	style?: CSSProperties;
}

const defaultStyle: CSSProperties = {
  position: "relative",
  width: '90%',
  maxWidth: 400,
  padding: 30,
  marginTop: 30,
};

export function ArchbaseResetPassword({ error, onSendResetPasswordEmail, onResetPassword, onClickBackToLogin, validatePassword, validateToken, initialEmail = "", description, style }: ArchbaseResetPasswordProps) {
  const focusTrapRef = useFocusTrap();
  const theme = useArchbaseTheme();

  const [lastError, setLastError] = useState<string>(error ?? "");
  const [emailInput, setEmailInput] = useState<string>(initialEmail);
  const [passwordResetTokenInput, setPasswordResetTokenInput] = useState<string>("");
  const [newPasswordInput, setNewPasswordInput] = useState<string>("");
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [tokenError, setTokenError] = useState<string>("");
  const [newPasswordError, setNewPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");


  async function handleSendResetPasswordEmail(email: string) {
    if (email) {
      if (!isEmail(email)) {
        setEmailError(`${t("archbase:Email inválido")}`)
      } else {
        await onSendResetPasswordEmail(email).then(() => {
          ArchbaseDialog.showSuccess(`${t("archbase:Um e-mail com instruções para redefinir sua senha foi enviado. Verifique sua caixa de entrada.")}`)
          setEmailSent(true)
        }).catch(() => {})
      }
    }
  }

  async function handleResetPassword(email: string, passwordResetToken: string, newPassword: string, confirmPassword: string) {
    if (email && passwordResetToken && newPassword) {
      let tokenErrorResult = "";
      let passwordErrorResult = "";
      let confirmPasswordError = "";

      if (validateToken) {
        tokenErrorResult = validateToken()
        setNewPasswordError(tokenErrorResult)
      }
      if (validatePassword) {
        passwordErrorResult = validatePassword()
        setNewPasswordError(passwordErrorResult)
      }
      if (newPassword !== confirmPassword) {
        confirmPasswordError = `${t("archbase:A nova senha e a confirmação devem ser iguais.")}`
        setConfirmPasswordError(confirmPasswordError);
      }

      if (!passwordErrorResult && !tokenErrorResult) {
        await onResetPassword(email, passwordResetToken, newPassword).then(() => {
          ArchbaseDialog.showSuccess(`${t("archbase:Senha redefinida com sucesso.")}`)
          onClickBackToLogin()
          setEmailSent(false)
        }).catch(() => {
          if (error) {
            setLastError(error)
          } else {
            setLastError(`${t("archbase:Erro ao redefinir senha.")}`)
          }
        })
      }
    }
  }

  useEffect(() => {
    if (error) {
      setLastError(error);
    }
  }, [error]);

  useEffect(() => {
    setLastError("");
  }, [emailInput, passwordResetTokenInput, newPasswordInput, confirmNewPasswordInput]);

  return (
    <Card
      withBorder
      shadow="md"
      radius="md"
      ref={focusTrapRef}
      style={{
        ...defaultStyle,
        ...style
      }}
    >
      {!emailSent
        ? (
          <>
            <Text
              c="light-dark(var(--mantine-color-black), var(--mantine-color-white))"
              fw={800}
              fz={{ base: "20px", md: "35px" }}
              style={{ textAlign: "center", letterSpacing: "-1px" }}
              mt="xs"
            >
              {t("archbase:Redefinir senha")}
            </Text>
            <Text c="dimmed" fz={14} style={{ textAlign: "justify" }}>
              {description}
            </Text>
            <Divider m="md" />
            <TextInput
              label="Email"
              placeholder={`${t("archbase:usuario@email.com")}`}
              value={emailInput || ""}
              required
              onChange={(event) => {
                setEmailInput(event.currentTarget.value)
                setEmailError("")
              }}
              error={emailError}
            />
            <Button
              disabled={!emailInput}
              mt="md"
              fullWidth
              onClick={() => handleSendResetPasswordEmail(emailInput)}
            >
              {`${t("archbase:Enviar")}`}
            </Button>
            <Button
              mt="6px"
              fullWidth
              color={theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[7]}
              onClick={() =>
                onClickBackToLogin &&
                onClickBackToLogin()
              }
            >
              {`${t("archbase:Voltar")}`}
            </Button>
          </>
        )
        : (
          <>
            <Text
              c="light-dark(var(--mantine-color-black), var(--mantine-color-white))"
              fw={800}
              fz={{ base: "20px", md: "35px" }}
              style={{ textAlign: "center", letterSpacing: "-1px" }}
              mt="xs"
            >
              {t("archbase:Redefinir senha")}
            </Text>
            <Divider m="xs" />
            <TextInput
              label={t("archbase:Código de segurança")}
              placeholder={`${t("archbase:Código enviado no seu e-mail")}`}
              value={passwordResetTokenInput || ""}
              required
              onChange={(event) => {
                setPasswordResetTokenInput(event.currentTarget.value)
                setTokenError("")
              }}
              error={tokenError}
            />
            <PasswordInput
              label={t("archbase:Nova senha")}
              placeholder={t("archbase:Nova senha")}
              onChange={(event) => {
                setNewPasswordInput(event.currentTarget.value)
                setNewPasswordError("")
                setConfirmPasswordError("")
              }}
              value={newPasswordInput}
              required
              error={newPasswordError}
            />
            <PasswordInput
              label={t("archbase:Confirmar senha")}
              placeholder={t("archbase:Confirmar senha")}
              onChange={(event) => {
                setConfirmNewPasswordInput(event.currentTarget.value)
                setConfirmPasswordError("")
              }}
              value={confirmNewPasswordInput || ""}
              required
              error={confirmPasswordError}
            />
            <Button
              disabled={!emailInput || !passwordResetTokenInput || !newPasswordInput || !confirmNewPasswordInput}
              mt="md"
              fullWidth
              onClick={() => handleResetPassword(emailInput, passwordResetTokenInput, newPasswordInput, confirmNewPasswordInput)}
            >
              {`${t("archbase:Redefinir senha")}`}
            </Button>
            <Button
              mt="6px"
              fullWidth
              color={theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[7]}
              onClick={() => {
                if (!emailError) {
                  setEmailSent(false)
                }
              }}
            >
              {`${t("archbase:Voltar")}`}
            </Button>
          </>
        )}

      {lastError ? <Text c="red" style={{ textAlign: "justify" }}>{lastError}</Text> : null}
    </Card>
  )
}