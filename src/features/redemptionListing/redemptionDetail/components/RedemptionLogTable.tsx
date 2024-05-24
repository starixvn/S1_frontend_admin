import { FC } from 'react'
import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { timeFormat } from 'common/utils/format'
import { find } from 'lodash'
import { IGetRedemptionLogData } from '../../type'
import { statusesList } from '../../constants'

interface IRedemptionLogTable {
	loading: boolean
	redemptionLog: IGetRedemptionLogData[]
	timeZoneUtcOffset: number
}

const RedemptionLogTable: FC<IRedemptionLogTable> = ({
	redemptionLog,
	timeZoneUtcOffset,
	loading,
}) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 120,
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime
					? dayjs(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_Comment'),
			key: 'comment',
			dataIndex: 'comment',
			width: 150,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Action'),
			key: 'action',
			dataIndex: 'action',
			width: 80,
			align: 'center' as 'center',
			render: (action: number) => {
				const status = find(statusesList, item => item.status === action)
				return status ? t(status.displayKey) : ''
			},
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 80,
			align: 'center' as 'center',
		},
	]
	return (
		<Table
			loading={loading}
			columns={columns}
			dataSource={redemptionLog ?? []}
			pagination={false}
			scroll={{ x: undefined, y: 300 }}
		/>
	)
}

export { RedemptionLogTable }
