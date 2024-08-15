import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Button, InputAdornment, Stack } from '@mui/material';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { NoticeList } from '../../../libs/components/admin/cs/NoticeList';
import { Notice } from '../../../libs/types/notice/notice';
import { NoticeInquiry, NoticeInquirySearch } from '../../../libs/types/notice/notice.input';
import { DELETE_NOTICE, UPDATE_NOTICE } from '../../../apollo/admin/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_NOTICES } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { NoticeCategory, NoticeStatus } from '../../../libs/enums/notice.enum';
import router from 'next/router';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { NoticeUpdate } from '../../../libs/types/notice/notice.update';

const AdminNotice: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [communityInquiry, setCommunityInquiry] = useState<NoticeInquiry>(initialInquiry);
	const [articles, setArticles] = useState<Notice[]>([]);
	const [articleTotal, setArticleTotal] = useState<number>(0);
	const [value, setValue] = useState(
		communityInquiry?.search?.noticeStatus ? communityInquiry?.search?.noticeStatus : 'ALL',
	);
	const [searchText, setSearchText] = useState('');
	const [searchType, setSearchType] = useState('ALL');
	const [allCount, setAllCount] = useState(0);
	const [activeCount, setActiveCount] = useState(0);
	const [holdCount, setHoldCount] = useState(0);
	const [deleteCount, setDeleteCount] = useState(0);

	/** APOLLO REQUESTS **/

	const [updateBoardArticleByAdmin] = useMutation(UPDATE_NOTICE);
	const [removeBoardArticleByAdmin] = useMutation(DELETE_NOTICE);

	const {
		loading: getAllBoardArticleByAdminLoading,
		data: getAllBoardArticlesByAdminData,
		error: getAllBoardArticleByAdminError,
		refetch: getAllBoardArticlesByAdminRefetch,
	} = useQuery(GET_NOTICES, {
		fetchPolicy: 'network-only',
		variables: { inquiry: communityInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setArticles(data?.getNotices?.list);
			setArticleTotal(data?.getNotices?.metaCounter[0]?.total ?? 0);

			setAllCount(data?.getNotices?.list.length);
			setActiveCount(data?.getNotices?.list.filter((faq: Notice) => faq.noticeStatus === NoticeStatus.ACTIVE).length);
			setHoldCount(data?.getNotices?.list.filter((faq: Notice) => faq.noticeStatus === NoticeStatus.HOLD).length);
			setDeleteCount(data?.getNotices?.list.filter((faq: Notice) => faq.noticeStatus === NoticeStatus.DELETE).length);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllBoardArticlesByAdminRefetch({ input: communityInquiry }).then();
	}, [communityInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		communityInquiry.page = newPage + 1;
		await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
		setCommunityInquiry({ ...communityInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		communityInquiry.limit = parseInt(event.target.value, 10);
		communityInquiry.page = 1;
		await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
		setCommunityInquiry({ ...communityInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const handleInput = (value: string) => {
		setSearchText(value);
	};

	const searchTextHandler = () => {
		try {
			setCommunityInquiry({
				...communityInquiry,
				search: {
					...communityInquiry.search,
					text: searchText,
				},
			});
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			searchTextHandler();
		}
	};

	const clearSearchHandler = () => {
		setSearchText('');
		setCommunityInquiry({
			...communityInquiry,
			search: {
				...communityInquiry.search,
				noticeTitle: '',
			},
		});
	};

	const handleTabChange = async (event: any, newValue: string) => {
		setValue(newValue);

		let search: Partial<NoticeInquirySearch> = {};

		switch (newValue) {
			case 'ACTIVE':
				search = { noticeStatus: NoticeStatus.ACTIVE };
				break;
			case 'HOLD':
				search = { noticeStatus: NoticeStatus.HOLD };
				break;
			case 'DELETE':
				search = { noticeStatus: NoticeStatus.DELETE };
				break;
			default:
				// No specific status, fetch all
				break;
		}

		setCommunityInquiry({
			...communityInquiry,
			page: 1,
			search,
		});
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setCommunityInquiry({
					...communityInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...communityInquiry.search,
						noticeCategory: newValue as NoticeCategory,
					},
				});
			} else {
				delete communityInquiry?.search?.noticeCategory;
				setCommunityInquiry({ ...communityInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updateArticleHandler = async (updateData: NoticeUpdate) => {
		try {
			await updateBoardArticleByAdmin({
				variables: {
					input: updateData,
				},
			});

			menuIconCloseHandler();
			await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	const removeArticleHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removeBoardArticleByAdmin({
					variables: {
						id: id,
					},
				});

				await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
			}
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	console.log('+communityInquiry', communityInquiry);
	console.log('+articles', articles);

	return (
		// @ts-ignore
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>Notice Management</Typography>
				<Button
					className="btn_add"
					variant={'contained'}
					size={'medium'}
					onClick={() => router.push(`/_admin/cs/notice.create`)}
				>
					<AddRoundedIcon sx={{ mr: '8px' }} />
					ADD
				</Button>
			</Box>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e: any) => handleTabChange(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All ({allCount})
								</ListItem>
								<ListItem
									onClick={(e: any) => handleTabChange(e, 'ACTIVE')}
									value="ACTIVE"
									className={value === 'ACTIVE' ? 'li on' : 'li'}
								>
									Active ({activeCount})
								</ListItem>
								<ListItem
									onClick={(e: any) => handleTabChange(e, 'HOLD')}
									value="HOLD"
									className={value === 'HOLD' ? 'li on' : 'li'}
								>
									Hold ({holdCount})
								</ListItem>
								<ListItem
									onClick={(e: any) => handleTabChange(e, 'DELETE')}
									value="DELETE"
									className={value === 'DELETE' ? 'li on' : 'li'}
								>
									Deleted ({deleteCount})
								</ListItem>
							</List>

							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={searchType}>
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')} sx={{ textTransform: 'uppercase' }}>
										ALL
									</MenuItem>
									{Object.values(NoticeCategory).map((category: string) => (
										<MenuItem
											value={category}
											sx={{ textTransform: 'uppercase' }}
											onClick={() => searchTypeHandler(category)}
											key={category}
										>
											{category.replace(/_/g, ' ')}
										</MenuItem>
									))}
								</Select>
								<Divider />
								<OutlinedInput
									value={searchText}
									onChange={(e) => handleInput(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder="Search by title"
									onKeyDown={handleKeyDown}
									endAdornment={
										<>
											{searchText && <CancelRoundedIcon onClick={clearSearchHandler} />}
											<InputAdornment position="end">
												<img src="/img/icons/search_icon.png" alt={'searchIcon'} onClick={searchTextHandler} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>
						<NoticeList
							articles={articles}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateArticleHandler={updateArticleHandler}
							removeArticleHandler={removeArticleHandler}
							// other props
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={articleTotal}
							rowsPerPage={communityInquiry.limit}
							page={communityInquiry.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminNotice.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminNotice);
