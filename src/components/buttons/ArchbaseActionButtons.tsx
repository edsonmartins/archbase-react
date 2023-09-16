import { ActionIcon, Button, Menu, Space, Text, Tooltip, Variants, px, useMantineTheme } from '@mantine/core';
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useArchbaseSize } from '@hooks/useArchbaseSize';
import { useMediaQuery } from '@mantine/hooks';
import ReactDOMServer from 'react-dom/server';
import { createElementFromHTML, applyFontFamily } from '@components/core/utils/dom';
import { isLastElementOfArray } from '@components/core/utils/array';
import { IconMenu2 } from '@tabler/icons-react';

export interface ActionButtonsCustomComponentsDefinition {
  largeButtonType?: React.ElementType;
  largeButtonProps?: any;
  mediumButtonType?: React.ElementType;
  mediumButtonProps?: any;
  smallButtonType?: React.ElementType;
  smallButtonProps?: any;
}

export interface ArchbaseAction {
  /** Id da Action */
  id: string;
  /** Ícone do Action Button */
  icon?: ReactNode;
  /** Cor do Action Button */
  color?: string;
  /** Título da Action Button */
  label: string;
  /** Ação a ser executada ao clicar no Action Button */
  executeAction: () => void;
  /** Indicador se o Action Button está habilitado para executar a ação */
  enabled: boolean;
  /** Detalhamento da ação para ajudar o usuário*/
  hint?: string;
}

export interface ArchbaseActionButtonsOptions {
  /** Limite que determina a partir de quantos px o botão maior será renderizado*/
  largerBreakPoint?: string;
  /** Limite que determina a partir de quantos px o botão menor será renderizado*/
  smallerBreakPoint?: string;
  /** Espaçamento do botão maior */
  largerSpacing?: string;
  /** Espaçamento do botão menor */
  smallerSpacing?: string;
  /** Variação do botão maior */
  largerButtonVariant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>;
  /** Variação do botão menor */
  smallerButtonVariant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>;
  /** Variação do item do menu */
  menuItemVariant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>;
  /** Variação do botão do menu */
  menuButtonVariant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>;
  /** Cor do botão do menu */
  menuButtonColor?: string;
  /** Posição do dropdown do menu */
  menuDropdownPosition?:
    | 'bottom'
    | 'left'
    | 'right'
    | 'top'
    | 'bottom-end'
    | 'bottom-start'
    | 'left-end'
    | 'left-start'
    | 'right-end'
    | 'right-start'
    | 'top-end'
    | 'top-start';
  /** Posição do menu */
  menuPosition?: 'right' | 'left';
  menuItemApplyActionColor?: boolean;
}

export interface ArchbaseActionButtonsProps {
  /** Lista de ações */
  actions: ArchbaseAction[];
  /**  Variação padrão para todo o componente, que será sobrescrito pela variação mais específica de options */
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>;
  /** Opções de personalização */
  options?: ArchbaseActionButtonsOptions;
  /** Definição dos componentes personalizados */
  customComponents?: ActionButtonsCustomComponentsDefinition;
}

interface ArchbaseActionButtonProps {
  /** Ação */
  action: ArchbaseAction;
  /**  Variação padrão */
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>;
  /** Opções de personalização */
  options?: ArchbaseActionButtonsOptions;
  /** Definição dos componentes personalizados */
  customComponents?: ActionButtonsCustomComponentsDefinition;
  /** Ação a ser executada ao clicar no Action Button */
  handleExecuteAction: (action: ArchbaseAction) => void;
}

function buildLargeActionButton({
  action,
  options,
  variant,
  handleExecuteAction,
  customComponents,
}: ArchbaseActionButtonProps) {
  const LargeActionButton = customComponents ? customComponents.largeButtonType : null;
  if (LargeActionButton) {
    let largeButtonProps = {};
    if (customComponents && customComponents.largeButtonProps) {
      largeButtonProps = customComponents.largeButtonProps;
    }

    return (
      <LargeActionButton
        action={action}
        variant={options && options.largerButtonVariant ? options.largerButtonVariant : variant}
        key={action.id}
        disabled={!action.enabled}
        onClick={() => handleExecuteAction(action)}
        {...largeButtonProps}
      />
    );
  } else {
    return (
      <Button
        color={action.color}
        variant={options && options.largerButtonVariant ? options.largerButtonVariant : variant}
        key={action.id}
        disabled={!action.enabled}
        onClick={() => handleExecuteAction(action)}
      >
        {action.icon}
        <Text>{action.label}</Text>
      </Button>
    );
  }
}

function buildMediumActionButton({
  action,
  options,
  variant,
  handleExecuteAction,
  customComponents,
}: ArchbaseActionButtonProps) {
  const MediumActionButton = customComponents ? customComponents.mediumButtonType : null;
  if (MediumActionButton) {
    let mediumButtonProps = {};
    if (customComponents && customComponents.mediumButtonProps) {
      mediumButtonProps = customComponents.mediumButtonProps;
    }

    return (
      <MediumActionButton
        action={action}
        variant={options && options.smallerButtonVariant ? options.smallerButtonVariant : variant}
        key={action.id}
        disabled={!action.enabled}
        onClick={() => handleExecuteAction(action)}
        {...mediumButtonProps}
      />
    );
  } else {
    return (
      <ActionIcon
        color={action.color}
        variant={options && options.smallerButtonVariant ? options.smallerButtonVariant : variant}
        key={action.id}
        disabled={!action.enabled}
        onClick={() => handleExecuteAction(action)}
      >
        {action.icon}
      </ActionIcon>
    );
  }
}

function buildHiddenActionButton({
  action,
  options,
  variant,
  handleExecuteAction,
  customComponents,
}: ArchbaseActionButtonProps) {
  const SmallActionButton = customComponents ? customComponents.smallButtonType : null;

  return (
    <Menu.Item
      icon={action.icon}
      key={action.id}
      disabled={!action.enabled}
      color={options && options.menuItemApplyActionColor ? action.color : undefined}
      onClick={() => handleExecuteAction(action)}
    >
      <Tooltip withArrow disabled={!action.hint} label={action.hint}>
        {SmallActionButton ? (
          <div>
            <SmallActionButton
              action={action}
              variant={options && options.menuItemVariant ? options.menuItemVariant : variant}
            />
          </div>
        ) : (
          <Text variant={options && options.menuItemVariant ? options.menuItemVariant : variant}>{action.label}</Text>
        )}
      </Tooltip>
    </Menu.Item>
  );
}

function buildVisibleActionButton(props: ArchbaseActionButtonProps, isLarge: boolean) {
  if (isLarge) {
    return buildLargeActionButton(props);
  } else {
    return buildMediumActionButton(props);
  }
}

export function ArchbaseActionButtons({ actions, variant, customComponents, options }: ArchbaseActionButtonsProps) {
  const containerRef = useRef<HTMLInputElement>(null);
  const [visibleActions, setVisibleActions] = useState<ArchbaseAction[]>(actions);
  const [hiddenActions, setHiddenActions] = useState<ArchbaseAction[]>([]);
  const [containerWidth, _containerHeight] = useArchbaseSize(containerRef);
  const [opened, setOpened] = useState(false);

  const theme = useMantineTheme();
  const _largerBreakPoint = options && options.largerBreakPoint ? options.largerBreakPoint : theme.breakpoints.md;
  const _smallerBreakPoint = options && options.smallerBreakPoint ? options.smallerBreakPoint : theme.breakpoints.sm;

  const isLarge = useMediaQuery(`(min-width: ${_largerBreakPoint})`);
  const isSmall = useMediaQuery(`(max-width: ${_smallerBreakPoint})`);

  const largerSpacingPx = options && options.largerSpacing ? px(options.largerSpacing) : px('1rem');
  const smallerSpacingPx = options && options.smallerSpacing ? px(options.smallerSpacing) : px('0.25rem');
  const spacingPx = isLarge ? largerSpacingPx : smallerSpacingPx;

  const _menuPosition = options && options.menuPosition ? options.menuPosition : 'right';

  const calculateVisibleActions = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const containerWidth = container.clientWidth;
      let totalWidth = 0;
      let menuWidth = 0;
      let maxVisibleActions = 0;
      const menuButton = isLarge ? (
        <Button px={'10px'}>
          <IconMenu2 />
        </Button>
      ) : (
        <ActionIcon>
          <IconMenu2 />
        </ActionIcon>
      );

      const menuButtonHtmlString = ReactDOMServer.renderToStaticMarkup(menuButton);
      const menuButtonHtml = createElementFromHTML(menuButtonHtmlString);
      theme.fontFamily && applyFontFamily(menuButtonHtml, theme.fontFamily);
      container.appendChild(menuButtonHtml);
      menuWidth += menuButtonHtml.offsetWidth;
      container.removeChild(menuButtonHtml);

      actions.forEach((action, index) => {
        const button = buildVisibleActionButton(
          { action, options, variant, handleExecuteAction, customComponents },
          isLarge,
        );

        const buttonHtmlString = ReactDOMServer.renderToStaticMarkup(button);
        const buttonHtml = createElementFromHTML(buttonHtmlString);
        theme.fontFamily && applyFontFamily(buttonHtml, theme.fontFamily);
        container.appendChild(buttonHtml);
        totalWidth += buttonHtml.offsetWidth + (isLastElementOfArray(actions, index) ? 0 : spacingPx);
        container.removeChild(buttonHtml);

        if (totalWidth <= containerWidth - (menuWidth + spacingPx)) {
          maxVisibleActions++;
        }
      });

      if (isSmall) {
        setVisibleActions([]);
        setHiddenActions(actions);
      } else {
        setVisibleActions(actions.slice(0, maxVisibleActions));
        setHiddenActions(actions.slice(maxVisibleActions));
      }
    }
  }, [actions, isSmall, spacingPx, theme.fontFamily, customComponents, variant, isLarge, options]);

  useEffect(() => {
    calculateVisibleActions();
  }, [actions, containerWidth, calculateVisibleActions]);

  function handleExecuteAction(action: ArchbaseAction) {
    if (action.enabled) {
      action.executeAction();
    }
  }

  function buildMenu() {
    return (
      hiddenActions.length > 0 && (
        <>
          {visibleActions.length !== 0 && _menuPosition === 'right' ? <Space w={spacingPx} /> : undefined}
          <Menu
            opened={opened}
            onChange={setOpened}
            withinPortal={true}
            position={
              options && options.menuDropdownPosition
                ? options.menuDropdownPosition
                : _menuPosition === 'right'
                ? 'bottom-end'
                : 'bottom-start'
            }
          >
            <Menu.Target>
              {isLarge ? (
                <Button
                  color={options && options.menuButtonColor ? options.menuButtonColor : 'blue.5'}
                  variant={options && options.menuButtonVariant ? options.menuButtonVariant : variant}
                  px={'10px'}
                >
                  <IconMenu2 />
                </Button>
              ) : (
                <ActionIcon
                  color={options && options.menuButtonColor ? options.menuButtonColor : 'blue.5'}
                  variant={options && options.menuButtonVariant ? options.menuButtonVariant : variant}
                >
                  <IconMenu2 />
                </ActionIcon>
              )}
            </Menu.Target>
            <Menu.Dropdown>
              {hiddenActions.map((action) =>
                buildHiddenActionButton({ action, options, variant, handleExecuteAction, customComponents }),
              )}
            </Menu.Dropdown>
          </Menu>
          {visibleActions.length !== 0 && _menuPosition === 'left' ? <Space w={spacingPx} /> : undefined}
        </>
      )
    );
  }

  return (
    <div
      style={{ width: '100%', display: 'flex', justifyContent: _menuPosition === 'right' ? 'flex-end' : 'flex-start' }}
      ref={containerRef}
    >
      {_menuPosition === 'left' ? buildMenu() : undefined}
      {visibleActions.map((action, index) => {
        return (
          <>
            <Tooltip withArrow withinPortal={true} disabled={!action.hint} label={action.hint}>
              <div>
                {buildVisibleActionButton({ action, options, variant, handleExecuteAction, customComponents }, isLarge)}
              </div>
            </Tooltip>
            {isLastElementOfArray(visibleActions, index) ? undefined : <Space w={spacingPx} key={index} />}
          </>
        );
      })}
      {_menuPosition === 'right' ? buildMenu() : undefined}
    </div>
  );
}
