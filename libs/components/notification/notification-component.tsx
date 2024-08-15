import React, { useEffect, useState } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_NOTIFICATIONS } from '../../../apollo/user/query';
import { NotificationStructure } from '../../types/notification/notification';
import { useRouter } from 'next/router';
import { Popover } from '@mui/material'; // Example MUI components
import { NotificationsInquiry } from '../../types/notification/notification.input';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { userVar } from '../../../apollo/store';
import { MdNotificationsActive } from 'react-icons/md';
import { VscEyeClosed } from 'react-icons/vsc';
import { FaRegWindowClose } from 'react-icons/fa';

const NotificationComponent: NextPage = ({}) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { query } = router;
	const [notificationTotal, setNotificationTotal] = useState<number>(0);
	const [notifications, setNotifications] = useState<NotificationStructure[]>([]);
	const [selectedNotification, setSelectedNotification] = useState<NotificationStructure | null>(null);
	const [isContainerVisible, setIsContainerVisible] = useState(false);
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const NotificationsInquiry: NotificationsInquiry = {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {
			receiverId: user?._id,
		},
	};

	const {
		loading: getNotificationsLoading,
		data: getNotificationsData,
		error: getNotificationsError,
		refetch: getNotificationsRefetch,
	} = useQuery(GET_NOTIFICATIONS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: NotificationsInquiry },
		skip: !NotificationsInquiry.search.receiverId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			setSelectedNotification(data?.getNotifications?.list);
			setNotificationTotal(data?.getNotifications?.metaCounter[0]?.total ?? 0);
		},

		onError: (error) => {
			console.error('Error fetching notifications:', error);
		},
	});

	const toggleContainer = (event: any) => {
		setAnchorEl(event.currentTarget);
		setIsContainerVisible(!isContainerVisible);
	};

	const markAsRead = (notificationId: string) => {
		setNotifications((prevNotifications) =>
			prevNotifications.map((notification) =>
				notification._id === notificationId ? { ...notification, read: true } : notification,
			),
		);
	};

	const handleClick = (event: React.MouseEvent<HTMLElement>, notification: NotificationStructure) => {
		setAnchorEl(event.currentTarget);
		setSelectedNotification(notification);
		markAsRead(notification._id);
	};

	const handleClose = () => {
		console.log('Close button clicked'); // Debugging statement
		setAnchorEl(null);
		setSelectedNotification(null);
		setIsContainerVisible(false);
	};

	const handleNotificationClick = (notification: any, event: any) => {
		event.stopPropagation(); // Prevent closing the notification container
		setSelectedNotification(notification);
		setAnchorEl(event.currentTarget);
	};

	const handleClosePopover = () => {
		setSelectedNotification(null);
	};

	useEffect(() => {
		if (getNotificationsData) {
			console.log('Fetched notifications:', getNotificationsData.getNotifications.list);
		}
	}, [getNotificationsData]);

	useEffect(() => {
		if (getNotificationsData) {
			console.log('Fetched notifications:', getNotificationsData.getNotifications.list);
		}
	}, [getNotificationsData]);

	useEffect(() => {
		if (getNotificationsData?.getNotifications?.list) {
			setSelectedNotification(getNotificationsData.getNotifications.list);
			getNotificationsData.getNotifications.list.forEach((notification: { _id: any }) => {
				console.log('Notification _id:', notification._id); // Check if _id is present
			});
		}
	}, [getNotificationsData]);

	if (getNotificationsLoading) return <p>Loading...</p>;
	if (getNotificationsError) return <p>Error: {getNotificationsError.message}</p>;

	return (
		<div className="notification-wrapper">
			<button onClick={toggleContainer} className="notification-bell">
				<MdNotificationsActive size={24} color="whitesmoke" />
			</button>

			{isContainerVisible && (
				<div className={'notification-container'}>
					<div className="notification-header">
						<button className="close-button" onClick={handleClose}>
							<p>Unsee</p>
							<VscEyeClosed size={24} />
						</button>
						<h1>Notifications</h1>
						<ul>
							{getNotificationsData &&
							getNotificationsData.getNotifications &&
							Array.isArray(getNotificationsData.getNotifications.list) ? (
								getNotificationsData.getNotifications.list.map((notification: NotificationStructure) => (
									<li
										key={notification._id}
										className={`notification-item ${notification.notificationStatus ? 'read' : 'wait'}`}
										onClick={(event) => handleNotificationClick(notification, event)}
									>
										<h2 onClick={(event) => handleClick(event, notification)}>{notification.notificationTitle}</h2>
										<p>{notification.notificationDesc}</p>
									</li>
								))
							) : (
								<div>Loading notifications...</div>
							)}
						</ul>

						<Popover
							open={Boolean(selectedNotification)}
							anchorEl={anchorEl}
							onClose={handleClosePopover}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'center',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}
						>
							{selectedNotification && (
								<div className={'popover-content'}>
									<h2>{selectedNotification.notificationTitle}</h2>
									<p>{selectedNotification.notificationDesc}</p>
									<p>
										<strong>Details:</strong>
									</p>
									<p>Type: {selectedNotification.notificationType}</p>
									<p>Status: {selectedNotification.notificationStatus}</p>
									<p>Group: {selectedNotification.notificationGroup}</p>
									<p>Author ID: {selectedNotification.authorId}</p>
									<p>Target Object ID: {selectedNotification.targetObjectId}</p>
									<p>Created At: {new Date(selectedNotification.createdAt).toLocaleString()}</p>
									<p>Updated At: {new Date(selectedNotification.updatedAt).toLocaleString()}</p>
									<button onClick={handleClosePopover} className="popover-close-button">
										<p>Close</p>
										<FaRegWindowClose size={24} />
									</button>
								</div>
							)}
						</Popover>
					</div>
				</div>
			)}
		</div>
	);
};

export default NotificationComponent;
