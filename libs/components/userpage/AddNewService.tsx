import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState, ReactNode } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import axios from 'axios';
import { getJwtToken } from '../../auth';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../sweetAlert';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { GET_SERVICE } from '../../../apollo/user/query';
import { CREATE_SERVICE, UPDATE_SERVICE } from '../../../apollo/user/mutation';
import { ServiceInput } from '../../types/service/service.input';
import { ServiceCategory, ServiceLocation, ServicePricingModel } from '../../enums/service.enum';
import { GrCloudUpload } from 'react-icons/gr';
import { PiCursorClickBold } from 'react-icons/pi';
import { REACT_APP_API_URL } from '../../config';

// ===============================================================================================================================================================

const AddService = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const inputRef = useRef<any>(null);
	const [insertServiceData, setInsertServiceData] = useState<ServiceInput>(initialValues);
	const [serviceCategory, setServiceCategory] = useState<ServiceCategory[]>(Object.values(ServiceCategory));
	const [serviceLocation, setServiceLocation] = useState<ServiceLocation[]>(Object.values(ServiceLocation));
	const token = getJwtToken();
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/
	const [createService] = useMutation(CREATE_SERVICE);
	const [updateService] = useMutation(UPDATE_SERVICE);

	const {
		loading: getServiceLoading,
		data: getServiceData,
		error: getServiceError,
		refetch: getServiceRefetch,
	} = useQuery(GET_SERVICE, {
		fetchPolicy: 'network-only',
		variables: {
			input: router.query.serviceId,
		},
	});

	// ===============================================================================================================================================================

	/** LIFECYCLES **/
	useEffect(() => {
		setInsertServiceData({
			...insertServiceData,
			serviceTitle: getServiceData?.getService ? getServiceData?.getService?.serviceTitle : '',
			servicePrice: getServiceData?.getService ? getServiceData?.getService?.servicePrice : 0,
			serviceCategory: getServiceData?.getService ? getServiceData?.getService?.serviceCategory : '',
			serviceLocation: getServiceData?.getService ? getServiceData?.getService?.serviceLocation : '',
			serviceAddress: getServiceData?.getService ? getServiceData?.getService?.serviceAddress : '',
			assistanceDIY: getServiceData?.getService ? getServiceData?.getService?.assistanceDIY : false,
			subscriptionModel: getServiceData?.getService ? getServiceData?.getService?.subscriptionModel : false,
			emergencyServices: getServiceData?.getService ? getServiceData?.getService?.emergencyServices : false,
			referralPrograms: getServiceData?.getService ? getServiceData?.getService?.referralPrograms : false,
			serviceDescription: getServiceData?.getService ? getServiceData?.getService?.serviceDescription : '',
			pricingModel: getServiceData?.getService ? getServiceData?.getService?.pricingModel : '',
			serviceImages: getServiceData?.getService ? getServiceData?.getService?.serviceImages : [],
		});
	}, [getServiceLoading, getServiceData]);

	// ====================================================================================================================================================================================================================

	/** HANDLERS **/
	async function uploadImages() {
		try {
			const formData = new FormData();
			const selectedFiles = inputRef.current.files;

			if (selectedFiles.length == 0) return false;
			if (selectedFiles.length > 5) throw new Error('Cannot upload more than 5 images!');

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) { 
						imagesUploader(files: $files, target: $target)
				  }`,
					variables: {
						files: [null, null, null, null, null],
						target: 'service',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.files.0'],
					'1': ['variables.files.1'],
					'2': ['variables.files.2'],
					'3': ['variables.files.3'],
					'4': ['variables.files.4'],
				}),
			);
			for (const key in selectedFiles) {
				if (/^\d+$/.test(key)) formData.append(`${key}`, selectedFiles[key]);
			}

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			console.log('+response', response);

			const responseImages = response.data.data.imagesUploader;

			console.log('+responseImages: ', responseImages);

			setInsertServiceData({ ...insertServiceData, serviceImages: responseImages });
		} catch (err: any) {
			console.log('err: ', err.message);
			await sweetMixinErrorAlert(err.message);
		}
	}

	// ===============================================================================================================================================================

	const doDisabledCheck = () => {
		if (
			insertServiceData.serviceTitle === '' ||
			insertServiceData.servicePrice === 0 || // @ts-ignore
			insertServiceData.serviceCategory === '' || // @ts-ignore
			insertServiceData.serviceLocation === '' || // @ts-ignore
			insertServiceData.serviceAddress === '' || // @ts-ignore
			insertServiceData.assistanceDIY === '' || // @ts-ignore
			insertServiceData.subscriptionModel === '' || // @ts-ignore
			insertServiceData.emergencyServices === '' || // @ts-ignore
			insertServiceData.referralPrograms === '' ||
			insertServiceData.serviceDescription === '' || // @ts-ignore
			insertServiceData.pricingModel === '' ||
			insertServiceData.serviceImages.length === 0
		) {
			return true;
		}
	};

	// ===============================================================================================================================================================

	const insertServiceHandler = useCallback(async () => {
		try {
			const result = await createService({
				variables: {
					input: insertServiceData,
				},
			});

			console.log('insertServiceHandler => result', result);
			console.log('insertServiceHandler => insertServiceData', insertServiceData);

			await sweetMixinSuccessAlert('This service has been created successfully.');
			await router.push({
				pathname: '/userpage',
				query: {
					category: 'myServices',
				},
			});
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [insertServiceData]);

	// ===============================================================================================================================================================

	const updateServiceHandler = useCallback(async () => {
		try {
			// @ts-ignore
			insertServiceData._id = getServiceData?.getService?._id;
			const result = await updateService({
				variables: {
					input: insertServiceData,
				},
			});

			console.log('updateServiceHandler = insertServiceData', insertServiceData);
			console.log('updateServiceHandler = result', result);

			await sweetMixinSuccessAlert('This service has been updated successfully.');
			await router.push({
				pathname: '/userpage',
				query: {
					category: 'myServices',
				},
			});
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [insertServiceData]);

	// ==========================================================================================================

	function PricingModelSelect({
		insertServiceData,
		setInsertServiceData,
	}: {
		insertServiceData: ServiceInput;
		setInsertServiceData: React.Dispatch<React.SetStateAction<ServiceInput>>;
	}) {
		const handleChange = (event: SelectChangeEvent<ServicePricingModel>, child: ReactNode) => {
			setInsertServiceData({
				...insertServiceData,
				pricingModel: event.target.value as ServicePricingModel, // Typecast
			});
		};

		return (
			<FormControl className="price-year-after-price">
				<InputLabel id="pricing-model-label" className="title">
					Pricing Model
				</InputLabel>
				<Select
					labelId="pricing-model-label"
					id="pricing-model-select"
					className="select-description"
					value={insertServiceData.pricingModel || ''}
					onChange={handleChange}
				>
					<MenuItem value="">Select</MenuItem> {/* Empty value for default "Select" */}
					{Object.values(ServicePricingModel).map((model) => (
						<MenuItem key={model} value={model}>
							{model.replace(/_/g, ' ')} {/* Replace underscores with spaces for readability */}
						</MenuItem>
					))}
				</Select>
				{/* Consider removing the divider and arrow as they may not be relevant */}
			</FormControl>
		);
	}

	// ====================================================================================================================================================================================================================

	/** RENDER **/

	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	console.log('+insertServiceData', insertServiceData);

	if (device === 'mobile') {
		return <div>ADD NEW SERVICE MOBILE PAGE</div>;

		// ====================================================================================================================================================================================================================
	} else {
		return (
			<div id="add-property-page">
				<Stack className="main-title-box">
					<Typography className="main-title">Add New Service</Typography>
					<Typography className="sub-title">We are glad to see you again!</Typography>
				</Stack>
				{/* // ==================================================================================================================================================================================================================== */}
				<div>
					<Stack className="config">
						<Stack className="description-box">
							{/* // ==================================================================================================================================================================================================================== */}

							<Stack className="config-column">
								<Typography className="title">Title</Typography>
								<input
									type="text"
									className="description-input"
									placeholder={'Title'}
									value={insertServiceData.serviceTitle}
									onChange={({ target: { value } }) =>
										setInsertServiceData({ ...insertServiceData, serviceTitle: value })
									}
								/>
							</Stack>

							{/* // ==================================================================================================================================================================================================================== */}

							<Stack className="config-row">
								{/* // ==================================================================================================================================================================================================================== */}

								<Stack className="price-year-after-price">
									<Typography className="title">Price</Typography>
									<input
										type="text"
										className="description-input"
										placeholder={'Price'}
										value={insertServiceData.servicePrice}
										onChange={({ target: { value } }) =>
											setInsertServiceData({ ...insertServiceData, servicePrice: parseInt(value) })
										}
									/>
								</Stack>

								{/* // ==================================================================================================================================================================================================================== */}

								<Stack className="price-year-after-price">
									<Typography className="title">Select Category</Typography>
									<select
										className={'select-description'}
										defaultValue={insertServiceData.serviceCategory || 'select'}
										value={insertServiceData.serviceCategory || 'select'}
										onChange={({ target: { value } }) =>
											// @ts-ignore
											setInsertServiceData({ ...insertServiceData, serviceCategory: value })
										}
									>
										<>
											<option selected={true} disabled={true} value={'select'}>
												Select
											</option>
											{serviceCategory.map((type: any) => (
												<option value={`${type}`} key={type}>
													{type}
												</option>
											))}
										</>
									</select>
									<div className={'divider'}></div>
									<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
								</Stack>

								{/* // ==================================================================================================================================================================================================================== */}
							</Stack>

							{/* // ==================================================================================================================================================================================================================== */}

							<Stack className="config-row">
								{/* // ==================================================================================================================================================================================================================== */}

								<Stack className="price-year-after-price">
									<Typography className="title">Select Location</Typography>
									<select
										className={'select-description'}
										defaultValue={insertServiceData.serviceLocation || 'select'}
										value={insertServiceData.serviceLocation || 'select'}
										onChange={({ target: { value } }) =>
											// @ts-ignore
											setInsertServiceData({ ...insertServiceData, serviceLocation: value })
										}
									>
										<>
											<option selected={true} disabled={true} value={'select'}>
												Select
											</option>
											{serviceLocation.map((location: any) => (
												<option value={`${location}`} key={location}>
													{location}
												</option>
											))}
										</>
									</select>
									<div className={'divider'}></div>
									<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
								</Stack>

								{/* // ==================================================================================================================================================================================================================== */}

								<Stack className="price-year-after-price">
									<Typography className="title">Address</Typography>
									<input
										type="text"
										className="description-input"
										placeholder={'Address'}
										value={insertServiceData.serviceAddress}
										onChange={({ target: { value } }) =>
											setInsertServiceData({ ...insertServiceData, serviceAddress: value })
										}
									/>
								</Stack>

								{/* // ==================================================================================================================================================================================================================== */}
							</Stack>

							{/* // ==================================================================================================================================================================================================================== */}

							<Stack className="config-row">
								{/* // ==================================================================================================================================================================================================================== */}

								<Stack className="price-year-after-price">
									<Typography className="title">DIY Assistance</Typography>
									<select
										className={'select-description'}
										value={insertServiceData.assistanceDIY ? 'yes' : 'no'}
										defaultValue={insertServiceData.assistanceDIY ? 'yes' : 'no'}
										onChange={({ target: { value } }) =>
											setInsertServiceData({ ...insertServiceData, assistanceDIY: value === 'yes' })
										}
									>
										<option disabled={true} selected={true}>
											Select
										</option>
										<option value={'yes'}>Yes</option>
										<option value={'no'}>No</option>
									</select>
									<div className={'divider'}></div>
									<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
								</Stack>

								{/* // ==================================================================================================================================================================================================================== */}

								<Stack className="price-year-after-price">
									<Typography className="title">Subscription Model</Typography>
									<select
										className={'select-description'}
										value={insertServiceData.subscriptionModel ? 'yes' : 'no'}
										defaultValue={insertServiceData.subscriptionModel ? 'yes' : 'no'}
										onChange={({ target: { value } }) =>
											setInsertServiceData({ ...insertServiceData, subscriptionModel: value === 'yes' })
										}
									>
										<option disabled={true} selected={true}>
											Select
										</option>
										<option value={'yes'}>Yes</option>
										<option value={'no'}>No</option>
									</select>
									<div className={'divider'}></div>
									<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
								</Stack>

								{/* // ==================================================================================================================================================================================================================== */}

								<Stack className="price-year-after-price">
									<Typography className="title">Emergency Services</Typography>
									<select
										className={'select-description'}
										value={insertServiceData.emergencyServices ? 'yes' : 'no'}
										defaultValue={insertServiceData.emergencyServices ? 'yes' : 'no'}
										onChange={({ target: { value } }) =>
											setInsertServiceData({ ...insertServiceData, emergencyServices: value === 'yes' })
										}
									>
										<option disabled={true} selected={true}>
											Select
										</option>
										<option value={'yes'}>Yes</option>
										<option value={'no'}>No</option>
									</select>
									<div className={'divider'}></div>
									<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
								</Stack>

								{/* // ==================================================================================================================================================================================================================== */}

								<Stack className="price-year-after-price">
									<Typography className="title">Referral Programs</Typography>
									<select
										className={'select-description'}
										value={insertServiceData.referralPrograms ? 'yes' : 'no'}
										defaultValue={insertServiceData.referralPrograms ? 'yes' : 'no'}
										onChange={({ target: { value } }) =>
											setInsertServiceData({ ...insertServiceData, referralPrograms: value === 'yes' })
										}
									>
										<option disabled={true} selected={true}>
											Select
										</option>
										<option value={'yes'}>Yes</option>
										<option value={'no'}>No</option>
									</select>
									<div className={'divider'}></div>
									<img src={'/img/icons/Vector.svg'} className={'arrow-down'} />
								</Stack>

								{/* // ==================================================================================================================================================================================================================== */}
							</Stack>

							{/* // ==================================================================================================================================================================================================================== */}

							<Stack className="config-row">
								<PricingModelSelect insertServiceData={insertServiceData} setInsertServiceData={setInsertServiceData} />
							</Stack>

							<Typography className="Service-title">Service Description</Typography>
							<Stack className="config-column">
								<Typography className="title">Description</Typography>
								<textarea
									name=""
									id=""
									className="description-text"
									value={insertServiceData.serviceDescription}
									onChange={({ target: { value } }) =>
										setInsertServiceData({ ...insertServiceData, serviceDescription: value })
									}
								></textarea>
							</Stack>

							{/* // ==================================================================================================================================================================================================================== */}
						</Stack>

						<Typography className="upload-title">Upload photos of your Service</Typography>
						<Stack className="images-box">
							{/* // ==================================================================================================================================================================================================================== */}

							<Stack className="upload-box">
								<GrCloudUpload size={165} color="gray" />

								<Stack className="text-box">
									<Typography className="drag-title">Drag and drop images here</Typography>
									<Typography className="format-title">Photos must be JPEG or PNG format and least 2048x768</Typography>
								</Stack>
								<Button
									className="browse-button"
									onClick={() => {
										inputRef.current.click();
									}}
								>
									<Typography className="browse-button-text">Browse Files</Typography>
									<input
										ref={inputRef}
										type="file"
										hidden={true}
										onChange={uploadImages}
										multiple={true}
										accept="image/jpg, image/jpeg, image/png"
									/>
									<PiCursorClickBold size={24} />
								</Button>
							</Stack>

							{/* // ==================================================================================================================================================================================================================== */}

							<Stack className="gallery-box">
								{insertServiceData?.serviceImages.map((image: string) => {
									const imagePath: string = `${REACT_APP_API_URL}/${image}`;
									return (
										<Stack className="image-box">
											<img src={imagePath} alt="" />
										</Stack>
									);
								})}
							</Stack>

							{/* // ==================================================================================================================================================================================================================== */}
						</Stack>

						{/* // ==================================================================================================================================================================================================================== */}

						<Stack className="buttons-row">
							{router.query.serviceId ? (
								<Button className="next-button" disabled={doDisabledCheck()} onClick={updateServiceHandler}>
									<Typography className="next-button-text">Save</Typography>
								</Button>
							) : (
								<Button className="next-button" disabled={doDisabledCheck()} onClick={insertServiceHandler}>
									<Typography className="next-button-text">Save</Typography>
								</Button>
							)}
						</Stack>

						{/* // ==================================================================================================================================================================================================================== */}
					</Stack>
				</div>
			</div>
		);
	}
};

AddService.defaultProps = {
	initialValues: {
		serviceTitle: '',
		servicePrice: 0,
		serviceCategory: '',
		serviceLocation: '',
		serviceAddress: '',
		assistanceDIY: '',
		subscriptionModel: '',
		emergencyServices: '',
		referralPrograms: '',
		serviceDescription: '',
		pricingModel: '',
		serviceImages: [],
	},
};

export default AddService;
