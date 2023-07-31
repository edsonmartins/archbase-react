import { Container } from 'inversify'
import { API_TYPE } from './DemoIOCTypes'
import { FakeProdutoService } from '@demo/service/FakeProdutoService'
import { FakePessoaService } from '@demo/service/FakePessoaService'
import { FakePedidoService } from '@demo/service/FakePedidoService'
import { FakeAuthenticator } from '@demo/auth/FakeAuthenticator'
import { FakeApiClient } from '@demo/service/FakeApiClient'

const container = new Container()

container.bind<FakeAuthenticator>(API_TYPE.Authenticator).to(FakeAuthenticator)
container.bind<FakeApiClient>(API_TYPE.ApiClient).to(FakeApiClient)
container.bind<FakeProdutoService>(API_TYPE.ProdutoService).to(FakeProdutoService)
container.bind<FakePessoaService>(API_TYPE.ProdutoService).to(FakePessoaService)
container.bind<FakePedidoService>(API_TYPE.ProdutoService).to(FakePedidoService)

export default container
