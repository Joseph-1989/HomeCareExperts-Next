import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Service } from '../../types/service/service';

interface FilterComponentProps {
	services: Service[];
}

interface YearCheck {
	start: number;
	end: number;
}

const CreatedDateFilterComponent: React.FC<FilterComponentProps> = ({ services }) => {
	const currentYear = new Date().getFullYear();
	const [yearCheck, setYearCheck] = useState<YearCheck>({ start: 1970, end: currentYear });
	const [filteredServices, setFilteredServices] = useState<Service[]>(services);

	// Change these functions to use SelectChangeEvent<number> instead of React.ChangeEvent<{ value: unknown }>
	const handleYearStartChange = (event: SelectChangeEvent<number>) => {
		const newStartYear = Number(event.target.value);
		setYearCheck((prev) => ({ ...prev, start: newStartYear }));
	};

	const handleYearEndChange = (event: SelectChangeEvent<number>) => {
		const newEndYear = Number(event.target.value);
		setYearCheck((prev) => ({ ...prev, end: newEndYear }));
	};

	useEffect(() => {
		const filterServicesByYear = (services: Service[], yearCheck: YearCheck): Service[] => {
			if (!Array.isArray(services)) {
				return []; // Return an empty array if services is not an array
			}

			return services.filter((service) => {
				const serviceYear = new Date(service.createdAt).getFullYear();
				return serviceYear >= yearCheck.start && serviceYear <= yearCheck.end;
			});
		};

		// Call filterServicesByYear with your data
		const filteredServices = filterServicesByYear(services, yearCheck);

		setFilteredServices(filteredServices); // Set filtered services state
	}, [services, yearCheck]);

	return (
		<div>
			<div className={'row-box'} style={{ marginTop: '44px' }}>
				<div className={'box'}>
					<span>Year Created</span>
					<div className={'inside space-between align-center'}>
						<FormControl sx={{ width: '122px' }}>
							<Select
								value={yearCheck.start} // No need for toString()
								onChange={handleYearStartChange}
								displayEmpty
								inputProps={{ 'aria-label': 'Without label' }}
							>
								{Array.from({ length: currentYear - 1969 }, (_, i) => 1970 + i).map((year) => (
									<MenuItem value={year} disabled={yearCheck.end <= year} key={year}>
										{year}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<div className={'minus-line'}></div>
						<FormControl sx={{ width: '122px' }}>
							<Select
								value={yearCheck.end} // No need for toString()
								onChange={handleYearEndChange}
								displayEmpty
								inputProps={{ 'aria-label': 'Without label' }}
							>
								{Array.from({ length: currentYear - 1969 }, (_, i) => 1970 + i).map((year) => (
									<MenuItem value={year} disabled={yearCheck.start >= year} key={year}>
										{year}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
				</div>
			</div>

			{/* Display filtered services */}
			<div>
				{filteredServices && filteredServices.length > 0 ? (
					filteredServices.map((service) => (
						<div key={service._id}>
							<h4>{service.serviceTitle}</h4>
						</div>
					))
				) : (
					<p>No services available</p>
				)}
			</div>
		</div>
	);
};

export default CreatedDateFilterComponent;
