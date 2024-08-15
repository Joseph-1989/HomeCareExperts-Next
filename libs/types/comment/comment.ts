import { CommentGroup, CommentStatus } from '../../enums/comment.enum';
import { Member } from '../member/member';

export interface Comment {
	_id: string;
	commentStatus: CommentStatus;
	commentGroup: CommentGroup;
	commentContent: string;
	commentRefId: string;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Comments {
	list: Comment[];
	metaCounter: TotalCounter[];
}
