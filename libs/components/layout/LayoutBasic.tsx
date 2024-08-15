import React, { useEffect, useMemo, useState } from 'react';
import { getJwtToken, updateUserInfo } from '../../auth';
import { useReactiveVar } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { userVar } from '../../../apollo/store';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Footer from '../Footer';
import Head from 'next/head';
import Chat from '../Chat';
import Top from '../Top';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import FooterService from '../Footer.service';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '';

			switch (router.pathname) {
				case '/property':
					title = 'Property Search';
					desc = 'We are glad to see you again!';
					bgImage = '/img/banner/properties.png';
					break;
				case '/service':
					title = 'Service Search';
					desc = 'We are glad to see you again!';
					bgImage = '/img/banner/service-page-header.jpg';
					break;
				case '/service/detail':
					title = 'Service Detail';
					desc = 'We are glad to see you again!';
					bgImage = '/img/banner/service-page-header.jpg';
					break;
				case '/agent':
					title = 'Taskers';
					desc = 'Home Care Experts';
					bgImage = '/img/banner/taskers-page-header2.jpg';
					break;
				case '/agent/detail':
					title = 'Tasker Page';
					desc = 'Home Care Experts';
					bgImage = '/img/banner/tasker-page-header1.jpgg';
					break;
				case '/agent/detail-tasker':
					title = 'Tasker Page';
					desc = 'Home Care Experts';
					bgImage = '/img/banner/tasker-page-header2.jpg';
					break;
				case '/userpage':
					title = 'user page';
					desc = 'Home services';
					bgImage = '/img/banner/personal-page-header.jpg';
					break;
				case '/community':
					title = 'public';
					desc = 'Home services';
					bgImage = '/img/banner/public-page-header4.jpg';
					break;
				case '/community/detail':
					title = 'Public Detail';
					desc = 'Home services';
					bgImage = '/img/banner/community-detail-page-header3.jpg';
					break;
				case '/cs':
					title = 'Customer Support Center';
					desc = 'We are glad to see you again!';
					bgImage = '/img/banner/cs_center4.jpg';
					break;
				case '/account/join':
					title = 'Login/Signup';
					desc = 'Authentication Process';
					bgImage = '/img/banner/header2.svg';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'Member Page';
					desc = 'Home / For Rent';
					bgImage = '/img/banner/tasker-detail-page-header.jpg';
					break;
				default:
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>HomeCareExperts</title>
						<meta name={'title'} content={`HomeCareExperts`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<FooterService />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>HomeCareExperts</title>
						<meta name={'title'} content={`HomeCareExperts`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={`header-basic ${authHeader && 'auth'}`}
							style={{
								backgroundImage: `url(${memoizedValues.bgImage})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
								boxShadow: 'inset 10px 40px 150px 40px rgb(24 22 36)',
							}}
						>
							<Stack className={'container'}>
								<strong>{t(memoizedValues.title)}</strong>
								<span>{t(memoizedValues.desc)}</span>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'}>
							<FooterService />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
