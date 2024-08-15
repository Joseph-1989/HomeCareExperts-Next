import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { Member } from '../../types/member/member';
import { Stack } from '@mui/material';

interface TopTaskerProps {
	tasker: Member;
}
const TopTaskerCard = (props: TopTaskerProps) => {
	const { tasker } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const taskerImage = tasker?.memberImage
		? `${process.env.REACT_APP_API_URL}/${tasker?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="top-tasker-card">
				<img src={taskerImage} alt="" />
				<strong>{tasker?.memberNick}</strong>
				<span>{tasker?.memberType}</span>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-tasker-card">
				<img src={taskerImage} alt="" />
				<strong>{tasker?.memberNick}</strong>
				<span>{tasker?.memberType}</span>
			</Stack>
		);
	}
};

export default TopTaskerCard;
