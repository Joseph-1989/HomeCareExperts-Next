import { Stack, Typography, Checkbox, OutlinedInput, Tooltip, IconButton, FormControlLabel } from '@mui/material';
import { ServiceCategory, ServiceLocation, ServicePricingModel } from '../../enums/service.enum';
import React, { useCallback, useEffect, useState } from 'react';
import { ServiceOptionsInput, ServicesInquiry, SISearch } from '../../types/service/service.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import RefreshIcon from '@mui/icons-material/Refresh';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: ServicesInquiry;
	setSearchFilter: any;
	initialInput: ServicesInquiry;
}

const Filter = (props: FilterType) => {
	const { initialInput, searchFilter, setSearchFilter } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [serviceLocation, setServiceLocation] = useState<ServiceLocation[]>(Object.values(ServiceLocation));
	const [serviceCategory, setServiceCategory] = useState<ServiceCategory[]>(Object.values(ServiceCategory));
	const [pricingModel, setPricingModel] = useState<ServicePricingModel[]>(Object.values(ServicePricingModel));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);

	console.log('searchFilter', searchFilter);

	console.log('setSearchFilter', setSearchFilter);
	{
		/* //========================================//========================================//========================================//======================================== */
	}
	/** LIFECYCLES **/
	useEffect(() => {
		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			setShowMore(false);
			router
				.push(
					`/service?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/service?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		/* //========================================//========================================//========================================//======================================== */

		if (searchFilter?.search?.categoryList?.length == 0) {
			delete searchFilter.search.categoryList;
			router
				.push(
					`/service?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/service?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}
		{
			/* //========================================//========================================//========================================//======================================== */
		}

		if (searchFilter?.search?.pricingModel?.length == 0) {
			delete searchFilter.search.pricingModel;
			router
				.push(
					`/service?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/service?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}
		{
			/* //========================================//========================================//========================================//======================================== */
		}

		if (searchFilter?.search?.locationList) setShowMore(true);
	}, [searchFilter]);
	{
		/* //========================================//========================================//========================================//======================================== */
	}
	/** HANDLERS **/

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/service?input=${JSON.stringify(initialInput)}`,
				`/service?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	{
		/* //========================================//========================================//========================================//======================================== */
	}

	// Inside the Filter component

	const handleFilterChange = useCallback(
		(key: string, value: any) => {
			setSearchFilter((prevFilter: ServicesInquiry) => {
				const updatedFilter = {
					...prevFilter,
					search: {
						...prevFilter.search,
						[key]: value,
					},
				};

				// Trigger the router push to update the URL and trigger the query
				router.push(`/service?input=${encodeURIComponent(JSON.stringify(updatedFilter))}`, undefined, {
					scroll: false,
				});

				return updatedFilter;
			});
		},
		[router, setSearchFilter],
	);

	{
		/* //========================================//========================================//========================================//======================================== */
	}

	const handleOptionChange = (option: keyof ServiceOptionsInput, value: boolean) => {
		const updatedOptions: ServiceOptionsInput = {
			...searchFilter.search.options,
			[option]: value,
		};

		// Remove false or undefined values to avoid unnecessary fields in the query
		Object.keys(updatedOptions).forEach((key) => {
			if (updatedOptions[key as keyof ServiceOptionsInput] === false) {
				delete updatedOptions[key as keyof ServiceOptionsInput];
			}
		});

		const updatedSearch: SISearch = {
			...searchFilter.search,
			options: Object.keys(updatedOptions).length ? updatedOptions : undefined,
		};

		setSearchFilter({ ...searchFilter, search: updatedSearch });
	};

	{
		/* //========================================//========================================//========================================//======================================== */
	}

	// Pricing Model Handler
	const servicePricingModelSelectHandler = useCallback(
		(e: any) => {
			const { value, checked } = e.target;
			const updatedPricingModels = checked
				? [...(searchFilter.search.pricingModel || []), value]
				: (searchFilter.search.pricingModel || []).filter((model) => model !== value);

			console.log('Updated Pricing Models:', updatedPricingModels);

			handleFilterChange('pricingModel', updatedPricingModels);
		},
		[searchFilter, handleFilterChange],
	);

	{
		/* //========================================//========================================//========================================//======================================== */
	}

	// Category Handler
	const serviceCategorySelectHandler = useCallback(
		(e: any) => {
			const { value, checked } = e.target;
			const updatedCategories = checked
				? [...(searchFilter.search.categoryList || []), value]
				: (searchFilter.search.categoryList || []).filter((category) => category !== value);

			handleFilterChange('categoryList', updatedCategories);
		},
		[searchFilter, handleFilterChange],
	);

	{
		/* //========================================//========================================//========================================//======================================== */
	}

	// Location Handler
	const serviceLocationSelectHandler = useCallback(
		(e: any) => {
			const { value, checked } = e.target;
			const updatedLocations = checked
				? [...(searchFilter.search.locationList || []), value]
				: (searchFilter.search.locationList || []).filter((location) => location !== value);

			handleFilterChange('locationList', updatedLocations);
		},
		[searchFilter, handleFilterChange],
	);

	{
		/* //========================================//========================================//========================================//======================================== */
	}

	// Price Range Handler
	const servicePriceHandler = useCallback(
		(value: number, type: 'start' | 'end') => {
			const updatedPriceSeries = {
				...searchFilter.search.pricesSeries,
				[type]: value,
			};

			handleFilterChange('pricesSeries', updatedPriceSeries);
		},
		[searchFilter, handleFilterChange],
	);

	{
		/* //========================================//========================================//========================================//======================================== */
	}

	if (device === 'mobile') {
		return <div>SERVICES FILTER</div>;
	} else {
		{
			/* //========================================//========================================//========================================//======================================== */
		}
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your Service</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'What are you looking for?'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>

				{/* //========================================//========================================//========================================//======================================== */}

				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Service Category</Typography>
					{serviceCategory.map((type: string) => (
						<Stack className={'input-box'} key={type}>
							<Checkbox
								id={type}
								className="property-checkbox"
								color="default"
								size="small"
								value={type}
								onChange={serviceCategorySelectHandler}
								checked={(searchFilter?.search?.categoryList || []).includes(type as ServiceCategory)}
							/>
							<label style={{ cursor: 'pointer' }}>
								<Typography className="property_type">{type.replace(/_/g, ' ')}</Typography>
							</label>
						</Stack>
					))}
				</Stack>

				{/* //========================================//========================================//========================================//======================================== */}

				<Stack className={'find-your-home'} mb={'30px'}>
					<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
						Location
					</p>
					<Stack
						className={`property-location`}
						style={{ height: showMore ? '253px' : '115px' }}
						onMouseEnter={() => setShowMore(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.locationList) {
								setShowMore(false);
							}
						}}
					>
						{serviceLocation.map((location: string) => {
							return (
								<Stack className={'input-box'} key={location}>
									<Checkbox
										id={location}
										className="property-checkbox"
										color="default"
										size="small"
										value={location}
										checked={(searchFilter?.search?.locationList || []).includes(location as ServiceLocation)}
										onChange={serviceLocationSelectHandler}
									/>
									<label htmlFor={location} style={{ cursor: 'pointer' }}>
										<Typography className="property-type">{location}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>

				{/* //========================================//========================================//========================================//======================================== */}

				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Options</Typography>
					<Stack className={'input-box'}>
						<Checkbox
							id={'DIY'}
							className="property-checkbox"
							color="default"
							size="small"
							value={'assistanceDIY'}
							checked={searchFilter.search?.options?.assistanceDIY || false}
							onChange={(e) => handleOptionChange('assistanceDIY', e.target.checked)}
						/>
						<label htmlFor={'DIY'} style={{ cursor: 'pointer' }}>
							<Typography className="property-type">DIY assistance</Typography>
						</label>
					</Stack>
					<Stack className={'input-box'}>
						<Checkbox
							id={'Subscription'}
							className="property-checkbox"
							color="default"
							size="small"
							value={'subscriptionModel'}
							checked={searchFilter.search?.options?.subscriptionModel || false}
							onChange={(e) => handleOptionChange('subscriptionModel', e.target.checked)}
						/>
						<label htmlFor={'Subscription'} style={{ cursor: 'pointer' }}>
							<Typography className="property-type">Subscription</Typography>
						</label>
					</Stack>
					<Stack className={'input-box'}>
						<Checkbox
							id={'EmergencyServices'}
							className="property-checkbox"
							color="default"
							size="small"
							value={'emergencyServices'}
							checked={searchFilter.search?.options?.emergencyServices || false}
							onChange={(e) => handleOptionChange('emergencyServices', e.target.checked)}
						/>
						<label htmlFor={'EmergencyServices'} style={{ cursor: 'pointer' }}>
							<Typography className="property-type">Emergency Services</Typography>
						</label>
					</Stack>
					<Stack className={'input-box'}>
						<Checkbox
							id={'referralPrograms'}
							className="property-checkbox"
							color="default"
							size="small"
							value={'referralPrograms'}
							checked={searchFilter.search?.options?.referralPrograms || false}
							onChange={(e) => handleOptionChange('referralPrograms', e.target.checked)}
						/>
						<label htmlFor={'referralPrograms'} style={{ cursor: 'pointer' }}>
							<Typography className="property-type">Referral Programs</Typography>
						</label>
					</Stack>
				</Stack>

				{/* //========================================//========================================//========================================//======================================== */}

				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Pricing Model </Typography>
					{pricingModel.map((type: string) => (
						<Stack className={'input-box'} key={type}>
							<Checkbox
								id={type}
								className="property-checkbox"
								color="default"
								size="small"
								value={type}
								onChange={servicePricingModelSelectHandler}
								checked={(searchFilter?.search?.pricingModel || []).includes(type as ServicePricingModel)}
							/>
							<label style={{ cursor: 'pointer' }}>
								<Typography className="property_type">{type.replace(/_/g, ' ')}</Typography>
							</label>
						</Stack>
					))}
				</Stack>

				{/* //========================================//========================================//========================================//======================================== */}

				<Stack className={'find-your-home'}>
					<Typography className={'title'}>Price</Typography>
					<Stack className="square-year-input">
						<div className="input-wrapper">
							<span className="currency">$</span>
							<input
								type="number"
								placeholder="0"
								min={0}
								value={searchFilter?.search?.pricesSeries?.start ?? ''}
								onChange={(e) => {
									const value = Number(e.target.value);
									if (value >= 0) {
										servicePriceHandler(value, 'start');
									}
								}}
							/>
							<span className="min-max-label">min</span>
						</div>
						<div className="central-divider"></div>
						<div className="input-wrapper">
							<span className="currency">$</span>
							<input
								type="number"
								placeholder="0"
								value={searchFilter?.search?.pricesSeries?.end ?? ''}
								onChange={(e) => {
									const value = Number(e.target.value);
									if (value >= 0) {
										servicePriceHandler(value, 'end');
									}
								}}
							/>
							<span className="min-max-label">max</span>
						</div>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
