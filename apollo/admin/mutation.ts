import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberProperties
			memberServices
			memberArticles
			memberFollowers
			memberFollowings
			memberPoints
			memberLikes
			memberViews
			memberComments
			memberRank
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

/**************************
 *        PROPERTY        *
 *************************/

export const UPDATE_PROPERTY_BY_ADMIN = gql`
	mutation UpdatePropertyByAdmin($input: PropertyUpdate!) {
		updatePropertyByAdmin(input: $input) {
			_id
			propertyType
			propertyStatus
			propertyLocation
			propertyAddress
			propertyTitle
			propertyPrice
			propertySquare
			propertyBeds
			propertyRooms
			propertyViews
			propertyLikes
			propertyImages
			propertyDesc
			propertyBarter
			propertyRent
			memberId
			soldAt
			deletedAt
			constructedAt
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_PROPERTY_BY_ADMIN = gql`
	mutation RemovePropertyByAdmin($input: String!) {
		removePropertyByAdmin(propertyId: $input) {
			_id
			propertyType
			propertyStatus
			propertyLocation
			propertyAddress
			propertyTitle
			propertyPrice
			propertySquare
			propertyBeds
			propertyRooms
			propertyViews
			propertyLikes
			propertyImages
			propertyDesc
			propertyBarter
			propertyRent
			memberId
			soldAt
			deletedAt
			constructedAt
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *        SERVICE        *
 *************************/

export const UPDATE_SERVICE_BY_ADMIN = gql`
	mutation UpdateServiceByAdmin($input: ServiceUpdateInput!) {
		updateServiceByAdmin(input: $input) {
			_id
			serviceCategory
			serviceStatus
			serviceLocation
			pricingModel
			serviceAddress
			serviceTitle
			servicePrice
			assistanceDIY
			subscriptionModel
			emergencyServices
			referralPrograms
			serviceViews
			serviceLikes
			serviceComments
			serviceRank
			serviceImages
			serviceDescription
			memberId
			stoppedAt
			deletedAt
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_SERVICE_BY_ADMIN = gql`
	mutation RemoveServiceByAdmin($input: String!) {
		removeServiceByAdmin(serviceId: $input) {
			_id
			serviceCategory
			serviceStatus
			serviceLocation
			pricingModel
			serviceAddress
			serviceTitle
			servicePrice
			assistanceDIY
			subscriptionModel
			emergencyServices
			referralPrograms
			serviceViews
			serviceLikes
			serviceComments
			serviceRank
			serviceImages
			serviceDescription
			memberId
			stoppedAt
			deletedAt
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input: String!) {
		removeBoardArticleByAdmin(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         NOTICE        *
 *************************/

export const CREATE_NOTICE = gql`
	mutation CreateNotice($input: NoticeInput!) {
		createNotice(input: $input) {
			_id
			noticeCategory
			noticeStatus
			noticeTitle
			noticeContent
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_NOTICE = gql`
	mutation UpdateNotice($input: NoticeUpdate!) {
		updateNotice(input: $input) {
			_id
			noticeCategory
			noticeStatus
			noticeTitle
			noticeContent
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const DELETE_NOTICE = gql`
	mutation DeleteNotice($id: String!) {
		deleteNotice(id: $id) {
			_id
			noticeCategory
			noticeStatus
			noticeTitle
			noticeContent
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *             FAQ        *
 *************************/

export const CREATE_FAQ = gql`
	mutation CreateFaq($input: FaqInput!) {
		createFaq(input: $input) {
			_id
			faqCategory
			faqStatus
			faqTitle
			faqContent
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_FAQ = gql`
	mutation UpdateFaq($input: FaqUpdate!) {
		updateFaq(input: $input) {
			_id
			faqCategory
			faqStatus
			faqTitle
			faqContent
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const DELETE_FAQ = gql`
	mutation DeleteFaq($id: String!) {
		deleteFaq(id: $id) {
			_id
			faqCategory
			faqStatus
			faqTitle
			faqContent
			memberId
			createdAt
			updatedAt
			memberData {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberProperties
				memberServices
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
		}
	}
`;
