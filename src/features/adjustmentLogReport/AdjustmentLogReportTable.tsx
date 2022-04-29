import moment from 'moment'
import { Table, TablePaginationConfig } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { PaginationInterface } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { selectAdjustmentLogReportList } from './slice'

const AdjustmentLogReportTable = ({
	loading,
	timeZoneUtcOffset,
	pagination,
	onTableChange,
}: {
	loading: boolean
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
}) => {
	const { t } = useTranslation()
	const adjustmentLogReportList = useAppSelector(selectAdjustmentLogReportList)

	const columns = [
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: 120,
			align: 'center' as 'center',
			render: (isoCode: string | null) => isoCode || 'N/A',
		},
		{
			title: t('Label_Function'),
			key: 'menuFunction',
			dataIndex: 'menuFunction',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_ActionType'),
			key: 'actionTypeName',
			dataIndex: 'actionTypeName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Before'),
			key: 'beforeDetailInfo',
			dataIndex: 'beforeDetailInfo',
			width: 120,
			render: (beforeDetailInfo: any | null) => {
				if (beforeDetailInfo === null) return 'N/A'

				const jsonBeforeDetailInfo = JSON.parse(beforeDetailInfo)

				return Object.keys(jsonBeforeDetailInfo).map((key: string) => (
					<div>
						{key} : {jsonBeforeDetailInfo[key]}
					</div>
				))
			},
		},
		{
			title: t('Label_After'),
			key: 'afterDetailInfo',
			dataIndex: 'afterDetailInfo',
			width: 120,
			render: (afterDetailInfo: any | null) => {
				if (afterDetailInfo === null) return 'N/A'

				const jsonBeforeDetailInfo = JSON.parse(afterDetailInfo)

				return Object.keys(jsonBeforeDetailInfo).map((key: string) => (
					<div>
						{key} : {jsonBeforeDetailInfo[key]}
					</div>
				))
			},
		},
		{
			title: t('Label_TransId'),
			key: 'refTransId',
			dataIndex: 'refTransId',
			width: 120,
			align: 'center' as 'center',
			render: (refTransId: any) => refTransId || 'N/A',
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 120,
			render: (createTime: string) =>
				moment(createTime)
					.utcOffset(timeZoneUtcOffset)
					.format('YYYY-DD-MM  hh:mm:ss'),
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 120,
			align: 'center' as 'center',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				bordered
				rowKey={record => record.id}
				size='small'
				scroll={{ x: 240 }}
				loading={loading}
				columns={columns}
				dataSource={adjustmentLogReportList}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export { AdjustmentLogReportTable }
