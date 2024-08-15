import React from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box } from '@mui/material';
import Moment from 'react-moment';
import { BoardArticle } from '../../types/board-article/board-article';

interface CommunityCardProps {
	vertical: boolean;
	article: BoardArticle;
	index: number;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { vertical, article, index } = props;
	const device = useDeviceDetect();
	const articleImage = article?.articleImage
		? `${process.env.REACT_APP_API_URL}/${article?.articleImage}`
		: '/img/event.svg';

	if (device === 'mobile') {
		return <div>COMMUNITY CARD (MOBILE)</div>;
	} else {
		if (vertical) {
			return (
				<Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
					<Box component={'div'} className={'vertical-community-card'}>
						<div className={'community-img'} style={{ backgroundImage: `url(${articleImage})` }}>
							<div>{index + 1}</div>
						</div>
						<strong>{article?.articleTitle.replace(/_/g, ' ')}</strong>
						<span>
							<Moment format="DD.MM.YY">{article?.createdAt}</Moment>
						</span>
						<span>{article.articleCategory.replace(/_/g, ' ')}</span>
					</Box>
				</Link>
			);
		} else {
			return (
				<>
					<Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
						<Box component={'div'} className="horizontal-card">
							<img src={articleImage} alt="articleImage" />
							<div>
								<strong>{article.articleTitle.replace(/_/g, ' ')}</strong>
								<span>
									<Moment format="DD.MM.YY">{article?.createdAt}</Moment>
								</span>
								<span>{article.articleCategory.replace(/_/g, ' ')}</span>
							</div>
						</Box>
					</Link>
				</>
			);
		}
	}
};

export default CommunityCard;
