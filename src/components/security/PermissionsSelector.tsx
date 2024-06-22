import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActionIcon, Badge, Grid, Group, Paper, Stack, Text, Tooltip, Tree, TreeNodeData, useTree } from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconChevronDown } from "@tabler/icons-react";
import { SecurityType } from "./SecurityType";
import { useArchbaseRemoteServiceApi, useArchbaseTheme } from "@components/hooks";
import { ResouceActionPermissionDto, ResoucePermissionsWithTypeDto } from "./SecurityDomain";
import { ARCHBASE_IOC_API_TYPE, getKeyByEnumValue } from "@components/core";
import { ArchbaseResourceService } from "./ArchbaseResourceService";

export interface PermissionsSelectorProps {
    securityId: string
    type: SecurityType
}

export function PermissionsSelector({ securityId, type }: PermissionsSelectorProps) {
    const theme = useArchbaseTheme()
    const availablePermissionsTree = useTree()
    const grantedPermissionsTree = useTree()
    const [availablePermissions, setAvailablePermissions] = useState<ResoucePermissionsWithTypeDto[]>([])
    const [grantedPermissions, setGrantedPermissions] = useState<ResoucePermissionsWithTypeDto[]>([])
    const [selectedAvailablePermission, setSelectedAvailablePermission] = useState<TreeNodeData>()
    const [selectedGrantedPermission, setSelectedGrantedPermission] = useState<TreeNodeData>()

    const resourceApi = useArchbaseRemoteServiceApi<ArchbaseResourceService>(ARCHBASE_IOC_API_TYPE.Resource)

    const selectedColor = theme.colorScheme === "dark" ? "var(--mantine-primary-color-7)" : "var(--mantine-primary-color-4)"

    const permissionsGrantedData: (permissionsGranted: ResoucePermissionsWithTypeDto[]) => TreeNodeData[] = useCallback((permissionsGranted) => permissionsGranted.map(resourcePermissions => {
        return (
            {
                value: resourcePermissions.resourceId,
                label: resourcePermissions.resourceDescription,
                children: resourcePermissions.permissions.map(permission => {
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
    }), [])

    const grantedPermissionsActionIds = useCallback((permissionsGranted: ResoucePermissionsWithTypeDto[]) => permissionsGranted
        .map(resourcePermissions => resourcePermissions.permissions.map(permission => permission.actionId))
        .flat(), [])

    const allPermissionsData: (allPermissions: ResoucePermissionsWithTypeDto[], permissionsGranted: ResoucePermissionsWithTypeDto[]) => TreeNodeData[] = useCallback((allPermissions, permissionsGranted) => allPermissions.map(resourcePermissions => {
        return (
            {
                value: resourcePermissions.resourceId,
                label: resourcePermissions.resourceDescription,
                children: resourcePermissions.permissions.map(permission => {
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
    }), [grantedPermissionsActionIds, type])

    const loadPermissions = useCallback(async () => {
        const permissionsGranted = await resourceApi.getPermissionsBySecurityId(securityId, type)
        const allPermissions = await resourceApi.getAllPermissionsAvailable()
        setAvailablePermissions(allPermissions)
        setGrantedPermissions(permissionsGranted)
    }, [securityId, type])

    const handleAdd = () => {
        if (selectedAvailablePermission?.value) {
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

                        const nextSelectedAvailablePermission = allPermissionsData(availablePermissions, grantedPermissions)
                            .filter(resourcePermissionsNode => resourcePermissionsNode.value === selectedAvailablePermission?.nodeProps?.owner?.resourceId)
                            .map(resourcePermissionsNode => resourcePermissionsNode.children).flat()
                            .find(permissionNode => !permissionNode?.nodeProps?.granted && permissionNode?.value !== selectedAvailablePermission.value)
                        if (nextSelectedAvailablePermission?.value) {
                            availablePermissionsTree.select(nextSelectedAvailablePermission.value)
                        }
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

                    const nextSelectedGrantedPermission = permissionsGrantedData(grantedPermissions)
                        .filter(resourcePermissionsNode => resourcePermissionsNode.value === selectedGrantedPermission?.nodeProps?.owner?.resourceId)
                        .map(resourcePermissionsNode => resourcePermissionsNode.children).flat()
                        .find(permissionNode => permissionNode?.nodeProps?.types.includes(getKeyByEnumValue(SecurityType, type)) && permissionNode?.value !== selectedGrantedPermission.value)
                    if (nextSelectedGrantedPermission?.value) {
                        grantedPermissionsTree.select(nextSelectedGrantedPermission.value)
                    }
                    setSelectedGrantedPermission(nextSelectedGrantedPermission)
                })
        }
    }

    useEffect(() => {
        loadPermissions()
    }, [type, securityId])

    return (
        <Paper withBorder my={20} p={20}>
            <Grid columns={20} maw={900}>
                <Grid.Col span={9}>
                    <Text>Disponíveis</Text>
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
                                <Group gap={5} {...elementProps}
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
                                    <Text
                                        c={textColor}
                                        td={textDecoration}
                                    >
                                        {node.label}
                                    </Text>
                                </Group>
                            )
                        }
                        }
                    />
                </Grid.Col>
                <Grid.Col span={2}>
                    <Stack gap={5} style={{ minWidth: '10%' }} justify="center" align="center" h={"100%"}>
                        <Tooltip label="Adicionar">
                            <ActionIcon onClick={handleAdd} disabled={!selectedAvailablePermission || selectedAvailablePermission?.nodeProps?.granted || !selectedAvailablePermission.nodeProps}>
                                <IconArrowRight />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Remover">
                            <ActionIcon onClick={handleRemove} disabled={!selectedGrantedPermission || !selectedGrantedPermission?.nodeProps?.permissionId || !selectedGrantedPermission.nodeProps}>
                                <IconArrowLeft />
                            </ActionIcon>
                        </Tooltip>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={9}>
                    <Text>Selecionados</Text>
                    <Tree
                        data={permissionsGrantedData(grantedPermissions)}
                        selectOnClick={true}
                        allowRangeSelection={false}
                        tree={grantedPermissionsTree}
                        renderNode={({ level, node, expanded, hasChildren, selected, elementProps }) => (
                            <Group gap={5} {...elementProps} bg={selected && level === 2 ? selectedColor : ""}
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
                                <Text>{node.label}</Text>
                                {node?.nodeProps?.types?.includes("USER") && <Badge color="blue">Usuário</Badge>}
                                {node?.nodeProps?.types?.includes("GROUP") && <Badge color="orange">Grupo</Badge>}
                                {node?.nodeProps?.types?.includes("PROFILE") && <Badge color="pink">Perfil</Badge>}
                            </Group>
                        )}
                    />
                </Grid.Col>
            </Grid>
        </Paper>
    )
}