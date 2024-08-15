import React, { useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Stack, Typography } from '@mui/material';
import { T } from '../../types/common';
import { useMutation, useQuery } from '@apollo/client';
import { GET_FAVORITE_SERVICES } from '../../../apollo/user/query';
import { LIKE_TARGET_SERVICE } from '../../../apollo/user/mutation';
import { Messages } from '../../config';
import { sweetMixinErrorAlert } from '../../sweetAlert';
import { Service } from '../../types/service/service';
import ServiceCard from '../service/ServiceCard';

const MyFavorites_Service: NextPage = () => {
	const device = useDeviceDetect();
	const [myFavorites, setMyFavorites] = useState<Service[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFavorites, setSearchFavorites] = useState<T>({ page: 1, limit: 6 });

	/** APOLLO REQUESTS **/

	const [likeTargetService] = useMutation(LIKE_TARGET_SERVICE);

	const {
		loading: getFavoritesLoading,
		data: getFavoritesData,
		error: getFavoritesError,
		refetch: getFavoritesRefetch,
	} = useQuery(GET_FAVORITE_SERVICES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFavorites }, // Ensure consistent spacing here
		notifyOnNetworkStatusChange: true,
		onCompleted(data: T) {
			setMyFavorites(data.getFavorites_Service?.list);
			setTotal(data.getFavorites_Service?.metaCounter?.[0]?.total || 0); // Safe access for 'total'
		},
	}); // Closing brace for useQuery

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFavorites({ ...searchFavorites, page: value });
	};

	const likeServiceHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2); // Assuming 'error2' is a typo for 'error2'

			await likeTargetService({
				variables: {
					input: id,
				},
			});
			await getFavoritesRefetch({ input: searchFavorites });
		} catch (err: any) {
			console.log('ERROR, likeTargetService:', err.message);
			sweetMixinErrorAlert(err.message).then(); // Ensure correct spacing for function calls
		}
	};

	if (device === 'mobile') {
		return <div>HOMECARESERVICES MY FAVORITE SERVICES MOBILE VERSION</div>;
	} else {
		return (
			<div id="my-favorites-service-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Favorite Services</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="favorites-list-box">
					{myFavorites?.length ? (
						myFavorites?.map((service: Service) => {
							return <ServiceCard service={service} likeServiceHandler={likeServiceHandler} myFavorites={true} />;
						})
					) : (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>No Favorite Service found!</p>
						</div>
					)}
				</Stack>
				{myFavorites?.length ? (
					<Stack className="pagination-config">
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(total / searchFavorites.limit)}
								page={searchFavorites.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
						<Stack className="total-result">
							<Typography>
								Total {total} favorite servic{total > 1 ? 'es' : 'e'}
							</Typography>
						</Stack>
					</Stack>
				) : null}
			</div>
		);
	}
};

export default MyFavorites_Service;
