import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { Descriptions, TablePaginationConfig, Typography } from 'antd'
import moment from 'moment'
import { numFormatToDigits, timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { IGetDepositInfoData } from 'features/memberProfile/type'
import { IEnumTypeData } from 'common/service/enumApi'
import { isPositiveNum } from 'common/utils'
import { DepositStatusEnum } from 'features/memberProfile/constants'

const { Text } = Typography
interface DepositTableProps {
	depositInfoList: IGetDepositInfoData[]
	loading: boolean
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	statusList: IEnumTypeData[]
	typeList: IEnumTypeData[]
}
const DepositTable = ({
	depositInfoList,
	loading,
	timeZoneUtcOffset,
	pagination,
	onTableChange,
	statusList,
	typeList,
}: DepositTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_UpdatedDate'),
			key: 'UpdatedDate',
			dataIndex: 'updateTime',
			width: 100,
			align: 'center' as 'center',
			render: (updateTime: string) =>
				updateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
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
			title: t('Label_DepositType'),
			key: 'DepositType',
			dataIndex: 'depositType',
			width: 100,
			align: 'center' as 'center',
			render: (depositType: number) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{typeList.map(({ value, name }) => value === depositType && name)}
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
			title: t('Label_DepositBonus'),
			key: 'bonusDescription',
			dataIndex: 'bonusDescription',
			width: 100,
			align: 'center' as 'center',
			render: (bonusDescription: string) => bonusDescription || '-',
		},
		{
			title: t('Label_ActualDeposit'),
			key: 'ActualDeposit',
			dataIndex: 'actualDeposit',
			width: 100,
			align: 'center' as 'center',
			render: (actualDeposit: number) => (
				<Text
					type={isPositiveNum(actualDeposit) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(actualDeposit || 0)}
				</Text>
			),
		},
		{
			title: t('Label_PaymentReferenceId'),
			key: 'PaymentReferenceId',
			dataIndex: 'refId',
			width: 100,
			align: 'center' as 'center',
			render: (refId: string) => refId ?? '-',
		},
		{
			title: t('Label_CompanyBankName'),
			key: 'CompanyBankName',
			dataIndex: 'bankName',
			width: 100,
			align: 'center' as 'center',
			render: (bankName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{bankName ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_CompanyAccountName'),
			key: 'CompanyAccountName',
			dataIndex: 'accountName',
			width: 100,
			align: 'center' as 'center',
			render: (accountName: string) => accountName ?? '-',
		},
		{
			title: t('Label_CompanyAccountNumber'),
			key: 'CompanyAccountNumber',
			dataIndex: 'accountNo',
			width: 100,
			align: 'center' as 'center',
			render: (accountNo: number) => accountNo ?? '-',
		},
		{
			title: t('Label_DepositDate'),
			key: 'DepositDate',
			dataIndex: 'depositTime',
			width: 100,
			align: 'center' as 'center',
			render: (depositTime: string) =>
				depositTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(depositTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Typography.Text>
				) : (
					'-'
				),
		},
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
	]

	const totalApprovedAmount = depositInfoList
		.filter(depositInfo => depositInfo.status === DepositStatusEnum.Approved)
		.reduce((acc, cur) => acc + cur.amount, 0)

	const totalApproveCount = depositInfoList.filter(
		depositInfo => depositInfo.status === DepositStatusEnum.Approved
	).length

	return (
		<>
			<Table
				loading={loading}
				dataSource={depositInfoList ?? []}
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

export default DepositTable
