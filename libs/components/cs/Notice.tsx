import React from 'react';
import { Stack, Box } from '@mui/material';
import { useQuery } from '@apollo/client';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GET_NOTICES } from '../../../apollo/user/query';

const Notice = () => {
	const device = useDeviceDetect();

	/** APOLLO REQUESTS **/
	const { loading, error, data } = useQuery(GET_NOTICES, {
		variables: {
			inquiry: {
				page: 1,
				limit: 10,
				sort: 'createdAt',
				direction: 'DESC',
				search: {},
			},
		},
	});

	/** LIFECYCLES **/
	/** HANDLERS **/

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	if (device === 'mobile') {
		return <div>NOTICE MOBILE</div>;
	} else {
		return (
			<Stack className={'notice-content'}>
				<span className={'title'}>Notice</span>
				<Stack className={'main'}>
					<Box component={'div'} className={'top'}>
						<span className={'notice-title'}>number</span>
						<span className={'notice-title'}>title</span>
						<span className={'notice-title'}>content</span>
						<span className={'notice-title'}>date</span>
					</Box>
					<Stack className={'bottom'}>
						{data.getNotices.list.map((notice: any, index: number) => (
							<div className={`notice-card ${notice?.event && 'event'}`} key={notice._id}>
								{notice?.event ? <div>event</div> : <span className={'notice-number'}>{index + 1}</span>}
								<span className={'notice-title'}>{notice.noticeTitle}</span>
								<span className={'notice-title'}>{notice.noticeContent}</span>
								<span className={'notice-date'}>{new Date(notice.createdAt).toLocaleDateString()}</span>
							</div>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Notice;
