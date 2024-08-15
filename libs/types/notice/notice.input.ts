import { Direction } from '../../enums/common.enum';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

export interface NoticeInput {
	noticeCategory?: NoticeCategory;
	noticeTitle?: string;
	noticeContent?: string;
	memberId?: string;
}

export interface NoticeInquirySearch {
	memberId?: string;
	noticeCategory?: NoticeCategory;
	noticeStatus?: NoticeStatus;
	noticeTitle?: string;
	noticeContent?: string;
	text?: string;
}

export interface NoticeInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: NoticeInquirySearch;
}
