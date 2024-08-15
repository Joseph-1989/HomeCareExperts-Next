import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import Chat from '../Chat';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import FooterService from '../Footer.service';

const withLayoutFull = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
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

export default withLayoutFull;
