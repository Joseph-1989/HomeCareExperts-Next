import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Badge, Popover } from '@mui/material'; // Example MUI components
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { userVar } from '../../../apollo/store';
import { MdNotificationsActive } from 'react-icons/md';
import { VscEyeClosed } from 'react-icons/vsc';
import { FaRegWindowClose } from 'react-icons/fa';
import { NotificationStructure } from '../../types/notification/notification';
import { GET_NOTIFICATIONS } from '../../../apollo/user/query';
import { NotificationsInquiry } from '../../types/notification/notification.input';
import { UPDATE_NOTIFICATION_STATUS } from '../../../apollo/user/mutation';
import { NotificationStatus } from '../../enums/notification.enum';

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

	const notificationsInquiry: NotificationsInquiry = {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {
			receiverId: user?._id,
		},
	};

	const [updateNotificationStatus] = useMutation(UPDATE_NOTIFICATION_STATUS);

	const {
		loading: getNotificationsLoading,
		data: getNotificationsData,
		error: getNotificationsError,
		refetch: getNotificationsRefetch,
	} = useQuery(GET_NOTIFICATIONS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: notificationsInquiry },
		skip: !notificationsInquiry.search.receiverId,
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

	const markAsRead = async (notification: NotificationStructure) => {
		if (notification.notificationStatus !== NotificationStatus.READ) {
			try {
				await updateNotificationStatus({
					variables: {
						id: notification._id,
						status: NotificationStatus.READ,
					},
				});
				// Update the notification status locally
				setNotifications((prevNotifications) =>
					prevNotifications.map((n) =>
						n._id === notification._id ? { ...n, notificationStatus: NotificationStatus.READ } : n,
					),
				);
			} catch (error) {
				console.error('Failed to update notification status', error);
			}
		}
	};

	const handleClick = (event: React.MouseEvent<HTMLElement>, notification: NotificationStructure) => {
		setAnchorEl(event.currentTarget);
		setSelectedNotification(notification);
		markAsRead(notification);
	};

	const handleClose = () => {
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
		if (getNotificationsData?.getNotifications?.list) {
			setSelectedNotification(getNotificationsData.getNotifications.list);
			getNotificationsData.getNotifications.list.forEach((notification: { _id: any }) => {});
		}
	}, [getNotificationsData]);

	if (getNotificationsLoading) return <p>Loading...</p>;
	if (getNotificationsError) return <p>Error: {getNotificationsError.message}</p>;

	return (
		<div className="notification-wrapper">
			<Badge badgeContent={notificationTotal} color="secondary" overlap="circular">
				<button onClick={toggleContainer} className="notification-bell">
					<MdNotificationsActive size={24} color="whitesmoke" />
				</button>
			</Badge>

			{isContainerVisible && (
				<div className={'notification-container'}>
					<div className="notification-header">
						<button className="close-button" onClick={handleClose}>
							<p>Unsee</p>
							<VscEyeClosed size={24} />
						</button>
						<h1>Notifications</h1>
						<ul>
							{getNotificationsData.getNotifications?.list.map((notification: NotificationStructure) => (
								<li
									key={notification._id}
									className={`notification-item ${
										notification.notificationStatus === NotificationStatus.READ
											? NotificationStatus.READ
											: NotificationStatus.WAIT
									}`}
									onClick={(event) => handleNotificationClick(notification, event)}
									style={{
										backgroundColor: notification.notificationStatus === NotificationStatus.READ ? '#e0e0e0' : 'white',
									}}
								>
									<h2 onClick={(event) => handleClick(event, notification)}>{notification.notificationTitle}</h2>
									<p>{notification.notificationDesc}</p>
								</li>
							))}
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
