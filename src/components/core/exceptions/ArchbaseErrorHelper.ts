import { t } from "i18next"

export function processErrorMessage(error: any) {
  let msgErro: any = ''
  if (
    (error && error.response && error.response.status && error.response.status === 401) ||
    (error && error.status && error.status === 401)
  ) {
    return t('archbase:Usuário/senha não encontrados. Não autorizado.')
  }
  if (error.response && error.response.data && error.response.data.apierror) {
    msgErro = error.response.data.apierror.message
    if (error.response.data.apierror.subErrors) {
      msgErro = []
      error.response.data.apierror.subErrors.forEach((element: any) => {
        msgErro.push(`(${element.field}) ${element.message}`)
      })
    }
  } else if (error.response && error.response.status && error.response.status === 404) {
    msgErro = t("archbase:recurso_nao_encontrado")
  } else if (error.response && error.response.status && error.response.status === 405) {
    msgErro = t("archbase:metodo_nao_permitido")
  } else if (error.response && error.response.status && error.response.status === 400) {
    msgErro = `${error.response?.data?.message ?? (error.response?.data && typeof error.response?.data === 'string' ? error.response.data : t("archbase:dados_incorretos"))}`
  } else if (error.response && error.response.status && error.response.status === 500) {
    msgErro = t('archbase:erro_servidor', {
      path: error.response.data.path,
      message: error.response.data.message,
    })
  } else if (error.response && error.response.data) {
    msgErro = error.response.data
  } else if (error.response) {
    msgErro = error.response
  } else if (error.message && error.message === 'Network Error') {
    msgErro = t("archbase:servidor_nao_disponivel")
  } else if (error.message) {
    msgErro = error.message
  } else {
    msgErro = `${error}`
  }

  if (typeof msgErro === 'object') {
    if (error && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')) {
      msgErro = t("archbase:servidor_nao_disponivel")
    }
  }
  return `${msgErro}`
}

export function processDetailErrorMessage(error: any) {
  let msgErro = ''
  if (error.response && error.response.data && error.response.data.apierror) {
    msgErro = error.response.data.apierror.debugMessage
  }
  return `${msgErro}`
}
