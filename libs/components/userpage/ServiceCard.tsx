import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import IconButton from '@mui/material/IconButton';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatterStr } from '../../utils';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { Service } from '../../types/service/service';
import { ServiceStatus } from '../../enums/service.enum';

interface ServiceCardProps {
	service: Service;
	deleteServiceHandler?: any;
	memberPage?: boolean;
	updateServiceHandler?: any;
}

export const ServiceCard = (props: ServiceCardProps) => {
	const { service, deleteServiceHandler, memberPage, updateServiceHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const pushEditService = async (id: string) => {
		console.log('+pushEditService: ', id);
		await router.push({
			pathname: '/userpage',
			query: { category: 'addService', serviceId: id },
		});
	};

	const pushServiceDetail = async (id: string) => {
		if (memberPage)
			await router.push({
				pathname: '/service/detail',
				query: { id: id },
			});
		else return;
	};

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <div>MOBILE SERVICE CARD</div>;
	} else
		return (
			<Stack className="property-card-box">
				<Stack className="image-box" onClick={() => pushEditService(service?._id)}>
					<img src={`${process.env.REACT_APP_API_URL}/${service.serviceImages[0]}`} alt="" />
				</Stack>
				<Stack className="information-box" onClick={() => pushServiceDetail(service?._id)}>
					<Typography className="name">{service.serviceTitle}</Typography>
					<Typography className="address">{service.serviceAddress}</Typography>
					<Typography className="price">
						<strong>${formatterStr(service?.servicePrice)}</strong>
					</Typography>
				</Stack>
				<Stack className="date-box">
					<Typography className="date">
						<Moment format="DD MMMM, YYYY">{service.createdAt}</Moment>
					</Typography>
				</Stack>
				<Stack className="status-box">
					<Stack className="coloured-box" sx={{ background: '#E5F0FD' }} onClick={handleClick}>
						<Typography className="status" sx={{ color: '#3554d1' }}>
							{service.serviceStatus}
						</Typography>
					</Stack>
				</Stack>
				{!memberPage && service.serviceStatus !== 'DELETED' && (
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						PaperProps={{
							elevation: 0,
							sx: {
								width: '70px',
								mt: 1,
								ml: '10px',
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							},
							style: {
								padding: 0,
								display: 'flex',
								justifyContent: 'center',
							},
						}}
					>
						{service.serviceStatus === 'AVAILABLE' && (
							<>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateServiceHandler(ServiceStatus.DELETED, service?._id);
									}}
								>
									AVAILABLE
								</MenuItem>
							</>
						)}
					</Menu>
				)}

				<Stack className="views-box">
					<Typography className="views">{service.serviceViews.toLocaleString()}</Typography>
				</Stack>
				{!memberPage && service.serviceStatus === ServiceStatus.AVAILABLE && (
					<Stack className="action-box">
						<IconButton className="icon-button" onClick={() => pushEditService(service._id)}>
							<ModeIcon className="buttons" />
						</IconButton>
						<IconButton className="icon-button" onClick={() => deleteServiceHandler(service._id)}>
							<DeleteIcon className="buttons" />
						</IconButton>
					</Stack>
				)}
			</Stack>
		);
};
