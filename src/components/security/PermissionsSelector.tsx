import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActionIcon, Badge, Grid, Group, Paper, Stack, Text, Tooltip, Tree, TreeNodeData } from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconChevronDown } from "@tabler/icons-react";
import { SecurityType } from "./SecurityType";
import { useArchbaseRemoteServiceApi, useArchbaseTheme } from "@components/hooks";
import { ResouceActionPermissionDto, ResoucePermissionsWithTypeDto } from "./SecurityDomain";
import { ARCHBASE_IOC_API_TYPE, getKeyByEnumValue } from "@components/core";
import { ArchbaseResourceService } from "./ArchbaseResourceService";
import { useForceUpdate } from "@mantine/hooks";

export interface PermissionsSelectorProps {
    securityId: string
    type: SecurityType
}

export function PermissionsSelector({ securityId, type }: PermissionsSelectorProps) {
    const theme = useArchbaseTheme()
    const forceUpdate = useForceUpdate()
    const [allPermissions, setAllPermissions] = useState<ResoucePermissionsWithTypeDto[]>([])
    const [permissionsGranted, setPermissionsGranted] = useState<ResoucePermissionsWithTypeDto[]>([])
    const [selectedAvailablePermission, setSelectedAvailablePermission] = useState<TreeNodeData>()
    const [selectedGrantedPermission, setSelectedGrantedPermission] = useState<TreeNodeData>()

    const resourceApi = useArchbaseRemoteServiceApi<ArchbaseResourceService>(ARCHBASE_IOC_API_TYPE.Resource)

    const selectedColor = theme.colorScheme === "dark" ? "var(--mantine-primary-color-7)" : "var(--mantine-primary-color-4)"

    const permissionsGrantedData: TreeNodeData[] = useMemo(() => permissionsGranted.map(resourcePermissions => {
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
                            types: permission.types ?? []
                        }
                    }
                })
            }
        )
    }), [permissionsGranted])

    const grantedPermissions = useMemo(() => permissionsGranted
        .map(resourcePermissions => resourcePermissions.permissions.map(permission => permission.actionId))
        .flat(), [permissionsGranted])

    const allPermissionsData: TreeNodeData[] = useMemo(() => allPermissions.map(resourcePermissions => {
        return (
            {
                value: resourcePermissions.resourceId,
                label: resourcePermissions.resourceDescription,
                children: resourcePermissions.permissions.map(permission => (
                    {
                        value: permission.actionId,
                        label: permission.actionDescription,
                        nodeProps: {
                            actionId: permission.actionId,
                            granted: grantedPermissions.includes(permission.actionId) && permission.types?.includes(getKeyByEnumValue(SecurityType, type)!)
                        }
                    }
                ))
            }
        )
    }), [grantedPermissions, allPermissions, type])

    const loadAllPermissionsAvailable = useCallback(async () => {
        const permissions = await resourceApi.getAllPermissionsAvailable()
        setAllPermissions(permissions)
    }, [])

    const loadPermissionsGranted = useCallback(async () => {
        const permissions = await resourceApi.getPermissionsBySecurityId(securityId, type)
        setPermissionsGranted(permissions)
    }, [securityId, type])

    const handleAdd = () => {
        if (selectedAvailablePermission?.nodeProps?.actionId) {
            resourceApi.createPermission(securityId, selectedAvailablePermission.nodeProps.actionId, type)
                .then((resouceActionPermissionDto: ResouceActionPermissionDto) => {
                    if (resouceActionPermissionDto) {
                        if (permissionsGranted.map(permission => permission.resourceId).includes(resouceActionPermissionDto.resourceId)) {
                            const updatedPermissionsGranted = permissionsGranted.map(resourcePermissions => {
                                if (resourcePermissions.resourceId === resouceActionPermissionDto.resourceId) {
                                    if (resourcePermissions.permissions.map(permission => permission.actionId).includes(selectedAvailablePermission.nodeProps?.actionId)) {
                                        return (
                                            {
                                                ...resourcePermissions,
                                                permissions: resourcePermissions.permissions.map(permission =>
                                                    permission.actionId === selectedAvailablePermission.nodeProps?.actionId ? {
                                                        ...permission,
                                                        permissionId: resouceActionPermissionDto.permissionId,
                                                        types: [...(permission.types ? permission.types : []), getKeyByEnumValue(SecurityType, type)!]
                                                    } : permission
                                                )
                                            }
                                        )
                                    }
                                    return (
                                        {
                                            ...resourcePermissions,
                                            permissions: [...resourcePermissions.permissions,
                                            {
                                                permissionId: resouceActionPermissionDto.permissionId,
                                                actionId: resouceActionPermissionDto.actionId,
                                                actionDescription: resouceActionPermissionDto.actionDescription,
                                                types: [getKeyByEnumValue(SecurityType, type)!]
                                            }]
                                        }
                                    )
                                }
                                return resourcePermissions
                            });
                            setPermissionsGranted(updatedPermissionsGranted)
                        } else {
                            const updatedPermissionsGranted = permissionsGranted.map(resourcePermissions => {
                                if (resourcePermissions.resourceId === resouceActionPermissionDto.resourceId) {
                                    return (
                                        {
                                            ...resourcePermissions,
                                            permissions: resourcePermissions.permissions.map(permission =>
                                                permission.actionId === selectedAvailablePermission.nodeProps?.actionId ? {
                                                    ...permission,
                                                    permissionId: resouceActionPermissionDto.permissionId,
                                                    types: [...(permission.types ? permission.types : []), getKeyByEnumValue(SecurityType, type)!]
                                                } : permission
                                            )
                                        }
                                    )
                                }
                                return resourcePermissions;
                            });
                            setPermissionsGranted(updatedPermissionsGranted)
                        }

                    }
                }).finally(() => forceUpdate())
        }
    }

    const handleRemove = () => {
        if (selectedGrantedPermission?.nodeProps?.permissionId) {
            resourceApi.deletePermission(selectedGrantedPermission.nodeProps.permissionId)
                .then(() => {
                    const updatedPermissionsGranted: ResoucePermissionsWithTypeDto[] = permissionsGranted.map(resourcePermissions => {
                        const permission = resourcePermissions.permissions.find(permission => permission.permissionId === selectedGrantedPermission?.nodeProps?.permissionId)
                        if (permission) {
                            if (permission.types?.length === 1) {
                                return ({
                                    resourceId: resourcePermissions.resourceId,
                                    resourceDescription: resourcePermissions.resourceDescription,
                                    permissions: [...resourcePermissions.permissions
                                        .filter(permission => permission.permissionId !== selectedGrantedPermission?.nodeProps?.permissionId)]
                                })
                            }
                            return (
                                {
                                    resourceId: resourcePermissions.resourceId,
                                    resourceDescription: resourcePermissions.resourceDescription,
                                    permissions: resourcePermissions.permissions
                                        .map(permission => permission.actionId === selectedGrantedPermission.nodeProps?.actionId
                                            ? ({
                                                actionId: permission.actionId,
                                                actionDescription: permission.actionDescription,
                                                types: [...(permission?.types?.filter(currentType => currentType && (currentType === getKeyByEnumValue(SecurityType, type))) ?? [])]
                                            }) : permission)
                                }
                            )
                        }
                        return resourcePermissions
                    })
                    if (updatedPermissionsGranted) {
                        setPermissionsGranted(updatedPermissionsGranted)
                    }
                })
        }
    }

    useEffect(() => {
        loadPermissionsGranted()
        loadAllPermissionsAvailable()
    }, [type, securityId])

    return (
        <Paper withBorder my={20} p={20}>
            <Grid columns={20} maw={900}>
                <Grid.Col span={9}>
                    <Text>Disponíveis</Text>
                    <Tree
                        data={allPermissionsData}
                        selectOnClick={true}
                        allowRangeSelection={false}
                        renderNode={({ level, node, expanded, hasChildren, selected, elementProps }) => {
                            const isGranted = node?.nodeProps?.granted;
                            const textColor = isGranted ? "dimmed" : undefined;
                            const textDecoration = isGranted ? "line-through" : undefined;
                            return (
                                <Group gap={5} {...elementProps}
                                    bg={selected && level === 2 ? selectedColor : ""}
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
                                        onClick={() => setSelectedAvailablePermission({...node})}
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
                            <ActionIcon onClick={handleAdd} disabled={!selectedAvailablePermission || selectedAvailablePermission?.nodeProps?.granted}>
                                <IconArrowRight />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Remover">
                            <ActionIcon onClick={handleRemove} disabled={!selectedGrantedPermission || !selectedGrantedPermission?.nodeProps?.permissionId}>
                                <IconArrowLeft />
                            </ActionIcon>
                        </Tooltip>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={9}>
                    <Text>Selecionados</Text>
                    <Tree
                        data={permissionsGrantedData}
                        selectOnClick={true}
                        allowRangeSelection={false}
                        renderNode={({ level, node, expanded, hasChildren, selected, elementProps }) => (
                            <Group gap={5} {...elementProps} bg={selected && level === 2 ? selectedColor : ""}>
                                {hasChildren && (
                                    <IconChevronDown
                                        size={18}
                                        style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                                    />
                                )}
                                <Text onClick={() => setSelectedGrantedPermission({...node})}>{node.label}</Text>
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