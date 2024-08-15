import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PropertyCard } from '../userpage/PropertyCard';
import { Property } from '../../types/property/property';
import { PropertiesInquiry } from '../../types/property/property.input';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import { GET_AGENT_SERVICES, GET_PROPERTIES, GET_SERVICES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { AgentServicesInquiry, ServicesInquiry } from '../../types/service/service.input';
import { Service } from '../../types/service/service';
import { ServiceCard } from '../userpage/ServiceCard';
import { MemberStatus } from '../../enums/member.enum';

const MemberServices: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<ServicesInquiry>({ ...initialInput });
	const [agentProperties, setAgentProperties] = useState<Service[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/

	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError, // Corrected "getProperties Err or"
		refetch: getPropertiesRefetch,
	} = useQuery(GET_SERVICES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: any) => {
			setAgentProperties(data?.getServices?.list); // Optional chaining for safety
			setTotal(data?.getServices?.metaCounter?.[0]?.total ?? 0); // Optional chaining & nullish coalescing
		},
	});

	/** LIFECYCLES **/

	useEffect(() => {
		if (memberId)
			setSearchFilter({ ...initialInput, search: { ...initialInput.search, memberId: memberId as string } });
	}, [memberId]);

	useEffect(() => {
		getPropertiesRefetch().then(); // Refetch data when searchFilter changes
	}, [searchFilter]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') {
		return <div> MY SERVICES MOBILE PAGE</div>;
	} else {
		return (
			<div id="member-properties-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Services </Typography>
					</Stack>
				</Stack>
				<Stack className="properties-list-box">
					<Stack className="list-box">
						{agentProperties?.length > 0 && (
							<Stack className="listing-title-box">
								<Typography className="title-text">Listing title</Typography>
								<Typography className="title-text">Date Published</Typography>
								<Typography className="title-text">Status</Typography>
								<Typography className="title-text">View</Typography>
							</Stack>
						)}
						{agentProperties?.length === 0 && (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Service found!</p>
							</div>
						)}
						{agentProperties?.map((property: Service) => {
							return <ServiceCard service={property} memberPage={true} key={property?._id} />;
						})}

						{agentProperties.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} service available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MemberServices.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			memberId: ' ',
		},
	},
};

export default MemberServices;
