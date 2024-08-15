import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_SERVICE } from '../../apollo/user/mutation';
import { Direction, Message } from '../../libs/enums/common.enum';
import { ServicesInquiry } from '../../libs/types/service/service.input';
import { GET_SERVICES } from '../../apollo/user/query';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Service } from '../../libs/types/service/service';
import { T } from '../../libs/types/common';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import ServiceCard from '../../libs/components/service/ServiceCard';
import Filter from '../../libs/components/service/Filter';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ServiceList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<ServicesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [services, setServices] = useState<Service[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');

	/** APOLLO REQUESTS **/
	const [likeTargetService] = useMutation(LIKE_TARGET_SERVICE);

	const {
		loading: getServicesLoading,
		data: getServicesData,
		error: getServicesError,
		refetch: getServicesRefetch,
	} = useQuery(GET_SERVICES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			console.log('Full data received:', data);
			console.log('Services list:', data?.getServices?.list);
			setServices(data?.getServices?.list);
			setTotal(data?.getServices?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		console.log('Updated services state:', services);
	}, [services]);

	useEffect(() => {
		console.log('searchFilter', searchFilter);
		getServicesRefetch({ input: searchFilter }).then();
	}, [searchFilter]);

	/** HANDLERS **/
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/service?input=${JSON.stringify(searchFilter)}`,
			`/service?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const likeServiceHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetService({
				variables: { input: id },
			});

			await getServicesRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeServiceHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
				setFilterSortName('New');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'servicePrice', direction: Direction.ASC });
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'servicePrice', direction: Direction.DESC });
				setFilterSortName('Highest Price');
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <h1>SERVICES MOBILE</h1>;
	} else {
		return (
			<div id="service-list-page" style={{ position: 'relative' }}>
				<div className="container">
					<Box component={'div'} className={'right'}>
						<span>Sort by</span>
						<div>
							<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
								{filterSortName}
							</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
								<MenuItem
									onClick={sortingHandler}
									id={'new'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									New
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'lowest'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Lowest Price
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'highest'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Highest Price
								</MenuItem>
							</Menu>
						</div>
					</Box>
					<Stack className={'service-page'}>
						<Stack className="main-config" mb={'76px'}>
							<Stack className={'list-config'}>
								{services?.length === 0 ? (
									<div className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No Service found!</p>
									</div>
								) : (
									services.map((service: Service) => {
										return <ServiceCard service={service} likeServiceHandler={likeServiceHandler} key={service?._id} />;
									})
								)}
							</Stack>
							<Stack className="pagination-config">
								{services.length !== 0 && (
									<Stack className="pagination-box">
										<Pagination
											page={currentPage}
											count={Math.ceil(total / searchFilter.limit)}
											onChange={handlePaginationChange}
											shape="circular"
											color="primary"
										/>
									</Stack>
								)}

								{services.length !== 0 && (
									<Stack className="total-result">
										<Typography>
											Total {total} servic{total > 1 ? 'es' : 'e'} available
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
						<Stack className={'filter-config'}>
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

ServiceList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			pricesSeries: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default withLayoutBasic(ServiceList);
