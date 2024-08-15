import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
const TuiEditor = dynamic(() => import('../community/TuiEditor'), { ssr: false });

const WriteArticle: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <>ARTICLE PAGE MOBILE</>;
	} else
		return (
			<div id="write-article-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Create an Article</Typography>
						<Typography className="sub-title">Share what is in your mind!</Typography>
					</Stack>
				</Stack>
				<TuiEditor />
			</div>
		);
};

export default WriteArticle;
