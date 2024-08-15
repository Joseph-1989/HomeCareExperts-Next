import React from 'react';
import { REACT_APP_API_URL, topServiceRank } from '../../config';
import { Stack, Box, Divider, Typography } from '@mui/material';
import { useReactiveVar } from '@apollo/client';
import { formatterStr } from '../../utils';
import { useRouter } from 'next/router';
import { userVar } from '../../../apollo/store';
import { Service } from '../../types/service/service';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GiPriceTag } from 'react-icons/gi';
import { RiUserSharedFill } from 'react-icons/ri';
import { FaHandsHelping, FaRegEye } from 'react-icons/fa';
import { FaFirstAid } from 'react-icons/fa';
import { BsArrowThroughHeartFill } from 'react-icons/bs';
import { GiCctvCamera } from 'react-icons/gi';
import { GrFavorite } from 'react-icons/gr';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { BiLike } from 'react-icons/bi';

interface ServiceBigCardProps {
	service: Service;
	likeServiceHandler?: any;
}

const ServiceBigCard = (props: ServiceBigCardProps) => {
	const { service, likeServiceHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goServiceDetatilPage = (serviceId: string) => {
		router.push(`/service/detail?id=${serviceId}`);
	};

	if (device === 'mobile') {
		return <div>SERVICE BIG CARD</div>;
	} else {
		return (
			<Stack className="service-big-card-box" onClick={() => goServiceDetatilPage(service?._id)}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${service?.serviceImages?.[0]})` }}
				>
					{service && service?.serviceRank >= topServiceRank && (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					)}

					<div className={'price'}>${formatterStr(service?.servicePrice)}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{service?.serviceTitle.replace(/_/g, ' ')}</strong>
					<p className={'desc'}>{service?.serviceAddress.toUpperCase()}</p>
					<div className={'options'}>
						<div className="div">
							<GiPriceTag color="green" size={28} /> <span>{service?.pricingModel.replace(/_/g, ' ')} </span>
						</div>
						<div>
							<RiUserSharedFill color="green" size={28} />
							<span>
								{service?.referralPrograms} {'Referral Programs'}{' '}
							</span>
						</div>
						<div>
							<FaHandsHelping color="green" size={28} />
							<span>{service?.assistanceDIY} DIY Assistance </span>
						</div>
						<div>
							<FaFirstAid color="green" size={28} />
							<span>{service?.emergencyServices} Emergency Services</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="buttons-box">
							<FaRegEye size={24} />

							<Typography className="view-cnt">{service?.serviceViews}</Typography>
							<button
								className="favorite-icon-button"
								onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
									e.stopPropagation();
									likeServiceHandler(user, service?._id);
								}}
							>
								{service?.meLiked && service?.meLiked[0]?.myFavorite ? (
									<BiLike size={24} />
								) : (
									<BiLike color={'red'} size={24} />
								)}
							</button>
							<Typography className="view-cnt">{service?.serviceLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default ServiceBigCard;
