import { getJwtToken, updateUserInfo } from '../../auth';
import React, { useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Stack } from '@mui/material';
import HeaderServiceFilter from '../homepage/HeaderServiceFilter';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FiberContainer from '../common/FiberContainer';
import Footer from '../Footer';
import Head from 'next/head';
import Chat from '../Chat';
import Top from '../Top';
import FooterService from '../Footer.service';
import HooksMain from '../common/HooksMain';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);

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

						<Stack className={'header-main'}>
							{/* <FiberContainer /> */}
							<HooksMain />
							<Stack className={'container'}>
								{/* <HeaderFilter /> */}

								<HeaderServiceFilter />
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

export default withLayoutMain;
