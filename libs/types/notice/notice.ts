import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import { Member } from '../member/member';

export interface Notice {
	_id: string;
	noticeCategory: NoticeCategory;
	noticeStatus: NoticeStatus;
	noticeTitle: string;
	noticeContent: string;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
	memberData?: Member;
}

export interface TotalCounter {
	total: number;
}

export interface Notices {
	list: Notice[];
	metaCounter: TotalCounter[];
}
