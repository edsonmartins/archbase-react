import{d as i}from"./index-9e992aa6.js";function d(s){var a,t,n,o;let e="";return s&&s.response&&s.response.status&&s.response.status===401||s&&s.status&&s.status===401?"Usuário/senha não encontrados. Não autorizado.":(s.response&&s.response.data&&s.response.data.apierror?(e=s.response.data.apierror.message,s.response.data.apierror.subErrors&&(e=[],s.response.data.apierror.subErrors.forEach(p=>{e.push(`(${p.field}) ${p.message}`)}))):s.response&&s.response.status&&s.response.status===404?e="Recurso não encontrado no servidor ou a url está incorreta. Erro 404":s.response&&s.response.status&&s.response.status===405?e="Método não permitido no servidor ou a url está incorreta. Erro 405":s.response&&s.response.status&&s.response.status===400?e=`${((t=(a=s.response)==null?void 0:a.data)==null?void 0:t.message)??((n=s.response)!=null&&n.data&&typeof((o=s.response)==null?void 0:o.data)=="string"?s.response.data:"Dados incorretos.")}`:s.response&&s.response.status&&s.response.status===500?e=`Ocorreu um erro no servidor. Erro 500. Caminho: ${s.response.data.path} Msg: ${s.response.data.message}`:s.response&&s.response.data?e=s.response.data:s.response?e=s.response:s.message&&s.message==="Network Error"?e="Servidor não disponível ou algum problema na rede.":s.message?e=s.message:e=`${s}`,typeof e=="object"&&s&&(s.code==="ERR_NETWORK"||s.message==="Network Error")&&(e="Servidor não disponível ou algum problema na rede."),`${e}`)}function f(s){let e="";return s.response&&s.response.data&&s.response.data.apierror&&(e=s.response.data.apierror.debugMessage),`${e}`}function g(s){return i.useContainer(e=>e.get(s))}export{f as a,d as p,g as u};
