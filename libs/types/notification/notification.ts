import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';

export interface NotificationStructure {
	_id: string;
	notificationType: NotificationType;
	notificationStatus: NotificationStatus;
	notificationGroup: NotificationGroup;
	notificationTitle: string;
	notificationDesc: string;
	authorId: string;
	receiverId: string;
	targetObjectId?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface TotalCounter {
	total: number;
}

export interface Notifications {
	list: NotificationStructure[];
	metaCounter: TotalCounter[];
}
