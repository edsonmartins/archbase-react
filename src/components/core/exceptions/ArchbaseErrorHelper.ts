export function processErrorMessage(error: any) {
  let msgErro: any = ''
  if (
    (error && error.response && error.response.status && error.response.status === 401) ||
    (error && error.status && error.status === 401)
  ) {
    return 'Usuário/senha não encontrados. Não autorizado.'
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
    msgErro = 'Recurso não encontrado no servidor ou a url está incorreta. Erro 404'
  } else if (error.response && error.response.status && error.response.status === 405) {
    msgErro = 'Método não permitido no servidor ou a url está incorreta. Erro 405'
  } else if (error.response && error.response.status && error.response.status === 400) {
    msgErro = `Requisição incorreta. Erro 400 Msg: ${error.response?.data?.message ?? ""}`
  } else if (error.response && error.response.status && error.response.status === 500) {
    msgErro = `Ocorreu um erro no servidor. Erro 500. Caminho: ${error.response.data.path} Msg: ${error.response.data.message}`
  } else if (error.response && error.response.data) {
    msgErro = error.response.data
  } else if (error.response) {
    msgErro = error.response
  } else if (error.message && error.message === 'Network Error') {
    msgErro = 'Servidor não disponível ou algum problema na rede.'
  } else if (error.message) {
    msgErro = error.message
  } else {
    msgErro = `${error}`
  }

  if (typeof msgErro === 'object') {
    if (error && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')) {
      msgErro = 'Servidor não disponível ou algum problema na rede.'
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
