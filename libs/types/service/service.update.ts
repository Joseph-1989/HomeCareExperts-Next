import { ServiceCategory, ServiceLocation, ServicePricingModel, ServiceStatus } from '../../enums/service.enum';

export interface ServiceUpdate {
	_id: string;
	serviceCategory?: ServiceCategory;
	serviceStatus?: ServiceStatus;
	serviceLocation?: ServiceLocation;
	pricingModel?: ServicePricingModel;
	serviceAddress?: string;
	serviceTitle?: string;
	servicePrice?: number;
	serviceImages?: string[];
	serviceDescription?: string;
	assistanceDIY?: boolean;
	subscriptionModel?: boolean;
	emergencyServices?: boolean;
	referralPrograms?: boolean;
	deletedAt?: Date;
	stoppedAt?: Date;
}
