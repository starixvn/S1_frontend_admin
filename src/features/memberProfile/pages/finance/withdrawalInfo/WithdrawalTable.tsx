import moment from 'moment'
import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { Descriptions, TablePaginationConfig, Typography } from 'antd'
import { numFormatToDigits, timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { IGetWithdrawalInfoData } from 'features/memberProfile/type'
import { IEnumTypeData } from 'common/service/enumApi'
import { isPositiveNum } from 'common/utils'
import { WithdrawalStatusEnum } from 'features/memberProfile/constants'

const { Text } = Typography

interface WithdrawalTableProps {
	withdrawalInfoList: IGetWithdrawalInfoData[]
	loading: boolean
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	statusList: IEnumTypeData[]
	typeList: IEnumTypeData[]
}
const WithdrawalTable = ({
	withdrawalInfoList,
	loading,
	timeZoneUtcOffset,
	pagination,
	onTableChange,
	statusList,
	typeList,
}: WithdrawalTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_CreatedDate'),
			key: 'CreatedDate',
			dataIndex: 'createTime',
			width: 100,
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					'-'
				),
		},
		{
			title: t('Label_TrxnID'),
			key: 'TrxnID',
			dataIndex: 'transId',
			width: 100,
			align: 'center' as 'center',
			render: (transId: string) => transId ?? '-',
		},
		{
			title: t('Label_Status'),
			key: 'Status',
			dataIndex: 'status',
			width: 100,
			align: 'center' as 'center',
			render: (status: number) =>
				statusList.map(({ value, name }) => value === status && name),
		},
		{
			title: t('Label_WithdrawalType'),
			key: 'WithdrawalType',
			dataIndex: 'withdrawalType',
			width: 100,
			align: 'center' as 'center',
			render: (withdrawalType: number) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{typeList.map(({ value, name }) => value === withdrawalType && name)}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Amount'),
			key: 'Amount',
			dataIndex: 'amount',
			width: 100,
			align: 'center' as 'center',
			render: (amount: number) => (
				<Text
					type={isPositiveNum(amount) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(amount || 0)}
				</Text>
			),
		},
		{
			title: t('Label_AccountNum'),
			key: 'accountNo',
			dataIndex: 'accountNo',
			width: 100,
			align: 'center' as 'center',
			render: (accountNo: string) => accountNo ?? '-',
		},
		{
			title: t('Label_AccountName'),
			key: 'accountName',
			dataIndex: 'accountName',
			width: 100,
			align: 'center' as 'center',
			render: (accountName: string) => accountName ?? '-',
		},
	]

	const totalApprovedAmount = withdrawalInfoList
		.filter(
			withdrawalInfo => withdrawalInfo.status === WithdrawalStatusEnum.Approved
		)
		.reduce((acc, cur) => acc + cur.amount, 0)

	const totalApproveCount = withdrawalInfoList.filter(
		withdrawalInfo => withdrawalInfo.status === WithdrawalStatusEnum.Approved
	).length

	return (
		<>
			<Table
				loading={loading}
				dataSource={withdrawalInfoList ?? []}
				style={{ marginTop: '10px', marginBottom: '10px' }}
				columns={columns}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
			<Descriptions>
				<Descriptions.Item label='totalApproveCount'>
					{numFormatToDigits(totalApproveCount || 0)}
				</Descriptions.Item>
				<Descriptions.Item label='totalApprovedAmount'>
					{numFormatToDigits(totalApprovedAmount || 0)}
				</Descriptions.Item>
			</Descriptions>
		</>
	)
}

export default WithdrawalTable
