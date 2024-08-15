import React from 'react';
import { REACT_APP_API_URL, topServiceRank } from '../../config';
import { Stack, Typography, Box } from '@mui/material';
import { useReactiveVar } from '@apollo/client';
import { formatterStr } from '../../utils';
import { userVar } from '../../../apollo/store';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { FaHandsHelping } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import { FaTimes } from 'react-icons/fa';
import { MdCardMembership } from 'react-icons/md';
import { GrEmergency } from 'react-icons/gr';
import { FaBullhorn } from 'react-icons/fa';
import { Service } from '../../types/service/service';

interface ServiceCardType {
	service: Service;
	likeServiceHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const ServiceCard = (props: ServiceCardType) => {
	const { service, likeServiceHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = service?.serviceImages[0]
		? `${REACT_APP_API_URL}/${service?.serviceImages[0]}`
		: '/img/banner/header1.svg';

	if (device === 'mobile') {
		return <div>SERVICE CARD</div>;
	} else {
		return (
			<Stack className="service-card-config">
				<Stack className="bottom">
					{/* ============================================================================================================================================================ */}

					<Stack className="name-address">
						<Stack className="name">
							<Link
								href={{
									pathname: '/service/detail',
									query: { id: service?._id },
								}}
							>
								<Typography>{service.serviceTitle}</Typography>
							</Link>
						</Stack>
						<Stack className="address">
							<Typography>{service.serviceAddress}</Typography>
							<Typography>{service.serviceLocation}</Typography>
						</Stack>
					</Stack>

					{/* ============================================================================================================================================================ */}

					<Stack className="top">
						<Link
							href={{
								pathname: '/service/detail',
								query: { id: service?._id },
							}}
						>
							<img src={imagePath} alt="service" />
						</Link>
						{service && service?.serviceRank > topServiceRank && (
							<Box component={'div'} className={'top-badge'}>
								<img src="/img/icons/electricity.svg" alt="service" />
								<Typography>TOP</Typography>
							</Box>
						)}
						<Box component={'div'} className={'price-box'}>
							<Typography>${formatterStr(service?.servicePrice)}</Typography>
						</Box>
					</Stack>

					{/* ============================================================================================================================================================ */}

					<Stack className="options">
						{/* ============================================================================================================================================================ */}

						<Stack className="option">
							<MdPayment size={24} color="#698D8B" />
							<Typography> {service.pricingModel} </Typography>
						</Stack>

						{/* ============================================================================================================================================================ */}

						{service.assistanceDIY ? (
							<Stack className="option">
								<FaHandsHelping size={24} color="#698D8B" />
								<Typography>DIY Assistance Available</Typography>
							</Stack>
						) : (
							<Stack className="option">
								<FaTimes size={24} color="#F6906C" />
								<Typography>No DIY Assistance</Typography>
							</Stack>
						)}

						{/* ============================================================================================================================================================ */}

						{service.subscriptionModel ? (
							<Stack className="option">
								<MdCardMembership size={24} color="#698D8B" />
								<Typography>Subscription Available</Typography>
							</Stack>
						) : (
							<Stack className="option">
								<MdCardMembership size={24} color="#F6906C" />
								<Typography>No Subscription</Typography>
							</Stack>
						)}

						{/* ============================================================================================================================================================ */}

						{service.emergencyServices ? (
							<Stack className="option">
								<GrEmergency size={24} color="#698D8B" />
								<Typography>Emergency Service Available</Typography>
							</Stack>
						) : (
							<Stack className="option">
								<GrEmergency size={24} color="#F6906C" />
								<Typography>No Emergency Service</Typography>
							</Stack>
						)}

						{/* ============================================================================================================================================================ */}

						{service.referralPrograms ? (
							<Stack className="option">
								<FaBullhorn size={24} color="#698D8B" />
								<Typography>Referral Program Available</Typography>
							</Stack>
						) : (
							<Stack className="option">
								<FaBullhorn size={24} color="#F6906C" />
								<Typography>No Referral Program</Typography>
							</Stack>
						)}

						{/* ============================================================================================================================================================ */}
					</Stack>

					{/* ============================================================================================================================================================ */}

					<Stack className="divider"></Stack>

					{/* ============================================================================================================================================================ */}

					<Stack className="type-buttons">
						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton color={'primary'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{service?.serviceViews}</Typography>
								<IconButton color={'default'} onClick={() => likeServiceHandler(user, service?._id)}>
									{myFavorites ? (
										<FavoriteIcon color="primary" />
									) : service?.meLiked && service?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="primary" />
									) : (
										<FavoriteBorderIcon color="primary" />
									)}
								</IconButton>
								<Typography className="view-cnt">{service?.serviceLikes}</Typography>
							</Stack>
						)}
					</Stack>

					{/* ============================================================================================================================================================ */}
				</Stack>
			</Stack>
		);
	}
};

export default ServiceCard;
