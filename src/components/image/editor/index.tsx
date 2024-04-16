/* eslint-disable react-hooks/exhaustive-deps */
import { ActionIcon, rem, Text, Tooltip, useMantineColorScheme } from '@mantine/core';
import {
	IconCloudDownload,
	IconCloudUpload,
	IconPhotoDown,
	IconPhotoEdit,
	IconPhotoUp,
	IconPhotoX,
	IconTrash,
} from '@tabler/icons-react';
import i18next from 'i18next';
import React, { Fragment, memo, useEffect, useMemo, useRef, useState } from 'react';
import { useArchbaseTheme } from '../../hooks';
import ArchbaseEditImage from './components/EditImage/ArchbaseEditImage';
import { convertImageUsingCanvas } from './functions/image-processing';
import './image_editor_styles.scss';
import { ArchbaseImagePickerConf, IState } from './models/index.models';

export * from './models/index.models';

const initialConfig: ArchbaseImagePickerConf = {
	objectFit: 'cover',
	hideDeleteBtn: false,
	hideDownloadBtn: false,
	hideEditBtn: false,
	hideAddBtn: false,
	compressInitial: null,
};

const initialState: IState = {
	maxHeight: 3000,
	maxWidth: 3000,
	cropHeight: 150,
	cropWidth: 150,
	maintainAspectRatio: true,
	format: 'png',
	arrayCopiedImages: [],
	originImageSrc: '',
	basicFilters: undefined,
	quality: 100,
};

export const ArchbaseImagePickerEditor = memo(
	({
		config = {},
		imageSrcProp = '',
		color = '#1e88e5',
		imageChanged = () => {},
	}: {
		config: ArchbaseImagePickerConf;
		imageSrcProp?: string;
		color?: string;
		imageChanged?: Function;
	}) => {
		const theme = useArchbaseTheme();
		const { colorScheme } = useMantineColorScheme();
		const [state, setState] = useState<IState>({
			...initialState,
		});
		const [imageSrc, setImageSrc] = useState<string | null>('');
		const [loadImage, setLoadImage] = useState<boolean>(false);
		const [showEditPanel, setShowEditPanel] = useState<boolean>(false);
		const [configuration, setConfiguration] = useState<ArchbaseImagePickerConf>(initialConfig);
		const imagePicker = useRef<any>(null);
		const fileType = useRef('');
		const urlImage = useRef('');
		const uuidFilePicker = Date.now().toString(20);
		const imageName = useRef('download');
		const mounted = useRef(false);

		useEffect(() => {
			processConfig();
		}, [config]);

		useEffect(() => {
			loadImageFromProps();
		}, [imageSrcProp]);

		async function loadImageFromProps() {
			if (imageSrcProp) {
				const result = await parseToBase64(imageSrcProp);
				const newState: IState = result.state;
				newState.originImageSrc = imageSrcProp;
				newState.arrayCopiedImages = [
					{
						lastImage: result.imageUri,
						width: newState.maxWidth,
						height: newState.maxHeight,
						quality: newState.quality,
						format: newState.format,
						originImageSrc: imageSrcProp,
					},
				];
				// console.log("NEW STATE", newState)
				setImageSrc(result.imageUri);
				setState(newState);
				setLoadImage(true);
			} else {
				const newState = { ...state };
				newState.originImageSrc = null;
				newState.arrayCopiedImages = [];
				setLoadImage(false);
				setImageSrc(null);
				setState(newState);
			}
		}

		useEffect(() => {
			imageChanged(imageSrc);
		}, [imageSrc]);

		function processConfig() {
			const dataConf = { ...configuration, ...config };
			setConfiguration(dataConf);
		}

		function onUpload(event: any) {
			event.preventDefault();
			imagePicker?.current?.click();
		}

		function handleFileSelect(this: typeof handleFileSelect, event: any) {
			const files = event.target?.files;
			if (files) {
				const file = files[0];
				imageName.current = file.name.split('.')[0];
				fileType.current = file.type;
				if (!fileType.current.includes('image')) return;
				urlImage.current = `data:${file.type};base64,`;
				if (file) {
					setState({ ...state, format: fileType.current.split('image/')[1] });
					const reader = new FileReader();
					reader.onload = handleReaderLoaded.bind(this);
					reader.readAsBinaryString(file);
				}
			}
		}

		async function handleReaderLoaded(readerEvt: any) {
			const binaryString = readerEvt.target.result;
			const base64textString = btoa(binaryString);
			let newState = { ...state };
			const newImageSrc = urlImage.current + base64textString;
			newState.originImageSrc = urlImage.current + base64textString;
			if (configuration.compressInitial) {
				newState = {
					...newState,
					quality: Math.min(configuration.compressInitial || 92, 100),
					maintainAspectRatio: true,
					format: newState.format ? newState.format : 'png',
				};
				const result = await convertImageUsingCanvas(newState.originImageSrc as string, false, newState, {
					getDimFromImage: true,
				});
				setState(result.state);
				setImageSrc(result.imageUri);
				setLoadImage(true);
				if (configuration.onChangeImage) {
					configuration.onChangeImage(result.imageUri);
				}
			} else {
				const img = document.createElement('img');
				img.src = newImageSrc;
				img.onload = () => {
					newState.arrayCopiedImages = [];
					newState.maxHeight = img.height;
					newState.maxWidth = img.width;
					newState.format = fileType.current.split('image/')[1];
					newState.arrayCopiedImages.push({
						lastImage: newImageSrc,
						width: img.width,
						height: img.height,
						quality: newState.quality,
						format: fileType.current.split('image/')[1],
						originImageSrc: newState.originImageSrc as string,
					});
					setState(newState);
					setImageSrc(newImageSrc);
					setLoadImage(true);
					if (configuration.onChangeImage) {
						configuration.onChangeImage(newImageSrc);
					}
				};
			}
		}

		const sizeImage = useMemo(() => {
			if (imageSrc && imageSrc.length) {
				return Math.ceil(((3 / 4) * imageSrc.length) / 1024);
			} else {
				return '';
			}
		}, [imageSrc]);

		function parseToBase64(imageUrl: string): Promise<{ imageUri: string; state: IState }> {
			let newState = { ...state };
			let type: string;

			// Verifica se a URL é base64
			if (imageUrl.startsWith('data:image/')) {
				// Extrai o tipo do formato 'data:image/png;base64,'
				const matches = imageUrl.match(/data:image\/([a-zA-Z]+);base64,/);
				if (matches && matches[1]) {
					type = matches[1];
				} else {
					// Se não houver correspondência, define um tipo padrão
					type = 'png'; // ou qualquer tipo padrão que você preferir
				}
			} else {
				// Trata a URL como um caminho de arquivo
				const types = imageUrl.split('.');
				type = types[types.length - 1];
				if (!['png', 'jpeg', 'webp'].includes(type)) {
					type = 'png'; // ou qualquer tipo padrão que você preferir
				}
			}

			newState.format = type;
			if (config.compressInitial != null) {
				let quality = 1;
				if (config.compressInitial >= 0 && config.compressInitial <= 100) {
					quality = config.compressInitial;
				}
				newState.quality = quality;
			}

			return new Promise((resolve, reject) => {
				const img = document.createElement('img');
				img.crossOrigin = 'Anonymous';
				newState.maxHeight = img.height;
				newState.maxWidth = img.width;

				img.onload = () => {
					const canvas = document.createElement('canvas');
					const ctx: any = canvas.getContext('2d');
					const ratio = 1.0;
					canvas.width = img.width * ratio;
					canvas.height = img.height * ratio;
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
					console.log(newState.quality);
					const dataURI = canvas.toDataURL(`image/${type}`, newState.quality / 100);
					return resolve({
						dataUri: dataURI,
						width: canvas.width,
						height: canvas.height,
					});
				};
				img.onerror = (e: any) => {
					return reject(e.message || `Error loading the src = ${imageUrl}`);
				};
				img.src = imageUrl;
			}).then((data: any) => {
				newState = {
					...newState,
					maxHeight: data.height,
					maxWidth: data.width,
				};
				return { imageUri: data.dataUri, state: newState };
			});
		}

		function onOpenEditPanel() {
			setShowEditPanel(true);
		}

		function onCloseEditPanel(data: any) {
			setShowEditPanel(false);
			if (data) {
				setState(data.state);
				setImageSrc(data.imageSrc);
				if (configuration.onChangeImage) {
					configuration.onChangeImage(data.imageSrc);
				}
			}
		}

		function onRemove() {
			setImageSrc(null);
			setLoadImage(false);
			const newState: IState = {
				...state,
				...initialState,
			};
			setState(newState);
			setShowEditPanel(false);
			if (configuration.onChangeImage) {
				configuration.onChangeImage(undefined);
			}
		}

		return (
			<div className="ArchbaseImagePickerEditor">
				{!loadImage && (
					<div className="place-image">
						<div
							className="image-holder"
							style={{
								width: configuration.width,
								height: configuration.height,
								borderRadius: configuration.borderRadius,
								aspectRatio: configuration.aspectRatio + '',
								background: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
								border: `${rem(1)} solid ${colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
							}}
						>
							<Tooltip withinPortal withArrow label={`${i18next.t('archbase:Upload a image')}`}>
								<ActionIcon component="button" color="blue" className="icon-btn image-upload-btn" onClick={onUpload}>
									<IconCloudUpload color="purple" />
								</ActionIcon>
							</Tooltip>
							<input
								ref={imagePicker}
								type="file"
								style={{ display: 'none' }}
								id={'filePicker-' + uuidFilePicker}
								onChange={handleFileSelect}
							/>
						</div>
					</div>
				)}
				{loadImage && (
					<div className="place-image">
						<div
							className="image-holder-loaded"
							style={{
								width: configuration.width,
								height: configuration.height,
								borderRadius: configuration.borderRadius,
								aspectRatio: configuration.aspectRatio + '',
								background: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
								border: `${rem(1)} solid ${colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
							}}
						>
							<img
								src={imageSrc as string}
								alt="image-loaded"
								style={{
									height: configuration.height,
									borderRadius: configuration.borderRadius,
									objectFit: configuration.objectFit,
									background: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
								}}
							/>
							{!configuration.hideEditBtn && (
								<Fragment>
									<div className="curtain" onClick={onUpload}>
										<Tooltip withinPortal withArrow label={`${i18next.t('archbase:Upload a image')}`}>
											<ActionIcon component="button" color="blue">
												<IconCloudUpload color="white" />
											</ActionIcon>
										</Tooltip>
									</div>
									<input
										ref={imagePicker}
										type="file"
										style={{ display: 'none' }}
										id={'filePicker-' + uuidFilePicker}
										onChange={handleFileSelect}
									/>
								</Fragment>
							)}
						</div>
						{sizeImage && configuration.showImageSize && (
							<div
								className="caption image-caption"
								style={{
									color: sizeImage > 120 ? '#f44336' : 'unset',
									fontWeight: sizeImage > 120 ? '500' : 'unset',
								}}
							>
								<Text>{`${i18next.t('archbase:size')}: ${sizeImage}Kb ${state.format}`}</Text>
							</div>
						)}

						<div
							style={{
								flexDirection: 'row',
								boxSizing: 'border-box',
								display: 'flex',
								placeContent: 'flex-start',
								alignItems: 'flex-start',
							}}
							className="editing-bar-btn"
						>
							{!configuration.hideAddBtn && (
								<Tooltip withinPortal withArrow label={`${i18next.t('archbase:Upload a image')}`}>
									<ActionIcon id="upload-img" color="blue" onClick={onUpload}>
										<IconCloudUpload color="purple" />
									</ActionIcon>
								</Tooltip>
							)}

							{!configuration.hideEditBtn && (
								<Tooltip withinPortal withArrow label={`${i18next.t('archbase:Open the editor panel')}`}>
									<ActionIcon id="edit-img" color="blue" onClick={onOpenEditPanel}>
										<IconPhotoEdit color="teal" />
									</ActionIcon>
								</Tooltip>
							)}
							{!configuration.hideDownloadBtn && (
								<Tooltip withinPortal withArrow label={`${i18next.t('archbase:Download the image')}`}>
									<ActionIcon
										component="a"
										id="download-img"
										href={imageSrc as string}
										color="green"
										download={imageName.current}
									>
										<IconCloudDownload color="green" />
									</ActionIcon>
								</Tooltip>
							)}
							{!configuration.hideDeleteBtn && (
								<Tooltip withinPortal withArrow label={`${i18next.t('archbase:Remove')}`}>
									<ActionIcon id="delete-img" color="red" onClick={() => onRemove()}>
										<IconTrash color="#C91A25" />
									</ActionIcon>
								</Tooltip>
							)}
						</div>
					</div>
				)}
				{showEditPanel && (
					<ArchbaseEditImage
						saveUpdates={onCloseEditPanel}
						color={color}
						image={imageSrc}
						initialState={state}
					></ArchbaseEditImage>
				)}
			</div>
		);
	},
);
