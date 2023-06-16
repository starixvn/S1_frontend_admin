import moment from 'moment'
import { IGetBonusLogData } from 'features/memberProfile/type'
import { TablePaginationConfig, Typography } from 'antd'
import { PaginationInterface } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { numFormatToDigits, timeFormat } from 'common/utils/format'
import { ChangeBonusDirectionEnum } from 'features/memberProfile/constants'
import { isPositiveNum } from 'common/utils'

const { Text } = Typography
interface IBonusLogTableProps {
	loading: boolean
	bonusLog: IGetBonusLogData[]
	timeZoneUtcOffset: number
	onTableChange: (newPagination: TablePaginationConfig) => void
	pagination: PaginationInterface
}

const BonusLogTable = ({
	loading,
	bonusLog,
	timeZoneUtcOffset,
	onTableChange,
	pagination,
}: IBonusLogTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_BonusId'),
			key: 'bonusId',
			dataIndex: 'bonusId',
			width: 80,
			align: 'center' as 'center',
			render: (bonusId: number) => (
				<Typography.Text style={{ whiteSpace: 'nowrap' }}>
					{bonusId}
				</Typography.Text>
			),
		},
		{
			title: t('Label_BonusCode'),
			key: 'bonusCode',
			dataIndex: 'bonusCode',
			width: 100,
			align: 'center' as 'center',
			render: (bonusCode: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap' }}>
					{bonusCode}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Time'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 120,
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
		{
			title: t('Label_Type'),
			key: 'typeName',
			dataIndex: 'typeName',
			width: 80,
			align: 'center' as 'center',
			render: (typeName: string) =>
				typeName ? (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{typeName}
					</Typography.Text>
				) : (
					'-'
				),
		},
		{
			title: `${t('Label_Before')} ${t('Label_Bonus')}`,
			key: 'beforeBonus',
			dataIndex: 'beforeBonus',
			align: 'center' as 'center',
			width: 80,
			render: (beforeBonus: number) => (
				<Text
					type={isPositiveNum(beforeBonus) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(beforeBonus || 0)}
				</Text>
			),
		},
		{
			title: t('Label_ChangeBonus'),
			key: 'changeBonus',
			width: 80,
			align: 'center' as 'center',
			render: ({ changeBonus, direction }: IGetBonusLogData) => {
				const sign = direction === ChangeBonusDirectionEnum.Add ? '+' : '-'
				return (
					<Typography.Text
						type={
							direction === ChangeBonusDirectionEnum.Add ? undefined : 'danger'
						}
						style={{ whiteSpace: 'nowrap' }}
					>
						{`${sign} ${numFormatToDigits(changeBonus)}`}
					</Typography.Text>
				)
			},
		},
		{
			title: `${t('Label_After')} ${t('Label_Bonus')}`,
			key: 'afterBonus',
			dataIndex: 'afterBonus',
			align: 'center' as 'center',
			width: 80,
			render: (afterBonus: number) => (
				<Text
					type={isPositiveNum(afterBonus) ? undefined : 'danger'}
					style={{ whiteSpace: 'nowrap', padding: '5px' }}
				>
					{numFormatToDigits(afterBonus || 0)}
				</Text>
			),
		},
		{
			title: t('Label_Memo'),
			key: 'memo',
			dataIndex: 'memo',
			align: 'center' as 'center',
			width: 100,
		},
		{
			title: t('Label_RefTransId'),
			key: 'refTransId',
			dataIndex: 'refTransId',
			align: 'center' as 'center',
			width: 150,
		},
	]

	return (
		<Table
			loading={loading}
			pagination={
				{
					...pagination,
					showTotal: total => `total ${total} items`,
				} as TablePaginationConfig
			}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			dataSource={bonusLog ?? []}
			onChange={onTableChange}
			columns={columns}
		/>
	)
}

export { BonusLogTable }
