import React from 'react';

const HowItWorks = () => {
	const steps = [
		{
			icon: '•••',
			title: '1. Tell us what your home needs',
			description:
				'From routine maintenance and repairs to dream home renovations, we can help with any project — big or small.',
		},
		{
			icon: '⚡',
			title: `2. We'll match you with personalized solutions`,
			description: `See your price and book services in an instant. Or, request and compare quotes from highly rated pros near you.`,
		},
		{
			icon: '🏠',
			title: `3. Start to finish, we've got you covered`,
			description: `When you book and pay with HomeCareServices, you're covered by our Happiness Guarantee. We'll cover your projects up to full purchase price, plus limited damage protection.`,
		},
	];

	return (
		<div className="how-it-works">
			<h2>How it works</h2>
			<div className="steps">
				{steps.map((step, index) => (
					<div key={index} className="step">
						<div className="icon">{step.icon}</div>
						<h3>{step.title}</h3>
						<p>{step.description}</p>
					</div>
				))}
			</div>
			<button className="learn-more">Learn more</button>
		</div>
	);
};

export default HowItWorks;
