import React from 'react';

const CostGuides = () => {
	const popularGuides = [
		'PLUMBING COST',
		'ELECTRICAL COST',
		'HVAC COST',
		'CLEANING COST',
		'PAINTING COST',
		'REMODELING COST',
		'LANDSCAPING COST',
		'PEST CONTROL COST',
		'HANDYMAN COST',
		'KITCHEN REMODEL COST',
		'COST TO BUILD A HOUSE',
		'ROOF REPLACEMENT COST',
		'WATER HEATER REPLACEMENT COST',
		'BATHROOM REMODEL COST',
		'SOLAR PANEL COST',
	];

	const costGuideMobileImage = '/img/app-promo/10007.png';
	return (
		<div className="cost-guides">
			<div className="main-section">
				<div className="content">
					<span className="tag">HOMECARESERVICES COST GUIDES</span>
					<h2>Knowledge is priceless — so our project cost guides are free.</h2>
					<p>
						Always know what to expect from a project price tag with our cost guides. From materials to labor and more,
						we have the data-backed info you need to get started with confidence.
					</p>
					<button className="explore-button">Explore project costs</button>
				</div>
				<div className="image-container">
					<img src={costGuideMobileImage} alt="Cost guide on phone" />
				</div>
			</div>

			<h3>Popular cost guides</h3>
			<div className="popular-guides">
				{popularGuides.map((guide, index) => (
					<div key={index} className="guide-item">
						<span className="tag">HOMECARESERVICES COST GUIDES</span>
						<p>{guide}</p>
						<span className="arrow">›</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default CostGuides;
