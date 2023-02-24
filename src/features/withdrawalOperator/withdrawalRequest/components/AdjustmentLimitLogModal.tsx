import { IAdjustmentLogLimitData } from 'features/withdrawalOperator/type'
import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { numberFormatter } from 'common/utils/format'
import { IEnumTypeData } from 'common/service/enumApi'
import { find } from 'lodash'
import { IGetReasonListData } from 'features/withdrawalAdjustment/type'
import moment from 'moment/moment'

interface IAdjustmentLimitLogModalProps {
	loading: boolean
	visible: boolean
	timeZoneUtcOffset: number
	reasonList: IGetReasonListData[]
	adjustmentLimitList: IAdjustmentLogLimitData[]
	directionEnumList: IEnumTypeData[]
	onCancel: () => void
}

const AdjustmentLimitLogModal = ({
	loading,
	visible,
	timeZoneUtcOffset,
	reasonList,
	adjustmentLimitList,
	directionEnumList,
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
			render: (mainType: number) => {
				const typeName = find(
					directionEnumList,
					({ value }) => value === mainType
				)?.name
				return typeName || '-'
			},
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
			title: t('Label_Reason'),
			key: 'reasonId',
			dataIndex: 'reasonId',
			width: 150,
			align: 'center' as 'center',
			render: (reasonId: number) => {
				const reasonName = find(
					reasonList,
					({ value }) => value === reasonId
				)?.name
				return reasonName || '-'
			},
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
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 140,
			align: 'center' as 'center',
			render: (createTime: string) =>
				moment(createTime)
					.utcOffset(timeZoneUtcOffset)
					.format('YYYY-MM-DD  HH:mm:ss'),
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
			width='50vw'
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
