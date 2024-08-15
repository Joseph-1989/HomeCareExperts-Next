import { FaqCategory, FaqStatus } from '../../enums/faq.enum';
import { Direction } from '../../enums/common.enum';

export interface FaqInput {
	faqCategory?: FaqCategory;
	faqStatus?: FaqStatus;
	faqTitle?: string;
	faqContent?: string;
	memberId?: string;
}

export interface FaqInquirySearch {
	memberId?: string; // Assuming memberId is of type string
	faqCategory?: FaqCategory;
	faqStatus?: FaqStatus;
	faqTitle?: string;
	faqContent?: string;
	text?: string;
}

export interface FaqInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: FaqInquirySearch;
}
