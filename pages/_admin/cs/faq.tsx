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
import { FaqArticlesPanelList } from '../../../libs/components/admin/cs/FaqList';
import { FaqInquiry, FaqInquirySearch } from '../../../libs/types/faq/faq.input';
import { Faq } from '../../../libs/types/faq/faq';
import { DELETE_FAQ, UPDATE_FAQ } from '../../../apollo/admin/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_FAQS_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { FaqCategory, FaqStatus } from '../../../libs/enums/faq.enum';
import { FaqUpdate } from '../../../libs/types/faq/faq.update';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import router from 'next/router';

const FaqArticles: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [communityInquiry, setCommunityInquiry] = useState<FaqInquiry>(initialInquiry);
	const [articles, setArticles] = useState<Faq[]>([]);
	const [articleTotal, setArticleTotal] = useState<number>(0);
	const [value, setValue] = useState(communityInquiry?.search?.faqStatus ? communityInquiry?.search?.faqStatus : 'ALL');
	const [searchText, setSearchText] = useState('');
	const [searchType, setSearchType] = useState('ALL');
	const [allCount, setAllCount] = useState(0);
	const [activeCount, setActiveCount] = useState(0);
	const [holdCount, setHoldCount] = useState(0);
	const [deleteCount, setDeleteCount] = useState(0);

	/** APOLLO REQUESTS **/
	const [updateBoardArticleByAdmin] = useMutation(UPDATE_FAQ);
	const [removeBoardArticleByAdmin] = useMutation(DELETE_FAQ);

	const {
		loading: getAllBoardArticleByAdminLoading,
		data: getAllBoardArticlesByAdminData,
		error: getAllBoardArticleByAdminError,
		refetch: getAllBoardArticlesByAdminRefetch,
	} = useQuery(GET_ALL_FAQS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: communityInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setArticles(data?.getAllFaqs?.list);
			setArticleTotal(data?.getAllFaqs?.metaCounter[0]?.total ?? 0);

			setAllCount(data?.getAllFaqs?.list.length);
			setActiveCount(data?.getAllFaqs?.list.filter((faq: Faq) => faq.faqStatus === FaqStatus.ACTIVE).length);
			setHoldCount(data?.getAllFaqs?.list.filter((faq: Faq) => faq.faqStatus === FaqStatus.HOLD).length);
			setDeleteCount(data?.getAllFaqs?.list.filter((faq: Faq) => faq.faqStatus === FaqStatus.DELETE).length);
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
				faqTitle: '',
			},
		});
	};

	const handleTabChange = async (event: any, newValue: string) => {
		setValue(newValue);

		let search: Partial<FaqInquirySearch> = {};

		switch (newValue) {
			case 'ACTIVE':
				search = { faqStatus: FaqStatus.ACTIVE };
				break;
			case 'HOLD':
				search = { faqStatus: FaqStatus.HOLD };
				break;
			case 'DELETE':
				search = { faqStatus: FaqStatus.DELETE };
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
						faqCategory: newValue as FaqCategory,
					},
				});
			} else {
				delete communityInquiry?.search?.faqCategory;
				setCommunityInquiry({ ...communityInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updateArticleHandler = async (updateData: FaqUpdate) => {
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
				console.log('id remove faq', id);
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
				<Typography variant={'h2'}>FAQ Management</Typography>
				<Button
					className="btn_add"
					variant={'contained'}
					size={'medium'}
					onClick={() => router.push(`/_admin/cs/faq.create`)}
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
									{Object.values(FaqCategory).map((category: string) => (
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
						<FaqArticlesPanelList
							articles={articles}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateArticleHandler={updateArticleHandler}
							removeArticleHandler={removeArticleHandler}
							// other props
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 30, 40, 50, 60]}
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

FaqArticles.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(FaqArticles);
