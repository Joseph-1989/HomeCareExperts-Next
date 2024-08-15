import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { useQuery } from '@apollo/client';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import PopularServiceCard from './PopularServiceCard';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Service } from '../../types/service/service';
import { ServicesInquiry } from '../../types/service/service.input';
import { T } from '../../types/common';
import { GET_SERVICES } from '../../../apollo/user/query';

interface PopularServicesProps {
	initialInput: ServicesInquiry;
}

const PopularServices = (props: PopularServicesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularServices, setPopularServices] = useState<Service[]>([]);

	/** APOLLO REQUESTS **/

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
			setPopularServices(data?.getServices?.list);
		},
	});

	/** HANDLERS **/

	if (!popularServices) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-services'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Popular Services</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-service-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={25}
							modules={[Autoplay]}
						>
							{popularServices.map((service: Service) => {
								return (
									<SwiperSlide key={service._id} className={'popular-service-slide'}>
										<PopularServiceCard service={service} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'popular-services'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Popular Services</span>
							<p>Popularity is based on views</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<span>See All Categories</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-service-swiper'}
							slidesPerView={'auto'}
							spaceBetween={25}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
							}}
						>
							{popularServices.map((service: Service) => {
								return (
									<SwiperSlide key={service._id} className={'popular-service-slide'}>
										<PopularServiceCard service={service} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon className={'swiper-popular-next'} />
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

PopularServices.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'serviceViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularServices;
