import React, { useCallback, useEffect, useState } from "react";
import { useArchbaseTheme, ARCHBASE_IOC_API_TYPE, getKeyByEnumValue } from "@archbase/core";
import { ActionIcon, Badge, Button, Grid, Group, Modal, Paper, ScrollArea, Stack, Text, TextInput, Tooltip, Tree, TreeNodeData, useMantineColorScheme, useTree } from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconBorderCornerSquare, IconChevronDown } from "@tabler/icons-react";
import { SecurityType } from "./SecurityType";
import { useArchbaseRemoteServiceApi, ArchbaseRemoteDataSource } from "@archbase/data";
import { ResouceActionPermissionDto, ResoucePermissionsWithTypeDto } from "./SecurityDomain";
import { ArchbaseResourceService } from "./ArchbaseResourceService";
import { useArchbaseTranslation } from '@archbase/core';
import { useDebouncedValue } from "@mantine/hooks";
import { ArchbaseSpaceBottom, ArchbaseSpaceFill, ArchbaseSpaceFixed } from "@archbase/layout";

const translateDelimitedString = (inputString) => {
    const delimiter = "->"
    if (inputString.includes(delimiter)) {
        const parts = inputString.split(delimiter).map(part => part.trim());

        const translatedParts = parts.map(part => t(part));

        return translatedParts.join(` ${delimiter} `);
    }

    return t(inputString);
};

export interface PermissionsSelectorProps {
    dataSource: ArchbaseRemoteDataSource<any, any> | null
    opened: boolean
    close: () => void
}

export function PermissionsSelectorModal({ dataSource, opened, close }: PermissionsSelectorProps) {
    // Verifica se o dataSource existe antes de acessá-lo
    const name = dataSource?.getFieldValue("name") || '';
    const securityId = dataSource?.getFieldValue("id") || '';
    const type = dataSource?.getFieldValue("type") || '';

    // const theme = useArchbaseTheme() // Temporarily disabled
    const availablePermissionsTree = useTree()
    const grantedPermissionsTree = useTree()
    const [availablePermissions, setAvailablePermissions] = useState<ResoucePermissionsWithTypeDto[]>([])
    const [grantedPermissions, setGrantedPermissions] = useState<ResoucePermissionsWithTypeDto[]>([])
    const [selectedAvailablePermission, setSelectedAvailablePermission] = useState<TreeNodeData>()
    const [selectedGrantedPermission, setSelectedGrantedPermission] = useState<TreeNodeData>()
    const [availablePermissionsFilter, setAvailablePermissionsFilter] = useState("")
    const [debouncedAvailablePermissionsFilter] = useDebouncedValue(availablePermissionsFilter, 200);
    const [grantedPermissionsFilter, setGrantedPermissionsFilter] = useState("")
    const [debouncedGrantedPermissionsFilter] = useDebouncedValue(grantedPermissionsFilter, 200);


    const resourceApi = useArchbaseRemoteServiceApi<ArchbaseResourceService>(ARCHBASE_IOC_API_TYPE.Resource)

    const theme = useArchbaseTheme();
    const { colorScheme } = useMantineColorScheme();
    const selectedColor = colorScheme === "dark" ? "var(--mantine-primary-color-7)" : "var(--mantine-primary-color-4)"

    const permissionsGrantedData: (permissionsGranted: ResoucePermissionsWithTypeDto[]) => TreeNodeData[] = useCallback((permissionsGranted) => permissionsGranted
        .sort((a, b) => a.resourceDescription.localeCompare(b.resourceDescription))
        .map(resourcePermissions => {
            return (
                {
                    value: resourcePermissions.resourceId,
                    label: resourcePermissions.resourceDescription,
                    children: resourcePermissions.permissions
                        .filter(permission => permission.actionDescription.toLowerCase().includes(debouncedGrantedPermissionsFilter.toLowerCase()))
                        .sort((a, b) => a.actionDescription.localeCompare(b.actionDescription))
                        .map(permission => {
                            return {
                                value: permission.actionId,
                                label: permission.actionDescription,
                                nodeProps: {
                                    permissionId: permission.permissionId,
                                    types: permission.types ?? [],
                                    owner: resourcePermissions
                                }
                            }
                        })
                }
            )
        }), [debouncedGrantedPermissionsFilter])

    const grantedPermissionsActionIds = useCallback((permissionsGranted: ResoucePermissionsWithTypeDto[]) => permissionsGranted
        .map(resourcePermissions => resourcePermissions.permissions.map(permission => permission.actionId))
        .flat(), [])

    const allPermissionsData: (allPermissions: ResoucePermissionsWithTypeDto[], permissionsGranted: ResoucePermissionsWithTypeDto[]) => TreeNodeData[] = useCallback((allPermissions, permissionsGranted) => allPermissions
        .sort((a, b) => a.resourceDescription.localeCompare(b.resourceDescription))
        .map(resourcePermissions => {
            return (
                {
                    value: resourcePermissions.resourceId,
                    label: resourcePermissions.resourceDescription,
                    children: resourcePermissions.permissions
                        .filter(permission => permission.actionDescription.toLowerCase().includes(debouncedAvailablePermissionsFilter.toLowerCase()))
                        .sort((a, b) => a.actionDescription.localeCompare(b.actionDescription))
                        .map(permission => {
                            const permissionGranted = permissionsGranted
                                .find(resourcePermissionsGranted => resourcePermissionsGranted.resourceId === resourcePermissions.resourceId)?.permissions
                                .find(permissionGranted => permissionGranted.actionId === permission.actionId)
                            return (
                                {
                                    value: permission.actionId,
                                    label: permission.actionDescription,
                                    nodeProps: {
                                        granted: grantedPermissionsActionIds(permissionsGranted).includes(permission.actionId) && permissionGranted?.types?.includes(getKeyByEnumValue(SecurityType, type)!),
                                        owner: resourcePermissions
                                    }
                                }
                            )
                        })
                }
            )
        }), [grantedPermissionsActionIds, type, debouncedAvailablePermissionsFilter])

    const loadPermissions = useCallback(async () => {
        if (securityId && dataSource) {
            const permissionsGranted = await resourceApi.getPermissionsBySecurityId(securityId, type)
            const allPermissions = await resourceApi.getAllPermissionsAvailable()
            setAvailablePermissions(allPermissions)
            setGrantedPermissions(permissionsGranted)
        }
    }, [securityId, type, dataSource])

    const handleAdd = () => {
        if (selectedAvailablePermission?.value && securityId) {
            resourceApi.createPermission(securityId, selectedAvailablePermission.value, type)
                .then((resouceActionPermissionDto: ResouceActionPermissionDto) => {
                    if (resouceActionPermissionDto) {
                        setGrantedPermissions(permissionsGranted => {
                            let updatedPermissionsGranted;
                            if (permissionsGranted.map(resourcePermissions => resourcePermissions.resourceId).includes(resouceActionPermissionDto.resourceId)) {
                                updatedPermissionsGranted = permissionsGranted.map(resourcePermissions => {
                                    if (resourcePermissions.resourceId === resouceActionPermissionDto.resourceId) {
                                        if (resourcePermissions.permissions.map(permission => permission.actionId).includes(selectedAvailablePermission.value)) {
                                            return (
                                                {
                                                    ...resourcePermissions,
                                                    permissions: resourcePermissions.permissions.map(permission =>
                                                        permission.actionId === selectedAvailablePermission.value ? {
                                                            ...permission,
                                                            permissionId: resouceActionPermissionDto.permissionId,
                                                            types: [...(permission.types ?? []), getKeyByEnumValue(SecurityType, type)!],
                                                        } : permission
                                                    )
                                                }
                                            )
                                        }
                                        return (
                                            {
                                                ...resourcePermissions,
                                                permissions: [...(resourcePermissions.permissions ?? []),
                                                {
                                                    actionId: resouceActionPermissionDto.actionId,
                                                    actionDescription: resouceActionPermissionDto.actionDescription,
                                                    permissionId: resouceActionPermissionDto.permissionId,
                                                    types: [getKeyByEnumValue(SecurityType, type)!]
                                                }]
                                            }
                                        )
                                    }
                                    return resourcePermissions
                                });
                            } else {
                                updatedPermissionsGranted = [
                                    ...permissionsGranted,
                                    {
                                        resourceId: resouceActionPermissionDto.resourceId,
                                        resourceDescription: resouceActionPermissionDto.resourceDescription,
                                        permissions: [
                                            {
                                                actionId: resouceActionPermissionDto.actionId,
                                                actionDescription: resouceActionPermissionDto.actionDescription,
                                                permissionId: resouceActionPermissionDto.permissionId,
                                                types: [getKeyByEnumValue(SecurityType, type)!]
                                            }
                                        ]
                                    }
                                ]
                            }

                            return updatedPermissionsGranted
                        })

                        const resourceAvailablePermissions = allPermissionsData(availablePermissions, grantedPermissions)
                            .filter(resourcePermissionsNode => resourcePermissionsNode.value === selectedAvailablePermission?.nodeProps?.owner?.resourceId)
                            .map(resourcePermissionsNode => resourcePermissionsNode.children).flat()

                        const previousSelectedPermissionIndex = resourceAvailablePermissions.map(permission => permission.value).indexOf(selectedAvailablePermission.value)
                        const nextSelectedAvailablePermission = resourceAvailablePermissions
                            .find((permissionNode, index) => !permissionNode?.nodeProps?.granted
                                && permissionNode?.value !== selectedAvailablePermission.value
                                && (resourceAvailablePermissions.length > previousSelectedPermissionIndex + 1
                                    ? index > previousSelectedPermissionIndex
                                    : true))
                        if (nextSelectedAvailablePermission?.value) {
                            availablePermissionsTree.select(nextSelectedAvailablePermission.value)
                        }
                        grantedPermissionsTree.expand(resouceActionPermissionDto.resourceId)
                        setSelectedAvailablePermission(nextSelectedAvailablePermission)
                    }
                })
        }
    }

    const handleRemove = () => {
        if (selectedGrantedPermission?.nodeProps?.permissionId) {
            resourceApi.deletePermission(selectedGrantedPermission.nodeProps.permissionId)
                .then(() => {
                    setGrantedPermissions(permissionsGranted => {
                        const updatedPermissionsGranted = [...permissionsGranted]
                            .filter(resourcePermissions => {
                                let hasOnePermissionOnResource = true
                                resourcePermissions.permissions?.forEach(permission => {
                                    if (permission.permissionId !== undefined
                                        && permission.permissionId === selectedGrantedPermission?.nodeProps?.permissionId
                                        && resourcePermissions.permissions.length === 1
                                        && permission?.types?.length === 1
                                        && permission.types[0] === getKeyByEnumValue(SecurityType, type)) {
                                        hasOnePermissionOnResource = false;
                                    }
                                })
                                return hasOnePermissionOnResource;
                            })
                            .map(resourcePermissions => {
                                const resource: ResoucePermissionsWithTypeDto = selectedGrantedPermission?.nodeProps?.owner
                                if (resourcePermissions.resourceId === resource.resourceId) {
                                    if (selectedGrantedPermission?.nodeProps?.types?.length === 1) {
                                        return ({
                                            ...resourcePermissions,
                                            permissions: [...(resourcePermissions.permissions ?? [])
                                                .filter(permission => permission.permissionId !== selectedGrantedPermission?.nodeProps?.permissionId)]
                                        })
                                    }
                                    return (
                                        {
                                            ...resourcePermissions,
                                            permissions: (resourcePermissions.permissions ?? [])
                                                .map(permission => permission.actionId === selectedGrantedPermission.value
                                                    ? ({
                                                        actionId: permission.actionId,
                                                        actionDescription: permission.actionDescription,
                                                        types: [...(permission.types?.filter(currentType => currentType && (currentType !== getKeyByEnumValue(SecurityType, type))) ?? [])]
                                                    }) : permission)
                                        }
                                    )
                                }
                                return resourcePermissions
                            })
                        return updatedPermissionsGranted
                    })

                    const resourceGrantedPermissions = permissionsGrantedData(grantedPermissions)
                        .filter(resourcePermissionsNode => resourcePermissionsNode.value === selectedGrantedPermission?.nodeProps?.owner?.resourceId)
                        .map(resourcePermissionsNode => resourcePermissionsNode.children).flat()

                    const previousSelectedPermissionIndex = resourceGrantedPermissions.map(permission => permission.value).indexOf(selectedGrantedPermission.value)

                    const nextSelectedGrantedPermission = resourceGrantedPermissions
                        .find((permissionNode, index) => permissionNode?.nodeProps?.types.includes(getKeyByEnumValue(SecurityType, type))
                            && permissionNode?.value !== selectedGrantedPermission.value
                            && (resourceGrantedPermissions.length > previousSelectedPermissionIndex + 1 ? index > previousSelectedPermissionIndex : true))
                    if (nextSelectedGrantedPermission?.value) {
                        grantedPermissionsTree.select(nextSelectedGrantedPermission.value)
                    }
                    setSelectedGrantedPermission(nextSelectedGrantedPermission)
                })
        }
    }

    useEffect(() => {
        if (opened && dataSource) {
            setSelectedAvailablePermission(undefined)
            setSelectedGrantedPermission(undefined)
            setAvailablePermissionsFilter("")
            setGrantedPermissionsFilter("")
            grantedPermissionsTree.collapseAllNodes()
            availablePermissionsTree.collapseAllNodes()
            loadPermissions()
        }
    }, [opened, type, securityId, dataSource])

    // Não exibir o modal se não houver dataSource
    if (!dataSource) {
        return null;
    }

    return (
        <Modal opened={opened} onClose={close} title={`${t(`archbase:${type}`)}: ${name}`} size={"80%"} styles={{ root: { overflow: "hidden" } }}>
            <ArchbaseSpaceFixed height={"540px"}>
                <ArchbaseSpaceFill>
                    <ScrollArea h={"500px"}>
                        <Paper withBorder my={20} p={20}>
                            <Grid columns={20}>
                                <Grid.Col span={9}>
                                    <Group mb={20}>
                                        <Text>{t('archbase:Available')}</Text>
                                        <TextInput
                                            size="xs"
                                            value={availablePermissionsFilter}
                                            onChange={(event) => setAvailablePermissionsFilter(event.target.value)}
                                            placeholder={t('archbase:Filter available permissions')}
                                        />
                                    </Group>
                                    <Tree
                                        data={allPermissionsData(availablePermissions, grantedPermissions)}
                                        selectOnClick={true}
                                        allowRangeSelection={false}
                                        tree={availablePermissionsTree}
                                        renderNode={({ level, node, expanded, hasChildren, selected, elementProps }) => {
                                            const isGranted = node?.nodeProps?.granted;
                                            const textColor = isGranted ? "dimmed" : undefined;
                                            const textDecoration = isGranted ? "line-through" : undefined;
                                            return (
                                                <Group ml={hasChildren ? 0 : 5} gap={5} {...elementProps}
                                                    bg={selected && level === 2 ? selectedColor : ""}
                                                    onClick={(event) => {
                                                        setSelectedAvailablePermission(node)
                                                        elementProps.onClick(event)
                                                    }}
                                                >
                                                    {hasChildren && (
                                                        <IconChevronDown
                                                            size={18}
                                                            style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                                                        />
                                                    )}
                                                    {!hasChildren && (
                                                        <IconBorderCornerSquare
                                                            size={12}
                                                            style={{ transform: 'rotate(-90deg)', marginTop: "-5px" }}
                                                        />
                                                    )}
                                                    <Text
                                                        c={textColor}
                                                        td={textDecoration}
                                                    >
                                                        {translateDelimitedString(node.label as string)}
                                                    </Text>
                                                </Group>
                                            )
                                        }
                                        }
                                    />
                                </Grid.Col>
                                <Grid.Col span={2}>
                                    <Stack gap={5} style={{ minWidth: '10%' }} justify="center" align="center" h={"100%"}>
                                        <Tooltip label={t('archbase:Add')}>
                                            <ActionIcon onClick={handleAdd} disabled={!selectedAvailablePermission || selectedAvailablePermission?.nodeProps?.granted || !selectedAvailablePermission.nodeProps}>
                                                <IconArrowRight />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label={t('archbase:Remove')}>
                                            <ActionIcon onClick={handleRemove} disabled={!selectedGrantedPermission || !selectedGrantedPermission?.nodeProps?.permissionId || !selectedGrantedPermission.nodeProps}>
                                                <IconArrowLeft />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Stack>
                                </Grid.Col>
                                <Grid.Col span={9}>
                                    <Group mb={20}>
                                        <Text>{t('archbase:Granted')}</Text>
                                        <TextInput
                                            size="xs"
                                            value={grantedPermissionsFilter}
                                            onChange={(event) => setGrantedPermissionsFilter(event.target.value)}
                                            placeholder={t('archbase:Filter granted permissions')}
                                        />
                                    </Group>
                                    <Tree
                                        data={permissionsGrantedData(grantedPermissions)}
                                        selectOnClick={true}
                                        allowRangeSelection={false}
                                        tree={grantedPermissionsTree}
                                        renderNode={({ level, node, expanded, hasChildren, selected, elementProps }) => (
                                            <Group ml={hasChildren ? 0 : 5} gap={5} {...elementProps} bg={selected && level === 2 ? selectedColor : ""}
                                                onClick={(event) => {
                                                    setSelectedGrantedPermission(node)
                                                    elementProps.onClick(event)
                                                }}
                                            >
                                                {hasChildren && (
                                                    <IconChevronDown
                                                        size={18}
                                                        style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                                                    />
                                                )}
                                                {!hasChildren && (
                                                    <IconBorderCornerSquare
                                                        size={12}
                                                        style={{ transform: 'rotate(-90deg)', marginTop: "-5px" }}
                                                    />
                                                )}
                                                <Text>{translateDelimitedString(node.label as string)}</Text>
                                                {node?.nodeProps?.types?.includes("USER") && <Badge color="blue">{t('archbase:user')}</Badge>}
                                                {node?.nodeProps?.types?.includes("GROUP") && <Badge color="orange">{t('archbase:group')}</Badge>}
                                                {node?.nodeProps?.types?.includes("PROFILE") && <Badge color="pink">{t('archbase:profile')}</Badge>}
                                            </Group>
                                        )}
                                    />
                                </Grid.Col>
                            </Grid>
                        </Paper>
                    </ScrollArea>
                </ArchbaseSpaceFill>
                <ArchbaseSpaceBottom size="40px">
                    <Group justify="flex-end">
                        <Button onClick={close}>{t("archbase:Close")}</Button>
                    </Group>
                </ArchbaseSpaceBottom>
            </ArchbaseSpaceFixed>
        </Modal>
    )
}
