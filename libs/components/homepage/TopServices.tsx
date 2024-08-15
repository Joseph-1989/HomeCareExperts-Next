import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopServiceCard from './TopServiceCard';
import { ServicesInquiry } from '../../types/service/service.input';
import { Service } from '../../types/service/service';
import { GET_SERVICES } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { LIKE_TARGET_SERVICE } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface TopServicesProps {
	initialInput: ServicesInquiry;
}

const TopServices = (props: TopServicesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [topServices, setTopServices] = useState<Service[]>([]);

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
			setTopServices(data?.getServices?.list);
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

	if (device === 'mobile') {
		return (
			<Stack className={'top-services'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top Services</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-property-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={15}
							modules={[Autoplay]}
						>
							{topServices.map((service: Service) => {
								return (
									<SwiperSlide className={'top-property-slide'} key={service?._id}>
										<TopServiceCard service={service} likeServiceHandler={likeServiceHandler} />
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
			<Stack className={'top-services'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Top Services</span>
							<p>Check out our Top Services</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-top-prev'} />
								<div className={'swiper-top-pagination'}></div>
								<EastIcon className={'swiper-top-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-service-swiper'}
							slidesPerView={'auto'}
							spaceBetween={15}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-top-next',
								prevEl: '.swiper-top-prev',
							}}
							pagination={{
								el: '.swiper-top-pagination',
							}}
						>
							{topServices.map((service: Service) => {
								return (
									<SwiperSlide className={'top-service-slide'} key={service?._id}>
										<TopServiceCard service={service} likeServiceHandler={likeServiceHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopServices.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'serviceRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopServices;
