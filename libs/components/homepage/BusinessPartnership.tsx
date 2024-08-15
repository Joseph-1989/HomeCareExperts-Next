import React from 'react';

const carpenterImage = '/img/serviceCategoryImages/3-moving-2.jpg';

const BusinessPartnership = () => {
	return (
		<div className="angi-pro-page">
			<div className="content">
				<h1>Grow your business with us. Become a Tasker today.</h1>
				<button className="learn-more-btn">Learn more</button>
			</div>
			<div className="image-container">
				<img src={carpenterImage} alt="Carpenter working" />
			</div>
		</div>
	);
};

export default BusinessPartnership;
