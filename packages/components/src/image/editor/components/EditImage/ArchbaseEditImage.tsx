import { ActionIcon, Button, Text, Tooltip } from '@mantine/core';
import { IconCrop, IconX } from '@tabler/icons-react';
import { IconCheck } from '@tabler/icons-react';
import { useArchbaseTranslation } from '@archbase/core';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { convertImageUsingCanvas, dragElement, saveState } from '../../functions/image-processing';
import { IBasicFilterState, IState } from '../../models/index.models';
import BasicFilter from '../BasicFilters/BasicFilter';
import { ArchbaseCropperWrapper } from '../CropprWrapper/ArchbaseCropperWrapper';
import Input from '../Input/Input';
import TabContainer, { TabItem } from '../Tab/Tab';
import './ArchbaseEditImage.scss';

export interface ArchbaseEditImageProps {
	image: string | null | undefined;
	color: string;
	initialState: IState;
	saveUpdates: Function;
}
const _initialState: IState = {
	quality: 92,
	maxHeight: 1000,
	maxWidth: 1000,
	cropHeight: 150,
	cropWidth: 150,
	maintainAspectRatio: true,
	format: 'png',
	arrayCopiedImages: [],
	originImageSrc: '',
};

const ArchbaseEditImage = memo(
	({ image = '', color = '#1e88e5', initialState = _initialState, saveUpdates = () => {} }: ArchbaseEditImageProps) => {
		const [state, setState] = useState<IState>(initialState);
		const [imageSrc, setImageSrc] = useState<string | null>('');
		const [showCrop, setShowCrop] = useState<boolean>(false);
		const [croppSize, setCroppSize] = useState<{ width: number; height: number }>({ width: 150, height: 150 });
		const [croppState, setCroppState] = useState<
			{ x: number; y: number; width: number; height: number } | undefined | null
		>();

		const isMobile = useRef<boolean>(false);
		const allFormats = ['webp', 'jpeg', 'png'];
		const { t } = useArchbaseTranslation();

		useEffect(() => {
			isMobile.current = window.innerWidth < 800;
			setState(JSON.parse(JSON.stringify({ ...state, ...initialState })));
		}, [initialState]);

		useEffect(() => {
			setImageSrc(image);
		}, [image]);

		useEffect(() => {
			if (!showCrop) {
				setCroppSize({ width: 150, height: 150 });
			}
		}, [showCrop]);

		async function applyChanges(stateIntance: IState, changeHeight = false) {
			try {
				const { state: newState, imageUri } = await convertImageUsingCanvas(
					state.originImageSrc as string,
					changeHeight,
					stateIntance,
				);
				setImageSrc(imageUri);
				setState(newState);
				// console.log("Here", newState);
			} catch (error) {
				console.log('🚀 ~ file: EditImage.tsx ~ line 73 ~ applyChanges ~ error', error);
			}
		}

		async function onUpdateQuality(quality: number) {
			quality = Math.max(Math.min(quality, 100), 1);
			// console.log("🚀 ~ file: EditImage.tsx ~ line 73 ~ onUpdateQuality ~ quality", quality)
			const newState: IState = { ...state, quality };
			setState(newState);
			try {
				await applyChanges(newState, false);
			} catch (error) {
				console.log('onUpdateQuality ~ error', error);
			}
		}

		async function onChangeSize(value: number, changeHeight = false) {
			const m = Math.max(Math.min(value, 4000), 32);
			const newState: IState = { ...state };

			if (changeHeight) {
				if (newState.maxHeight === m) return;
				newState.maxHeight = m;
			} else {
				if (newState.maxWidth === m) return;
				newState.maxWidth = m;
			}
			setState(newState);
			try {
				await applyChanges(newState, changeHeight);
			} catch (error) {
				console.log('onChangeSize ~ error', error);
			}
		}

		async function onChangeFormat(e: any) {
			const newState: IState = { ...state, format: e.target.value };
			try {
				setState(newState);
				await applyChanges(newState, false);
			} catch (error) {
				console.log('onChangeFormat ~ error', error);
			}
		}

		function onChangeCrop(width: number | null, height: number | null) {
			if (width) {
				setState({ ...state, cropWidth: width });
				setCroppSize({ ...croppSize, width: width });
			}
			if (height) {
				setState({ ...state, cropHeight: height });
				setCroppSize({ ...croppSize, height: height });
			}
		}

		function onCrop() {
			let newState: IState = _cloneObject(state);
			const canvas = document.createElement('canvas');
			return new Promise((resolve, reject) => {
				const ctx: any = canvas.getContext('2d');
				const image = new Image();
				image.src = imageSrc as string;
				image.onload = () => {
					const newWidth: any = croppState?.width;
					const newHeight: any = croppState?.height;
					canvas.height = newHeight;
					canvas.width = newWidth;
					ctx.drawImage(
						image,
						Math.abs(croppState?.x as any),
						Math.abs(croppState?.y as any),
						croppState?.width,
						croppState?.height,
						0,
						0,
						croppState?.width,
						croppState?.height,
					);
					return resolve(canvas.toDataURL(`image/${newState.format}`, newState.quality));
				};
				image.onerror = (e) => {
					reject(e);
				};
			})
				.then((dataUri: any) => {
					newState.maxWidth = canvas.width;
					newState.maxHeight = canvas.height;
					newState.originImageSrc = dataUri;
					newState = saveState(newState, dataUri);
					setState(newState);
					setImageSrc(dataUri);
					setShowCrop(false);
				})
				.catch((e) => {
					console.log(e);
				});
		}

		function onCroppUpdate(data: { x: number; y: number; width: number; height: number }) {
			setCroppState(data);
			setState({ ...state, cropHeight: data.height, cropWidth: data.width });
		}

		function onCloseEditPanel(saveChanges = false) {
			setShowCrop(false);
			if (saveChanges) saveUpdates({ state: state, imageSrc: imageSrc });
			else saveUpdates(null);
		}

		async function onRestore() {
			try {
				let newState: IState = _cloneObject(state);
				if (newState.arrayCopiedImages.length > 1) {
					newState.arrayCopiedImages.pop();
					const newValue = newState.arrayCopiedImages[newState.arrayCopiedImages.length - 1];
					newState = {
						...state,
						arrayCopiedImages: newState.arrayCopiedImages,
						maxHeight: newValue.height,
						maxWidth: newValue.width,
						quality: newValue.quality,
						format: newValue.format,
						originImageSrc: newValue.originImageSrc,
						basicFilters: newValue.basicFilters as IBasicFilterState,
					};
					setState(newState);
					setImageSrc(newValue.lastImage);
				}
			} catch (e) {
				console.log('🚀 ~ file: edit-image.component.ts ~ line 126 ~ EditImageComponent ~ onRestore ~ e', e);
			}
		}

		async function onChangeFilters(data: IBasicFilterState) {
			try {
				const newState: IState = _cloneObject(state);
				if (!newState.basicFilters) {
					newState.basicFilters = data;
				} else {
					newState.basicFilters = { ...newState.basicFilters, ...data };
				}
				await applyChanges(newState, false);
			} catch (e) {
				console.log('🚀 ~ file: EditImage.tsx ~ line 259 ~ onChangeFilters ~ e', e);
			}
		}

		const sizeImage = useMemo(() => {
			if (imageSrc && imageSrc.length) {
				return Math.ceil(((3 / 4) * imageSrc.length) / 1024);
			} else {
				return '';
			}
		}, [imageSrc]);

		function _cloneObject(obj: any): any {
			return JSON.parse(JSON.stringify(obj));
		}

		return (
			<div className="ArchbaseEditImage">
				<div id="popup" className="popup">
					<div
						style={{
							flexDirection: 'row',
							boxSizing: 'border-box',
							display: 'flex',
							placeContent: 'center flex-end',
							alignItems: 'center',
							padding: '0px 16px',
						}}
					>
						<button
							className="icon-btn"
							onClick={() => {
								onCloseEditPanel(false);
							}}
						>
							<span className="material-icons">
								<IconX />
							</span>
						</button>
					</div>
					<div className="image-container">
						<div className="image-holder-full">
							{!showCrop && <img id="image-full" src={imageSrc as string} />}
							{showCrop && (
								<ArchbaseCropperWrapper
									src={imageSrc as string}
									size={croppSize}
									croppUpdate={onCroppUpdate}
								></ArchbaseCropperWrapper>
							)}
						</div>

						<div className="control-panel">
							<TabContainer lazy borderLine>
								<TabItem name={`${t('Basic')}`}>
									{(!isMobile.current || (isMobile.current && !showCrop)) && (
										<React.Fragment>
											<div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
												<p className="item-panel">{`${t('Quality')}`}</p>
												<p className="item-panel">{state.quality + '%'}</p>
											</div>

											<div className="flex-row-start">
												<Input
													readOnly={showCrop}
													disabled={showCrop}
													className="input-range"
													onChangedDelayed={onUpdateQuality}
													onChangedValue={(value: number) => {
														setState({ ...state, quality: value });
													}}
													style={{
														maxWidth: '100%',
														width: '100%',
														color: color,
													}}
													type="range"
													min={1}
													max={100}
													value={state.quality}
												/>
											</div>

											<div
												className="item-panel"
												style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}
											>
												{`${t('Max dimensions')}`}
												<div style={{ display: 'flex', alignItems: 'center' }}>
													<input
														disabled={showCrop}
														readOnly={showCrop}
														type="checkbox"
														checked={state.maintainAspectRatio}
														onChange={(e) => setState({ ...state, maintainAspectRatio: e.target.checked })}
														style={{ color: color }}
													/>
													<span className="caption">{`${t('aspect-ratio')}`}</span>
												</div>
											</div>

											<div className="flex-row-start" style={{ marginTop: '10px', justifyContent: 'space-between' }}>
												<div className="form-field" style={{ maxWidth: '48%', width: '48%' }}>
													<label>{`${t('max-width(px)')}`}</label>
													<Input
														readOnly={showCrop}
														disabled={showCrop}
														placeholder={`${t('max-width(px)')}`}
														value={state.maxWidth}
														onChangedValue={(value: number) => setState({ ...state, maxWidth: value })}
														type="number"
														min={0}
														max={2000}
														onInputChangedEnd={(value: number) => {
															onChangeSize(value, false);
														}}
													/>
												</div>

												<div className="form-field" style={{ maxWidth: '48%', width: '48%' }}>
													<label>{`${t('max-height(px)')}`}</label>
													<Input
														readOnly={showCrop}
														disabled={showCrop}
														placeholder={`${t('max-height(px)')}`}
														value={state.maxHeight}
														onChangedValue={(value: number) => setState({ ...state, maxHeight: value })}
														type="number"
														min={0}
														max={2000}
														onInputChangedEnd={(value: number) => {
															onChangeSize(value, true);
														}}
													/>
												</div>
											</div>

											<p className="item-panel">{`${t('Format')}`}</p>
											<div className="flex-row-start" style={{ marginTop: '10px', justifyContent: 'space-between' }}>
												<div className="form-field" style={{ width: '100%' }}>
													<select disabled={showCrop} value={state.format} onChange={onChangeFormat}>
														{allFormats.map((formatItem, index) => (
															<option key={index} value={formatItem}>
																{formatItem}
															</option>
														))}
													</select>
												</div>
											</div>
										</React.Fragment>
									)}

									<div className="flex-row-start" style={{ marginTop: '5px', justifyContent: 'space-between' }}>
										<span style={{ display: 'flex', alignItems: 'center' }}>
											<input
												type="checkbox"
												onChange={(e) => {
													setShowCrop(e.target.checked);
												}}
												checked={showCrop}
												style={{ color: color, marginBottom: '3px' }}
											/>
											<span className="item-panel" style={{ marginLeft: '4px' }}>{`${t('Crop')}`}</span>
										</span>
									</div>
									{showCrop && (
										<React.Fragment>
											<div className="flex-row-start" style={{ marginTop: '10px', justifyContent: 'space-between' }}>
												<div className="form-field" style={{ maxWidth: '48%', width: '48%' }}>
													<label>{`${t('width(px)')}`}</label>
													<Input
														type="number"
														min={0}
														value={state.cropWidth}
														onChangedValue={(value: number) => setState({ ...state, cropWidth: value })}
														onInputChangedEnd={(value: number) => {
															onChangeCrop(+value, null);
														}}
														placeholder={`${t('width(px)')}`}
													/>
												</div>

												<div className="form-field" style={{ maxWidth: '48%', width: '48%' }}>
													<label>{`${t('height(px)')}`}</label>
													<Input
														type="number"
														min={0}
														value={state.cropHeight}
														onInputChangedEnd={(value: number) => {
															onChangeCrop(null, +value);
														}}
														onChangedValue={(value: number) => setState({ ...state, cropHeight: value })}
														placeholder={`${t('height(px)')}`}
													/>
												</div>
											</div>

											<p style={{ marginBottom: '4px !important' }}>
												<Button onClick={onCrop} leftSection={<IconCrop color="orange" />}>
													{`${t('Crop')}`}
												</Button>
											</p>
										</React.Fragment>
									)}
								</TabItem>
								<TabItem disabled={showCrop} name={`${t('Filters')}`}>
									<BasicFilter
										color={color}
										initialState={state.basicFilters}
										changeFilter={onChangeFilters}
									></BasicFilter>
								</TabItem>
							</TabContainer>
							<button
								title={`${t('Undo')}`}
								disabled={state.arrayCopiedImages.length <= 1}
								style={{ position: 'absolute', right: '10px', top: '30px' }}
								className="icon-btn"
								onClick={onRestore}
							>
								<span className="material-icons">{`${t('Refresh')}`}</span>
							</button>
							<div
								className="flex-row-start"
								style={{ marginTop: '10px', justifyContent: 'space-between', alignItems: 'center' }}
							>
								<Button
									leftSection={<IconCheck />}
									color="green"
									onClick={() => {
										onCloseEditPanel(true);
									}}
								>{`${t('archbase:Apply')}`}</Button>
								{sizeImage && (
									<p
										className="caption image-caption"
										style={{
											color: sizeImage > 120 ? '#f44336' : 'unset',
											fontWeight: sizeImage > 120 ? '500' : 'unset',
										}}
									>
										<Text>{`${t('archbase:size')}: ${sizeImage}Kb ${state.format}`}</Text>
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	},
);

export default ArchbaseEditImage;
