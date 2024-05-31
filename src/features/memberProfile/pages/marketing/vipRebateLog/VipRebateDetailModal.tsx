import dayjs from 'dayjs'
import { IGetVipRebateDetailData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { Descriptions, Modal, Spin, Typography } from 'antd'
import { numFormatToDigits, timeFormat } from 'common/utils/format'
import { Table } from 'components'
import { useEffect, useState } from 'react'
import { isPositiveNum } from 'common/utils'

const { Text } = Typography

interface IVipRebateDetailModalProps {
	loading: boolean
	vipRebateDetail: IGetVipRebateDetailData[]
	visible: boolean
	onCancel: () => void
	modalInfo: {
		createTime: string
		maxPayout: number
		minPayout: number
	}
	timeZoneUtcOffset: number
}

const VipRebateDetailModal = ({
	loading,
	vipRebateDetail,
	visible,
	onCancel,
	modalInfo,
	timeZoneUtcOffset,
}: IVipRebateDetailModalProps) => {
	const { t } = useTranslation()
	const { createTime, minPayout = 0, maxPayout = 0 } = modalInfo ?? {}

	// 這裡為了方便控制資料 , 另外寫 state 儲存 並在關閉 modal 後把資料抹除
	const [modalData, setModalData] = useState<IGetVipRebateDetailData[]>([])

	const columns = [
		{
			title: t('Label_Game'),
			key: 'typeName',
			dataIndex: 'typeName',
			width: 120,
			align: 'center' as 'center',
		},
		// 保持數字準確性 , 這裡不做 formatter
		{
			title: t('Label_TotalTurnover'),
			key: 'validBet',
			dataIndex: 'validBet',
			width: 100,
			align: 'center' as 'center',
			render: (validBet: number) => numFormatToDigits(validBet) ?? 0,
		},
		{
			title: t('Label_ValidTurnover'),
			key: 'validTurnover',
			dataIndex: 'validTurnover',
			width: 100,
			align: 'center' as 'center',
			render: (validTurnover: number) => numFormatToDigits(validTurnover) ?? 0,
		},
		{
			title: t('Label_RebateByGame'),
			key: 'percentage',
			dataIndex: 'percentage',
			width: 80,
			align: 'center' as 'center',
			render: (percentage: number) =>
				typeof percentage === 'number' ? `${percentage.toFixed(2)} %` : '',
		},
		{
			title: t('Label_RedeemAmount'),
			key: 'calculatedAmount',
			dataIndex: 'calculatedAmount',
			width: 100,
			align: 'center' as 'center',
			render: (calculatedAmount: number) =>
				numFormatToDigits(calculatedAmount) ?? 0,
		},
	]

	const hashVipRebateDetail = (
		rawVipRebateDetail: IGetVipRebateDetailData[]
	) => {
		const totalItem: IGetVipRebateDetailData[] = [
			{
				typeName: t('Label_Total'),
				validBet: rawVipRebateDetail.reduce(
					(sum, cur) => sum + cur.validBet,
					0
				),
				percentage: null,
				calculatedAmount: rawVipRebateDetail.reduce(
					(sum, cur) => sum + cur.calculatedAmount,
					0
				),
				validTurnover: rawVipRebateDetail.reduce(
					(sum, cur) => sum + cur.validTurnover,
					0
				),
			},
		]
		setModalData([...rawVipRebateDetail, ...totalItem])
	}

	useEffect(() => {
		// 初始化 Data 並 計算 total 值
		if (!loading) {
			hashVipRebateDetail(vipRebateDetail)
		}
	}, [loading])

	useEffect(() => {
		if (!visible) {
			setTimeout(() => setModalData([]), 500)
		}
	}, [visible])

	return (
		<Modal
			open={visible}
			onCancel={onCancel}
			footer={false}
			title={dayjs(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
		>
			<Spin spinning={loading}>
				<Table columns={columns} dataSource={modalData} pagination={false} />
			</Spin>
			<Descriptions bordered size='small' column={1}>
				<Descriptions.Item label={t('Label_MinPayout')}>
					<Text
						type={isPositiveNum(minPayout) ? undefined : 'danger'}
						style={{ whiteSpace: 'nowrap', padding: '5px' }}
					>
						{numFormatToDigits(minPayout || 0)}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_MaxPayout')}>
					<Text
						type={isPositiveNum(maxPayout) ? undefined : 'danger'}
						style={{ whiteSpace: 'nowrap', padding: '5px' }}
					>
						{numFormatToDigits(maxPayout || 0)}
					</Text>
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	)
}

export { VipRebateDetailModal }
