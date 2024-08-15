import { Button, Stack, Typography, Tab, Tabs, IconButton, Backdrop, Pagination } from '@mui/material';
import { CREATE_COMMENT, LIKE_TARGET_BOARD_ARTICLE, UPDATE_COMMENT } from '../../apollo/user/mutation';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_BOARD_ARTICLE, GET_COMMENTS } from '../../apollo/user/query';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import React, { useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CommentUpdate } from '../../libs/types/comment/comment.update';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { useRouter } from 'next/router';
import { Messages } from '../../libs/config';
import { NextPage } from 'next';
import { userVar } from '../../apollo/store';
import { Comment } from '../../libs/types/comment/comment';
import { T } from '../../libs/types/common';
import {
	sweetConfirmAlert,
	sweetMixinErrorAlert,
	sweetMixinSuccessAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { FaThumbsUp } from 'react-icons/fa';
import { FaRegThumbsUp } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa6';
import { LiaSmsSolid } from 'react-icons/lia';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ChatIcon from '@mui/icons-material/Chat';
import EditIcon from '@mui/icons-material/Edit';
import dynamic from 'next/dynamic';
import Moment from 'react-moment';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
const ToastViewerComponent = dynamic(() => import('../../libs/components/community/TViewer'), { ssr: false });

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CommunityDetail: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;

	const articleId = query?.id as string;
	const articleCategory = query?.articleCategory as string;
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
	const [comment, setComment] = useState<string>('');
	const [wordsCnt, setWordsCnt] = useState<number>(0);
	const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const [comments, setComments] = useState<Comment[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({
		...initialInput,
	});
	const [memberImage, setMemberImage] = useState<string>('/img/community/articleImg.png');
	const [anchorEl, setAnchorEl] = useState<any | null>(null);
	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
	const [updatedComment, setUpdatedComment] = useState<string>('');
	const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
	const [likeLoading, setLikeLoading] = useState<boolean>(false);
	const [boardArticle, setBoardArticle] = useState<BoardArticle>();

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);

	const {
		loading: boardArticleLoading,
		data: boardArticleData,
		error: getBoardArticleError,
		refetch: boardArticleRefetch,
	} = useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: articleId,
		},

		notifyOnNetworkStatusChange: true,
		onCompleted(data: any) {
			setBoardArticle(data?.getBoardArticle);
			if (data?.getBoardArticle?.memberData?.memberImage) {
				setMemberImage(`${process.env.REACT_APP_API_URL}/${data?.getBoardArticle?.memberData?.memberImage}`);
			}
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: searchFilter,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted(data: any) {
			setComments(data.getComments.list);
			setTotal(data.getComments?.metaCounter?.[0]?.total || 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (articleId) setSearchFilter({ ...searchFilter, search: { commentRefId: articleId } });
	}, [articleId]);

	/** HANDLERS **/
	const tabChangeHandler = (event: React.SyntheticEvent, value: string) => {
		router.replace(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			'/community',
			{ shallow: true },
		);
	};

	const likeBoArticleHandler = async (user: any, id: any) => {
		try {
			if (likeLoading) return;
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			setLikeLoading(true);

			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});
			await boardArticleRefetch({ input: articleId });
			await sweetTopSmallSuccessAlert('Success!', 800);
		} catch (err: any) {
			console.log('ERROR, likeBoArticleHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		} finally {
			setLikeLoading(false);
		}
	};
	const createCommentHandler = async () => {
		if (!comment) return;
		try {
			if (!user?._id) throw new Error(Messages.error2);
			const commentInput: CommentInput = {
				commentGroup: CommentGroup.ARTICLE,
				commentRefId: articleId,
				commentContent: comment,
			};
			await createComment({
				variables: {
					input: commentInput,
				},
			});
			await getCommentsRefetch({ input: searchFilter });
			await boardArticleRefetch({ input: articleId });
			setComment('');
			await sweetMixinSuccessAlert('Successfully commented!');
		} catch (error: any) {
			await sweetMixinErrorAlert(error.message);
		}
	};

	const updateButtonHandler = async (commentId: string, commentStatus?: CommentStatus.DELETE) => {
		try {
			if (!user?._id) throw new Error(Messages.error2);
			if (!commentId) throw new Error('Select a comment to update!');
			if (updatedComment === comments?.find((comment) => comment?._id === commentId)?.commentContent) return;

			const updateData: CommentUpdate = {
				_id: commentId,
				...(commentStatus && { commentStatus: commentStatus }),
				...(updatedComment && { commentContent: updatedComment }),
			};

			if (!updateData?.commentContent && !updateData?.commentStatus) {
				throw new Error('Provide data to update your comment!');
			}

			if (commentStatus) {
				if (await sweetConfirmAlert('Do you want to delete the comment?')) {
					await updateComment({
						variables: {
							input: updateData,
						},
					});
					await sweetMixinSuccessAlert('Successfully deleted!');
				} else return;
			} else {
				await updateComment({
					variables: {
						input: updateData,
					},
				});
				await sweetMixinSuccessAlert('Successfully updated!');
			}
			await getCommentsRefetch({ input: searchFilter });
		} catch (error: any) {
			await sweetMixinErrorAlert(error.message);
		} finally {
			setOpenBackdrop(false);
			setUpdatedComment('');
			setUpdatedCommentWordsCnt(0);
			setUpdatedCommentId('');
		}
	};

	const getCommentMemberImage = (imageUrl: string | undefined) => {
		if (imageUrl) return `${process.env.REACT_APP_API_URL}/${imageUrl}`;
		else return '/img/community/articleImg.png';
	};

	const goMemberPage = (id: any) => {
		if (id === user?._id) router.push('/userpage');
		else router.push(`/member?memberId=${id}`);
	};

	const cancelButtonHandler = () => {
		setOpenBackdrop(false);
		setUpdatedComment('');
		setUpdatedCommentWordsCnt(0);
	};

	const updateCommentInputHandler = (value: string) => {
		if (value.length > 100) return;
		setUpdatedCommentWordsCnt(value.length);
		setUpdatedComment(value);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') {
		return (
			<div id="community-detail-page">
				<div className="container">
					<Stack className="main-box">
						{/* ____________________________________________________________________________________________________________________________________________ */}

						<Stack className="left-config">
							<Stack className={'image-info'}>
								<img src={'/img/logo/logoHomeCareServices.png'} />
								<Stack className={'community-name'}>
									<Typography className={'name'}>HomeCareServices Community</Typography>
								</Stack>
							</Stack>

							<Tabs
								orientation="vertical"
								aria-label="lab API tabs example"
								TabIndicatorProps={{
									style: { display: 'none' },
								}}
								onChange={tabChangeHandler}
								value={articleCategory}
							>
								{Object.values(BoardArticleCategory).map((category) => (
									<Tab
										key={category}
										value={category}
										label={category
											.replace(/_/g, ' ')
											.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())}
										className={`tab-button ${articleCategory === category ? 'active' : ''}`}
									/>
								))}
							</Tabs>
						</Stack>

						{/* ____________________________________________________________________________________________________________________________________________ */}

						<div className="community-detail-config">
							<Stack className="title-box">
								<Stack className="left">
									<Typography className="title">{articleCategory} BOARD</Typography>
									<Typography className="sub-title">
										Express your opinions freely here without content restrictions
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
									Write
								</Button>
							</Stack>

							{/* ____________________________________________________________________________________________________________________________________________ */}

							<div className="config">
								<Stack className="first-box-config">
									<Stack className="content-and-info">
										{/* ____________________________________________________________________________________________________________________________________________ */}

										<Stack className="content">
											<Typography className="content-data">{boardArticle?.articleTitle}</Typography>
											<Stack className="member-info">
												<img
													src={memberImage}
													alt=""
													className="member-img"
													onClick={() => goMemberPage(boardArticle?.memberData?._id)}
												/>
												<Typography className="member-nick" onClick={() => goMemberPage(boardArticle?.memberData?._id)}>
													{boardArticle?.memberData?.memberNick}
												</Typography>
												<Stack className="divider"></Stack>
												<Moment className={'time-added'} format={'DD.MM.YY HH:mm'}>
													{boardArticle?.createdAt}
												</Moment>
											</Stack>
										</Stack>

										{/* ____________________________________________________________________________________________________________________________________________ */}

										<Stack className="info">
											<Stack className=" icon-info">
												{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
													<FaThumbsUp onClick={() => likeBoArticleHandler(user, boardArticle?._id)} />
												) : (
													<FaThumbsUp onClick={() => likeBoArticleHandler(user, boardArticle?._id)} />
												)}

												<Typography className="text">{boardArticle?.articleLikes}</Typography>
											</Stack>
											<Stack className="divider"></Stack>
											<Stack className="icon-info">
												<FaEye />
												<Typography className="text">{boardArticle?.articleViews}</Typography>
											</Stack>
											<Stack className="divider"></Stack>
											<Stack className="icon-info">
												{total > 0 ? <ChatIcon /> : <ChatBubbleOutlineRoundedIcon />}

												<Typography className="text">{total}</Typography>
											</Stack>
										</Stack>

										{/* ____________________________________________________________________________________________________________________________________________ */}
									</Stack>
									<Stack>
										<ToastViewerComponent markdown={boardArticle?.articleContent} className={'ytb_play'} />
									</Stack>
									<Stack className="like-and-dislike">
										<Stack className="top">
											<Button>
												{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
													<FaRegThumbsUp onClick={() => likeBoArticleHandler(user, boardArticle?._id)} />
												) : (
													<FaThumbsUp onClick={() => likeBoArticleHandler(user, boardArticle?._id)} />
												)}
												<Typography className="text">{boardArticle?.articleLikes}</Typography>
											</Button>
										</Stack>
									</Stack>
								</Stack>

								{/* ____________________________________________________________________________________________________________________________________________ */}

								<Stack
									className="second-box-config"
									sx={{ borderBottom: total > 0 ? 'none' : '1px solid #eee', border: '1px solid #eee' }}
								>
									<Typography className="title-text">Comments ({total})</Typography>
									<Stack className="leave-comment">
										<input
											type="text"
											placeholder="Leave a comment"
											value={comment}
											onChange={(e) => {
												if (e.target.value.length > 100) return;
												setWordsCnt(e.target.value.length);
												setComment(e.target.value);
											}}
										/>
										<Stack className="button-box">
											<Typography>{wordsCnt}/100</Typography>
											<Button onClick={createCommentHandler}>comment</Button>
										</Stack>
									</Stack>
								</Stack>

								{/* ____________________________________________________________________________________________________________________________________________ */}

								{total > 0 && (
									<Stack className="comments">
										<Typography className="comments-title">Comments</Typography>
									</Stack>
								)}

								{/* ____________________________________________________________________________________________________________________________________________ */}

								{comments?.map((commentData, index) => {
									return (
										<Stack className="comments-box" key={commentData?._id}>
											<Stack className="main-comment">
												<Stack className="member-info">
													<Stack
														className="name-date"
														onClick={() => goMemberPage(commentData?.memberData?._id as string)}
													>
														<img src={getCommentMemberImage(commentData?.memberData?.memberImage)} alt="" />
														<Stack className="name-date-column">
															<Typography className="name">{commentData?.memberData?.memberNick}</Typography>
															<Typography className="date">
																<Moment className={'time-added'} format={'DD.MM.YY HH:mm'}>
																	{commentData?.createdAt}
																</Moment>
															</Typography>
														</Stack>
													</Stack>
													{commentData?.memberId === user?._id && (
														<Stack className="buttons">
															<IconButton
																onClick={() => {
																	setUpdatedCommentId(commentData?._id);
																	updateButtonHandler(commentData?._id, CommentStatus.DELETE);
																}}
															>
																<DeleteForeverIcon sx={{ color: '#757575', cursor: 'pointer' }} />
															</IconButton>
															<IconButton
																onClick={(e: any) => {
																	setUpdatedComment(commentData?.commentContent);
																	setUpdatedCommentWordsCnt(commentData?.commentContent?.length);
																	setUpdatedCommentId(commentData?._id);
																	setOpenBackdrop(true);
																}}
															>
																<EditIcon sx={{ color: '#757575' }} />
															</IconButton>
															<Backdrop
																sx={{
																	top: '40%',
																	right: '25%',
																	left: '25%',
																	width: '1000px',
																	height: 'fit-content',
																	borderRadius: '10px',
																	color: '#ffffff',
																	zIndex: 999,
																}}
																open={openBackdrop}
															>
																<Stack
																	sx={{
																		width: '100%',
																		height: '100%',
																		background: 'white',
																		border: '1px solid #b9b9b9',
																		padding: '15px',
																		gap: '10px',
																		borderRadius: '10px',
																		boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
																	}}
																>
																	<Typography variant="h4" color={'#b9b9b9'}>
																		Update comment
																	</Typography>
																	<Stack gap={'20px'}>
																		<input
																			autoFocus
																			value={updatedComment}
																			onChange={(e) => updateCommentInputHandler(e.target.value)}
																			type="text"
																			style={{
																				border: '1px solid #b9b9b9',
																				outline: 'none',
																				height: '40px',
																				padding: '0px 10px',
																				borderRadius: '5px',
																			}}
																		/>
																		<Stack width={'100%'} flexDirection={'row'} justifyContent={'space-between'}>
																			<Typography variant="subtitle1" color={'#b9b9b9'}>
																				{updatedCommentWordsCnt}/100
																			</Typography>
																			<Stack sx={{ flexDirection: 'row', alignSelf: 'flex-end', gap: '10px' }}>
																				<Button
																					variant="outlined"
																					color="inherit"
																					onClick={() => cancelButtonHandler()}
																				>
																					Cancel
																				</Button>
																				<Button
																					variant="contained"
																					color="inherit"
																					onClick={() => updateButtonHandler(updatedCommentId, undefined)}
																				>
																					Update
																				</Button>
																			</Stack>
																		</Stack>
																	</Stack>
																</Stack>
															</Backdrop>
														</Stack>
													)}
												</Stack>
												<Stack className="content">
													<Typography>{commentData?.commentContent}</Typography>
												</Stack>
											</Stack>
										</Stack>
									);
								})}

								{/* ____________________________________________________________________________________________________________________________________________ */}

								{total > 0 && (
									<Stack className="pagination-box">
										<Pagination
											count={Math.ceil(total / searchFilter.limit) || 1}
											page={searchFilter.page}
											shape="circular"
											color="primary"
											onChange={paginationHandler}
										/>
									</Stack>
								)}
							</div>
						</div>
					</Stack>
				</div>
			</div>
		);
	} else {
		return (
			<div id="community-detail-page">
				<div className="container">
					<Stack className="main-box">
						{/* ____________________________________________________________________________________________________________________________________________ */}

						<div className="community-detail-config">
							<Stack className="title-box">
								<Stack className="left">
									<Typography className="title">
										{articleCategory ? articleCategory.replace(/_/g, ' ') : 'UNKNOWN'} BOARD
									</Typography>
									<Typography className="sub-title">
										This is a space where you can share your thoughts, ideas, and opinions freely without any
										restrictions.
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

							{/* ____________________________________________________________________________________________________________________________________________ */}

							<div className="config">
								<Stack className="first-box-config">
									<Stack className="content-and-info">
										{/* ____________________________________________________________________________________________________________________________________________ */}

										<Stack className="content">
											<Typography className="content-data">{boardArticle?.articleTitle}</Typography>
											<Stack className="member-info">
												<img
													src={memberImage}
													alt=""
													className="member-img"
													onClick={() => goMemberPage(boardArticle?.memberData?._id)}
												/>
												<Typography className="member-nick" onClick={() => goMemberPage(boardArticle?.memberData?._id)}>
													{boardArticle?.memberData?.memberNick}
												</Typography>
												<Stack className="divider"></Stack>
												<Moment className={'time-added'} format={'DD.MM.YY HH:mm'}>
													{boardArticle?.createdAt}
												</Moment>
											</Stack>
										</Stack>

										{/* ____________________________________________________________________________________________________________________________________________ */}

										<Stack className="info">
											<Stack className=" icon-info">
												{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
													<FaRegThumbsUp size={24} onClick={() => likeBoArticleHandler(user, boardArticle?._id)} />
												) : (
													<FaThumbsUp size={24} onClick={() => likeBoArticleHandler(user, boardArticle?._id)} />
												)}

												<Typography className="text">{boardArticle?.articleLikes}</Typography>
											</Stack>
											<Stack className="divider"></Stack>
											<Stack className="icon-info">
												<FaEye size={24} />
												<Typography className="text">{boardArticle?.articleViews}</Typography>
											</Stack>
											<Stack className="divider"></Stack>
											<Stack className="icon-info">
												{total > 0 ? <LiaSmsSolid size={24} /> : <ChatIcon size={24} />}

												<Typography className="text">{total}</Typography>
											</Stack>
										</Stack>

										{/* ____________________________________________________________________________________________________________________________________________ */}
									</Stack>
									<Stack>
										<ToastViewerComponent markdown={boardArticle?.articleContent} className={'ytb_play'} />
									</Stack>
									<Stack className="like-and-dislike">
										<Stack className="top">
											<Button>
												{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
													<FaRegThumbsUp size={24} onClick={() => likeBoArticleHandler(user, boardArticle?._id)} />
												) : (
													<FaThumbsUp size={24} onClick={() => likeBoArticleHandler(user, boardArticle?._id)} />
												)}
												<Typography className="text">{boardArticle?.articleLikes}</Typography>
											</Button>
										</Stack>
									</Stack>
								</Stack>

								{/* ____________________________________________________________________________________________________________________________________________ */}

								<Stack
									className="second-box-config"
									sx={{ borderBottom: total > 0 ? 'none' : '1px solid #eee', border: '1px solid #eee' }}
								>
									<Typography className="title-text">Comments ({total})</Typography>
									<Stack className="leave-comment">
										<input
											type="text"
											placeholder="Leave a comment"
											value={comment}
											onChange={(e) => {
												if (e.target.value.length > 100) return;
												setWordsCnt(e.target.value.length);
												setComment(e.target.value);
											}}
										/>
										<Stack className="button-box">
											<Typography>{wordsCnt}/100</Typography>
											<Button onClick={createCommentHandler}>comment</Button>
										</Stack>
									</Stack>
								</Stack>

								{/* ____________________________________________________________________________________________________________________________________________ */}

								{total > 0 && (
									<Stack className="comments">
										<Typography className="comments-title">Comments</Typography>
									</Stack>
								)}
								{comments?.map((commentData, index) => {
									return (
										<Stack className="comments-box" key={commentData?._id}>
											<Stack className="main-comment">
												<Stack className="member-info">
													{/* ____________________________________________________________________________________________________________________________________________ */}

													<Stack
														className="name-date"
														onClick={() => goMemberPage(commentData?.memberData?._id as string)}
													>
														<img src={getCommentMemberImage(commentData?.memberData?.memberImage)} alt="" />
														<Stack className="name-date-column">
															<Typography className="name">{commentData?.memberData?.memberNick}</Typography>
															<Typography className="date">
																<Moment className={'time-added'} format={'DD.MM.YY HH:mm'}>
																	{commentData?.createdAt}
																</Moment>
															</Typography>
														</Stack>
													</Stack>

													{/* ____________________________________________________________________________________________________________________________________________ */}

													{commentData?.memberId === user?._id && (
														<Stack className="buttons">
															<IconButton
																onClick={() => {
																	setUpdatedCommentId(commentData?._id);
																	updateButtonHandler(commentData?._id, CommentStatus.DELETE);
																}}
															>
																<DeleteForeverIcon sx={{ color: '#757575', cursor: 'pointer' }} />
															</IconButton>
															<IconButton
																onClick={(e: any) => {
																	setUpdatedComment(commentData?.commentContent);
																	setUpdatedCommentWordsCnt(commentData?.commentContent?.length);
																	setUpdatedCommentId(commentData?._id);
																	setOpenBackdrop(true);
																}}
															>
																<EditIcon sx={{ color: '#757575' }} />
															</IconButton>
															<Backdrop
																sx={{
																	top: '40%',
																	right: '25%',
																	left: '25%',
																	width: '1000px',
																	height: 'fit-content',
																	borderRadius: '10px',
																	color: '#ffffff',
																	zIndex: 999,
																}}
																open={openBackdrop}
															>
																<Stack
																	sx={{
																		width: '100%',
																		height: '100%',
																		background: 'white',
																		border: '1px solid #b9b9b9',
																		padding: '15px',
																		gap: '10px',
																		borderRadius: '10px',
																		boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
																	}}
																>
																	<Typography variant="h4" color={'#b9b9b9'}>
																		Update comment
																	</Typography>
																	<Stack gap={'20px'}>
																		<input
																			autoFocus
																			value={updatedComment}
																			onChange={(e) => updateCommentInputHandler(e.target.value)}
																			type="text"
																			style={{
																				border: '1px solid #b9b9b9',
																				outline: 'none',
																				height: '40px',
																				padding: '0px 10px',
																				borderRadius: '5px',
																			}}
																		/>
																		<Stack width={'100%'} flexDirection={'row'} justifyContent={'space-between'}>
																			<Typography variant="subtitle1" color={'#b9b9b9'}>
																				{updatedCommentWordsCnt}/100
																			</Typography>
																			<Stack sx={{ flexDirection: 'row', alignSelf: 'flex-end', gap: '10px' }}>
																				<Button
																					variant="outlined"
																					color="inherit"
																					onClick={() => cancelButtonHandler()}
																				>
																					Cancel
																				</Button>
																				<Button
																					variant="contained"
																					color="inherit"
																					onClick={() => updateButtonHandler(updatedCommentId, undefined)}
																				>
																					Update
																				</Button>
																			</Stack>
																		</Stack>
																	</Stack>
																</Stack>
															</Backdrop>
														</Stack>
													)}

													{/* ____________________________________________________________________________________________________________________________________________ */}
												</Stack>
												<Stack className="content">
													<Typography>{commentData?.commentContent}</Typography>
												</Stack>
											</Stack>
										</Stack>
									);
								})}
								{total > 0 && (
									<Stack className="pagination-box">
										<Pagination
											count={Math.ceil(total / searchFilter.limit) || 1}
											page={searchFilter.page}
											shape="circular"
											color="primary"
											onChange={paginationHandler}
										/>
									</Stack>
								)}
							</div>
						</div>

						{/* ____________________________________________________________________________________________________________________________________________ */}

						<Stack className="left-config">
							<Stack className={'image-info'}>
								<img src={'/img/logo/logoHomeCareServices.png'} />
								<Stack className={'community-name'}>
									<Typography className={'name'}>HomeCareServices Community</Typography>
								</Stack>
							</Stack>

							<Tabs
								orientation="vertical"
								aria-label="lab API tabs example"
								TabIndicatorProps={{
									style: { display: 'none' },
								}}
								onChange={tabChangeHandler}
								value={articleCategory}
							>
								{Object.values(BoardArticleCategory).map((category) => (
									<Tab
										key={category}
										value={category.replace(/_/g, ' ')}
										label={category
											.replace(/_/g, ' ')
											.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())}
										className={`tab-button ${articleCategory === category ? 'active' : ''}`}
									/>
								))}
							</Tabs>
						</Stack>

						{/* ____________________________________________________________________________________________________________________________________________ */}
					</Stack>
				</div>
			</div>
		);
	}
};
CommunityDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: { commentRefId: '' },
	},
};

export default withLayoutBasic(CommunityDetail);
function boardArticleRefetch(arg0: { input: string }) {
	throw new Error('Function not implemented.');
}
