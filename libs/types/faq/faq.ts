import { FaqCategory, FaqStatus } from '../../enums/faq.enum';
import { Member } from '../member/member';

export interface TotalCounter {
	total: number;
}

export interface Faq {
	_id: string;
	faqCategory: FaqCategory;
	faqStatus: FaqStatus;
	faqTitle: string;
	faqContent: string;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
	memberData?: Member;
}

export interface Faqs {
	list: Faq[];
	metaCounter: TotalCounter[];
}
