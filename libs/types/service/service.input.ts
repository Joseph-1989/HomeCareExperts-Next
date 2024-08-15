import { Direction } from '../../enums/common.enum';
import { ServiceCategory, ServiceLocation, ServicePricingModel, ServiceStatus } from '../../enums/service.enum';

export interface ServiceInput {
	serviceTitle: string;
	servicePrice: number;
	serviceAddress: string;
	serviceDescription?: string;
	serviceCategory: ServiceCategory;
	serviceLocation: ServiceLocation;
	pricingModel: ServicePricingModel;
	assistanceDIY?: boolean;
	subscriptionModel?: boolean;
	emergencyServices?: boolean;
	referralPrograms?: boolean;
	serviceImages: string[];
	memberId?: string;
}

export interface ServiceOptionsInput {
	assistanceDIY?: boolean;
	subscriptionModel?: boolean;
	emergencyServices?: boolean;
	referralPrograms?: boolean;
}

export interface SISearch {
	memberId?: string;
	serviceStatus?: ServiceStatus[];
	locationList?: ServiceLocation[];
	categoryList?: ServiceCategory[];
	pricingModel?: ServicePricingModel[];
	pricesSeries?: PricesSeries;
	options?: ServiceOptionsInput;
	text?: string;
}

export interface ServicesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: SISearch;
}

export interface ASISearch {
	serviceStatus?: ServiceStatus;
	memberId?: string;
}

export interface AgentServicesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ASISearch;
}

export interface ALSISearch {
	serviceStatus?: ServiceStatus;
	serviceLocationList?: ServiceLocation;
	memberId?: string;
}

export interface AllServicesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALSISearch;
}

export interface ServiceOrdinaryInquiry {
	page: number;
	limit: number;
}

export interface PricesSeries {
	start: number;
	end: number;
}
