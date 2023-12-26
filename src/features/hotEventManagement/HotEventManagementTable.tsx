import { FC } from 'react'
import { PermissionInterface } from 'type'
import { PaginationInterface } from 'common/hooks'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import {
	Popconfirm,
	Space,
	Switch,
	TablePaginationConfig,
	Typography,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { IGetHotEventListData } from 'features/hotEventManagement/type'
import moment from 'moment'
import { timeFormat } from 'common/utils/format'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from 'app/store'
import { selectAllCurrencyList } from 'common/enum'

interface IHotEventManagementTableProps {
	loading: boolean
	editPermission?: PermissionInterface
	deletePermission?: PermissionInterface
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	onDeleteHotEvent: (id: number) => void
	onSetStatus: ({ id, status }: { id: number; status: number }) => void
	timeZoneUtcOffset: number
	hotEventList: IGetHotEventListData[]
}

const HotEventManagementTable: FC<IHotEventManagementTableProps> = ({
	loading,
	editPermission,
	deletePermission,
	pagination,
	onTableChange,
	onDeleteHotEvent,
	timeZoneUtcOffset,
	onSetStatus,
	hotEventList,
}) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const allCurrencyList = useAppSelector(selectAllCurrencyList)
	const columns = [
		{
			title: t('Label_Action'),
			key: 'action',
			width: 80,
			align: 'center' as 'center',
			render: (record: IGetHotEventListData) => {
				const { id } = record
				return (
					<Space size='middle' style={{ padding: '5px' }}>
						<Typography.Link
							disabled={!editPermission?.canUse}
							onClick={() =>
								navigate(
									`/${NEW_SITE_PREFIX_URL}/${paths.cms.sub.hotEventManagement.root}/${id}`
								)
							}
						>
							{t('Label_Edit')}
						</Typography.Link>
						<Popconfirm
							disabled={!deletePermission?.canUse}
							title={t('Label_SureToDelete')}
							onConfirm={() => onDeleteHotEvent(id)}
						>
							<Typography.Link disabled={!deletePermission?.canUse}>
								{t('Label_Delete')}
							</Typography.Link>
						</Popconfirm>
					</Space>
				)
			},
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: 80,
			align: 'center' as 'center',
			render: (record: IGetHotEventListData) => {
				const { status, id } = record
				return (
					<Popconfirm
						disabled={!editPermission?.canUse}
						title={t('Label_AreYouSure')}
						onConfirm={() => onSetStatus({ id, status: Number(!status) })}
					>
						<Switch
							checked={Boolean(status)}
							disabled={!editPermission?.canUse}
						/>
					</Popconfirm>
				)
			},
		},
		{
			title: t('Label_LiveBroadCaster'),
			dataIndex: `isLiveStreaming`,
			width: 100,
			align: 'center' as 'center',
			render: (isLiveStreaming: boolean) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{isLiveStreaming ? t('Label_Yes') : t('Label_No')}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Currency'),
			dataIndex: `iCurrencyList`,
			width: 100,
			align: 'center' as 'center',
			render: (iCurrencyList: number[]) => {
				const currencyNames = iCurrencyList?.map(
					currency =>
						allCurrencyList.find(({ currencyId }) => currencyId === currency)
							?.isoCode
				)
				if (currencyNames && currencyNames.length > 0) {
					return currencyNames.join(',')
				}
				return '-'
			},
		},
		{
			title: t('Label_SportLeaguesTitle'),
			dataIndex: `sportLeaguesTitle`,
			width: 100,
			align: 'center' as 'center',
			render: (sportLeaguesTitle: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{sportLeaguesTitle ?? 'N/A'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_BattleTime'),
			key: 'battleTime',
			dataIndex: 'battleTime',
			width: 120,
			align: 'center' as 'center',
			render: (battleTime: string) =>
				battleTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(battleTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_HomeTeam'),
			dataIndex: `homeTeamName`,
			width: 100,
			align: 'center' as 'center',
			render: (homeTeamName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{homeTeamName ?? 'N/A'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_AwayTeam'),
			dataIndex: `awayTeamName`,
			width: 100,
			align: 'center' as 'center',
			render: (awayTeamName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{awayTeamName ?? 'N/A'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_StartTime'),
			key: 'startTime',
			dataIndex: 'startTime',
			width: 120,
			align: 'center' as 'center',
			render: (startTime: string) =>
				startTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(startTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_EndTime'),
			key: 'endTime',
			dataIndex: 'endTime',
			width: 120,
			align: 'center' as 'center',
			render: (endTime: string) =>
				endTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(endTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_LastUpdateUser'),
			dataIndex: `lastUpdateUser`,
			width: 100,
			align: 'center' as 'center',
			render: (lastUpdater: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{lastUpdater ?? 'N/A'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_LastUpdateTime'),
			key: 'updateTime',
			dataIndex: 'lastUpdateTime',
			width: 120,
			align: 'center' as 'center',
			render: (lastUpdateTime: string) =>
				lastUpdateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(lastUpdateTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
	]
	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={hotEventList ?? []}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export { HotEventManagementTable }
