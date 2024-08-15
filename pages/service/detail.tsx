import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Box, Button, CircularProgress, ImageList, ImageListItem, Stack, Typography } from '@mui/material';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import { GET_COMMENTS, GET_SERVICE, GET_SERVICES } from '../../apollo/user/query';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { CREATE_COMMENT, LIKE_TARGET_SERVICE } from '../../apollo/user/mutation';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Pagination as MuiPagination } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Direction, Message } from '../../libs/enums/common.enum';
import { REACT_APP_API_URL } from '../../libs/config';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { formatterStr } from '../../libs/utils';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Service } from '../../libs/types/service/service';
import { Comment } from '../../libs/types/comment/comment';
import { userVar } from '../../apollo/store';
import { T } from '../../libs/types/common';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import ServiceBigCard from '../../libs/components/common/ServiceBigCard';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import Review from '../../libs/components/property/Review';
import moment from 'moment';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import { GiPriceTag } from 'react-icons/gi';
import { BsCalendar2Date } from 'react-icons/bs';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import { TbCategoryPlus } from 'react-icons/tb';
import { FaLocationDot } from 'react-icons/fa6';
import { FaHeart } from 'react-icons/fa';
import { FcLike } from 'react-icons/fc';
import { FcAlarmClock } from 'react-icons/fc';
import { FcMoneyTransfer } from 'react-icons/fc';
import { PiRankingFill } from 'react-icons/pi';
import { MdStars } from 'react-icons/md';
import { BsFillSendArrowUpFill } from 'react-icons/bs';
import { FaPhoneVolume } from 'react-icons/fa6';
import { RiMailSendFill } from 'react-icons/ri';
import { VscCircleFilled } from 'react-icons/vsc';

SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ServiceDetail: NextPage = ({ initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [service, setService] = useState<Service | null>(null);
	const [serviceId, setServiceId] = useState<string | null>(null);
	const [slideImage, setSlideImage] = useState<string>('');
	const [destinationServices, setDestinationServices] = useState<Service[]>([]);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [serviceComments, setServiceComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.SERVICE,
		commentContent: '',
		commentRefId: '',
	});

	const getIconColor = (views: any) => {
		if (views > 100) return 'primary';
		if (views > 0) return 'green';
		return 'action';
	};

	const iconColor = getIconColor(service?.serviceViews);

	/** APOLLO REQUESTS **/
	const [likeTargetService] = useMutation(LIKE_TARGET_SERVICE);
	const [createComment] = useMutation(CREATE_COMMENT);

	/** GET_SERVICE **/

	const {
		loading: getServiceLoading,
		data: getServiceData,
		error: getServiceError,
		refetch: getServiceRefetch,
	} = useQuery(GET_SERVICE, {
		fetchPolicy: 'network-only',
		variables: { input: serviceId },
		skip: !serviceId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getService) setService(data.getService);
			if (data?.getService) setSlideImage(data.getService.serviceImages[0]);
		},
	});

	/** GET_PROPERTIES **/

	const {
		loading: getServicesLoading,
		data: getServicesData,
		error: getServicesError,
		refetch: getServicesRefetch,
	} = useQuery(GET_SERVICES, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 4,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {
					locationList: service?.serviceLocation ? [service?.serviceLocation] : [],
				},
			},
		},
		skip: !serviceId && !service,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getServices?.list) {
				setDestinationServices(data.getServices.list);
			}
		},
	});

	/** GET_COMMENTS **/

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialComment },
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getComments?.list) {
				setServiceComments(data.getComments.list);
			}
			setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/

	useEffect(() => {
		if (router.query.id) {
			setServiceId(router.query.id as string);
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: router.query.id as string,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: router.query.id as string,
			});
		}
	}, [router]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ input: commentInquiry });
		}
	}, [commentInquiry]);

	/** HANDLERS **/
	const changeImageHandler = (image: string) => {
		setSlideImage(image);
	};

	const likeServiceHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetService({
				variables: { input: id },
			});
			await getServiceRefetch({ input: id });
			await getServicesRefetch({
				input: {
					page: 1,
					limit: 4,
					sort: 'createdAt',
					direction: Direction.DESC,
					search: {
						locationList: [service?.serviceLocation],
					},
				},
			});

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeServiceHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await createComment({ variables: { input: insertCommentData } });

			setInsertCommentData({ ...insertCommentData, commentContent: '' });

			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (getServiceLoading) {
		return (
			<Stack
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					width: '100%',
					height: '1080px',
				}}
			>
				<CircularProgress size={'4rem'} />
			</Stack>
		);
	}

	const services = [
		{ name: 'Assembly', imageUrl: '/img/serviceCategoryImages/1-assambly.png' },
		{ name: 'Mounting', imageUrl: '/img/serviceCategoryImages/2-mounting.jpeg' },
		{ name: 'Moving', imageUrl: '/img/serviceCategoryImages/3-moving.jpg' },
		{ name: 'Cleaning', imageUrl: '/img/serviceCategoryImages/4-cleaning.webp' },
		{ name: 'Outdoor Help', imageUrl: '/img/serviceCategoryImages/5-outdoorhelp.webp' },
		{ name: 'Home Repairs', imageUrl: '/img/serviceCategoryImages/6-homerepairs.jpg' },
		{ name: 'Painting', imageUrl: '/img/serviceCategoryImages/7-painting.png' },
		{ name: 'Trending', imageUrl: '/img/serviceCategoryImages/8-trending.jpg' },
		{ name: 'Plumbing', imageUrl: '/img/serviceCategoryImages/9-plumber.webp' },
		{ name: 'Electrical', imageUrl: '/img/serviceCategoryImages/10-electrical.jpg' },
		{ name: 'HVAC', imageUrl: '/img/serviceCategoryImages/11-hvac.webp' },
		{ name: 'Remodeling', imageUrl: '/img/serviceCategoryImages/12-remodeling.jpg' },
		{ name: 'Landscaping', imageUrl: '/img/serviceCategoryImages/13-landscaping.jpeg' },
		{ name: 'Pest Control', imageUrl: '/img/serviceCategoryImages/14-pest-control.webp' },
		{ name: 'Handyman', imageUrl: '/img/serviceCategoryImages/15-Handyman.jpg' },
		{ name: 'Kitchen Remodel', imageUrl: '/img/serviceCategoryImages/16-kitchen-remodeling.webp' },
		{ name: 'Build A House', imageUrl: '/img/serviceCategoryImages/17-build-a-house.jpg' },
		{ name: 'Roof Replacement', imageUrl: '/img/serviceCategoryImages/18-roof-replacement.jpeg' },
	];

	console.log('Number of destination services:', destinationServices.length);
	console.log('Destination services:', destinationServices);

	if (device === 'mobile') {
		return <div>SERVICE DETAIL PAGE</div>;
	} else {
		return (
			<div id={'service-detail-page'}>
				<div className={'container'}>
					<Stack className={'property-detail-config'}>
						<Stack className={'property-info-config'}>
							<Stack className={'info'}>
								<Stack className={'left-box'}>
									<Typography className={'title-main'}>{service?.serviceTitle.replace(/_/g, ' ')}</Typography>
									<Stack className={'top-box'}>
										<Typography className={'city'}>{service?.serviceLocation}</Typography>
										<Stack className={'divider'}></Stack>

										<Stack className="service-options">
											{[
												{ condition: service?.assistanceDIY, text: 'DIY Assistance', color: '#698D8B' },
												{ condition: service?.subscriptionModel, text: 'Subscription Model', color: '#698D8B' },
												{ condition: service?.emergencyServices, text: 'Emergency Services', color: '#698D8B' },
												{ condition: service?.referralPrograms, text: 'Referral Programs', color: '#698D8B' },
											].map(
												(option, index) =>
													option.condition && (
														<Stack key={index} className="option-item">
															<VscCircleFilled size={15} />
															<Typography>{option.text}</Typography>
														</Stack>
													),
											)}
										</Stack>
										<Stack className={'divider'}></Stack>
										<FcAlarmClock size={24} />
										<Typography className={'date'}>{moment().diff(service?.createdAt, 'days')} days ago</Typography>
									</Stack>
									<Stack className={'bottom-box'}>
										<Stack className="option">
											<GiPriceTag color="green" size={20} />
											<Typography>{service?.pricingModel.replace(/_/g, ' ')} Pricing Model</Typography>
										</Stack>
									</Stack>
								</Stack>

								{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

								<Stack className={'right-box'}>
									<Stack className="buttons">
										<Stack className="button-box">
											<RemoveRedEyeIcon fontSize="medium" style={{ color: iconColor }} />
											<Typography>{service?.serviceViews}</Typography>
										</Stack>
										<Stack className="button-box">
											{service?.meLiked && service?.meLiked[0]?.myFavorite ? (
												<FaHeart fontSize={'medium'} />
											) : (
												<FcLike
													fontSize={'medium'}
													// @ts-ignore
													onClick={() => likeServiceHandler(user, service?._id)}
												/>
											)}
											<Typography>{service?.serviceLikes}</Typography>
										</Stack>
									</Stack>
									<Typography>${formatterStr(service?.servicePrice)}</Typography>
								</Stack>

								{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
							</Stack>

							{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

							<Stack className={'images'}>
								<Stack className={'main-image'}>
									<img
										src={slideImage ? `${REACT_APP_API_URL}/${slideImage}` : '/img/property/bigImage.png'}
										alt={'main-image'}
									/>
								</Stack>
								<Stack className={'sub-images'}>
									{service?.serviceImages.map((subImg: string) => {
										const imagePath: string = `${REACT_APP_API_URL}/${subImg}`;
										return (
											<Stack className={'sub-img-box'} onClick={() => changeImageHandler(subImg)} key={subImg}>
												<img src={imagePath} alt={'sub-image'} />
											</Stack>
										);
									})}
								</Stack>
							</Stack>
						</Stack>

						{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

						<Stack className={'service-desc-config'}>
							<Stack className={'left-config'}>
								<Stack className={'options-config'}>
									{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

									<Stack className={'option'}>
										<Stack className={'svg-box'}>
											<BsCalendar2Date color="green" size={24} />
										</Stack>
										<Stack className={'option-includes'}>
											<Typography className={'title'}>Date of Establishment</Typography>
											<Typography className={'option-data'}>
												{moment(service?.createdAt).format('YYYY-MM-DD')}
											</Typography>
										</Stack>
									</Stack>

									{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

									<Stack className={'option'}>
										<Stack className={'svg-box'}>
											<GiPriceTag color="green" size={24} />
										</Stack>
										<Stack className={'option-includes'}>
											<Typography className={'title'}>Pricing Model</Typography>
											<Typography className={'option-data'}>{service?.pricingModel.replace(/_/g, ' ')}</Typography>
										</Stack>
									</Stack>

									{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

									<Stack className={'option'}>
										<Stack className={'svg-box'}>
											<HiOutlineStatusOnline color="green" size={24} />
										</Stack>
										<Stack className={'option-includes'}>
											<Typography className={'title'}>Service Status</Typography>
											<Typography className={'option-data'}>{service?.serviceStatus} </Typography>
										</Stack>
									</Stack>

									{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

									<Stack className={'option'}>
										<Stack className={'svg-box'}>
											<TbCategoryPlus color="green" size={24} />
										</Stack>
										<Stack className={'option-includes'}>
											<Typography className={'title'}>Service Category</Typography>
											<Typography className={'option-data'}>{service?.serviceCategory.replace(/_/g, ' ')}</Typography>
										</Stack>
									</Stack>

									{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

									<Stack className={'option'}>
										<Stack className={'svg-box'}>
											<FaLocationDot color="green" size={24} />
										</Stack>
										<Stack className={'option-includes'}>
											<Typography className={'title'}>Service Address</Typography>
											<Typography className={'option-data'}>{service?.serviceAddress.replace(/_/g, ' ')}</Typography>
										</Stack>
									</Stack>

									{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

									<Stack className={'option'}>
										<Stack className={'svg-box'}>
											<FcMoneyTransfer color="green" size={24} />
										</Stack>
										<Stack className={'option-includes'}>
											<Typography className={'title'}>Service Price</Typography>
											<Typography className={'option-data'}>{service?.servicePrice}</Typography>
										</Stack>
									</Stack>

									{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

									<Stack className={'option'}>
										<Stack className={'svg-box'}>
											<PiRankingFill color="green" size={24} />
										</Stack>
										<Stack className={'option-includes'}>
											<Typography className={'title'}>Service Rank</Typography>
											<Typography className={'option-data'}>{service?.serviceRank}</Typography>
										</Stack>
									</Stack>

									{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
								</Stack>

								{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

								<Stack className={'prop-desc-config'}>
									<Stack className={'top'}>
										<Typography className={'title'}>Service Description</Typography>
										<Typography className={'desc'}>{service?.serviceDescription ?? 'No Description!'}</Typography>
									</Stack>
									<Stack className={'bottom'}>
										<Typography className={'title'}>Service Details</Typography>
										<Stack className={'info-box'}>
											{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
											<Stack className={'left'}>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Price</Typography>
													<Typography className={'data'}>${formatterStr(service?.servicePrice)}</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Address</Typography>
													<Typography className={'data'}>{service?.serviceAddress} </Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Location</Typography>
													<Typography className={'data'}>{service?.serviceLocation}</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Status</Typography>
													<Typography className={'data'}>{service?.serviceStatus}</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Pricing method</Typography>
													<Typography className={'data'}>{service?.pricingModel.replace(/_/g, ' ')}</Typography>
												</Box>
											</Stack>

											{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

											<Stack className={'right'}>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Date of Establishment</Typography>
													<Typography className={'data'}>{moment(service?.createdAt).format('YYYY-MM-DD')}</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Service Category</Typography>
													<Typography className={'data'}>{service?.serviceCategory.replace(/_/g, ' ')}</Typography>
												</Box>
												<Box component={'div'} className={'info'}>
													<Typography className={'title'}>Extra Service Options</Typography>
													<div className={'data'}>
														{service?.assistanceDIY && <Typography component="span">DIY Assistance</Typography>}
														{service?.subscriptionModel && <Typography component="span">Subscription Model</Typography>}
														{service?.emergencyServices && <Typography component="span">Emergency Services</Typography>}
														{service?.referralPrograms && <Typography component="span">Referral Programs</Typography>}
													</div>
												</Box>
											</Stack>

											{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
										</Stack>
									</Stack>
								</Stack>

								{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

								<Stack className={'service-gallery'}>
									<Typography className={'title'}>Our Services</Typography>
									<ImageList className={'image-list'}>
										{services?.map((service, index) => (
											<ImageListItem className={'image-list-item'} key={index}>
												<img
													src={`${service.imageUrl}?w=164&h=164&fit=crop&auto=format`}
													alt={service.name}
													loading="lazy"
												/>
												<Typography className={'service-name'}>{service.name}</Typography>
											</ImageListItem>
										))}
									</ImageList>
								</Stack>

								{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

								<Stack className={'address-config'}>
									<Typography className={'title'}>Address</Typography>
									<Stack className={'map-box'}>
										<iframe
											src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25867.098915951767!2d128.68632810247993!3d35.86402299180927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35660bba427bf179%3A0x1fc02da732b9072f!2sGeumhogangbyeon-ro%2C%20Dong-gu%2C%20Daegu!5e0!3m2!1suz!2skr!4v1695537640704!5m2!1suz!2skr"
											width="100%"
											height="100%"
											style={{ border: 0 }}
											allowFullScreen={true}
											loading="lazy"
											referrerPolicy="no-referrer-when-downgrade"
										></iframe>
									</Stack>
								</Stack>

								{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

								{commentTotal !== 0 && (
									<Stack className={'reviews-config'}>
										{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
										<Stack className={'filter-box'}>
											<Stack className={'review-cnt'}>
												<MdStars color="red" size={24} />
												<Typography className={'reviews'}>{commentTotal} reviews</Typography>
											</Stack>
										</Stack>

										{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
										<Stack className={'review-list'}>
											{serviceComments?.map((comment: Comment) => {
												return <Review comment={comment} key={comment?._id} />;
											})}
											<Box component={'div'} className={'pagination-box'}>
												<MuiPagination
													page={commentInquiry.page}
													count={Math.ceil(commentTotal / commentInquiry.limit)}
													onChange={commentPaginationChangeHandler}
													shape="circular"
													color="primary"
												/>
											</Box>
										</Stack>
										{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
									</Stack>
								)}

								{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
								<Stack className={'leave-review-config'}>
									<Typography className={'main-title'}>Leave A Review</Typography>
									<Typography className={'review-title'}>Review</Typography>
									<textarea
										onChange={({ target: { value } }: any) => {
											setInsertCommentData({ ...insertCommentData, commentContent: value });
										}}
										value={insertCommentData.commentContent}
									></textarea>
									<Box className={'submit-btn'} component={'div'}>
										<Button
											className={'submit-review'}
											disabled={insertCommentData.commentContent === '' || user?._id === ''}
											onClick={createCommentHandler}
										>
											<Typography className={'title'}>Submit Review</Typography>
											<BsFillSendArrowUpFill color={'black'} size={24} />
										</Button>
									</Box>
								</Stack>

								{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
							</Stack>

							{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

							<Stack className={'right-config'}>
								<Stack className={'info-box'}>
									<Typography className={'main-title'}>Get More Information</Typography>
									<Stack className={'image-info'}>
										<img
											className={'member-image'}
											src={
												service?.memberData?.memberImage
													? `${REACT_APP_API_URL}/${service?.memberData?.memberImage}`
													: '/img/profile/defaultUser.svg'
											}
										/>
										<Stack className={'name-phone-listings'}>
											<Link href={`/member?memberId=${service?.memberData?._id}`}>
												<Typography className={'name'}>{service?.memberData?.memberNick}</Typography>
											</Link>
											<Stack className={'phone-number'}>
												<FaPhoneVolume size={24} />
												<Typography className={'number'}>{service?.memberData?.memberPhone}</Typography>
											</Stack>
											<Typography className={'listings'}>View Listings</Typography>
										</Stack>
									</Stack>
								</Stack>
								<Stack className={'info-box'}>
									<Typography className={'sub-title'}>Name</Typography>
									<input type={'text'} placeholder={'Enter your name'} />
								</Stack>
								<Stack className={'info-box'}>
									<Typography className={'sub-title'}>Phone</Typography>
									<input type={'text'} placeholder={'Enter your phone'} />
								</Stack>
								<Stack className={'info-box'}>
									<Typography className={'sub-title'}>Email</Typography>
									<input type={'text'} placeholder={'creativelayers088'} />
								</Stack>
								<Stack className={'info-box'}>
									<Typography className={'sub-title'}>Message</Typography>
									<textarea placeholder={'Hello, I am interested in \n' + '[Renovated property at  floor]'}></textarea>
								</Stack>
								<Stack className={'info-box'}>
									<Button className={'send-message'}>
										<Typography className={'title'}>Send Message</Typography>
										<RiMailSendFill size={24} />
									</Button>
								</Stack>
							</Stack>

							{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
						</Stack>

						{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

						{destinationServices.length !== 0 && (
							<Stack className={'similar-services-config'}>
								<Stack className={'title-pagination-box'}>
									<Stack className={'title-box'}>
										<Typography className={'main-title'}>Destination Service</Typography>
										<Typography className={'sub-title'}>Aliquam lacinia diam quis lacus euismod</Typography>
									</Stack>
									<Stack className={'pagination-box'}>
										<WestIcon className={'swiper-similar-prev'} />
										<div className={'swiper-similar-pagination'}></div>
										<EastIcon className={'swiper-similar-next'} />
									</Stack>
								</Stack>
								<Stack className={'cards-box'}>
									<Swiper
										className={'similar-homes-swiper'}
										slidesPerView={'auto'}
										spaceBetween={35}
										modules={[Autoplay, Navigation, Pagination]}
										navigation={{
											nextEl: '.swiper-similar-next',
											prevEl: '.swiper-similar-prev',
										}}
										pagination={{
											el: '.swiper-similar-pagination',
										}}
									>
										{destinationServices.map((service: Service) => {
											return (
												<SwiperSlide className={'similar-homes-slide'} key={service?.serviceTitle}>
													<ServiceBigCard
														service={service}
														likeServiceHandler={likeServiceHandler}
														key={service?._id}
													/>
												</SwiperSlide>
											);
										})}
									</Swiper>
								</Stack>
							</Stack>
						)}

						{/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
					</Stack>
				</div>
			</div>
		);
	}
};

ServiceDetail.defaultProps = {
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutFull(ServiceDetail);
