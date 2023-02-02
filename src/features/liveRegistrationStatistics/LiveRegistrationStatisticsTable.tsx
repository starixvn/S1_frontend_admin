import { FC } from 'react'
import moment from 'moment'
import { find, isArray } from 'lodash'
import { timeFormat } from 'common/utils/format'
import { Button, Select, Space, TablePaginationConfig, Typography } from 'antd'
import { PaginationInterface } from 'common/hooks'
import { SorterResult } from 'antd/es/table/interface'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { AlignType } from 'rc-table/lib/interface'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { IRegistrationManagementData } from 'features/liveRegistrationStatistics/type'
import {
	DEPOSIT_STATUS_OPTIONS,
	STATUS_OPTIONS,
	StatusEnum,
} from 'features/liveRegistrationStatistics/constants'
import { Table } from 'components'

const { Option } = Select

const LiveRegistrationStatisticsTable: FC<{
	loading: boolean
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	registrationManagementList: IRegistrationManagementData[]
	onTableChange: (
		newPagination: TablePaginationConfig,
		_: any,
		sorter: SorterResult<IRegistrationManagementData>
	) => void
	onStatusChange: ({
		custId,
		status,
	}: {
		custId: number
		status: number
	}) => void
	onOpenNoteLogModal: (record: IRegistrationManagementData) => void
	onCallingRecord: (custId: number) => void
}> = ({
	loading,
	timeZoneUtcOffset,
	pagination,
	registrationManagementList,
	onTableChange,
	onStatusChange,
	onOpenNoteLogModal,
	onCallingRecord,
}) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'currency',
			width: 80,
			align: 'center' as AlignType,
			render: (isoCode: string) => isoCode ?? 'N/A',
		},
		{
			title: t('Label_Agent'),
			key: 'agent',
			dataIndex: 'agent',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_AffiliatesCode'),
			key: 'affiliatesCode',
			dataIndex: 'affiliatesCode',
			width: 80,
			align: 'center' as 'center',
			render: (affiliatesCode: string) => affiliatesCode ?? '-',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			width: 80,
			align: 'center' as 'center',
			render: ({ userName, custId }: IRegistrationManagementData) => (
				<Typography.Link
					href={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${custId}`}
					target='_blank'
				>
					{userName}
				</Typography.Link>
			),
		},
		{
			title: t('Label_FullName'),
			key: 'accountName',
			dataIndex: 'accountName',
			width: 80,
			align: 'center' as 'center',
			render: (accountName: string) => accountName ?? '-',
		},
		{
			title: t('Label_Verify'),
			key: 'phoneVerified',
			dataIndex: 'phoneVerified',
			width: 80,
			align: 'center' as 'center',
			render: (phoneVerified: number) =>
				phoneVerified === 1 ? t('Label_Verified') : 'No',
		},
		{
			title: t('Label_ReferralUrl'),
			key: 'referralUrl',
			dataIndex: 'referralUrl',
			width: 80,
			align: 'center' as 'center',
			render: (referralUrl: string) => referralUrl ?? '-',
		},
		{
			title: t('Label_RegTimeDate'),
			key: 'regTime',
			dataIndex: 'regTime',
			width: '200px',
			align: 'center' as 'center',
			sorter: true,
			render: (regTime: string) =>
				regTime
					? moment(regTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_LastActiveTime'),
			key: 'lastActiveTime',
			dataIndex: 'lastActiveTime',
			width: '200px',
			align: 'center' as 'center',
			sorter: true,
			render: (lastActiveTime: string) =>
				lastActiveTime
					? moment(lastActiveTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)
					: '',
		},
		{
			title: t('Label_DepositStatus'),
			key: 'depositStatus',
			dataIndex: 'depositStatus',
			width: 80,
			align: 'center' as 'center',
			render: (depositStatus: number) =>
				t(
					find(DEPOSIT_STATUS_OPTIONS, { value: depositStatus })?.displayKey ??
						''
				),
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: 80,
			align: 'center' as 'center',
			render: (record: IRegistrationManagementData) => (
				<Select
					style={{ width: '140px' }}
					value={record.status}
					onChange={status => onStatusChange({ custId: record.custId, status })}
				>
					{STATUS_OPTIONS.filter(option => option.value !== StatusEnum.All).map(
						option => (
							<Option value={option.value} key={option.value}>
								{t(option.displayKey)}
							</Option>
						)
					)}
				</Select>
			),
		},
		{
			title: t('Label_CallMark'),
			align: 'center' as 'center',
			render: ({ custId, updateRemark }: IRegistrationManagementData) => {
				return (
					<Space direction='vertical'>
						{isArray(updateRemark) && updateRemark.map(remark => remark)}
						<Button type='primary' onClick={() => onCallingRecord(custId)}>
							{t('Label_CompleteOnce')}
						</Button>
					</Space>
				)
			},
		},
		{
			title: t('Label_Action'),
			key: 'action',
			width: 80,
			align: 'center' as 'center',
			render: (record: IRegistrationManagementData) => {
				return (
					<Space size='middle'>
						<Typography.Link onClick={() => onOpenNoteLogModal(record)}>
							{t('Label_Note')}
						</Typography.Link>
					</Space>
				)
			},
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={registrationManagementList}
				pagination={pagination as TablePaginationConfig}
				// @ts-ignore
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export default LiveRegistrationStatisticsTable
