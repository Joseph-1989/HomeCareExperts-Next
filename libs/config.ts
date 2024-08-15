import mongoose from 'mongoose';

export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const availableOptions = ['propertyBarter', 'propertyRent'];

export const availableServiceOptions = [
	'emergencyService', // Indicates if it's an emergency
	'weekendAvailability',
	'seniorDiscounts',
	'virtualConsultation',
	// ... add more options as needed
];

const thisYear = new Date().getFullYear();

export const propertyYears: any = [];
export const serviceYears: any = [];

for (let i = 1970; i <= thisYear; i++) {
	propertyYears.push(String(i));
}

for (let i = 1970; i <= thisYear; i++) {
	serviceYears.push(String(i));
}

export const propertySquare = [0, 25, 50, 75, 100, 125, 150, 200, 300, 500];

export const serviceExperience = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export const ServicePricingModel = ['Hourly rate', 'Flat fee per project', 'Free estimates'];

export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
};

export const topPropertyRank = 2;

export const topServiceRank = 2;

/**
 * Converts a string to a Mongoose ObjectId.
 * @param idString The string to convert to ObjectId.
 * @returns A Mongoose ObjectId or throws an error if the string is invalid.
 */
export function convertToObjectId(idString: string): mongoose.Types.ObjectId {
	if (mongoose.Types.ObjectId.isValid(idString)) {
		return new mongoose.Types.ObjectId(idString);
	} else {
		throw new Error('Invalid ObjectId string.');
	}
}
