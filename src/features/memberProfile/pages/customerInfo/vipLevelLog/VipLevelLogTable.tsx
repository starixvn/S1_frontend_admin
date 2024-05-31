import { IGetVipLevelLogData } from 'features/memberProfile/type'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import { PaginationInterface } from 'common/hooks'
import { TablePaginationConfig, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { IVipLevelsData } from 'common/service/allDataApi'
import { find, isEmpty } from 'lodash'
import dayjs from 'dayjs'
import { timeFormat } from 'common/utils/format'

interface IVipLevelLogTableProps {
	loading: boolean
	vipLevelLog: IGetVipLevelLogData[]
	vipLevelList: IVipLevelsData[]
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	timeZoneUtcOffset: number
}
const VipLevelLogTable = ({
	loading,
	vipLevelLog,
	pagination,
	onTableChange,
	vipLevelList,
	timeZoneUtcOffset,
}: IVipLevelLogTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_OldLevel'),
			key: 'oldLevel',
			dataIndex: 'oldLevel',
			align: 'center' as 'center',
			width: 100,
			render: (oldLevel: number) => {
				const currentVipLevelName = find(
					vipLevelList,
					level => level.level === oldLevel
				)?.levelName
				return currentVipLevelName ?? '-'
			},
		},
		{
			title: t('Label_NewLevel'),
			key: 'newLevel',
			dataIndex: 'newLevel',
			align: 'center' as 'center',
			width: 100,
			render: (newLevel: number) => {
				const currentVipLevelName = find(
					vipLevelList,
					level => level.level === newLevel
				)?.levelName
				return currentVipLevelName ?? '-'
			},
		},
		{
			title: t('Label_Memo'),
			key: 'memo',
			dataIndex: 'memo',
			width: 150,
			align: 'center' as 'center',
			render: (memo: string) => (!isEmpty(memo) ? memo : '-'),
		},
		{
			title: t('Label_OperationTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: 120,
			align: 'center' as 'center',
			render: (updateTime: string) =>
				updateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{dayjs(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_Operator'),
			key: 'updaters',
			dataIndex: 'updaters',
			width: 60,
			align: 'center' as 'center',
		},
	]
	return (
		<LayoutContent.Card style={{ marginTop: -20 }}>
			<Table
				loading={loading}
				dataSource={vipLevelLog ?? []}
				columns={columns}
				onChange={onTableChange}
				pagination={pagination as TablePaginationConfig}
				style={{ marginTop: '10px', marginBottom: '10px' }}
			/>
		</LayoutContent.Card>
	)
}

export { VipLevelLogTable }
