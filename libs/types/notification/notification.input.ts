import { Direction } from '../../enums/common.enum';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';

export interface NotificationInput {
	notificationType: NotificationType;
	notificationStatus?: NotificationStatus;
	notificationGroup: NotificationGroup;
	notificationDesc?: string;
	authorId: string;
	receiverId: string;
	targetObjectId?: string;
}

interface NISearch {
	receiverId?: string;
}

export interface NotificationsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: NISearch;
}
