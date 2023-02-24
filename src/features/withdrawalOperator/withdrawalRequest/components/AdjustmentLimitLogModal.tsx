import { IAdjustmentLogLimitData } from 'features/withdrawalOperator/type'
import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { numberFormatter } from 'common/utils/format'

interface IAdjustmentLimitLogModalProps {
	loading: boolean
	adjustmentLimitList: IAdjustmentLogLimitData[]
	visible: boolean
	onCancel: () => void
}

const AdjustmentLimitLogModal = ({
	loading,
	adjustmentLimitList,
	visible,
	onCancel,
}: IAdjustmentLimitLogModalProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_AdjustType'),
			key: 'adjustType',
			dataIndex: 'mainType',
			width: 100,
			align: 'center' as 'center',
			render: (isoCode: string | null) => isoCode || 'N/A',
		},
		{
			title: t('Label_Amount'),
			key: 'amount',
			dataIndex: 'amount',
			width: 100,
			align: 'center' as 'center',
			render: (amount: number) => (amount ? numberFormatter.format(amount) : 0),
		},
		{
			title: t('Label_Memo'),
			key: 'memo',
			dataIndex: 'memo',
			width: 100,
			align: 'center' as 'center',
			render: (memo: string) => memo || 'N/A',
		},
		{
			title: t('Label_Operator'),
			key: 'creator',
			dataIndex: 'creator',
			width: 100,
			align: 'center' as 'center',
			render: (creator: string) => creator || 'N/A',
		},
	]
	return (
		<Modal
			open={visible}
			onCancel={onCancel}
			footer={false}
			title={
				<div style={{ textAlign: 'center' }}>{t('Label_AdjustmentRecord')}</div>
			}
		>
			<Table
				pagination={false}
				columns={columns}
				dataSource={adjustmentLimitList}
				loading={loading}
			/>
		</Modal>
	)
}

export { AdjustmentLimitLogModal }
