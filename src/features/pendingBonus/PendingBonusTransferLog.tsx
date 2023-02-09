import { Typography } from 'antd'
import { Table } from 'components'
import { ITransferMultiData } from 'features/pendingBonus/type'
import { useTranslation } from 'react-i18next'

const PendingBonusTransferLog = ({
	transferLogs,
}: {
	transferLogs: ITransferMultiData[]
}) => {
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
			dataIndex: 'result',
			align: 'center' as 'center',
			render: (result: {
				errorCode: number
				message: string
				rawErrorCode: string
				rawMessage: string
			}) => {
				const { errorCode } = result
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
			dataIndex: 'result',
			align: 'center' as 'center',
			width: '70%',
			render: (result: {
				errorCode: number
				message: string
				rawErrorCode: string
				rawMessage: string
			}) => {
				const { message } = result
				return <Typography.Text>{message}</Typography.Text>
			},
		},
	]

	return (
		<Table
			pagination={false}
			columns={columns}
			dataSource={transferLogs}
			scroll={{ y: 400 }}
		/>
	)
}

export default PendingBonusTransferLog
