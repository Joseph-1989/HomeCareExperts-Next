import React, { useState } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Button, TextField, MenuItem, Box, Typography } from '@mui/material';
import { NoticeCategory, NoticeStatus } from '../../../libs/enums/notice.enum';
import { CREATE_NOTICE } from '../../../apollo/admin/mutation';
import { userVar } from '../../../apollo/store';

// Categories and statuses for notice creation
const categories = [
	{ label: 'FAQ', value: NoticeCategory.FAQ },
	{ label: 'TERMS', value: NoticeCategory.TERMS },
	{ label: 'INQUIRY', value: NoticeCategory.INQUIRY },
];

const statuses = [
	{ label: 'ACTIVE', value: NoticeStatus.ACTIVE },
	{ label: 'HOLD', value: NoticeStatus.HOLD },
	{ label: 'DELETE', value: NoticeStatus.DELETE },
];

const CreateNotice = () => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [category, setCategory] = useState(NoticeCategory.FAQ);
	const [status, setStatus] = useState(NoticeStatus.ACTIVE);
	const router = useRouter();
	const user = useReactiveVar(userVar);

	console.log('user', user);

	const [createNotice, { loading, data, error }] = useMutation(CREATE_NOTICE, {
		onCompleted: () => {
			router.push('/_admin/cs/notice');
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await createNotice({
				variables: {
					input: {
						noticeCategory: category,
						noticeStatus: status,
						noticeTitle: title,
						noticeContent: content,
						memberId: user._id,
					},
				},
			});
		} catch (error) {
			console.error('Failed to create Notice', error);
		}
	};

	return (
		<Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Create New Notice
			</Typography>

			<TextField
				label="Title"
				value={title}
				onChange={(e) => setTitle(e.target.value as string)}
				fullWidth
				required
				margin="normal"
			/>

			<TextField
				label="Content"
				value={content}
				onChange={(e) => setContent(e.target.value as string)}
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
				onChange={(e) => setCategory(e.target.value as NoticeCategory)}
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
				onChange={(e) => setStatus(e.target.value as NoticeStatus)}
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
					{loading ? 'Creating...' : 'Create Notice'}
				</Button>
			</Box>
		</Box>
	);
};

export default CreateNotice;
