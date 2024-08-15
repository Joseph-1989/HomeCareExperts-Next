import React, { useState } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Button, TextField, MenuItem, Box, Typography } from '@mui/material';
import { FaqCategory, FaqStatus } from '../../../libs/enums/faq.enum';
import { CREATE_FAQ } from '../../../apollo/admin/mutation';
import { userVar } from '../../../apollo/store';

const categories = [
	{ label: 'SERVICE', value: FaqCategory.SERVICE },
	{ label: 'PAYMENT', value: FaqCategory.PAYMENT },
	{ label: 'BUYERS', value: FaqCategory.BUYERS },
	{ label: 'AGENTS', value: FaqCategory.AGENTS },
	{ label: 'MEMBERSHIP', value: FaqCategory.MEMBERSHIP },
	{ label: 'COMMUNITY', value: FaqCategory.COMMUNITY },
	{ label: 'OTHER', value: FaqCategory.OTHER },
];

const statuses = [
	{ label: 'ACTIVE', value: FaqStatus.ACTIVE },
	{ label: 'HOLD', value: FaqStatus.HOLD },
	{ label: 'DELETE', value: FaqStatus.DELETE },
];

const CreateFaq = () => {
	const [question, setQuestion] = useState('');
	const [answer, setAnswer] = useState('');
	const [category, setCategory] = useState(FaqCategory.OTHER);
	const [status, setStatus] = useState(FaqStatus.ACTIVE);
	const router = useRouter();
	const user = useReactiveVar(userVar);

	console.log('user', user);

	const [createFaq, { loading, data, error }] = useMutation(CREATE_FAQ, {
		onCompleted: () => {
			router.push('/_admin/cs/faq');
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await createFaq({
				variables: {
					input: {
						faqCategory: category,
						faqStatus: status,
						faqTitle: question,
						faqContent: answer,
						memberId: user._id, // Ensure this is a valid ObjectId string
					},
				},
			});
		} catch (error) {
			console.error('Failed to create FAQ', error);
		}
	};

	return (
		<Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Create New FAQ
			</Typography>

			<TextField
				label="Question"
				value={question}
				onChange={(e) => setQuestion(e.target.value as string)}
				fullWidth
				required
				margin="normal"
			/>

			<TextField
				label="Answer"
				value={answer}
				onChange={(e) => setAnswer(e.target.value as string)}
				fullWidth
				multiline
				rows={4}
				required
				margin="normal"
			/>

			<TextField
				select
				label="Category"
				value={category}
				onChange={(e) => setCategory(e.target.value as FaqCategory)}
				fullWidth
				required
				margin="normal"
			>
				{categories.map((option) => (
					<MenuItem key={option.value} value={option.value}>
						{option.label}
					</MenuItem>
				))}
			</TextField>

			<TextField
				select
				label="Status"
				value={status}
				onChange={(e) => setStatus(e.target.value as FaqStatus)}
				fullWidth
				required
				margin="normal"
			>
				{statuses.map((option) => (
					<MenuItem key={option.value} value={option.value}>
						{option.label}
					</MenuItem>
				))}
			</TextField>

			{error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

			<Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
				<Button variant="contained" color="primary" type="submit" disabled={loading}>
					{loading ? 'Creating...' : 'Create FAQ'}
				</Button>
			</Box>
		</Box>
	);
};

export default CreateFaq;
