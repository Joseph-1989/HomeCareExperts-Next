import { Card, Stack } from '@mui/material';
import { useState } from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

interface Service {
	icon: string; // Fontawesome icon for the service
	title: string;
	image: string;
	subcategories: string[]; // Optional array of subcategories for specific services
	description: string; // Optional description for specific services
}

const icons = [
	'/img/icons/service-categories/assembly-solid.svg', //1
	'/img/icons/service-categories/hammer-solid.svg', //2
	'/img/icons/service-categories/people-carry-box-solid.svg', //3
	'/img/icons/service-categories/bath-solid.svg', //4
	'/img/icons/service-categories/person-digging-solid.svg', //5
	'/img/icons/service-categories/toolbox-solid.svg', //6
	'/img/icons/service-categories/painting brush-solid.svg', //7
	'/img/icons/service-categories/money-bill-trend-up-solid.svg', //8
	'/img/icons/service-categories/faucet-solid.svg', //9
	'/img/icons/service-categories/electrical plug-circle-bolt-solid.svg', //10
	'/img/icons/service-categories/temperature-arrow-up-solid.svg', //11
	'/img/icons/service-categories/REMODELING screwdriver-wrench-solid.svg', //12
	'/img/icons/service-categories/tree-city-solid.svg', //13
	'/img/icons/service-categories/hvac mask-ventilator-solid.svg', //14
	'/img/icons/service-categories/screwdriver-solid.svg', //15
	'/img/icons/service-categories/kitchen-set-solid.svg', //16
	'/img/icons/service-categories/house-solid.svg', //17
	'/img/icons/service-categories/people-roof-solid.svg', //18

	'/img/icons/service-categories/person-shelter-solid.svg', //17
	'/img/icons/service-categories/pen-ruler-solid.svg', //17
	'/img/icons/service-categories/PEST-CONTROL.svg', //14
	'/img/icons/service-categories/panorama-solid.svg', //13
	'/img/icons/service-categories/solar-panel-solid.svg', //10
	'/img/icons/service-categories/sink-solid.svg', //9
	'/img/icons/service-categories/plumbing wrench-solid.svg', //9
	'/img/icons/service-categories/restroom-solid.svg', //9
	'/img/icons/service-categories/shower-solid.svg', //9
	'/img/icons/service-categories/chart-simple-solid.svg', //8
	'/img/icons/service-categories/arrow-solid.svg', //8
	'/img/icons/service-categories/chart-column-solid.svg', //8
	'/img/icons/service-categories/PAINTING paintbrush-solid.svg', //7
	'/img/icons/service-categories/wrench-solid.svg', //6
	'/img/icons/service-categories/cleaning soap-solid.svg', //4
	'/img/icons/service-categories/Moving truck-moving-solid.svg', //3
	'/img/icons/service-categories/packing-solid.svg', //3
	'/img/icons/service-categories/truck-pickup-solid.svg', //3
	'/img/icons/service-categories/mountain-sun-solid.svg', //2
	'/img/icons/service-categories/trowel-solid.svg', //2 lapatka
	'/img/icons/service-categories/temperature-arrow-down-solid.svg',
	'/img/icons/service-categories/gears-solid.svg',
];

export const servicesData: Service[] = [
	{
		icon: '🛠️',
		title: 'Assembly',
		image: '/img/serviceCategoryImages/1-assambly.png',
		subcategories: [
			'General Furniture Assembly',
			'IKEA Assembly',
			'Crib Assembly',
			'PAX Assembly',
			'Bookshelf Assembly',
			'Desk Assembly',
		],
		description:
			'Putting together furniture, shelves, exercise equipment, and other pre-fabricated items. May involve following instructions, using tools, and attaching parts securely. Often includes after-care instructions or disposal of packaging materials.',
	},
	{
		icon: '🔨',
		title: 'Mounting',
		image: '/img/serviceCategoryImages/2-mounting.jpeg',
		subcategories: ['TV Mounting', 'Picture Hanging', 'Shelf Mounting'],
		description:
			'Securing items to walls, ceilings, or floors, such as TVs, shelves, pictures, mirrors, or curtain rods. May involve drilling, using anchors, and ensuring proper weight capacity. Often includes ensuring a level and secure installation.',
	},
	{
		icon: '🚚',
		title: 'Moving',
		image: '/img/serviceCategoryImages/3-moving.jpg',
		subcategories: ['Local Moving', 'Long Distance Moving', 'Packing Services'],
		description:
			'Packing, loading, transporting, and unloading belongings during a relocation. May involve packing supplies, furniture disassembly/reassembly, and truck rentals. Can include additional services like unpacking and furniture placement at the new location.',
	},
	{
		icon: '🧹',
		title: 'Cleaning',
		image: '/img/serviceCategoryImages/4-cleaning.webp',
		subcategories: ['House Cleaning', 'Office Cleaning', 'Window Cleaning'],
		description:
			'Thorough cleaning of homes, apartments, or offices. May include vacuuming, mopping, dusting, disinfecting surfaces, and cleaning bathrooms and kitchens. Often customizable based on specific needs and areas to be cleaned.',
	},
	{
		icon: '🌳',
		title: 'Outdoor Help',
		image: '/img/serviceCategoryImages/5-outdoorhelp.webp',
		subcategories: ['Gardening', 'Yard Work', 'Snow Removal'],
		description:
			'Assistance with various outdoor tasks, such as yard work, landscaping, gardening, or pressure washing. May involve mowing lawns, trimming hedges, planting flowers, or cleaning decks and patios. Can include seasonal services like leaf removal or snow shoveling.',
	},
	{
		icon: '🧰',
		title: 'Home Repairs',
		image: '/img/serviceCategoryImages/6-homerepairs.jpg',
		subcategories: ['Plumbing', 'Electrical', 'Carpentry'],
		description:
			'Fixing minor or major issues within a home, such as plumbing leaks, electrical problems, appliance malfunctions, or drywall repair. May involve skilled professionals with specific expertise in various repair areas. Often requires troubleshooting, identifying the source of the problem, and performing a proper repair.',
	},
	{
		icon: '🎨',
		title: 'Painting',
		image: '/img/serviceCategoryImages/7-painting.png',
		subcategories: ['Interior Painting', 'Exterior Painting', 'Specialty Finishes'],
		description:
			'Painting walls, ceilings, trim, doors, cabinets, or other surfaces inside or outside a home. May involve surface preparation, such as patching holes, sanding, and priming.Often includes choosing colors, types of paint, and ensuring a professional-looking finish.',
	},
	{
		icon: '🔥',
		title: 'Trending',
		image: '/img/serviceCategoryImages/8-trending.jpg',
		subcategories: ['Curved Sofas', 'Computer Desks', 'Sustainable Materials'],
		description:
			'This category likely highlights services that are currently in high demand or popular among customers. The specific services listed under "Trending" might change depending on the platform or season. It could include services like eco-friendly cleaning, smart home installation, or handyman services for minor fix-it tasks.',
	},

	{
		icon: '🚽',
		title: 'Plumbing',
		image: '/img/serviceCategoryImages/9-plumber.webp',
		subcategories: [
			'Leak Repair',
			'Pipe Installation',
			'Drain Cleaning',
			'Fixture Installation',
			'Water Heater Services',
		],
		description:
			'Professional plumbing services for residential and commercial properties, including repairs, installations, and maintenance.',
	},
	{
		icon: '⚡',
		title: 'Electrical',
		image: '/img/serviceCategoryImages/10-electrical.jpg',
		subcategories: [
			'Wiring Installation',
			'Circuit Breaker Repair',
			'Lighting Installation',
			'Electrical Panel Upgrades',
			'Smart Home Wiring',
		],
		description:
			'Comprehensive electrical services for homes and businesses, ensuring safe and efficient electrical systems.',
	},
	{
		icon: '❄️',
		title: 'Hvac',
		image: '/img/serviceCategoryImages/11-hvac.webp',
		subcategories: [
			'AC Installation',
			'Furnace Repair',
			'Duct Cleaning',
			'Heat Pump Services',
			'Thermostat Installation',
		],
		description:
			'Heating, ventilation, and air conditioning services to keep your indoor environment comfortable year-round.',
	},
	{
		icon: '🏗️',
		title: 'Remodeling',
		image: '/img/serviceCategoryImages/12-remodeling.jpg',
		subcategories: [
			'Kitchen Remodeling',
			'Bathroom Renovation',
			'Basement Finishing',
			'Room Additions',
			'Whole House Remodel',
		],
		description: 'Comprehensive remodeling services to update and improve your living or working spaces.',
	},
	{
		icon: '🌿',
		title: 'Landscaping',
		image: '/img/serviceCategoryImages/13-landscaping.jpeg',
		subcategories: ['Lawn Care', 'Garden Design', 'Tree Trimming', 'Irrigation System Installation', 'Hardscaping'],
		description: 'Professional landscaping services to enhance the beauty and functionality of your outdoor spaces.',
	},
	{
		icon: '🐜',
		title: 'Pest Control',
		image: '/img/serviceCategoryImages/14-pest-control.webp',
		subcategories: [
			'Rodent Control',
			'Termite Treatment',
			'Bed Bug Elimination',
			'Mosquito Control',
			'Wildlife Removal',
		],
		description: 'Effective pest control services to keep your property free from unwanted insects and animals.',
	},
	{
		icon: '🔧',
		title: 'Handyman',
		image: '/img/serviceCategoryImages/15-Handyman.jpg',
		subcategories: [
			'Drywall Repair',
			'Door Installation',
			'Furniture Assembly',
			'Tile Repair',
			'Small Appliance Repair',
		],
		description: 'Versatile handyman services for a wide range of home repairs and improvements.',
	},
	{
		icon: '🍳',
		title: 'Kitchen Remodel',
		image: '/img/serviceCategoryImages/16-kitchen-remodeling.webp',
		subcategories: [
			'Cabinet Installation',
			'Countertop Replacement',
			'Appliance Installation',
			'Kitchen Island Construction',
			'Backsplash Installation',
		],
		description: 'Comprehensive kitchen remodeling services to create your dream cooking and dining space.',
	},
	{
		icon: '🏠',
		title: 'Build A House',
		image: '/img/serviceCategoryImages/17-build-a-house.jpg',
		subcategories: ['Custom Home Design', 'Foundation Construction', 'Framing', 'Interior Finishing', 'Landscaping'],
		description: 'Full-service home building from design to completion, creating your perfect custom home.',
	},
	{
		icon: '🏡',
		title: 'Roof Replacement',
		image: '/img/serviceCategoryImages/18-roof-replacement.jpeg',
		subcategories: [
			'Shingle Roofing',
			'Metal Roofing',
			'Flat Roof Installation',
			'Roof Inspection',
			'Gutter Installation',
		],
		description: 'Professional roof replacement services to protect your home and enhance its curb appeal.',
	},
];

export const servicesDataWithIcons = servicesData.map((service, index) => ({
	...service,
	icon: icons[index],
}));

interface ServiceCategoriesProps {
	services: Service[];
}
const ServiceCategories: React.FC<ServiceCategoriesProps> = ({ services }) => {
	const [activeCategory, setActiveCategory] = useState<string>('Trending');

	const handleCategoryClick = (title: string) => {
		setActiveCategory(title);
	};

	const findActiveCategoryImage = (title: string) => {
		const activeService = services.find((service) => service.title === title);

		if (activeService) {
			return activeService.image;
		} else {
			return '';
		}
	};

	const findActiveCategoryTitle = (title: string) => {
		const activeService = services.find((service) => service.title === title);

		if (activeService) {
			return activeService.title;
		} else {
			return '';
		}
	};

	const findActiveCategoryDesc = (title: string) => {
		const activeService = services.find((service) => service.title === title);

		if (activeService) {
			return activeService.description;
		} else {
			return '';
		}
	};

	const findActiveCategorySubcategories = (title: string) => {
		const activeService = services.find((service) => service.title === title);

		if (activeService) {
			return activeService.subcategories.map((subcategory) => (
				<li className="subcategory-li" key={subcategory}>
					{subcategory}
				</li>
			));
		} else {
			return '';
		}
	};

	return (
		<Card className="service-categories">
			<div className="service-icons">
				<div className="swiper-button-prev swiper-icons-prev"></div>
				<div className="swiper-button-next swiper-icons-next"></div>

				<Swiper
					className={'service-icons-swiper'}
					slidesPerView={5}
					slidesPerGroup={5}
					spaceBetween={10}
					modules={[Autoplay, Navigation]}
					navigation={{
						nextEl: '.swiper-icons-next',
						prevEl: '.swiper-icons-prev',
					}}
					breakpoints={{
						640: {
							slidesPerView: 3,
							slidesPerGroup: 3,
						},
						768: {
							slidesPerView: 4,
							slidesPerGroup: 4,
						},
						1024: {
							slidesPerView: 6,
							slidesPerGroup: 6,
						},
					}}
				>
					{servicesDataWithIcons.map((service) => (
						<SwiperSlide key={service.title}>
							<button
								onClick={() => handleCategoryClick(service.title)}
								className={`service-icon ${activeCategory === service.title ? 'selected' : ''}`}
							>
								<img src={service.icon} alt={service.title} />
								<span className="service-title">{service.title}</span>
							</button>
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			{activeCategory && (
				<Stack className="subcategories">
					<h3 className="active-category">The {activeCategory} service category provides the following services:</h3>
					<ul className="service-categories">{findActiveCategorySubcategories(activeCategory || '')}</ul>
				</Stack>
			)}

			<Stack className="description-box">
				<Stack className="image-box" key={findActiveCategoryImage(activeCategory || '')}>
					<img
						className="image"
						src={findActiveCategoryImage(activeCategory || '')}
						alt={findActiveCategoryImage(activeCategory || '')}
					/>
					<div className="description-overlay">
						<h2>{findActiveCategoryTitle(activeCategory || '')}</h2>
						<p>{findActiveCategoryDesc(activeCategory || '')}</p>
					</div>
				</Stack>
			</Stack>
		</Card>
	);
};

export default ServiceCategories;
