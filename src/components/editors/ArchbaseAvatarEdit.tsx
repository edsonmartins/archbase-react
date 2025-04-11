import { ActionIcon, ActionIconVariant, Box, Button, Group, Input, Modal, Paper, Slider, Stack, Tooltip } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import { IconCameraPlus, IconEdit, IconRotate, IconTrash, IconZoomIn } from '@tabler/icons-react';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '../../components/datasource';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseTheme, useArchbaseWillUnmount } from '../../components/hooks';
import { isBase64 } from '../../components/validator';
import i18next from 'i18next';
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';

export interface ArchbaseAvatarEditProps<T, ID> {
    /** Fonte de dados onde será atribuido o valor do avatar */
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o valor do avatar na fonte de dados */
    dataField?: string;
    /** Indicador se o avatar está desabilitado */
    disabled?: boolean;
    /** Indicador se o avatar é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
    readOnly?: boolean;
    /** Indicador se o preenchimento do avatar é obrigatório */
    required?: boolean;
    /** Estilo do avatar */
    style?: CSSProperties;
    /** Título do avatar */
    label?: string;
    /** Descrição do avatar */
    description?: string;
    /** Último erro ocorrido no avatar */
    error?: string;
    /** Controla a aparência dos botões, sendo padrão "transparent". */
    variant?: ActionIconVariant;
    /** Image src */
    src?: string | null;
    /** Largura do avatar, padrão 200 */
    width?: number;
    /** Altura do avatar, padrão 200 */
    height?: number;
    /** Zoom inicial do avatar, padrão 1 */
    initialZoom?: number;
    /** Chave de theme.radius ou qualquer valor CSS válido para definir border-radius, 0 por padrão */
    radius?: string | number | undefined;
    /** Referência para o componente interno */
    innerRef?: React.RefObject<HTMLInputElement> | undefined;
    /** Callback quando a imagem for alterada */
    onChangeImage?: (image: any) => void;
    /** Desabilita conversão do conteúdo em base64 antes de salvar na fonte de dados */
    disabledBase64Convertion?: boolean;
    /** Cor de fundo de hover do avatar */
    hoverBackgroundColor?: string
}

export function ArchbaseAvatarEdit<T, ID>({
    width = 200,
    height = 200,
    dataSource,
    dataField,
    disabled,
    readOnly,
    required,
    label,
    description,
    error,
    src,
    radius = '50%',
    initialZoom = 1,
    onChangeImage,
    disabledBase64Convertion,
    innerRef,
    variant = 'transparent',
    hoverBackgroundColor = 'rgba(0, 0, 0, 0.6)',
    ...otherProps
}: ArchbaseAvatarEditProps<T, ID>) {
    const [value, setValue] = useState<string | undefined>(undefined);
    const [image, setImage] = useState<string | undefined>(undefined);
    const [modalOpen, setModalOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(initialZoom);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const innerComponentRef = useRef<any>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cropperRef = useRef<any>(null);
    const [internalError, setInternalError] = useState<string | undefined>(error);
    const forceUpdate = useForceUpdate();
    const theme = useArchbaseTheme()
    const [showControls, setShowControls] = useState(false);

    useEffect(() => {
        setInternalError(undefined);
    }, [value]);

    const loadDataSourceFieldValue = () => {
        let initialValue: any = value;

        if (dataSource && dataField) {
            initialValue = dataSource.getFieldValue(dataField);
            if (!initialValue) {
                initialValue = '';
            }
        }

        if (isBase64(initialValue) && !disabledBase64Convertion) {
            initialValue = atob(initialValue);
        }

        setValue(initialValue);
        setImage(initialValue);
    };

    const fieldChangedListener = useCallback(() => {
        loadDataSourceFieldValue();
    }, []);

    const dataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
        if (dataSource && dataField) {
            if (
                event.type === DataSourceEventNames.dataChanged ||
                event.type === DataSourceEventNames.recordChanged ||
                event.type === DataSourceEventNames.afterScroll ||
                event.type === DataSourceEventNames.afterCancel ||
                event.type === DataSourceEventNames.afterEdit
            ) {
                loadDataSourceFieldValue();
                forceUpdate();
            }
            if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
                setInternalError(event.error);
            }
        }
    }, []);

    useArchbaseDidMount(() => {
        loadDataSourceFieldValue();
        if (dataSource && dataField) {
            dataSource.addListener(dataSourceEvent);
            dataSource.addFieldChangeListener(dataField, fieldChangedListener);
        }
    });

    useArchbaseDidUpdate(() => {
        loadDataSourceFieldValue();
    }, []);

    useArchbaseWillUnmount(() => {
        if (dataSource && dataField) {
            dataSource.removeListener(dataSourceEvent);
            dataSource.removeFieldChangeListener(dataField, fieldChangedListener);
        }
    });

    const handleChangeImage = (image: string | undefined) => {
        const changedValue = image;
        setValue((_prev) => changedValue);
        setImage(changedValue);

        if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== changedValue) {
            if (!changedValue) {
                dataSource.setFieldValue(dataField, undefined);
            } else {
                dataSource.setFieldValue(dataField, disabledBase64Convertion ? changedValue : btoa(changedValue));
            }
        }
        if (onChangeImage) {
            onChangeImage(image);
        }
    };

    const isReadOnly = () => {
        let tmpReadOnly = readOnly;
        if (dataSource && !readOnly) {
            tmpReadOnly = dataSource.isBrowsing();
        }
        return tmpReadOnly;
    };

    const handleSelectImage = () => {
        if (isReadOnly() || disabled) return;
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
                setModalOpen(true);
                setCrop({ x: 0, y: 0 });
                setZoom(initialZoom);
                setRotation(0);
            };
            reader.readAsDataURL(file);
            // Reset input para permitir selecionar o mesmo arquivo novamente
            e.target.value = '';
        }
    };

    const handleRemoveImage = () => {
        if (isReadOnly() || disabled) return;
        setImage(undefined);
        handleChangeImage(undefined);
    };

    const handleCropComplete = (croppedArea: any, croppedAreaPixelsData: any) => {
        setCroppedAreaPixels(croppedAreaPixelsData);
    };

    // Função para criar uma imagem a partir de URL
    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    async function getCroppedImg(
        imageSrc: string,
        pixelCrop: any,
        rotation = 0,
    ): Promise<string> {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return imageSrc;
        }

        // Calcular o tamanho do retângulo delimitador da imagem rotacionada
        const rotRad = (rotation * Math.PI) / 180;
        const { width: bBoxWidth, height: bBoxHeight } = getRotatedSize(
            image.width,
            image.height,
            rotation
        );

        // Definir o tamanho do canvas para o tamanho do retângulo delimitador
        canvas.width = bBoxWidth;
        canvas.height = bBoxHeight;

        // Preencher com branco para imagens com transparência
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, bBoxWidth, bBoxHeight);

        // Transladar para o centro do canvas
        ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
        ctx.rotate(rotRad);
        ctx.translate(-image.width / 2, -image.height / 2);

        // Desenhar a imagem
        ctx.drawImage(image, 0, 0);

        // Obter os dados da imagem
        const data = ctx.getImageData(0, 0, bBoxWidth, bBoxHeight);

        // Definir o tamanho do canvas para o tamanho desejado
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        // Colocar os dados da imagem rotacionada de volta no canvas
        ctx.putImageData(data, -pixelCrop.x, - pixelCrop.y);

        // Retornar como base64
        return canvas.toDataURL('image/jpeg', 0.95);
    }

    // Função auxiliar para calcular o tamanho do retângulo delimitador após rotação
    function getRotatedSize(width: number, height: number, rotation: number) {
        const rotRad = (rotation * Math.PI) / 180;

        return {
            width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
            height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
        };
    }

    const handleSaveCrop = async () => {
        if (!image || !croppedAreaPixels) return;

        try {
            const croppedImage = await getCroppedImg(
                image,
                croppedAreaPixels,
                rotation,
            );

            handleChangeImage(croppedImage);
            setModalOpen(false);
        } catch (error) {
            console.error("Error cropping the image: ", error);
        }
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <Input.Wrapper
                withAsterisk={required}
                label={label}
                description={description}
                error={internalError}
                ref={innerRef || innerComponentRef}
            >
                <Paper
                    radius={radius}
                    style={{
                        width,
                        height,
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {image ? (
                        <>
                            <img
                                src={image}
                                alt="Avatar"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: radius,
                                }}
                            />
                            {!isReadOnly() && !disabled && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: hoverBackgroundColor,
                                        borderRadius: radius,
                                        opacity: showControls ? 1 : 0,
                                        transition: 'opacity 0.2s',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: 10,
                                    }}
                                    onMouseEnter={() => setShowControls(true)}
                                    onMouseLeave={() => setShowControls(false)}
                                >
                                    <Tooltip label={i18next.t('archbase:Edit')}>
                                        <ActionIcon
                                            radius="xl"
                                            size="lg"
                                            color="blue"
                                            variant={variant}
                                            onClick={handleSelectImage}
                                        >
                                            <IconEdit color={theme.colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[4]} />
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label={i18next.t('archbase:Remove')}>
                                        <ActionIcon
                                            radius="xl"
                                            size="lg"
                                            color="red"
                                            variant={variant}
                                            onClick={handleRemoveImage}
                                        >
                                            <IconTrash color={theme.colorScheme === 'dark' ? theme.colors.red[8] : theme.colors.red[4]} />
                                        </ActionIcon>
                                    </Tooltip>
                                </div>
                            )}
                        </>
                    ) : (
                        <Box
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: isReadOnly() || disabled ? 'default' : 'pointer',
                                border: theme.colorScheme === "dark" ? "3px solid gray" : "3px solid #B2B2B2",
                                borderRadius: "50%"
                            }}
                            onClick={handleSelectImage}
                        >
                            <IconCameraPlus
                                size={width * 0.3}
                                opacity={0.3}
                                style={{ color: isReadOnly() || disabled ? 'gray' : 'inherit' }}
                            />
                        </Box>
                    )}
                </Paper>

                <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <Modal
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={i18next.t('archbase:Edit avatar')}
                    size="lg"
                >
                    <Box style={{ position: 'relative', height: 400, width: '100%' }}>
                        {image && (
                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={zoom}
                                rotation={rotation}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onCropComplete={handleCropComplete}
                                onZoomChange={setZoom}
                                onRotationChange={setRotation}
                                ref={cropperRef}
                            />
                        )}
                    </Box>

                    <Stack gap="xs" mt="md">
                        <Group justify="space-between">
                            <Box style={{ flex: 1 }}>
                                <Tooltip label={i18next.t('archbase:Zoom')}>
                                    <IconZoomIn size={20} />
                                </Tooltip>
                                <Slider
                                    value={zoom}
                                    onChange={setZoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    label={(value) => value.toFixed(1)}
                                    style={{ flex: 1 }}
                                />
                            </Box>
                        </Group>

                        <Group justify="space-between">
                            <Box style={{ flex: 1 }}>
                                <Tooltip label={i18next.t('archbase:Rotation')}>
                                    <IconRotate size={20} />
                                </Tooltip>
                                <Slider
                                    value={rotation}
                                    onChange={setRotation}
                                    min={0}
                                    max={360}
                                    step={1}
                                    label={(value) => `${value}°`}
                                    style={{ flex: 1 }}
                                />
                            </Box>
                        </Group>
                    </Stack>

                    <Group justify="flex-end" mt="md">
                        <Button variant="outline" onClick={() => setModalOpen(false)}>
                            {i18next.t('archbase:Cancel')}
                        </Button>
                        <Button onClick={handleSaveCrop}>
                            {i18next.t('archbase:Apply')}
                        </Button>
                    </Group>
                </Modal>
            </Input.Wrapper>
        </div>
    );
}