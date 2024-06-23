import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActionIcon, Badge, Button, Grid, Group, Modal, Paper, ScrollArea, Stack, Text, TextInput, Tooltip, Tree, TreeNodeData, useTree } from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconBorderCornerSquare, IconChevronDown, IconEdit } from "@tabler/icons-react";
import { SecurityType } from "./SecurityType";
import { useArchbaseRemoteServiceApi, useArchbaseTheme } from "@components/hooks";
import { ResouceActionPermissionDto, ResoucePermissionsWithTypeDto } from "./SecurityDomain";
import { ARCHBASE_IOC_API_TYPE, getKeyByEnumValue } from "@components/core";
import { ArchbaseResourceService } from "./ArchbaseResourceService";
import { t } from "i18next";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { ArchbaseRemoteDataSource } from "@components/datasource";

export interface PermissionsSelectorProps<T, ID> {
    dataSource: ArchbaseRemoteDataSource<T, ID>
}

export function PermissionsSelector<T, ID>({ dataSource }: PermissionsSelectorProps<T, ID>) {
    const name = dataSource.getFieldValue("name")
    const securityId = dataSource.getFieldValue("id")
    const type = dataSource.getFieldValue("type")
    const theme = useArchbaseTheme()
    const availablePermissionsTree = useTree()
    const grantedPermissionsTree = useTree()
    const [availablePermissions, setAvailablePermissions] = useState<ResoucePermissionsWithTypeDto[]>([])
    const [grantedPermissions, setGrantedPermissions] = useState<ResoucePermissionsWithTypeDto[]>([])
    const [selectedAvailablePermission, setSelectedAvailablePermission] = useState<TreeNodeData>()
    const [selectedGrantedPermission, setSelectedGrantedPermission] = useState<TreeNodeData>()
    const [opened, { open, close }] = useDisclosure(false);
    const [availablePermissionsFilter, setAvailablePermissionsFilter] = useState("")
    const [debouncedAvailablePermissionsFilter] = useDebouncedValue(availablePermissionsFilter, 200);
    const [grantedPermissionsFilter, setGrantedPermissionsFilter] = useState("")
    const [debouncedGrantedPermissionsFilter] = useDebouncedValue(grantedPermissionsFilter, 200);


    const resourceApi = useArchbaseRemoteServiceApi<ArchbaseResourceService>(ARCHBASE_IOC_API_TYPE.Resource)

    const selectedColor = theme.colorScheme === "dark" ? "var(--mantine-primary-color-7)" : "var(--mantine-primary-color-4)"

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
        setSelectedAvailablePermission(undefined)
        setSelectedGrantedPermission(undefined)
        setAvailablePermissionsFilter("")
        setGrantedPermissionsFilter("")
        grantedPermissionsTree.collapseAllNodes()
        availablePermissionsTree.collapseAllNodes()
        loadPermissions()
    }, [type, securityId])

    return (
        <>
            <Button color={'blue'} leftSection={<IconEdit />} onClick={() => open()}>
                {t('archbase:Edit permissions')}
            </Button>
            <Modal opened={opened} onClose={close} title={`${t(`archbase:${type}`)}: ${name}`} size={"80%"} styles={{ root: { overflow: "hidden" } }}>
                <ScrollArea h={"75vh"}>
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
                                            <Text>{node.label}</Text>
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
            </Modal>
        </>
    )
}