import React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, Divider, FormControl, MenuItem, Modal, Select, SelectChangeEvent, Stack } from '@mui/material';
import { ServiceCategory, ServiceLocation, ServicePricingModel } from '../../enums/service.enum';
import { ServiceOptionsInput, ServicesInquiry } from '../../types/service/service.input';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import CloseIcon from '@mui/icons-material/Close';
import { serviceYears } from '../../config';
import { Service } from '../../types/service/service';
import CreatedDateFilterComponent from './CreatedDateFilterComponent';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'auto',
	bgcolor: 'background.paper',
	borderRadius: '12px',
	outline: 'none',
	boxShadow: 24,
};

const categoryImages = [
	'/img/banner/types/assambly.png',
	'/img/banner/types/mounting.jpeg',
	'/img/banner/types/moving.png',
	'/img/banner/types/gardening.webp',
	'/img/banner/types/repairing.jpg',
	'/img/banner/types/assambly.jpeg',
	'/img/banner/types/kitchen-remodeling.webp',
	'/img/banner/types/build-a-house.jpg',
	'/img/banner/types/roof-replacement.jpeg',
	'/img/banner/types/plumbing.webp',
	'/img/banner/types/electirician.jpg',
	'/img/banner/types/hvac.webp',
	'/img/banner/types/cleaning.jpg',
	'/img/banner/types/painting.png',
	'/img/banner/types/remodeling.jpg',
	'/img/banner/types/landscaping.jpeg',
	'/img/banner/types/pest-control.webp',
	'/img/banner/types/Handyman.jpg',
	// Add more categories and their corresponding image filenames
];

const modelImages = [
	'/img/banner/pricing-models/hourly-rate.webp',
	'/img/banner/pricing-models/flat-fee-on-blocks.avif',
	'/img/banner/pricing-models/flat-fee.jpg',
	'/img/banner/pricing-models/flat-fee-per-project.jpg',
	'/img/banner/pricing-models/hourly-rate.jpg',
	'/img/banner/pricing-models/free-estimates.webp',

	// Add more categories and their corresponding image filenames
];

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

const thisYear = new Date().getFullYear();

interface HeaderServiceFilterProps {
	initialInput: ServicesInquiry;
}

const HeaderServiceFilter = (props: HeaderServiceFilterProps) => {
	const { initialInput } = props;
	const [optionCheck, setOptionCheck] = useState<string>('all');
	const [categoryCheck, setCategoryCheck] = useState<string>('all');
	const [modelCheck, setModelCheck] = useState<string>('all');
	const [serviceLocation, setServiceLocation] = useState<ServiceLocation[]>(Object.values(ServiceLocation));
	const [serviceCategory, setServiceCategory] = useState<ServiceCategory[]>(Object.values(ServiceCategory));
	const [pricingModel, setPricingModel] = useState<ServicePricingModel[]>(Object.values(ServicePricingModel));
	const [searchFilter, setSearchFilter] = useState<ServicesInquiry>(initialInput);
	const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
	const [openCategory, setOpenCategory] = useState(false);
	const [openLocation, setOpenLocation] = useState(false);
	const [openModel, setOpenModel] = useState(false);
	const { t } = useTranslation('common');
	const router = useRouter();
	const locationRef = useRef<HTMLDivElement | null>(null);
	const typeRef = useRef<HTMLDivElement | null>(null);
	const modelRef = useRef<HTMLDivElement | null>(null);

	const device = useDeviceDetect();

	/** LIFECYCLES **/
	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
				setOpenLocation(false);
			}

			if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
				setOpenCategory(false);
			}

			if (modelRef.current && !modelRef.current.contains(event.target as Node)) {
				setOpenModel(false);
			}
		};

		document.addEventListener('mousedown', clickHandler);

		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, []);

	/** HANDLERS **/

	const advancedFilterHandler = useCallback((status: boolean) => {
		setOpenLocation(false);
		setOpenModel(false);
		setOpenCategory(false);
		setOpenAdvancedFilter(status);
	}, []);

	const locationStateChangeHandler = () => {
		setOpenLocation((prev) => !prev);
		setOpenModel(false);
		setOpenCategory(false);
	};

	const categoryStateChangeHandler = () => {
		setOpenCategory((prev) => !prev);
		setOpenModel(false);
		setOpenLocation(false);
	};

	const modelsStateChangeHandler = () => {
		setOpenModel((prev) => !prev);
		setOpenLocation(false);
		setOpenCategory(false);
	};

	const serviceLocationSelectHandler = useCallback(
		async (value: ServiceLocation) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						locationList: [value],
					},
				});
				locationStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, serviceLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const serviceCategorySelectHandler = useCallback(
		async (value: ServiceCategory) => {
			try {
				setSearchFilter((prev) => ({
					...prev,
					search: {
						...prev?.search, // Use optional chaining here to avoid the error
						categoryList: [value],
					},
				}));
				categoryStateChangeHandler(); // Close the category dropdown after selection
			} catch (err: any) {
				console.log('ERROR, serviceCategorySelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const pricingModelSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter((prev) => ({
					...prev,
					search: {
						...prev?.search, // Use optional chaining here to avoid the error
						pricingModel: [value],
					},
				}));
				categoryStateChangeHandler(); // Close the category dropdown after selection
			} catch (err: any) {
				console.log('ERROR, pricingModelSelectHandler:', err);
			}
		},
		[searchFilter], // Add dependencies if needed
	);

	const serviceOptionSelectHandler = useCallback((option: keyof ServiceOptionsInput) => {
		setSearchFilter((prev) => {
			const updatedOptions = { ...prev.search.options };

			// Toggle the option
			updatedOptions[option] = !updatedOptions[option];

			// Remove the option if it becomes false
			if (!updatedOptions[option]) {
				delete updatedOptions[option];
			}

			return {
				...prev,
				search: {
					...prev.search,
					options: updatedOptions,
				},
			};
		});
	}, []);

	const resetFilterHandler = () => {
		setSearchFilter(initialInput);
		setCategoryCheck('all'); // Reset the option check state
		setOptionCheck('all'); // Reset the option check state
		setModelCheck('all'); // Reset the model check state
	};

	const pushSearchHandler = async () => {
		// Clean up empty filters before pushing
		const cleanedSearch = { ...searchFilter.search };

		if (!cleanedSearch.locationList?.length) delete cleanedSearch.locationList;
		if (!cleanedSearch.categoryList?.length) delete cleanedSearch.categoryList;
		if (!cleanedSearch.pricingModel?.length) delete cleanedSearch.pricingModel;
		if (!cleanedSearch.options) delete cleanedSearch.options;

		await router.push(`/service?input=${JSON.stringify({ ...searchFilter, search: cleanedSearch })}`);
	};

	type PricingModelType = ServicePricingModel | 'all';

	if (device === 'mobile') {
		return <div>HEADER FILTER MOBILE</div>;
	} else {
		return (
			<>
				<Stack className={'search-box'}>
					<Stack className={'select-box'}>
						<Box component={'div'} className={`box ${openLocation ? 'on' : ''}`} onClick={locationStateChangeHandler}>
							<span>{searchFilter?.search?.locationList ? searchFilter?.search?.locationList[0] : t('Location')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box component={'div'} className={`box ${openCategory ? 'on' : ''}`} onClick={categoryStateChangeHandler}>
							<span>
								{searchFilter?.search?.categoryList?.[0]
									? searchFilter.search.categoryList[0].replace(/_/g, ' ')
									: t('Service category')}
							</span>
							<ExpandMoreIcon />
						</Box>

						<Box className={`box ${openModel ? 'on' : ''}`} onClick={modelsStateChangeHandler}>
							<span>
								{searchFilter?.search?.pricingModel
									? searchFilter?.search?.pricingModel[0].replace(/_/g, ' ')
									: t('Pricing Model')}
							</span>
							<ExpandMoreIcon />
						</Box>
					</Stack>
					<Stack className={'search-box-other'}>
						<Box className={'advanced-filter'} onClick={() => advancedFilterHandler(true)}>
							<img src="/img/icons/tune.svg" alt="" />
							<span>{t('Advanced')}</span>
						</Box>
						<Box className={'search-btn'} onClick={pushSearchHandler}>
							<img src="/img/icons/search_white.svg" alt="" />
						</Box>
					</Stack>

					{/*MENU */}
					<div className={`filter-location ${openLocation ? 'on' : ''}`} ref={locationRef}>
						{serviceLocation.map((location: ServiceLocation) => {
							return (
								<div onClick={() => serviceLocationSelectHandler(location)} key={location}>
									<img src={`img/banner/cities/${location}.webp`} alt={location} />
									<span>{location}</span>
								</div>
							);
						})}
					</div>

					<div className={`filter-location ${openCategory ? 'on' : ''}`} ref={typeRef}>
						{serviceCategory.map((category: ServiceCategory, index) => {
							return (
								<div onClick={() => serviceCategorySelectHandler(category)} key={category}>
									<img src={categoryImages[index]} alt={category} />
									<span>{category.replace(/_/g, ' ')}</span>
								</div>
							);
						})}
					</div>

					<div className={`filter-type ${openModel ? 'on' : ''}`} ref={modelRef}>
						{pricingModel.map((model, index) => {
							return (
								<div onClick={() => pricingModelSelectHandler(model)} key={model}>
									<img src={modelImages[index]} alt={model} />
									<span>{model.replace(/_/g, ' ')}</span>
								</div>
							);
						})}
					</div>
				</Stack>

				<Modal
					open={openAdvancedFilter}
					onClose={() => advancedFilterHandler(false)}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					{/* @ts-ignore */}
					<Box sx={style}>
						<Box className={'advanced-filter-modal'}>
							<div className={'close'} onClick={() => advancedFilterHandler(false)}>
								<CloseIcon />
							</div>
							<div className={'top'}>
								<span>Find your home</span>
								<div className={'search-input-box'}>
									<img src="/img/icons/search.svg" alt="" />
									<input
										value={searchFilter?.search?.text ?? ''}
										type="text"
										placeholder={'What are you looking for?'}
										onChange={(e: any) => {
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: e.target.value },
											});
										}}
									/>
								</div>
							</div>
							<Divider sx={{ mt: '30px', mb: '35px' }} />
							<div className={'middle'}>
								<div className={'row-box'}>
									<div className={'box'}>
										<span>Premium Add-Ons</span>
										<div className={'inside'}>
											<div className="options-filter">
												<div className="filter-group">
													<label>
														<input
															type="checkbox"
															checked={searchFilter?.search?.options?.assistanceDIY || false}
															onChange={() => serviceOptionSelectHandler('assistanceDIY')}
														/>
														DIY Assistance
													</label>
													<label>
														<input
															type="checkbox"
															checked={searchFilter?.search?.options?.subscriptionModel || false}
															onChange={() => serviceOptionSelectHandler('subscriptionModel')}
														/>
														Subscription
													</label>
													<label>
														<input
															type="checkbox"
															checked={searchFilter?.search?.options?.emergencyServices || false}
															onChange={() => serviceOptionSelectHandler('emergencyServices')}
														/>
														Emergency Services
													</label>
													<label>
														<input
															type="checkbox"
															checked={searchFilter?.search?.options?.referralPrograms || false}
															onChange={() => serviceOptionSelectHandler('referralPrograms')}
														/>
														Referral Programs
													</label>
												</div>
											</div>
										</div>
									</div>
								</div>

								<Divider sx={{ mt: '30px', mb: '35px' }} />

								<div className={'row-box'} style={{ marginTop: '44px' }}>
									<div className={'box'}>
										<span>Select a Service Category</span>
										<div className={'inside'}>
											<FormControl>
												<Select
													value={searchFilter?.search?.categoryList?.[0] || 'all'} // Default to 'all' if no category is selected
													onChange={(e) => {
														const selectedCategory = e.target.value as string; // First cast as string
														setSearchFilter((prev) => ({
															...prev,
															search: {
																...prev?.search,
																categoryList: selectedCategory !== 'all' ? [selectedCategory as ServiceCategory] : [], // Cast as ServiceCategory only if not 'all'
															},
														}));
													}}
													displayEmpty
													inputProps={{ 'aria-label': 'Service Category' }}
												>
													<MenuItem value={'all'}>All Categories</MenuItem>
													{serviceCategory.map((category) => (
														<MenuItem value={category} key={category}>
															{category.replace(/_/g, ' ')}{' '}
															{/* Replace underscores with spaces for better readability */}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</div>
									</div>
								</div>

								<Divider sx={{ mt: '30px', mb: '35px' }} />

								<div className={'row-box'}>
									<div className={'box'}>
										<span>Select A Location</span>
										<div className={'inside'}>
											<FormControl>
												<Select
													value={searchFilter?.search?.locationList?.[0] || 'all'}
													onChange={(e) => {
														const selectedLocation = e.target.value as string;
														setSearchFilter((prev) => ({
															...prev,
															search: {
																...prev.search,
																locationList: selectedLocation !== 'all' ? [selectedLocation as ServiceLocation] : [],
															},
														}));
													}}
													displayEmpty
													inputProps={{ 'aria-label': 'Location' }}
												>
													<MenuItem value={'all'}>All Locations</MenuItem>
													{serviceLocation.map((location) => (
														<MenuItem value={location} key={location}>
															{location}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</div>
									</div>
								</div>

								<Divider sx={{ mt: '30px', mb: '35px' }} />

								<div className={'row-box'}>
									<div className={'box'}>
										<span>Select A Pricing Model</span>
										<div className={'inside'}>
											<FormControl>
												<Select
													value={searchFilter?.search?.pricingModel?.[0] || 'all'}
													onChange={(e) => {
														const selectedLocation = e.target.value as string;
														setSearchFilter((prev) => ({
															...prev,
															search: {
																...prev.search,
																pricingModel:
																	selectedLocation !== 'all' ? [selectedLocation as ServicePricingModel] : [],
															},
														}));
													}}
													displayEmpty
													inputProps={{ 'aria-label': 'Pricing Model' }}
												>
													<MenuItem value={'all'}>All Pricing Models</MenuItem>
													{pricingModel.map((location) => (
														<MenuItem value={location} key={location}>
															{location.replace(/_/g, ' ')}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
							</div>

							<Divider sx={{ mt: '60px', mb: '18px' }} />
							<div className={'bottom'}>
								<div onClick={resetFilterHandler}>
									<img src="/img/icons/reset.svg" alt="" />
									<span>Reset all filters</span>
								</div>
								<Button
									startIcon={<img src={'/img/icons/search.svg'} />}
									className={'search-btn'}
									onClick={pushSearchHandler}
								>
									Search
								</Button>
							</div>
						</Box>
					</Box>
				</Modal>
			</>
		);
	}
};

HeaderServiceFilter.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		search: {
			pricesSeries: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default HeaderServiceFilter;
