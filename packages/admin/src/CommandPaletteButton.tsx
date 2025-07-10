import React, { useMemo, useState } from 'react';
import { Button, Tooltip, Group, Badge, Center, Image, Text } from '@mantine/core';
import { IconTerminal, IconSearch } from '@tabler/icons-react';
import i18next from 'i18next';
import { spotlight, Spotlight, SpotlightActionData } from '@mantine/spotlight';
import { ArchbaseNavigationItem } from './types';
import { useNavigate } from 'react-router';

export interface ArchbaseSpotlightActionData extends SpotlightActionData {
    category?: string;
    image?: string;
    link?: string;
    color?: string;
}

function CustomCommand({ category, label, color, description, image, onClick }: ArchbaseSpotlightActionData) {
    return (
        <Spotlight.Action
            key={label}
            onClick={onClick}
            label={i18next.t(label || '')}
            description={description ? i18next.t(description) : undefined}
            leftSection={
                image ? (
                    <Center>
                        <Image src={image} alt={i18next.t(label || '')} width={24} height={24} />
                    </Center>
                ) : undefined
            }
            rightSection={
                category ? <Badge color={color} size="sm">{i18next.t(category)}</Badge> : undefined
            }
        />
    );
}

export interface CommandPaletteButtonProps {
    navigationData: ArchbaseNavigationItem[];
    color?: string
}

export const CommandPaletteButton = ({ navigationData, color }: CommandPaletteButtonProps) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const commands = useMemo(() => {
        const result = new Array<ArchbaseSpotlightActionData>();
        navigationData.forEach((item) => {
            if (item.links) {
                item.links.forEach((subItem) => {
                    if (!subItem.disabled && subItem.showInSidebar) {
                        result.push({
                            id: subItem.label,
                            category: subItem.category ? subItem.category.toUpperCase() : '',
                            color: subItem.color,
                            label: subItem.label,
                            link: subItem.link,
                            onClick: () => {
                                if (subItem.link) {
                                    navigate(subItem.link);
                                }
                            },
                        });
                    }
                });
            } else {
                if (!item.disabled && item.showInSidebar) {
                    result.push({
                        id: item.label,
                        onClick: () => {
                            if (item.link) {
                                navigate(item.link);
                            }
                        },
                        category: item.category ? item.category.toUpperCase() : '',
                        color: item.color,
                        label: item.label,
                        link: item.link,
                    });
                }
            }
        });

        return result;
    }, [navigationData, navigate]);

    const filteredCommands = commands
        .filter((item) => {
            const sItem = `${i18next.t(item.label || '')}`;
            return sItem && sItem.toLowerCase().includes(query.toLowerCase().trim());
        })
        .map((item) => <CustomCommand key={item.id} {...item} />);

    return (
        <>
            {commands && commands.length > 0 ?
                <>
                    <Tooltip withinPortal withArrow label={`${i18next.t('archbase:Comandos ⌘M')}`}>
                        <Button color={color} leftSection={<IconTerminal size="24px" />} onClick={() => spotlight.open()} />
                    </Tooltip>

                    <Spotlight.Root
                        shortcut={['mod + M', '/']}
                        onQueryChange={(q) => setQuery(q)}
                        query={query}
                    >
                        <Spotlight.Search placeholder={`${i18next.t('archbase:Localizar...')}`} leftSection={<IconSearch size="1.2rem" />} />
                        <Spotlight.ActionsList>
                            {filteredCommands.length > 0 ? filteredCommands : <Spotlight.Empty>{i18next.t('archbase:Nenhum resultado...')}</Spotlight.Empty>}
                        </Spotlight.ActionsList>
                    </Spotlight.Root>
                </>
                : null
            }
        </>
    );
};
