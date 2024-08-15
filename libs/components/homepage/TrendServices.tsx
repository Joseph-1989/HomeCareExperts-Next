import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Service } from '../../types/service/service';
import { ServicesInquiry } from '../../types/service/service.input';
import TrendServiceCard from './TrendServiceCard';
import { GET_SERVICES } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { LIKE_TARGET_SERVICE } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';

interface TrendServicesProps {
	initialInput: ServicesInquiry;
}

const TrendServices = (props: TrendServicesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendServices, setTrendServices] = useState<Service[]>([]);

	/** APOLLO REQUESTS **/

	const [likeTargetService] = useMutation(LIKE_TARGET_SERVICE);

	const {
		loading: getServicesLoading,
		data: getServicesData,
		error: getServicesError,
		refetch: getServicesRefetch,
	} = useQuery(GET_SERVICES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrendServices(data?.getServices?.list);
		},
	});

	/** HANDLERS **/
	const likeServiceHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetService({
				variables: { input: id },
			});
			await getServicesRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeServiceHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	/** HANDLERS **/

	if (!trendServices) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'trend-services'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Trend Services</span>
					</Stack>
					<Stack className={'card-box'}>
						{trendServices.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Swiper
								className={'trend-property-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={15}
								modules={[Autoplay]}
							>
								{trendServices.map((service: Service) => {
									return (
										<SwiperSlide key={service._id} className={'trend-property-slide'}>
											<TrendServiceCard service={service} likeServiceHandler={likeServiceHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trend-services'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Trend Services</span>
							<p>Trend is based on likes</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-trend-prev'} />
								<div className={'swiper-trend-pagination'}></div>
								<EastIcon className={'swiper-trend-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{trendServices.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Swiper
								className={'trend-property-swiper'}
								slidesPerView={'auto'}
								spaceBetween={15}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-trend-next',
									prevEl: '.swiper-trend-prev',
								}}
								pagination={{
									el: '.swiper-trend-pagination',
								}}
							>
								{trendServices.map((service: Service) => {
									return (
										<SwiperSlide key={service._id} className={'trend-property-slide'}>
											<TrendServiceCard service={service} likeServiceHandler={likeServiceHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TrendServices.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'serviceLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendServices;
