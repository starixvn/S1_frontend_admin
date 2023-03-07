import { LayoutContent } from 'app/pages/layout'
import { IVipLevelData } from 'features/vipReview/type'
import { Typography } from 'antd'
import { Table } from 'components'
import { useTranslation } from 'react-i18next'

interface IBatchLogTableProps {
	batchLog: IVipLevelData[]
}

const BatchLogTable = ({ batchLog }: IBatchLogTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: '#',
			width: '10%',
			key: 'index',
			align: 'center' as 'center',
			// 單純要取 index , 前兩個參數用不到
			render: (_: any, __: any, idx: number) => idx + 1,
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: '20%',
			align: 'center' as 'center',
			render: (record: IVipLevelData) => {
				const { errorCode } = record
				// 0 = success
				return errorCode === 0 ? (
					<Typography.Text type='success'>
						{t('System.Label_Success')}
					</Typography.Text>
				) : (
					<Typography.Text type='danger'>
						{t('System.Label_Failed')}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_Comment'),
			key: 'comment',
			dataIndex: 'message',
			align: 'center' as 'center',
			width: '70%',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				pagination={false}
				columns={columns}
				dataSource={batchLog}
				style={{ margin: '10px 0' }}
				scroll={{ y: 200 }}
			/>
		</LayoutContent.Card>
	)
}

export default BatchLogTable
