import { ServiceCategory, ServiceLocation, ServicePricingModel, ServiceStatus } from '../../enums/service.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Service {
	_id: string;
	serviceCategory: ServiceCategory;
	serviceStatus: ServiceStatus;
	serviceLocation: ServiceLocation;
	pricingModel: ServicePricingModel;
	serviceAddress: string;
	serviceTitle: string;
	servicePrice: number;
	serviceViews: number;
	serviceLikes: number;
	serviceComments: number;
	serviceRank: number;
	serviceImages: string[];
	serviceDescription?: string;
	assistanceDIY?: boolean;
	subscriptionModel?: boolean;
	emergencyServices?: boolean;
	referralPrograms?: boolean;
	memberId: string;
	stoppedAt?: Date;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Services {
	list: Service[];
	metaCounter: TotalCounter[];
}
