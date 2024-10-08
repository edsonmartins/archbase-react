import React, { useMemo, useState } from 'react';
import { Button, Tooltip, Group, Badge, Center, Image, Text } from '@mantine/core';
import { IconTerminal, IconSearch } from '@tabler/icons-react';
import i18next from 'i18next';
import { spotlight, Spotlight, SpotlightActionData } from '@mantine/spotlight';
import { ArchbaseNavigationItem } from './types';
import { useNavigate } from 'react-router';

export interface ArchbaseSpotlightActionData extends SpotlightActionData {
    category: string;
    image?: string;
    link?: string;
}

function CustomCommand({ category, title, color, description, image, onClick }: ArchbaseSpotlightActionData) {
    return (
        <Spotlight.Action key={title} onClick={onClick}>
            <Group wrap="nowrap" w="100%">
                {category && <Badge color={color}>{i18next.t(category)}</Badge>}
                {image && (
                    <Center>
                        <Image src={image} alt={i18next.t(title)} width={50} height={50} />
                    </Center>
                )}
                <div style={{ flex: 1 }}>
                    <Text>{i18next.t(title)}</Text>
                    {description && (
                        <Text c="dimmed" size="xs">
                            {i18next.t(description)}
                        </Text>
                    )}
                </div>
            </Group>
        </Spotlight.Action>
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
                            c: 'white',
                            bg: subItem.color,
                            title: subItem.label,
                            link: subItem.link,
                            onClick: () => {
                                return navigate(subItem.link);
                            },
                        });
                    }
                });
            } else {
                if (!item.disabled && item.showInSidebar) {
                    result.push({
                        id: item.label,
                        onClick: () => {
                            return navigate(item.link);
                        },
                        category: item.category ? item.category.toUpperCase() : '',
                        c: 'white',
                        bg: item.color,
                        title: item.label,
                        link: item.link,
                    });
                }
            }
        });

        return result;
    }, [navigationData, navigate]);

    const filteredCommands = commands
        .filter((item) => {
            const sItem = `${i18next.t(item.title)}`;
            return sItem && sItem.toLowerCase().includes(query.toLowerCase().trim());
        })
        .map((item) => <CustomCommand {...item} />);

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
