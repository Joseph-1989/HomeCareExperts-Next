import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Button, Pagination } from '@mui/material';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { GET_BOARD_ARTICLES } from '../../apollo/user/query';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { T } from '../../libs/types/common';
import CommunityCard from '../../libs/components/common/CommunityCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Community: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;

	// Inside the component where you initialize the state or set the query parameter
	const articleCategory = query?.articleCategory as BoardArticleCategory; // Ensure correct enum type

	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>({
		...initialInput,
		search: {
			...initialInput.search,
			articleCategory: articleCategory,
		},
	});

	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	if (articleCategory) initialInput.search.articleCategory = articleCategory;

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	// Passing the enum value in the query
	const { loading, data, error, refetch } = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				...searchCommunity,
				search: {
					...searchCommunity.search,
					articleCategory: searchCommunity.search.articleCategory as BoardArticleCategory, // Correct enum value
				},
			},
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data?.getBoardArticles?.list);
			setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/

	useEffect(() => {
		let categoryParam = query?.articleCategory;

		// If categoryParam is an array, take the first element
		if (Array.isArray(categoryParam)) {
			categoryParam = categoryParam[0];
		}

		// Now replace the + with _
		let normalizedCategory = categoryParam?.replace(/\+/g, '_');

		if (!normalizedCategory) {
			normalizedCategory = articleCategory;
		}

		setSearchCommunity((prevState) => ({
			...prevState,
			search: {
				...prevState.search,
				articleCategory: normalizedCategory as BoardArticleCategory,
			},
		}));
	}, [query?.articleCategory]);

	/** HANDLERS **/
	// Setting the correct value when changing tabs

	const tabChangeHandler = async (e: T, value: BoardArticleCategory) => {
		const encodedValue = encodeURIComponent(value); // Ensure the value is URL-friendly
		setSearchCommunity((prevState) => ({
			...prevState,
			search: { articleCategory: value },
			page: 1,
		}));

		// Replace '_' with '+' when updating the URL, if needed
		const urlCategory = value.replace(/_/g, '+');

		await router.push(
			{
				pathname: '/community',
				query: { articleCategory: urlCategory },
			},
			undefined,
			{ shallow: true },
		);

		refetch();
	};

	const likeArticleHandler = async (e: any, user: any, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);
			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});
			await refetch({ input: searchCommunity });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeArticleHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	// Inside your component
	const paginationHandler = (e: any, value: number) => {
		setSearchCommunity((prevState) => ({
			...prevState,
			page: value,
		}));
		refetch(); // Trigger a refetch of the articles
	};

	if (device === 'mobile') {
		return (
			<div id="community-list-page">
				<div className="container">
					<TabContext value={searchCommunity.search.articleCategory}>
						<Stack className="main-box">
							{/* =============================================================================================================================================================== */}

							<Stack className="right-config">
								<Stack className="panel-config">
									{/* =============================================================================================================================================================== */}

									<Stack className="title-box">
										<Stack className="left">
											<Typography className="title">FREE BOARD</Typography>
											<Typography className="sub-title">
												Absolutely! Feel free to share any thoughts, ideas, or opinions you have in this space. There
												are no content restrictions here, so you can express yourself openly and honestly.
											</Typography>
										</Stack>
										<Button
											onClick={() =>
												router.push({
													pathname: '/userpage',
													query: {
														category: 'writeArticle',
													},
												})
											}
											className="right"
										>
											Share your thoughts
										</Button>
									</Stack>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.GENERAL_DISCUSSION}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.HELP_AND_SUPPORT}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.TIPS_AND_TRICKS}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.REVIEWS}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.OFF_TOPIC}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.ANNOUNCEMENTS}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.MARKETPLACE}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.EVENTS}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.FEEDBACK}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.TECH_TALK}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.CREATIVE_CORNER}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.INDUSTRY_NEWS}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}
								</Stack>
							</Stack>

							{/* ____________________________________________________________________________________________________________________________________________ */}

							<Stack className="left-config">
								<Stack className={'image-info'}>
									<img src={'/img/logo/logoHomeCareServices.png'} />
									<Stack className={'community-name'}>
										<Typography className={'name'}>HomeCareServices Community</Typography>
									</Stack>
								</Stack>

								<TabList
									orientation="vertical"
									aria-label="lab API tabs example"
									TabIndicatorProps={{
										style: { display: 'none' },
									}}
									onChange={tabChangeHandler}
								>
									<Tab
										value={BoardArticleCategory.GENERAL_DISCUSSION}
										label="General Discussion"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.GENERAL_DISCUSSION ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.HELP_AND_SUPPORT}
										label="Help & Support"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.HELP_AND_SUPPORT ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.TIPS_AND_TRICKS}
										label="Tips & Tricks"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.TIPS_AND_TRICKS ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.REVIEWS}
										label="Reviews"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.REVIEWS ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.OFF_TOPIC}
										label="Off Topic"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.OFF_TOPIC ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.ANNOUNCEMENTS}
										label="Announcements"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.ANNOUNCEMENTS ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.MARKETPLACE}
										label="Marketplace"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.MARKETPLACE ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.EVENTS}
										label="Events"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.EVENTS ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.FEEDBACK}
										label="Feedback"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.FEEDBACK ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.TECH_TALK}
										label="Tech talk"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.TECH_TALK ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.CREATIVE_CORNER}
										label="Creative corner"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.CREATIVE_CORNER ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.INDUSTRY_NEWS}
										label="Industry news"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.INDUSTRY_NEWS ? 'active' : ''
										}`}
									/>
								</TabList>
							</Stack>

							{/* ____________________________________________________________________________________________________________________________________________ */}
						</Stack>
					</TabContext>

					{totalCount > 0 && (
						<Stack className="pagination-config">
							<Stack className="pagination-box">
								<Pagination
									count={Math.ceil(totalCount / searchCommunity.limit)}
									page={searchCommunity.page}
									shape="circular"
									color="primary"
									onChange={paginationHandler}
								/>
							</Stack>
							<Stack className="total-result">
								<Typography>
									Total {totalCount} article{totalCount > 1 ? 's' : ''} available
								</Typography>
							</Stack>
						</Stack>
					)}
				</div>
			</div>
		);
	} else {
		return (
			<div id="community-list-page">
				<div className="container">
					<TabContext value={searchCommunity.search.articleCategory}>
						<Stack className="main-box">
							{/* =============================================================================================================================================================== */}

							<Stack className="right-config">
								<Stack className="panel-config">
									{/* =============================================================================================================================================================== */}

									<Stack className="title-box">
										<Stack className="left">
											<Typography className="title">PUBLIC BOARD</Typography>
											<Typography className="sub-title">
												Absolutely! Feel free to share any thoughts, ideas, or opinions you have in this space. There
												are no content restrictions here, so you can express yourself openly and honestly.
											</Typography>
										</Stack>
										<Button
											onClick={() =>
												router.push({
													pathname: '/userpage',
													query: {
														category: 'writeArticle',
													},
												})
											}
											className="right"
										>
											Share your thoughts
										</Button>
									</Stack>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.GENERAL_DISCUSSION}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.HELP_AND_SUPPORT}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.TIPS_AND_TRICKS}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.REVIEWS}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.OFF_TOPIC}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.ANNOUNCEMENTS}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.MARKETPLACE}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.EVENTS}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.FEEDBACK}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.TECH_TALK}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.CREATIVE_CORNER}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}

									<TabPanel value={BoardArticleCategory.INDUSTRY_NEWS}>
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															key={boardArticle?._id}
															likeArticleHandler={likeArticleHandler}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>

									{/* =============================================================================================================================================================== */}
								</Stack>
							</Stack>

							{/* ____________________________________________________________________________________________________________________________________________ */}

							<Stack className="left-config">
								<Stack className={'image-info'}>
									<img src={'/img/logo/logoHomeCareServices.png'} />
									<Stack className={'community-name'}>
										<Typography className={'name'}>HomeCareServices Community</Typography>
									</Stack>
								</Stack>

								<TabList
									orientation="vertical"
									aria-label="lab API tabs example"
									TabIndicatorProps={{
										style: { display: 'none' },
									}}
									onChange={tabChangeHandler}
								>
									<Tab
										value={BoardArticleCategory.GENERAL_DISCUSSION}
										label="General Discussion"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.GENERAL_DISCUSSION ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.HELP_AND_SUPPORT}
										label="Help & Support"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.HELP_AND_SUPPORT ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.TIPS_AND_TRICKS}
										label="Tips & Tricks"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.TIPS_AND_TRICKS ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.REVIEWS}
										label="Reviews"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.REVIEWS ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.OFF_TOPIC}
										label="Off Topic"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.OFF_TOPIC ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.ANNOUNCEMENTS}
										label="Announcements"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.ANNOUNCEMENTS ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.MARKETPLACE}
										label="Marketplace"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.MARKETPLACE ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.EVENTS}
										label="Events"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.EVENTS ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.FEEDBACK}
										label="Feedback"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.FEEDBACK ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.TECH_TALK}
										label="Tech talk"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.TECH_TALK ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.CREATIVE_CORNER}
										label="Creative corner"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.CREATIVE_CORNER ? 'active' : ''
										}`}
									/>
									<Tab
										value={BoardArticleCategory.INDUSTRY_NEWS}
										label="Industry news"
										className={`tab-button ${
											searchCommunity.search.articleCategory === BoardArticleCategory.INDUSTRY_NEWS ? 'active' : ''
										}`}
									/>
								</TabList>
							</Stack>

							{/* ____________________________________________________________________________________________________________________________________________ */}
						</Stack>
					</TabContext>

					{totalCount > 0 && (
						<Stack className="pagination-config">
							<Stack className="pagination-box">
								<Pagination
									count={Math.ceil(totalCount / searchCommunity.limit)}
									page={searchCommunity.page}
									shape="circular"
									color="primary"
									onChange={paginationHandler}
								/>
							</Stack>
							<Stack className="total-result">
								<Typography>
									Total {totalCount} article{totalCount > 1 ? 's' : ''} available
								</Typography>
							</Stack>
						</Stack>
					)}
				</div>
			</div>
		);
	}
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			articleCategory: BoardArticleCategory.ANNOUNCEMENTS,
		},
	},
};

export default withLayoutBasic(Community);
