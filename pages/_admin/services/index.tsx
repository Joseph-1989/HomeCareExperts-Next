import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { REMOVE_SERVICE_BY_ADMIN, UPDATE_SERVICE_BY_ADMIN } from '../../../apollo/admin/mutation';
import { GET_ALL_SERVICES_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { AllServicesInquiry } from '../../../libs/types/service/service.input';
import { Service } from '../../../libs/types/service/service';
import { ServiceLocation, ServiceStatus } from '../../../libs/enums/service.enum';
import { ServiceUpdate } from '../../../libs/types/service/service.update';
import { ServicePanelList } from '../../../libs/components/admin/services/ServiceList';
import { useMutation, useQuery } from '@apollo/client';

const AdminServices: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [servicesInquiry, setServicesInquiry] = useState<AllServicesInquiry>(initialInquiry);
	const [services, setServices] = useState<Service[]>([]);
	const [servicesTotal, setServicesTotal] = useState<number>(0);
	const [value, setValue] = useState(
		servicesInquiry?.search?.serviceStatus ? servicesInquiry?.search?.serviceStatus : 'ALL',
	);
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/

	const [updateServiceByAdmin] = useMutation(UPDATE_SERVICE_BY_ADMIN);
	const [removeServiceByAdmin] = useMutation(REMOVE_SERVICE_BY_ADMIN);

	const {
		loading: getAllServicesByAdminLoading,
		data: getAllServicesByAdminData,
		error: getAllServicesByAdminError,
		refetch: getAllServicesByAdminRefetch,
	} = useQuery(GET_ALL_SERVICES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: servicesInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setServices(data?.getAllServicesByAdmin?.list);
			setServicesTotal(data?.getAllServicesByAdmin?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/

	useEffect(() => {
		getAllServicesByAdminRefetch({ input: servicesInquiry }).then();
	}, [servicesInquiry]);

	/** HANDLERS **/

	const changePageHandler = async (event: unknown, newPage: number) => {
		servicesInquiry.page = newPage + 1; // Update page in the inquiry object

		await getAllServicesByAdminRefetch({ input: servicesInquiry });
		setServicesInquiry({ ...servicesInquiry }); // Update state after refetch
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const newLimit = parseInt(event.target.value, 10);
		servicesInquiry.limit = newLimit; // Update limit in the inquiry object
		servicesInquiry.page = 1; // Reset page to 1 when limit changes

		await getAllServicesByAdminRefetch({ input: servicesInquiry });
		setServicesInquiry({ ...servicesInquiry }); // Update state after refetch
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setServicesInquiry({ ...servicesInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'AVILABLE':
				setServicesInquiry({ ...servicesInquiry, search: { serviceStatus: ServiceStatus.AVAILABLE } });
				break;
			case 'NOT_AVAILABLE':
				setServicesInquiry({ ...servicesInquiry, search: { serviceStatus: ServiceStatus.NOT_AVAILABLE } });
				break;
			case 'DELETED':
				setServicesInquiry({ ...servicesInquiry, search: { serviceStatus: ServiceStatus.DELETED } });
				break;
			default:
				delete servicesInquiry?.search?.serviceStatus;
				setServicesInquiry({ ...servicesInquiry });
				break;
		}
	};

	const removeServiceHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				// Confirmation prompt
				await removeServiceByAdmin({
					variables: {
						input: id,
					},
				});

				await getAllServicesByAdminRefetch({ input: servicesInquiry });
			}
		} catch (err: any) {
			sweetErrorHandling(err).then();
		} finally {
			menuIconCloseHandler(); // Close the menu after removal, regardless of success or failure
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setServicesInquiry({
					...servicesInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...servicesInquiry.search,
						serviceLocationList: [newValue as ServiceLocation],
					},
				});
			} else {
				delete servicesInquiry?.search?.serviceLocationList;
				setServicesInquiry({ ...servicesInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updateServiceHandler = async (updateData: ServiceUpdate) => {
		try {
			console.log('+updateData:', updateData);

			await updateServiceByAdmin({
				variables: {
					input: updateData,
				},
			});

			menuIconCloseHandler();
			await getAllServicesByAdminRefetch({ input: servicesInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Service List
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'AVAILABLE')}
									value="AVAILABLE"
									className={value === 'AVAILABLE' ? 'li on' : 'li'}
								>
									Available
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'NOT_AVAILABLE')}
									value="NOT_AVAILABLE"
									className={value === 'NOT_AVAILABLE' ? 'li on' : 'li'}
								>
									Not available
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'DELETED')}
									value="DELETED"
									className={value === 'DELETED' ? 'li on' : 'li'}
								>
									Deleted
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={searchType}>
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
										ALL
									</MenuItem>
									{Object.values(ServiceLocation).map((location: string) => (
										<MenuItem value={location} onClick={() => searchTypeHandler(location)} key={location}>
											{location}
										</MenuItem>
									))}
								</Select>
							</Stack>
							<Divider />
						</Box>
						<ServicePanelList
							services={services}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateServiceHandler={updateServiceHandler}
							removeServiceHandler={removeServiceHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={servicesTotal}
							rowsPerPage={servicesInquiry?.limit}
							page={servicesInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminServices.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminServices);
