import React, { useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Stack, Typography } from '@mui/material';
import { T } from '../../types/common';
import { useQuery } from '@apollo/client';
import { GET_VISITED_SERVICES } from '../../../apollo/user/query';
import { Service } from '../../types/service/service';
import ServiceCard from '../service/ServiceCard';

const RecentlyVisited_Service: NextPage = () => {
	const device = useDeviceDetect();
	const [recentlyVisited, setRecentlyVisited] = useState<Service[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchVisited, setSearchVisited] = useState<T>({ page: 1, limit: 6 });

	/** APOLLO REQUESTS **/

	const {
		loading: getVisitedLoading,
		data: getVisitedData,
		error: getVisitedError,
		refetch: getVisitedRefetch,
	} = useQuery(GET_VISITED_SERVICES, {
		fetchPolicy: 'network-only',
		variables: { input: searchVisited },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setRecentlyVisited(data.getVisited_Service?.list);
			setTotal(data.getVisited_Service?.metaCounter?.[0]?.total || 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchVisited({ ...searchVisited, page: value });
		getVisitedRefetch({
			variables: { input: { ...searchVisited, page: value } },
		});
	};

	if (device === 'mobile') {
		return <div>HOMECARESERVICES MY RECENTLY VISITED SERVICES MOBILE</div>;
	} else {
		return (
			<div id="my-favorites-service-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Recently Visited Services</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="favorites-list-box">
					{recentlyVisited?.length ? (
						recentlyVisited?.map((service: Service) => {
							return <ServiceCard service={service} recentlyVisited={true} />;
						})
					) : (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>No Recently Visited Service found!</p>
						</div>
					)}
				</Stack>
				{recentlyVisited?.length ? (
					<Stack className="pagination-config">
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(total / searchVisited.limit)}
								page={searchVisited.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
						<Stack className="total-result">
							<Typography>
								Total {total} recently visited service{total > 1 ? 'es' : 'e'}
							</Typography>
						</Stack>
					</Stack>
				) : null}
			</div>
		);
	}
};

export default RecentlyVisited_Service;
