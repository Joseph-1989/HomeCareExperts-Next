import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
	Box,
	IconButton,
	Tooltip,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { Faq } from '../../../types/faq/faq';
import { FaqStatus } from '../../../enums/faq.enum';
import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import { REACT_APP_API_URL } from '../../../config';
import Moment from 'react-moment';
import DeleteIcon from '@mui/icons-material/Delete';

interface Data {
	id_number: string;
	category: string;
	question: string;
	author: string;
	date: string;
	status: string;
	id?: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id_number',
		numeric: true,
		disablePadding: false,
		label: 'FAQ ID',
	},
	{
		id: 'category',
		numeric: true,
		disablePadding: false,
		label: 'CATEGORY',
	},
	{
		id: 'question',
		numeric: true,
		disablePadding: false,
		label: 'QUESTION',
	},

	{
		id: 'author',
		numeric: true,
		disablePadding: false,
		label: 'AUTHOR',
	},
	{
		id: 'date',
		numeric: true,
		disablePadding: false,
		label: 'DATE',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick } = props;

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface FaqArticlesPanelListType {
	articles: Faq[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateArticleHandler: any;
	removeArticleHandler: any;
}

export const FaqArticlesPanelList = (props: FaqArticlesPanelListType) => {
	const { articles, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateArticleHandler, removeArticleHandler } =
		props;
	const router = useRouter();

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	/** HANDLERS **/

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{articles.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{articles.length !== 0 &&
							articles.map((article: Faq, index: number) => {
								const memberImage = article?.memberData?.memberImage
									? `${REACT_APP_API_URL}/${article?.memberData?.memberImage}`
									: `/img/profile/defaultUser.svg`;
								return (
									<TableRow hover key={article._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">{article._id}</TableCell>
										<TableCell align="left">{article.faqCategory.replace(/_/g, ' ')}</TableCell>
										<TableCell align="left">
											<Box component={'div'}>
												{article.faqTitle.replace(/_/g, ' ')}
												{article.faqStatus === FaqStatus.ACTIVE && (
													<Link href={`/cs?=${article.faqTitle}#${article._id}`} className={'img_box'}>
														<IconButton className="btn_window">
															<Tooltip title={'Open window'}>
																<OpenInBrowserRoundedIcon />
															</Tooltip>
														</IconButton>
													</Link>
												)}
											</Box>
										</TableCell>

										<TableCell align="left" className={'name'}>
											<Link href={`/member?memberId=${article?.memberData?._id}`}>
												<div>
													<Avatar alt="Remy Sharp" src={memberImage} sx={{ ml: '2px', mr: '10px' }} />
												</div>
											</Link>
											<Link href={`/member?memberId=${article?.memberData?._id}`}>
												<div>{article.memberData?.memberNick}</div>
											</Link>
										</TableCell>
										<TableCell align="left">
											<Moment format={'DD.MM.YY HH:mm'}>{article?.createdAt}</Moment>
										</TableCell>
										<TableCell align="center">
											{article.faqStatus === FaqStatus.DELETE ? (
												<Button
													variant="outlined"
													sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
													onClick={() => removeArticleHandler(article._id)}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											) : (
												<>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
														{article.faqStatus}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{Object.values(FaqStatus)
															.filter((ele) => ele !== article.faqStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() => updateArticleHandler({ _id: article._id, faqStatus: status })}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
