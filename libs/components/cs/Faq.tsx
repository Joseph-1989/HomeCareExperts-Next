import React, { SyntheticEvent, useState } from 'react';
import { useQuery } from '@apollo/client';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GET_FAQS_BY_CATEGORY } from '../../../apollo/user/query';
import { FaqCategory } from '../../enums/faq.enum';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);
const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [category, setCategory] = useState<FaqCategory>(FaqCategory.SERVICE);
	const [expanded, setExpanded] = useState<string | false>('panel1');

	// Use Apollo's useQuery hook to fetch FAQs by category
	const { data, loading, error } = useQuery(GET_FAQS_BY_CATEGORY, {
		variables: { category },
	});

	// Handle errors or loading states
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	const changeCategoryHandler = (category: FaqCategory) => {
		setCategory(category);
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	} else {
		return (
			<Stack className={'faq-content'}>
				<Box className={'categories'} component={'div'}>
					<div
						className={category === FaqCategory.SERVICE ? 'active' : ''}
						onClick={() => changeCategoryHandler(FaqCategory.SERVICE)}
					>
						Service
					</div>
					<div
						className={category === FaqCategory.PAYMENT ? 'active' : ''}
						onClick={() => changeCategoryHandler(FaqCategory.PAYMENT)}
					>
						Payment
					</div>
					<div
						className={category === FaqCategory.BUYERS ? 'active' : ''}
						onClick={() => changeCategoryHandler(FaqCategory.BUYERS)}
					>
						For Buyers
					</div>
					<div
						className={category === FaqCategory.AGENTS ? 'active' : ''}
						onClick={() => changeCategoryHandler(FaqCategory.AGENTS)}
					>
						For Agents
					</div>
					<div
						className={category === FaqCategory.MEMBERSHIP ? 'active' : ''}
						onClick={() => changeCategoryHandler(FaqCategory.MEMBERSHIP)}
					>
						Membership
					</div>
					<div
						className={category === FaqCategory.COMMUNITY ? 'active' : ''}
						onClick={() => changeCategoryHandler(FaqCategory.COMMUNITY)}
					>
						Community
					</div>
					<div
						className={category === FaqCategory.OTHER ? 'active' : ''}
						onClick={() => changeCategoryHandler(FaqCategory.OTHER)}
					>
						Other
					</div>
				</Box>
				<Box className={'wrap'} component={'div'}>
					{data.getFaqsByCategory &&
						data.getFaqsByCategory.map((ele: any) => (
							<Accordion expanded={expanded === ele._id} onChange={handleChange(ele._id)} key={ele._id}>
								<AccordionSummary id="panel1d-header" className="question" aria-controls="panel1d-content">
									<Typography className="badge" variant={'h4'}>
										Q
									</Typography>
									<Typography>{ele.faqTitle}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Stack className={'answer flex-box'}>
										<Typography className="badge" variant={'h4'} color={'primary'}>
											A
										</Typography>
										<Typography>{ele.faqContent}</Typography>
									</Stack>
								</AccordionDetails>
							</Accordion>
						))}
				</Box>
			</Stack>
		);
	}
};

export default Faq;
