import React from 'react';
import Image from 'next/image';
const angiAppScreenshot = '/img/app-promo/10017.jpg';
const angiLogo = '/img/logo/logoHomeCareServices.png';
const appStoreIcon = '/img/app-promo/10009.png';
const googlePlayIcon = '/img/app-promo/10010.png';

const AppPromo = () => {
	return (
		<div className="angi-app-promo">
			<div className="app-screenshot">
				<img src={angiAppScreenshot} alt="Angi app screenshot" />
			</div>
			<div className="promo-content">
				<div className="logo-container">
					<img src={angiLogo} alt="Angi logo" className="angi-logo" />
				</div>
				<h2>The best of HomeCareServices is in the app</h2>
				<p>Keep track of projects, message pros directly, pay securely, and more - all in the HomeCareServices app.</p>
				<div className="app-store-buttons">
					<a href="#" className="app-store">
						<img src={appStoreIcon} alt="Download on the App Store" />
					</a>
					<a href="#" className="google-play">
						<img src={googlePlayIcon} alt="Get it on Google Play" />
					</a>
				</div>
			</div>
		</div>
	);
};

export default AppPromo;
