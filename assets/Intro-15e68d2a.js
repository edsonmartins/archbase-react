import{j as e,a as t,F as i}from"./jsx-runtime-2ca98591.js";import{M as r,d as s}from"./index-6cc85afb.js";import{u as c}from"./index-ef048a71.js";import"./index-402471b7.js";import"./_commonjsHelpers-de833af9.js";import"./iframe-a6120d03.js";import"../sb-preview/runtime.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-20a9f65a.js";import"./pickBy-5061995a.js";import"./_commonjs-dynamic-modules-302442b1.js";import"./mapValues-19ef60e3.js";import"./index-29301433.js";import"./index-7f92349d.js";import"./extends-98964cd2.js";import"./index-356e4a49.js";import"./index-c0071dc9.js";const d=""+new URL("archbase_logo-f6b55ee9.png",import.meta.url).href,m=`# Archbase React

## Introdução

O **Archbase React** é uma biblioteca de componentes para React com TypeScript projetada para aumentar a produtividade dos desenvolvedores FrontEnd na criação de aplicações comerciais e industriais. Esta biblioteca oferece uma ampla gama de recursos e funcionalidades para acelerar o desenvolvimento de interfaces web, manter a padronização e fornecer uma experiência consistente para os usuários.

### Objetivo da Library

O Archbase React foi concebido com a ideia de fornecer aos desenvolvedores de FrontEnd a mesma produtividade e padronização que os desenvolvedores de aplicações desktop têm desfrutado por anos. Sua principal missão é simplificar e acelerar o processo de criação de interfaces web para aplicações comerciais e industriais (SASS em geral). A biblioteca começou como um projeto privado, mas agora é open source, permitindo compartilhar esses benefícios com a comunidade.

### Principais Recursos

O Archbase React oferece uma série de recursos essenciais, incluindo:

- **Templates Prontos:** Componentes pré-construídos que aceleram a criação de interfaces web.
- **Fonte de Dados:** Gerenciamento centralizado de dados e vinculação bidirecional para componentes visuais.
- **Componentes Especializados:** Criação rápida de interfaces de administrador com poucas linhas de código.
- **Controle de Ações:** Rastreamento e controle de ações do usuário com integração de segurança.

Esses recursos beneficiam os desenvolvedores FrontEnd, permitindo:

- Iniciar rapidamente novos projetos com uma ampla variedade de componentes e modelos.
- Aumentar a produtividade na construção de interfaces web, desde CRUDs simples até telas complexas.
- Padronizar interfaces, incluindo temas e cores, economizando tempo em adaptações.
- Utilizar uma variedade de componentes especializados para aplicações comerciais ou industriais (SASS).

### Público-Alvo

O Archbase React é voltado para desenvolvedores FrontEnd que trabalham com React e TypeScript, independentemente do nível de experiência. Pode ser aplicado em uma ampla gama de aplicações comerciais e industriais.

### Tecnologias Utilizadas

A biblioteca é baseada no Mantine.dev e utiliza as seguintes tecnologias:

- React com TypeScript usando hooks.
- Documentação em StoryBook.

## Instalação e Uso Básico

Para começar a usar o Archbase React em um projeto React, siga os passos abaixo:

1. Crie um novo aplicativo React TypeScript (usando Vite como exemplo):

\`\`\`bash
npm init vite@latest minhaAplicacao -- --template react-ts
cd minhaAplicacao
yarn install
\`\`\`

2. Instale o Archbase React:

\`\`\`bash
yarn add archbase-react
\`\`\`

3. Execute o aplicativo:

\`\`\`bash
yarn run dev
\`\`\`

Agora você pode começar a integrar os componentes do Archbase React em seu projeto.

Aqui está um exemplo simples de código que demonstra como criar uma interface de administrador com menu e abas:

\`\`\`tsx
    
    // Este é parte de um código mais amplo para criação de um admin inicial para
    // uma aplicação, mais detalhes e código estão na documentação do produto:

    // Importe os componentes necessários e configure-os conforme necessário
    const ArchbaseAdminMainLayoutExample = () => {
        const adminStore = useArchbaseAdminStore()

        const headerActions = useMemo((): ReactNode => {
        return [
            <Tooltip withinPortal withArrow label="Trocar empresa">
            <ActionIcon variant="transparent">
                <IconSwitchHorizontal size="2rem" />
            </ActionIcon>
            </Tooltip>,
            <Tooltip withinPortal withArrow label="Tela cheia">
            <ActionIcon variant="transparent">
                <IconArrowsMaximize size="2rem" />
            </ActionIcon>
            </Tooltip>,
            <Tooltip withinPortal withArrow label="Notificações">
            <ActionIcon variant="transparent">
                <IconBell size="2rem" />
            </ActionIcon>
            </Tooltip>,
            <Tooltip withinPortal withArrow label="Chat">
            <ActionIcon variant="transparent">
                <IconMessageChatbot size="2rem" />
            </ActionIcon>
            </Tooltip>,
        ]
        }, [])

        return (
        <div style={{ width: '100%', height: 'calc(100vh - 50px)' }}>
            <ArchbaseAdminMainLayout
            navigationData={navigationDataSample}
            navigationRootLink="/"
            footer={<ArchbaseAdminLayoutFooter />}
            header={
                <ArchbaseAdminLayoutHeader
                user={fakeUser}
                headerActions={headerActions}
                navigationData={navigationDataSample}
                userMenuItems={
                    <Fragment>
                    <Menu.Label>Usuário</Menu.Label>
                    <Menu.Item icon={<IconUserCircle size={14} />}>Meu perfil</Menu.Item>
                    <Menu.Item icon={<IconSettings size={14} />}>Configurações</Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>Conta</Menu.Label>
                    <Menu.Item icon={<IconBrandMessenger size={14} />}>Suporte</Menu.Item>
                    <Menu.Item
                        color="red"
                        icon={<IconLogout size={14} />}
                        onClick={() => {
                        //
                        }}
                    >
                        Sair
                    </Menu.Item>
                    </Fragment>
                }
                logo={archbaseLogo3}
                />
            }
            >
            <ArchbaseAdminTabContainer
                onChangeActiveTabId={(activeTabId: any) => adminStore.setActiveTabId(activeTabId)}
                onChangeOpenedTabs={(openedTabs: ArchbaseTabItem[]) => {
                adminStore.setOpenedTabs(openedTabs)
                }}
                openedTabs={adminStore.openedTabs}
                activeTabId={adminStore.activeTabId}
                navigationData={navigationDataSample}
            />
            </ArchbaseAdminMainLayout>
        </div>
        )
    }

export default ArchbaseAdminMainLayoutExample;
\`\`\`

## Documentação Completa

A documentação completa do Archbase React está disponível no formato Storybook no seguinte endereço: [https://react.archbase.com.br](https://react.archbase.com.br).

## Comunidade e Suporte

Para obter suporte, participar da comunidade de desenvolvedores e relatar problemas ou sugestões, visite a página do GitHub do projeto: [https://github.com/edsonmartins/archbase-react](https://github.com/edsonmartins/archbase-react).

O projeto está em constante evolução, e você pode encontrar informações sobre releases, correções e o roadmap no GitHub.

## Licenciamento

O Archbase React é uma biblioteca open source e é distribuído sob a licença Apache License 2.0.

## Exemplos de Uso

Exemplos de uso detalhados podem ser encontrados na documentação do produto, que está disponível no formato stories do Storybook, acessível em [https://react.archbase.com.br](https://react.archbase.com.br).`;function o(a){return t(i,{children:[e(r,{title:"Introdução"}),`
`,e("img",{src:d,height:"200px"}),`
`,e(s,{children:m})]})}function y(a={}){const{wrapper:n}=Object.assign({},c(),a.components);return n?e(n,Object.assign({},a,{children:e(o,a)})):o()}export{y as default};
//# sourceMappingURL=Intro-15e68d2a.js.map
