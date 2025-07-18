import React, { useCallback, useEffect, useState, useMemo } from "react";
import { ARCHBASE_IOC_API_TYPE, getKeyByEnumValue, getI18nextInstance } from "@archbase/core";
import { ActionIcon, Badge, Button, Grid, Group, Modal, Paper, ScrollArea, Stack, Text, TextInput, Tooltip, Tree, TreeNodeData, useMantineColorScheme, useTree } from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconBorderCornerSquare, IconChevronDown } from "@tabler/icons-react";
import { SecurityType } from "./SecurityType";
import { useArchbaseRemoteServiceApi, ArchbaseRemoteDataSource } from "@archbase/data";
import { ResouceActionPermissionDto, ResoucePermissionsWithTypeDto } from "./SecurityDomain";
import { ArchbaseResourceService } from "./ArchbaseResourceService";
import { useDebouncedValue } from "@mantine/hooks";
import { ArchbaseSpaceBottom, ArchbaseSpaceFill, ArchbaseSpaceFixed } from "@archbase/layout";

const translateDelimitedString = (inputString) => {
    const delimiter = "->"
    if (inputString.includes(delimiter)) {
        const parts = inputString.split(delimiter).map(part => part.trim());

        const translatedParts = parts.map(part => getI18nextInstance().t(part));

        return translatedParts.join(` ${delimiter} `);
    }

    return getI18nextInstance().t(inputString);
};

export interface PermissionsSelectorProps {
    dataSource: ArchbaseRemoteDataSource<any, any> | null
    opened: boolean
    close: () => void
}

export function PermissionsSelectorModal({ dataSource, opened, close }: PermissionsSelectorProps) {
    // Memoiza os valores do dataSource para evitar recálculos
    const name = useMemo(() => dataSource?.getFieldValue("name") || '', [dataSource]);
    const securityId = useMemo(() => dataSource?.getFieldValue("id") || '', [dataSource]);
    const type = useMemo(() => dataSource?.getFieldValue("type") || '', [dataSource]);

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

    const { colorScheme } = useMantineColorScheme();
    const selectedColor = colorScheme === "dark" ? "var(--mantine-primary-color-7)" : "var(--mantine-primary-color-4)"

    const permissionsGrantedData = useMemo(() => grantedPermissions
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
        }), [grantedPermissions, debouncedGrantedPermissionsFilter])

    const grantedPermissionsActionIds = useMemo(() => grantedPermissions
        .map(resourcePermissions => resourcePermissions.permissions.map(permission => permission.actionId))
        .flat(), [grantedPermissions])

    const allPermissionsData = useMemo(() => availablePermissions
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
                            const permissionGranted = grantedPermissions
                                .find(resourcePermissionsGranted => resourcePermissionsGranted.resourceId === resourcePermissions.resourceId)?.permissions
                                .find(permissionGranted => permissionGranted.actionId === permission.actionId)
                            return (
                                {
                                    value: permission.actionId,
                                    label: permission.actionDescription,
                                    nodeProps: {
                                        granted: grantedPermissionsActionIds.includes(permission.actionId) && permissionGranted?.types?.includes(getKeyByEnumValue(SecurityType, type)!),
                                        owner: resourcePermissions
                                    }
                                }
                            )
                        })
                }
            )
        }), [availablePermissions, grantedPermissions, grantedPermissionsActionIds, type, debouncedAvailablePermissionsFilter])

    const loadPermissions = useCallback(async () => {
        if (securityId) {
            const permissionsGranted = await resourceApi.getPermissionsBySecurityId(securityId, type)
            const allPermissions = await resourceApi.getAllPermissionsAvailable()
            setAvailablePermissions(allPermissions)
            setGrantedPermissions(permissionsGranted)
        }
    }, [securityId, type])

    const handleAdd = useCallback(() => {
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

                        const resourceAvailablePermissions = allPermissionsData
                            .filter((resourcePermissionsNode: any) => resourcePermissionsNode.value === selectedAvailablePermission?.nodeProps?.owner?.resourceId)
                            .map((resourcePermissionsNode: any) => resourcePermissionsNode.children).flat()

                        const previousSelectedPermissionIndex = resourceAvailablePermissions.map((permission: any) => permission.value).indexOf(selectedAvailablePermission.value)
                        const nextSelectedAvailablePermission = resourceAvailablePermissions
                            .find((permissionNode: any, index: any) => !permissionNode?.nodeProps?.granted
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
    }, [selectedAvailablePermission, securityId, type, resourceApi, allPermissionsData, availablePermissions, grantedPermissions, availablePermissionsTree, grantedPermissionsTree])

    const handleRemove = useCallback(() => {
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

                    const resourceGrantedPermissions = permissionsGrantedData
                        .filter((resourcePermissionsNode: any) => resourcePermissionsNode.value === selectedGrantedPermission?.nodeProps?.owner?.resourceId)
                        .map((resourcePermissionsNode: any) => resourcePermissionsNode.children).flat()

                    const previousSelectedPermissionIndex = resourceGrantedPermissions.map((permission: any) => permission.value).indexOf(selectedGrantedPermission.value)

                    const nextSelectedGrantedPermission = resourceGrantedPermissions
                        .find((permissionNode: any, index: any) => permissionNode?.nodeProps?.types.includes(getKeyByEnumValue(SecurityType, type))
                            && permissionNode?.value !== selectedGrantedPermission.value
                            && (resourceGrantedPermissions.length > previousSelectedPermissionIndex + 1 ? index > previousSelectedPermissionIndex : true))
                    if (nextSelectedGrantedPermission?.value) {
                        grantedPermissionsTree.select(nextSelectedGrantedPermission.value)
                    }
                    setSelectedGrantedPermission(nextSelectedGrantedPermission)
                })
        }
    }, [selectedGrantedPermission, resourceApi, type, permissionsGrantedData, grantedPermissions, grantedPermissionsTree])

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
    }, [opened, type, securityId, loadPermissions])

    // Não exibir o modal se não houver dataSource
    if (!dataSource) {
        return null;
    }

    return (
        <Modal opened={opened} onClose={close} title={`${getI18nextInstance().t(`archbase:${type}`)}: ${name}`} size={"80%"} styles={{ root: { overflow: "hidden" } }}>
            <ArchbaseSpaceFixed height={"540px"}>
                <ArchbaseSpaceFill>
                    <ScrollArea h={"500px"}>
                        <Paper withBorder my={20} p={20}>
                            <Grid columns={20}>
                                <Grid.Col span={9}>
                                    <Group mb={20}>
                                        <Text>{getI18nextInstance().t('archbase:Available')}</Text>
                                        <TextInput
                                            size="xs"
                                            value={availablePermissionsFilter}
                                            onChange={(event) => setAvailablePermissionsFilter(event.target.value)}
                                            placeholder={getI18nextInstance().t('archbase:Filter available permissions')}
                                        />
                                    </Group>
                                    <Tree
                                        data={allPermissionsData}
                                        selectOnClick={true}
                                        allowRangeSelection={false}
                                        tree={availablePermissionsTree}
                                        renderNode={({ level, node, expanded, hasChildren, selected, elementProps }) => {
                                            const isGranted = node?.nodeProps?.granted;
                                            const textColor = isGranted ? "dimmed" : undefined;
                                            const textDecoration = isGranted ? "line-through" : undefined;
                                            
                                            const handleClick = useCallback((event: any) => {
                                                setSelectedAvailablePermission(node)
                                                elementProps.onClick(event)
                                            }, [node, elementProps.onClick])
                                            
                                            return (
                                                <Group ml={hasChildren ? 0 : 5} gap={5} {...elementProps}
                                                    bg={selected && level === 2 ? selectedColor : ""}
                                                    onClick={handleClick}
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
                                        <Tooltip label={getI18nextInstance().t('archbase:Add')}>
                                            <ActionIcon onClick={handleAdd} disabled={!selectedAvailablePermission || selectedAvailablePermission?.nodeProps?.granted || !selectedAvailablePermission.nodeProps}>
                                                <IconArrowRight />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label={getI18nextInstance().t('archbase:Remove')}>
                                            <ActionIcon onClick={handleRemove} disabled={!selectedGrantedPermission || !selectedGrantedPermission?.nodeProps?.permissionId || !selectedGrantedPermission.nodeProps}>
                                                <IconArrowLeft />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Stack>
                                </Grid.Col>
                                <Grid.Col span={9}>
                                    <Group mb={20}>
                                        <Text>{getI18nextInstance().t('archbase:Granted')}</Text>
                                        <TextInput
                                            size="xs"
                                            value={grantedPermissionsFilter}
                                            onChange={(event) => setGrantedPermissionsFilter(event.target.value)}
                                            placeholder={getI18nextInstance().t('archbase:Filter granted permissions')}
                                        />
                                    </Group>
                                    <Tree
                                        data={permissionsGrantedData}
                                        selectOnClick={true}
                                        allowRangeSelection={false}
                                        tree={grantedPermissionsTree}
                                        renderNode={({ level, node, expanded, hasChildren, selected, elementProps }) => {
                                            const handleClick = useCallback((event: any) => {
                                                setSelectedGrantedPermission(node)
                                                elementProps.onClick(event)
                                            }, [node, elementProps.onClick])
                                            
                                            return (
                                                <Group ml={hasChildren ? 0 : 5} gap={5} {...elementProps} bg={selected && level === 2 ? selectedColor : ""}
                                                    onClick={handleClick}
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
                                                    {node?.nodeProps?.types?.includes("USER") && <Badge color="blue">{getI18nextInstance().t('archbase:user')}</Badge>}
                                                    {node?.nodeProps?.types?.includes("GROUP") && <Badge color="orange">{getI18nextInstance().t('archbase:group')}</Badge>}
                                                    {node?.nodeProps?.types?.includes("PROFILE") && <Badge color="pink">{getI18nextInstance().t('archbase:profile')}</Badge>}
                                                </Group>
                                            )
                                        }}
                                    />
                                </Grid.Col>
                            </Grid>
                        </Paper>
                    </ScrollArea>
                </ArchbaseSpaceFill>
                <ArchbaseSpaceBottom size="40px">
                    <Group justify="flex-end">
                        <Button onClick={close}>{getI18nextInstance().t("archbase:Close")}</Button>
                    </Group>
                </ArchbaseSpaceBottom>
            </ArchbaseSpaceFixed>
        </Modal>
    )
}
