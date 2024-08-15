import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';

const FooterService = () => {
	const device = useDeviceDetect();

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/logoHomeCareServices.png" alt="" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Free Customer Care</span>
							<p>+82 10 4867 2909</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Live Support</span>
							<p>+82 10 4867 2909</p>
							<span>Need Assistance?</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>Follow us on social media</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Popular Services</strong>
								<span>House Cleaning</span>
								<span>Plumbing Services</span>
							</div>
							<div>
								<strong>Quick Links</strong>
								<span>Terms of Use</span>
								<span>Privacy Policy</span>
								<span>Pricing Plans</span>
								<span>Our Services</span>
								<span>Contact Support</span>
								<span>FAQs</span>
							</div>
							<div>
								<strong>Discover</strong>
								<span>Seoul</span>
								<span>Gyeongido</span>
								<span>Busan</span>
								<span>Jejudo</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© HomeCareExperts - All rights reserved. {moment().year()}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/logoHomeCareServices.png" alt="" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Free Customer Care</span>
							<p>+82 10 4867 2909</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Live Support</span>
							<p>+82 10 4867 2909</p>
							<span>Need Assistance?</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>Follow us on social media</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'top'}>
							<strong>Stay Updated</strong>
							<div>
								<input type="text" placeholder={'Your Email'} />
								<span>Subscribe</span>
							</div>
						</Box>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Popular Services</strong>
								<span>House Cleaning</span>
								<span>Plumbing Services</span>
							</div>
							<div>
								<strong>Quick Links</strong>
								<span>Terms of Use</span>
								<span>Privacy Policy</span>
								<span>Pricing Plans</span>
								<span>Our Services</span>
								<span>Contact Support</span>
								<span>FAQs</span>
							</div>
							<div>
								<strong>Discover</strong>
								<span>Seoul</span>
								<span>Gyeongido</span>
								<span>Busan</span>
								<span>Jejudo</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© HomeCareExperts - All rights reserved. {moment().year()}</span>
					<span>Privacy · Terms · Sitemap</span>
				</Stack>
			</Stack>
		);
	}
};

export default FooterService;
