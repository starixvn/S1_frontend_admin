import moment from 'moment'
import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { TablePaginationConfig, Typography } from 'antd'
import { numberFormatter, timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { IGetWithdrawalLimitLogData } from 'features/memberProfile/type'
import { IEnumTypeData } from 'common/service/enumApi'
import { isPositiveNum } from 'common/utils'

const { Text } = Typography

interface WithdrawalLimitTableProps {
	withdrawalLimitLogList: IGetWithdrawalLimitLogData[]
	loading: boolean
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	typeList: IEnumTypeData[]
}
const WithdrawalLimitTable = ({
	withdrawalLimitLogList,
	loading,
	timeZoneUtcOffset,
	pagination,
	onTableChange,
	typeList,
}: WithdrawalLimitTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_MainType'),
			key: 'MainType',
			dataIndex: 'mainType',
			width: 100,
			align: 'center' as 'center',
			render: (mainType: number) =>
				typeList.map(({ value, name }) => value === mainType && name),
		},
		{
			title: t('Label_Change'),
			key: 'Change',
			width: 100,
			align: 'center' as 'center',
			render: ({
				changeWithdrawalLimit,
				beforeWithdrawalLimit,
				afterWithdrawalLimit,
			}: {
				changeWithdrawalLimit: number
				beforeWithdrawalLimit: number
				afterWithdrawalLimit: number
			}) => {
				let sign
				if (beforeWithdrawalLimit !== afterWithdrawalLimit) {
					sign = afterWithdrawalLimit > beforeWithdrawalLimit ? '+' : '-'
				}
				return `${sign ?? ''}${numberFormatter.format(changeWithdrawalLimit)}`
			},
		},
		{
			title: t('Label_Before'),
			key: 'Before',
			dataIndex: 'beforeWithdrawalLimit',
			width: 100,
			align: 'center' as 'center',
			render: (beforeWithdrawalLimit: number) => (
				<Text
					type={isPositiveNum(beforeWithdrawalLimit) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numberFormatter.format(beforeWithdrawalLimit || 0)}
				</Text>
			),
		},
		{
			title: t('Label_After'),
			key: 'After',
			dataIndex: 'afterWithdrawalLimit',
			width: 100,
			align: 'center' as 'center',
			render: (afterWithdrawalLimit: number) => (
				<Text
					type={isPositiveNum(afterWithdrawalLimit) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numberFormatter.format(afterWithdrawalLimit || 0)}
				</Text>
			),
		},
		{
			title: t('Label_Memo'),
			key: 'Memo',
			dataIndex: 'memo',
			width: 100,
			align: 'center' as 'center',
			render: (memo: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{memo ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_RefTransId'),
			key: 'RefTransId',
			dataIndex: 'refTransId',
			width: 100,
			align: 'center' as 'center',
			render: (refTransId: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{refTransId ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_CreateTime'),
			key: 'CreateTime',
			dataIndex: 'createTime',
			width: 100,
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
	]
	return (
		<Table
			loading={loading}
			dataSource={withdrawalLimitLogList ?? []}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			columns={columns}
			pagination={pagination as TablePaginationConfig}
			onChange={onTableChange}
		/>
	)
}

export default WithdrawalLimitTable
