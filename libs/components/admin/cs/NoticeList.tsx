import React, { useState } from 'react';
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
	Checkbox,
	Toolbar,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { IconButton, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { NotePencil } from 'phosphor-react';
import { Notice } from '../../../types/notice/notice';
import { REACT_APP_API_URL } from '../../../config';
import { NoticeStatus } from '../../../enums/notice.enum';
import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import Moment from 'react-moment';
import DeleteIcon from '@mui/icons-material/Delete';
import { NoticeUpdate } from '../../../types/notice/notice.update';

type Order = 'asc' | 'desc';

interface Data {
	id_number: string;
	category: string;
	title: string;
	author: string;
	date: string;
	status: string;
	action: string;
}
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
		label: 'NOTICE ID',
	},
	{
		id: 'category',
		numeric: true,
		disablePadding: false,
		label: 'CATEGORY',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
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
	{
		id: 'action',
		numeric: false,
		disablePadding: false,
		label: 'ACTION',
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

interface EnhancedTableToolbarProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
	const [select, setSelect] = useState('');
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

	return (
		<>
			{numSelected > 0 ? (
				<>
					<Toolbar>
						<Box component={'div'}>
							<Box component={'div'} className="flex_box">
								<Checkbox
									color="primary"
									indeterminate={numSelected > 0 && numSelected < rowCount}
									checked={rowCount > 0 && numSelected === rowCount}
									onChange={onSelectAllClick}
									inputProps={{
										'aria-label': 'select all',
									}}
								/>
								<Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="h6" component="div">
									{numSelected} selected
								</Typography>
							</Box>
							<Button variant={'text'} size={'large'}>
								Delete
							</Button>
						</Box>
					</Toolbar>
				</>
			) : (
				<TableHead>
					<TableRow>
						<TableCell padding="checkbox">
							<Checkbox
								color="primary"
								indeterminate={numSelected > 0 && numSelected < rowCount}
								checked={rowCount > 0 && numSelected === rowCount}
								onChange={onSelectAllClick}
								inputProps={{
									'aria-label': 'select all',
								}}
							/>
						</TableCell>
						{headCells.map((headCell) => (
							<TableCell
								key={headCell.id}
								align={headCell.numeric ? 'left' : 'right'}
								padding={headCell.disablePadding ? 'none' : 'normal'}
							>
								{headCell.label}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
			)}
			{numSelected > 0 ? null : null}
		</>
	);
};

interface NoticeListType {
	articles: Notice[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateArticleHandler: any;
	removeArticleHandler: any;
}

export const NoticeList = (props: NoticeListType) => {
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
					<EnhancedTableToolbar />
					<TableBody>
						{articles.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{articles.length !== 0 &&
							articles.map((article: Notice, index: number) => {
								const member_image = article.memberData?.memberImage
									? `${REACT_APP_API_URL}/${article?.memberData?.memberImage}`
									: `/img/profile/defaultUser.svg`;
								return (
									<TableRow hover key={article._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell padding="checkbox">
											<Checkbox color="primary" />
										</TableCell>
										<TableCell align="left">{article._id}</TableCell>

										<TableCell align="left">{article.noticeCategory.replace(/_/g, ' ')}</TableCell>
										<TableCell align="left">
											<Box component={'div'}>
												{article.noticeTitle.replace(/_/g, ' ')}
												{article.noticeStatus === NoticeStatus.ACTIVE && (
													<Link href={`/cs?=${article.noticeTitle}#${article._id}`} className={'img_box'}>
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
													<Avatar
														alt="Remy Sharp"
														src={
															article?.memberData?.memberImage
																? `${REACT_APP_API_URL}/${article?.memberData?.memberImage}`
																: `/img/profile/defaultUser.svg`
														}
														sx={{ ml: '2px', mr: '10px' }}
													/>
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
											{article.noticeStatus === NoticeStatus.DELETE ? (
												<Button
													variant="outlined"
													sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
													onClick={() => removeArticleHandler(article._id)}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											) : (
												<div>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
														{article.noticeStatus}
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
														{Object.values(NoticeStatus)
															.filter((ele) => ele !== article.noticeStatus)
															.map((status: any) => (
																<MenuItem
																	onClick={() => updateArticleHandler({ _id: article._id, noticeStatus: status })}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</div>
											)}
										</TableCell>
										<TableCell align="right">
											{article.noticeStatus === NoticeStatus.DELETE && (
												<Tooltip title="Delete">
													<Button
														variant="outlined"
														sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
														onClick={() => removeArticleHandler(article._id)}
													>
														<DeleteRoundedIcon fontSize="small" />
													</Button>
												</Tooltip>
											)}

											<Tooltip title="edit">
												<IconButton onClick={() => router.push(`/_admin/cs/notice.create?id=${article._id}`)}>
													<NotePencil size={24} weight="fill" />
												</IconButton>
											</Tooltip>
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
