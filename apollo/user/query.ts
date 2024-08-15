import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_AGENTS = gql`
	query GetAgents($input: AgentsInquiry!) {
		getAgents(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER = gql(`
query GetMember($input: String!) {
    getMember(memberId: $input) {
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
        memberArticles
        memberPoints
        memberLikes
        memberViews
        memberFollowings
		memberFollowers
        memberRank
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
        accessToken
        meFollowed {
					followingId
					followerId
					myFollowing
				}
    }
}
`);

/**************************
 *        PROPERTY        *
 *************************/

export const GET_PROPERTY = gql`
	query GetProperty($input: String!) {
		getProperty(propertyId: $input) {
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
			propertyComments
			propertyRank
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

export const GET_PROPERTIES = gql`
	query GetProperties($input: PropertiesInquiry!) {
		getProperties(input: $input) {
			list {
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
				propertyRank
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
					memberWarnings
					memberBlocks
					memberProperties
					memberRank
					memberPoints
					memberLikes
					memberViews
					deletedAt
					createdAt
					updatedAt
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_AGENT_PROPERTIES = gql`
	query GetAgentProperties($input: AgentPropertiesInquiry!) {
		getAgentProperties(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryInquiry!) {
		getFavorites(input: $input) {
			list {
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
				propertyComments
				propertyRank
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
			metaCounter {
				total
			}
		}
	}
`;

export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryInquiry!) {
		getVisited(input: $input) {
			list {
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
				propertyComments
				propertyRank
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_BOARD_ARTICLE = gql`
	query GetBoardArticle($input: String!) {
		getBoardArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			articleComments
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const GET_BOARD_ARTICLES = gql`
	query GetBoardArticles($input: BoardArticlesInquiry!) {
		getBoardArticles(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleComments
				memberId
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/

export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followerData {
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
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				followingData {
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
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         SERVICE        *
 *************************/

export const GET_SERVICE = gql`
	query GetService($input: String!) {
		getService(serviceId: $input) {
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

export const GET_SERVICES = gql`
	query GetServices($input: ServicesInquiry!) {
		getServices(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

export const GET_AGENT_SERVICES = gql`
	query GetAgentServices($input: AgentServicesInquiry!) {
		getAgentServices(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FAVORITE_SERVICES = gql`
	query GetFavorites_Service($input: ServiceOrdinaryInquiry!) {
		getFavorites_Service(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

export const GET_VISITED_SERVICES = gql`
	query GetVisited_Service($input: ServiceOrdinaryInquiry!) {
		getVisited_Service(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *       NOTIFICATIONS    *
 *************************/

export const GET_NOTIFICATIONS = gql`
	query GetNotifications($input: NotificationsInquiry!) {
		getNotifications(input: $input) {
			list {
				_id
				notificationType
				notificationStatus
				notificationGroup
				notificationTitle
				notificationDesc
				authorId
				receiverId
				targetObjectId
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *          NOTICE         *
 *************************/

export const GET_NOTICE = gql`
	query GetNotice($id: String!) {
		getNotice(id: $id) {
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
`; // noticeCategory, noticeStatus, noticeTitle, noticeContent, memberId, createdAt, updatedAt

export const GET_NOTICES = gql`
	query GetNotices($inquiry: NoticeInquiry!) {
		getNotices(inquiry: $inquiry) {
			list {
				_id
				noticeCategory
				noticeStatus
				noticeTitle
				noticeContent
				memberId
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *          FAQ        *
 *************************/

export const GET_FAQS_BY_CATEGORY = gql`
	query GetFaqsByCategory($category: String!) {
		getFaqsByCategory(category: $category) {
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
