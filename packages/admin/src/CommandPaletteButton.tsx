import React, { useMemo, useState } from 'react';
import { Button, Tooltip, Group, Badge, Center, Image, Text, ScrollArea } from '@mantine/core';
import { IconTerminal, IconSearch } from '@tabler/icons-react';
import { getI18nextInstance, useArchbaseTranslation } from '@archbase/core';
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
            label={`${getI18nextInstance().t(label || '')}`}
            description={description ? getI18nextInstance().t(description) : undefined}
            leftSection={
                image ? (
                    <Center>
                        <Image src={image} alt={getI18nextInstance().t(label || '')} width={24} height={24} />
                    </Center>
                ) : undefined
            }
            rightSection={
                category ? <Badge color={color} size="sm">{getI18nextInstance().t(category)}</Badge> : undefined
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
    const {t} = useArchbaseTranslation();

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
            const sItem = `${t(item.label || '')}`;
            return sItem && sItem.toLowerCase().includes(query.toLowerCase().trim());
        })
        .map((item) => <CustomCommand key={item.id} {...item} />);

    return (
        <>
            {commands && commands.length > 0 ?
                <>
                    <Tooltip withinPortal withArrow label={`${t('archbase:Comandos ⌘M')}`}>
                        <Button color={color} leftSection={<IconTerminal size="24px" />} onClick={() => spotlight.open()} />
                    </Tooltip>

                    <Spotlight.Root
                        shortcut={['mod + M', '/']}
                        onQueryChange={(q) => setQuery(q)}
                        query={query}
                    >
                        <Spotlight.Search placeholder={`${t('archbase:Localizar...')}`} leftSection={<IconSearch size="1.2rem" />} />
                        <ScrollArea.Autosize mah="calc(100vh - 200px)" type="scroll" scrollbarSize={8}>
                            <Spotlight.ActionsList>
                                {filteredCommands.length > 0 ? filteredCommands : <Spotlight.Empty>{getI18nextInstance().t('archbase:Nenhum resultado...')}</Spotlight.Empty>}
                            </Spotlight.ActionsList>
                        </ScrollArea.Autosize>
                    </Spotlight.Root>
                </>
                : null
            }
        </>
    );
};
