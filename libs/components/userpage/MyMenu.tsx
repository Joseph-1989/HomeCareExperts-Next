import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box, List, ListItem, Container } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import PortraitIcon from '@mui/icons-material/Portrait';
import IconButton from '@mui/material/IconButton';
import { REACT_APP_API_URL } from '../../config';
import { logOut } from '../../auth';
import { sweetConfirmAlert } from '../../sweetAlert';
import { CgProfile } from 'react-icons/cg';
import { ImExit } from 'react-icons/im';
import { PiArticleNyTimesBold } from 'react-icons/pi';
import { SlBookOpen } from 'react-icons/sl';
import { SlUserFollowing } from 'react-icons/sl';
import { GiShadowFollower } from 'react-icons/gi';
import { FaRegEye } from 'react-icons/fa';
import { GrFavorite } from 'react-icons/gr';

const MyMenu = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const pathname = router.query.category ?? 'myProfile';
	const category: any = router.query?.category ?? 'myProfile';
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const logoutHandler = async () => {
		try {
			if (await sweetConfirmAlert('Do you want to logout?')) logOut();
		} catch (err: any) {
			console.log('ERROR, logoutHandler:', err.message);
		}
	};

	if (device === 'mobile') {
		return <div>MY MENU</div>;
	} else {
		return (
			<div className={'profile-stack'}>
				<div className={'profile'}>
					<Box component={'div'} className={'profile-img'}>
						<img
							src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
							alt={'member-photo'}
						/>
					</Box>

					{/* ======================================================================================================================================================================================= */}

					<div className={'user-info'}>
						<Typography className={'user-name'}>{user?.memberNick}</Typography>
						<Box component={'div'} className={'user-phone'}>
							<img src={'/img/icons/call.svg'} alt={'icon'} />
							<Typography className={'p-number'}>{user?.memberPhone}</Typography>
						</Box>
						{user?.memberType === 'ADMIN' ? (
							<a href="/_admin/users" target={'_blank'}>
								<Typography className={'view-list'}>{user?.memberType}</Typography>
							</a>
						) : (
							<Typography className={'view-list'}>{user?.memberType}</Typography>
						)}
					</div>

					{/* ======================================================================================================================================================================================= */}
				</div>
				<div className={'sections'}>
					<div className={'section'}>
						<Typography className={'title'} variant={'h5'}>
							MANAGE LISTINGS
						</Typography>
						<List className={'sub-section'}>
							{user.memberType === 'AGENT' && (
								<>
									{/* addProperty ======================================================================================================================================================================================= */}
									{/* 
									<ListItem className={pathname === 'addProperty' ? 'focus' : ''}>
										<Link
											href={{
												pathname: '/userpage',
												query: { category: 'addProperty' },
											}}
											scroll={false}
										>
											<div className={'flex-box'}>
												{category === 'addProperty' ? (
													<img className={'com-icon'} src={'/img/icons/whiteTab.svg'} alt={'com-icon'} />
												) : (
													<img className={'com-icon'} src={'/img/icons/newTab.svg'} alt={'com_icon'} />
												)}
												<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
													Add Property
												</Typography>
												<IconButton aria-label="delete" sx={{ ml: '40px' }}>
													<PortraitIcon style={{ color: 'red' }} />
												</IconButton>
											</div>
										</Link>
									</ListItem> */}

									{/* addService ======================================================================================================================================================================================= */}

									<ListItem className={pathname === 'addService' ? 'focus' : ''}>
										<Link
											href={{
												pathname: '/userpage',
												query: { category: 'addService' },
											}}
											scroll={false}
										>
											<div className={'flex-box'}>
												{category === 'addService' ? (
													<img className={'com-icon'} src={'/img/icons/whiteTab.svg'} alt={'com-icon'} />
												) : (
													<img className={'com-icon'} src={'/img/icons/newTab.svg'} alt={'com_icon'} />
												)}
												<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
													Add Service
												</Typography>
												<IconButton aria-label="delete" sx={{ ml: '40px' }}>
													<PortraitIcon style={{ color: 'red' }} />
												</IconButton>
											</div>
										</Link>
									</ListItem>

									{/* myProperties ======================================================================================================================================================================================= */}

									{/* <ListItem className={pathname === 'myProperties' ? 'focus' : ''}>
										<Link
											href={{
												pathname: '/userpage',
												query: { category: 'myProperties' },
											}}
											scroll={false}
										>
											<div className={'flex-box'}>
												{category === 'myProperties' ? (
													<img className={'com-icon'} src={'/img/icons/homeWhite.svg'} alt={'com-icon'} />
												) : (
													<img className={'com-icon'} src={'/img/icons/home.svg'} alt={'com-icon'} />
												)}
												<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
													My Properties
												</Typography>
												<IconButton aria-label="delete" sx={{ ml: '36px' }}>
													<PortraitIcon style={{ color: 'red' }} />
												</IconButton>
											</div>
										</Link>
									</ListItem> */}

									{/* myServices ======================================================================================================================================================================================= */}

									<ListItem className={pathname === 'myServices' ? 'focus' : ''}>
										<Link
											href={{
												pathname: '/userpage',
												query: { category: 'myServices' },
											}}
											scroll={false}
										>
											<div className={'flex-box'}>
												{category === 'myServices' ? (
													<img className={'com-icon'} src={'/img/icons/homeWhite.svg'} alt={'com-icon'} />
												) : (
													<img className={'com-icon'} src={'/img/icons/home.svg'} alt={'com-icon'} />
												)}
												<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
													My Services
												</Typography>
												<IconButton aria-label="delete" sx={{ ml: '36px' }}>
													<PortraitIcon style={{ color: 'red' }} />
												</IconButton>
											</div>
										</Link>
									</ListItem>

									{/* ======================================================================================================================================================================================= */}
								</>
							)}

							{/* myFavorites ======================================================================================================================================================================================= */}

							{/* <ListItem className={pathname === 'myFavorites' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/userpage',
										query: { category: 'myFavorites' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										{category === 'myFavorites' ? (
											<GrFavorite className={'com-icon'} size={20} />
										) : (
											<GrFavorite className={'com-icon'} size={20} />
										)}

										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											My Favorite Properties
										</Typography>
									</div>
								</Link>
							</ListItem> */}

							{/* myFavorites_Service ======================================================================================================================================================================================= */}

							<ListItem className={pathname === 'myFavorites_Service' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/userpage',
										query: { category: 'myFavorites_Service' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										{category === 'myFavorites_Service' ? (
											<GrFavorite className={'com-icon'} size={20} />
										) : (
											<GrFavorite className={'com-icon'} size={20} />
										)}

										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											My Favorite Services
										</Typography>
									</div>
								</Link>
							</ListItem>

							{/* recentlyVisited ======================================================================================================================================================================================= */}

							{/* <ListItem className={pathname === 'recentlyVisited' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/userpage',
										query: { category: 'recentlyVisited' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										{category === 'recentlyVisited' ? (
											<FaRegEye className={'com-icon'} size={20} />
										) : (
											<FaRegEye className={'com-icon'} size={20} />
										)}

										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											Recently Visited
										</Typography>
									</div>
								</Link>
							</ListItem> */}

							{/* recentlyVisited ======================================================================================================================================================================================= */}

							<ListItem className={pathname === 'recentlyVisited_Service' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/userpage',
										query: { category: 'recentlyVisited_Service' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										{category === 'recentlyVisited_Service' ? (
											<FaRegEye className={'com-icon'} size={20} />
										) : (
											<FaRegEye className={'com-icon'} size={20} />
										)}

										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											Recently Visited Services
										</Typography>
									</div>
								</Link>
							</ListItem>

							{/* ======================================================================================================================================================================================= */}

							<ListItem className={pathname === 'followers' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/userpage',
										query: { category: 'followers' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<GiShadowFollower size={20} className="com-icon" />
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											My Followers
										</Typography>
									</div>
								</Link>
							</ListItem>

							{/* ======================================================================================================================================================================================= */}

							<ListItem className={pathname === 'followings' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/userpage',
										query: { category: 'followings' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<SlUserFollowing size={20} className={'com-icon'} />

										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											My Followings
										</Typography>
									</div>
								</Link>
							</ListItem>

							{/* ======================================================================================================================================================================================= */}
						</List>
					</div>

					{/* ======================================================================================================================================================================================= */}

					<div className={'section'}>
						<div>
							<Typography className="title" variant={'h5'}>
								Community
							</Typography>
							<List className={'sub-section'}>
								{/* ======================================================================================================================================================================================= */}

								<ListItem className={pathname === 'myArticles' ? 'focus' : ''}>
									<Link
										href={{
											pathname: '/userpage',
											query: { category: 'myArticles' },
										}}
										scroll={false}
									>
										<div className={'flex-box'}>
											{category === 'myArticles' ? (
												<SlBookOpen className={'com-icon'} size={20} />
											) : (
												<SlBookOpen className={'com-icon'} size={20} />
											)}

											<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
												Articles
											</Typography>
										</div>
									</Link>
								</ListItem>

								{/* ======================================================================================================================================================================================= */}

								<ListItem className={pathname === 'writeArticle' ? 'focus' : ''}>
									<Link
										href={{
											pathname: '/userpage',
											query: { category: 'writeArticle' },
										}}
										scroll={false}
									>
										<div className={'flex-box'}>
											{category === 'writeArticle' ? (
												<PiArticleNyTimesBold className={'com-icon'} size={22} />
											) : (
												<PiArticleNyTimesBold className={'com-icon'} size={22} />
											)}
											<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
												Write Article
											</Typography>
										</div>
									</Link>
								</ListItem>

								{/* ======================================================================================================================================================================================= */}
							</List>
						</div>
					</div>

					{/* ======================================================================================================================================================================================= */}

					<div className={'section'}>
						<Typography className="title" variant={'h5'}>
							MANAGE ACCOUNT
						</Typography>
						<List className={'sub-section'}>
							{/* ======================================================================================================================================================================================= */}

							<ListItem className={pathname === 'myProfile' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/userpage',
										query: { category: 'myProfile' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										{category === 'myProfile' ? (
											<CgProfile className={'com-icon'} size={20} />
										) : (
											<CgProfile className={'com-icon'} size={20} />
										)}
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											My Profile
										</Typography>
									</div>
								</Link>
							</ListItem>

							{/* ======================================================================================================================================================================================= */}

							<ListItem onClick={logoutHandler}>
								<div className={'flex-box'}>
									<ImExit size={20} className={'com-icon'} />
									<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
										Logout
									</Typography>
								</div>
							</ListItem>

							{/* ======================================================================================================================================================================================= */}
						</List>
					</div>

					{/* ======================================================================================================================================================================================= */}
				</div>
			</div>
		);
	}
};

export default MyMenu;
