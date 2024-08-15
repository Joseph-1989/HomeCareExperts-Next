import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

export class NoticeUpdate {
	_id!: string; // Using the `!` operator to tell TypeScript that this will be initialized later
	noticeCategory?: NoticeCategory;
	noticeStatus?: NoticeStatus;
	noticeTitle?: string;
	noticeContent?: string;
	memberId?: string;
}
