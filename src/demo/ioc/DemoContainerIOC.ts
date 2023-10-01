import { API_TYPE } from './DemoIOCTypes';
import { FakeProdutoService } from '../service/FakeProdutoService';
import { FakePessoaService } from '../service/FakePessoaService';
import { FakePedidoService } from '../service/FakePedidoService';
import { FakeAuthenticator } from '../auth/FakeAuthenticator';
import { FakeRemoteApiClient } from '../service/FakeRemoteApiClient';
import { IOCContainer } from '../../components/core/ioc';

export const demoContainerIOC = IOCContainer.getContainer();

demoContainerIOC.bind<FakeAuthenticator>(API_TYPE.Authenticator).to(FakeAuthenticator);
demoContainerIOC.bind<FakeRemoteApiClient>(API_TYPE.ApiClient).to(FakeRemoteApiClient);
demoContainerIOC.bind<FakeProdutoService>(API_TYPE.Produto).to(FakeProdutoService);
demoContainerIOC.bind<FakePessoaService>(API_TYPE.Pessoa).to(FakePessoaService);
demoContainerIOC.bind<FakePedidoService>(API_TYPE.Pedido).to(FakePedidoService);
