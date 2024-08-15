import React from 'react';
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
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';
import { REACT_APP_API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { Service } from '../../../types/service/service';
import { ServiceStatus } from '../../../enums/service.enum';

interface Data {
	id: string;
	title: string;
	price: string;
	agent: string;
	location: string;
	type: string;
	status: string;
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
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'MEMBER ID',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'price',
		numeric: false,
		disablePadding: false,
		label: 'PRICE',
	},
	{
		id: 'agent',
		numeric: false,
		disablePadding: false,
		label: 'AGENT',
	},
	{
		id: 'location',
		numeric: false,
		disablePadding: false,
		label: 'LOCATION',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'CATEGORY',
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
	onRequestSort: (event: React.MouseEvent<unknown>, service: keyof Data) => void;
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

interface ServicePanelListType {
	services: Service[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateServiceHandler: any;
	removeServiceHandler: any;
}

export const ServicePanelList = (props: ServicePanelListType) => {
	const { services, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateServiceHandler, removeServiceHandler } =
		props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{services.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{services.length !== 0 &&
							services.map((service: Service, index: number) => {
								const serviceImage = `${REACT_APP_API_URL}/${service?.serviceImages[0]}`;
								const memberImage = `${REACT_APP_API_URL}/${service?.memberData?.memberImage}`;
								console.log('service.memberData?.memberNick', service.memberData?.memberNick); // Debugging line
								console.log('service', service);
								return (
									<TableRow hover key={service?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">{service._id}</TableCell>
										<TableCell align="left" className="name">
											{service.serviceStatus === ServiceStatus.AVAILABLE ? (
												<Stack className={'memberImage'}>
													<Link href={`/service/detail?id=${service._id}`}>
														<div>
															<Avatar alt="Remy Sharp" src={serviceImage} sx={{ ml: '2px', mr: '10px' }} />
														</div>
													</Link>
													<Link href={`/service/detail?id=${service?._id}`}>
														<div>{service.serviceTitle.replace(/_/g, ' ')}</div>
													</Link>
												</Stack>
											) : (
												<Stack direction="row" alignItems="center" className={'memberImage'}>
													<div>
														<Avatar alt="Remy Sharp" src={serviceImage} sx={{ ml: '2px', mr: '10px' }} />
													</div>
													<div style={{ marginTop: 10 }}>{service.serviceTitle}</div>
												</Stack>
											)}
										</TableCell>
										<TableCell align="center">{service.servicePrice}</TableCell>
										<TableCell align="left" className={'name'}>
											<Stack className={'memberImage'}>
												<Link href={`/member?memberId=${service?.memberData?._id}`}>
													<div>
														<Avatar alt="Remy Sharp" src={memberImage} sx={{ ml: '2px', mr: '10px' }} />
													</div>
												</Link>
												<Link href={`/member?memberId=${service?.memberData?._id}`}>
													<div>{service.memberData?.memberNick}</div>
												</Link>
											</Stack>
										</TableCell>

										<TableCell align="center">{service.serviceLocation}</TableCell>
										<TableCell align="center">{service.serviceCategory.replace(/_/g, ' ')}</TableCell>
										<TableCell align="center">
											{service.serviceStatus === ServiceStatus.DELETED && (
												<Button
													variant="outlined"
													sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
													onClick={() => removeServiceHandler(service._id)}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											)}

											{service.serviceStatus === ServiceStatus.NOT_AVAILABLE && (
												<Button className={'badge warning'}>{service.serviceStatus.replace(/_/g, ' ')}</Button>
											)}

											{service.serviceStatus === ServiceStatus.AVAILABLE && (
												<>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
														{service.serviceStatus.replace(/_/g, ' ')}
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
														{Object.values(ServiceStatus)
															.filter((ele) => ele !== service.serviceStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() => updateServiceHandler({ _id: service._id, serviceStatus: status })}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status.replace(/_/g, ' ')}
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
