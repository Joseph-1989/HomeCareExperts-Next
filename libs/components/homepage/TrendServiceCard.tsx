import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import { Service } from '../../types/service/service';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { MdFavorite } from 'react-icons/md';

interface TrendServiceCardProps {
	service: Service;
	likeServiceHandler: any;
}

const TrendServiceCard = (props: TrendServiceCardProps) => {
	const { service, likeServiceHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async (serviceId: string) => {
		await router.push({ pathname: '/service/detail', query: { id: serviceId } });
	};

	return (
		<Stack className="trend-service-card-box" key={service._id}>
			<Box
				component={'div'}
				className={'card-img'}
				style={{ backgroundImage: `url(${REACT_APP_API_URL}/${service?.serviceImages[0]})` }}
				onClick={() => pushDetailHandler(service?._id)}
			>
				<div>${service.servicePrice}</div>
			</Box>
			<Box component={'div'} className={'info'}>
				<strong className={'title'} onClick={() => pushDetailHandler(service?._id)}>
					{service.serviceTitle.replace(/_/g, ' ')}
				</strong>
				<p className={'desc'}>{service.serviceDescription ?? 'no description'}</p>
				<div className={'options'}>
					<div>
						<span>{service.serviceCategory.replace(/_/g, ' ')}</span>
					</div>
					<div>
						<span>{service.serviceLocation.replace(/_/g, ' ')}</span>
					</div>
				</div>
				<Divider sx={{ mt: '15px', mb: '17px' }} />
				<div className={'bott'}>
					<p>{service.serviceStatus}</p>
					<div className="view-like-box">
						<IconButton color={'default'}>
							<RemoveRedEyeIcon />
						</IconButton>
						<Typography className="view-cnt">{service?.serviceViews}</Typography>
						<MdFavorite size={24} color={'red'} onClick={() => likeServiceHandler(user, service?._id)}>
							{service?.meLiked && service?.meLiked[0]?.myFavorite ? (
								<MdFavorite color={'red'} />
							) : (
								<MdFavorite color={'green'} />
							)}
						</MdFavorite>

						<Typography className="view-cnt">{service?.serviceLikes}</Typography>
					</div>
				</div>
			</Box>
		</Stack>
	);
};

export default TrendServiceCard;
