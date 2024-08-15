import { FaqCategory, FaqStatus } from '../../enums/faq.enum';

export interface FaqUpdate {
	_id: string; // Assuming ID is required for updates
	faqCategory?: FaqCategory;
	faqStatus?: FaqStatus;
	faqTitle?: string;
	faqContent?: string;
	memberId?: string;
}
