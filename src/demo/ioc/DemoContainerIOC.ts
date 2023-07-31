import { Container } from 'inversify'
import { API_TYPE } from './DemoIOCTypes'
import { FakeProdutoService } from '@demo/service/FakeProdutoService'
import { FakePessoaService } from '@demo/service/FakePessoaService'
import { FakePedidoService } from '@demo/service/FakePedidoService'
import { FakeAuthenticator } from '@demo/auth/FakeAuthenticator'
import { FakeApiClient } from '@demo/service/FakeApiClient'

export const demoContainerIOC = new Container()

demoContainerIOC.bind<FakeAuthenticator>(API_TYPE.Authenticator).to(FakeAuthenticator)
demoContainerIOC.bind<FakeApiClient>(API_TYPE.ApiClient).to(FakeApiClient)
demoContainerIOC.bind<FakeProdutoService>(API_TYPE.Produto).to(FakeProdutoService)
demoContainerIOC.bind<FakePessoaService>(API_TYPE.Pessoa).to(FakePessoaService)
demoContainerIOC.bind<FakePedidoService>(API_TYPE.Pedido).to(FakePedidoService)


