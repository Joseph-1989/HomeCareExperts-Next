import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { T } from '../../types/common';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { UPDATE_SERVICE } from '../../../apollo/user/mutation';
import { GET_AGENT_SERVICES } from '../../../apollo/user/query';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';
import { AgentServicesInquiry } from '../../types/service/service.input';
import { Service } from '../../types/service/service';
import { ServiceStatus } from '../../enums/service.enum';
import { ServiceCard } from './ServiceCard';

const MyServices: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<AgentServicesInquiry>(initialInput);
	const [agentServices, setAgentServices] = useState<Service[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/
	const [updateService] = useMutation(UPDATE_SERVICE);

	const {
		loading: getAgentServicesLoading,
		data: getAgentServicesData,
		error: getAgentServicesError,
		refetch: getAgentServicesRefetch,
	} = useQuery(GET_AGENT_SERVICES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentServices(data?.getAgentServices?.list);
			setTotal(data?.getAgentServices?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: ServiceStatus) => {
		setSearchFilter({ ...searchFilter, search: { serviceStatus: value } });
	};

	const deleteServiceHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to delete this service?')) {
				await updateService({
					variables: {
						input: {
							_id: id,
							serviceStatus: 'DELETE',
						},
					},
				});
				await getAgentServicesRefetch({ input: searchFilter });
			}
		} catch (err) {
			await sweetErrorHandling(err);
		}
	};

	const updateServiceHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(`Are you sure change to ${status} status?`)) {
				await updateService({
					variables: {
						input: {
							_id: id,
							serviceStatus: status,
						},
					},
				});
				await getAgentServicesRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>NESTAR SERVICES MOBILE</div>;
	} else {
		return (
			<div id="my-property-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Services</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="property-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(ServiceStatus.AVAILABLE)}
							className={searchFilter.search.serviceStatus === 'AVAILABLE' ? 'active-tab-name' : 'tab-name'}
						>
							On Available
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(ServiceStatus.NOT_AVAILABLE)}
							className={searchFilter.search.serviceStatus === 'NOT_AVAILABLE' ? 'active-tab-name' : 'tab-name'}
						>
							On Not Available
						</Typography>
					</Stack>
					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Listing title</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">View</Typography>
							{searchFilter.search.serviceStatus === 'AVAILABLE' && (
								<Typography className="title-text">Action</Typography>
							)}
						</Stack>

						{agentServices?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Service found!</p>
							</div>
						) : (
							agentServices.map((service: Service) => {
								return (
									<ServiceCard
										service={service}
										deleteServiceHandler={deleteServiceHandler}
										updateServiceHandler={updateServiceHandler}
									/>
								);
							})
						)}

						{agentServices.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} service available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyServices.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			serviceStatus: 'AVAILABLE',
		},
	},
};

export default MyServices;
