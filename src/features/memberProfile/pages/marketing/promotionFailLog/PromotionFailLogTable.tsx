import dayjs from 'dayjs'
import { Typography } from 'antd'
import { Table } from 'components'
import { timeFormat } from 'common/utils/format'
import { useTranslation } from 'react-i18next'
import { IPromotionReceiveFailLogData } from 'features/memberProfile/type'

interface IPromotionFailLogTableProps {
	loading: boolean
	promotionReceiveFailLogList: IPromotionReceiveFailLogData[]
	timeZoneUtcOffset: number
}

const PromotionFailLogTable = ({
	loading,
	promotionReceiveFailLogList,
	timeZoneUtcOffset,
}: IPromotionFailLogTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_BonusType'),
			key: 'promotionTypeName',
			dataIndex: 'promotionTypeName',
			width: '10%',
			align: 'center' as 'center',
			render: (promotionTypeName: string) => promotionTypeName || '-',
		},
		{
			title: t('Label_BonusCode'),
			key: 'bonusCode',
			dataIndex: 'bonusCode',
			width: '20%',
			align: 'center' as 'center',
			render: (bonusCode: string) => bonusCode || '-',
		},
		{
			title: t('Label_ClaimDate'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: '20%',
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{dayjs(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_Reason'),
			key: 'errorReason',
			dataIndex: 'errorReason',
			width: '50%',
			align: 'center' as 'center',
			render: (errorReason: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{errorReason ?? 'N/A'}
				</Typography.Text>
			),
		},
	]

	return (
		<Table
			loading={loading}
			pagination={false}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			dataSource={promotionReceiveFailLogList}
			columns={columns}
		/>
	)
}

export default PromotionFailLogTable
