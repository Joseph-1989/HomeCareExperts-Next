import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextPage } from 'next';
import { Stack } from '@mui/material';
import PopularProperties from '../libs/components/homepage/PopularProperties';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import TrendProperties from '../libs/components/homepage/TrendProperties';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import TopProperties from '../libs/components/homepage/TopProperties';
import Advertisement from '../libs/components/homepage/Advertisement';
import TopAgents from '../libs/components/homepage/TopAgents';
import Events from '../libs/components/homepage/Events';
import BusinessPartnership from '../libs/components/homepage/BusinessPartnership';
import HowItWorks from '../libs/components/homepage/HowItWorks';
import AppPromo from '../libs/components/homepage/AppPromo';
import CostGuides from '../libs/components/homepage/CostGuides';
import TopServices from '../libs/components/homepage/TopServices';
import TrendServices from '../libs/components/homepage/TrendServices';
import PopularServices from '../libs/components/homepage/PopularServices';
import TopTaskers from '../libs/components/homepage/TopTaskers';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<BusinessPartnership />
				<HowItWorks />
				<CostGuides />
				<AppPromo />
				<Advertisement />
				<CommunityBoards />
				<TopTaskers />
				<TrendServices />
				<TopServices />
				<PopularServices />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<BusinessPartnership />
				<CostGuides />
				<AppPromo />
				<HowItWorks />
				<Advertisement />
				<CommunityBoards />
				<TopTaskers />
				<TrendServices />
				<TopServices />
				<PopularServices />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
