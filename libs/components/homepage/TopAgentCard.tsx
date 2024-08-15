import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { Member } from '../../types/member/member';
import { Stack } from '@mui/material';

interface TopAgentProps {
	agent: Member;
}
const TopAgentCard = (props: TopAgentProps) => {
	const { agent } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const agentImage = agent?.memberImage
		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card">
				<strong>{agent?.memberNick}</strong>
				<span>{agent?.memberType}</span>
				<img src={agentImage} alt="" />
			</Stack>
		);
	} else {
		return (
			<Stack className="top-agent-card">
				<strong>{agent?.memberNick}</strong>
				<span>{agent?.memberType}</span>
				<img src={agentImage} alt="" />
			</Stack>
		);
	}
};

export default TopAgentCard;
