import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box } from '@mui/material';
import { SiCcleaner } from 'react-icons/si';
import { MdBuild, MdHomeRepairService, MdOutlineHomeRepairService } from 'react-icons/md';
import { GiGardeningShears } from 'react-icons/gi';
import { BsArrowRight } from 'react-icons/bs';
const About: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>ABOUT PAGE MOBILE</div>;
	} else {
		return (
			<Stack className={'about-page'}>
				<Stack className={'intro'}>
					<Stack className={'container'}>
						<Stack className={'left'}>
							<strong>We're on a Mission to Revolutionize Home Services.</strong>
						</Stack>
						<Stack className={'right'}>
							<p>
								At HomeCareExperts, we believe in providing top-notch home services that cater to all your needs. From
								cleaning and maintenance to specialized home care, we have experts ready to assist you.
								<br />
								<br />
								Our team is committed to ensuring that your home is always in its best condition. Whether it's a
								one-time service or regular maintenance, we tailor our offerings to suit your specific requirements.
							</p>
							<Stack className={'boxes'}>
								<div className={'box'}>
									<div>
										<SiCcleaner size={30} />
										{/* <img src="/img/icons/cleaning.svg" alt="" /> */}
									</div>
									<span>Expert Cleaning</span>
									<p>We provide comprehensive cleaning services to keep your home spotless.</p>
								</div>
								<div className={'box'}>
									<div>
										<MdHomeRepairService size={30} />
										{/* <img src="/img/icons/maintenance.svg" alt="" /> */}
									</div>
									<span>Regular Maintenance</span>
									<p>Our professionals ensure that your home is well-maintained year-round.</p>
								</div>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'statistics'}>
					<Stack className={'container'}>
						<div className={'banner'}>
							<img src="/img/banner/our-team-banner1.jpg" alt="" />
						</div>
						<div className={'info'}>
							<Box component={'div'}>
								<strong>10K+</strong>
								<p>Happy Clients</p>
							</Box>
							<Box component={'div'}>
								<strong>500+</strong>
								<p>Skilled Professionals</p>
							</Box>
							<Box component={'div'}>
								<strong>1M+</strong>
								<p>Services Completed</p>
							</Box>
						</div>
					</Stack>
				</Stack>
				<Stack className={'agents'}>
					<Stack className={'container'}>
						<span className={'title'}>Our Dedicated Service Experts</span>
						<p className={'desc'}>Meet the team that makes it all happen.</p>
						<Stack className={'wrap'}>{/* Render service expert cards here */}</Stack>
					</Stack>
				</Stack>
				<Stack className={'options'}>
					<img src="/img/banner/teamwork-banner.jpg" alt="" className={'about-banner'} />
					<Stack className={'container'}>
						<strong>Let’s find the right service option for you</strong>
						<Stack className={'box'}>
							<div className={'icon-box'}>
								<MdOutlineHomeRepairService size={40} />
								{/* <img src="/img/icons/homecare.svg" alt="" /> */}
							</div>
							<div className={'text-box'}>
								<span>Home Care Assistance</span>
								<p>We provide specialized home care services tailored to your needs.</p>
							</div>
						</Stack>
						<Stack className={'box'}>
							<div className={'icon-box'}>
								<GiGardeningShears size={40} />
								{/* <img src="/img/icons/gardening.svg" alt="" /> */}
							</div>
							<div className={'text_-box'}>
								<span>Gardening Services</span>
								<p>Keep your garden in top shape with our expert gardening services.</p>
							</div>
						</Stack>
						<Stack className={'box'}>
							<div className={'icon-box'}>
								<MdBuild size={40} />
								{/* <img src="/img/icons/repair.svg" alt="" /> */}
							</div>
							<div className={'text-box'}>
								<span>Home Repairs</span>
								<p>Our professionals handle all types of home repair work efficiently.</p>
							</div>
						</Stack>
						<Stack className={'btn'}>
							Learn More
							{/* <BsArrowRight size={24} /> */}
							<img src="/img/icons/rightup.svg" alt="" />
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'partners'}>
					<Stack className={'container'}>
						<span>Trusted by the Best in the Industry</span>
						<Stack className={'wrap'}>
							<img src="/img/icons/brands/amazon.svg" alt="" />
							<img src="/img/icons/brands/amd.svg" alt="" />
							<img src="/img/icons/brands/cisco.svg" alt="" />
							<img src="/img/icons/brands/dropcam.svg" alt="" />
							<img src="/img/icons/brands/spotify.svg" alt="" />
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'help'}>
					<Stack className={'container'}>
						<Box component={'div'} className={'left'}>
							<strong>Need help? Talk to our expert.</strong>
							<p>Contact us for any service inquiries or browse through our service offerings.</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'white'}>
								Contact Us
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
							<div className={'black'}>
								<img src="/img/icons/call.svg" alt="" />
								920 851 9087
							</div>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(About);
