import moment from 'moment'
import { ModalState } from 'common/hooks'
import { Descriptions, Modal, Space, Spin, Typography } from 'antd'
import {
	IGetVipRebateDetailData,
	IVipRebateInfoData,
} from 'features/vipRebateReport/type'
import { numberFormatter, timeFormat } from 'common/utils/format'
import { reduce } from 'lodash'
import { CustomDivider } from 'features/redemptionListing/RedemptionOverviewTable'
import { useTranslation } from 'react-i18next'

const { Title, Text } = Typography

interface IVipRebateReportDetailModalProps {
	detailModal: ModalState
	selectedDetailTarget: IVipRebateInfoData | null
	vipRebateDetail: IGetVipRebateDetailData[]
	loading: boolean
	timeZoneUtcOffset: number
}

const itemRenderer = (
	label: string,
	Content: Array<number | string>,
	Amount: number | string
) => (
	<Descriptions.Item
		label={label}
		style={{
			textAlign: 'center',
			paddingLeft: 0,
			paddingRight: 0,
			minWidth: '100px',
		}}
		span={1}
	>
		<Space direction='vertical' style={{ width: '100%' }}>
			{Content.map(value => (
				<>
					<Text style={{ height: 1 }}>{value}</Text>
					<CustomDivider />
				</>
			))}
			<Space>
				<Text style={{ height: 1 }}>{Amount}</Text>
			</Space>
		</Space>
	</Descriptions.Item>
)

const VipRebateReportDetailModal = ({
	detailModal,
	selectedDetailTarget,
	vipRebateDetail,
	loading,
	timeZoneUtcOffset,
}: IVipRebateReportDetailModalProps) => {
	const { t } = useTranslation()
	const { visible, onCancel } = detailModal
	const { userName, categoryName, createTime, minPayout, maxPayout } =
		selectedDetailTarget ?? {}

	const titleElement = () => {
		return itemRenderer(
			t('Label_Game'),
			vipRebateDetail.map(({ typeName }) => typeName),
			t('Label_Total')
		)
	}

	// Total Turnover //

	const totalTurnoverElement = () => {
		const totalValidTurnover = reduce(
			vipRebateDetail,
			(sum, current) => sum + current.validBet,
			0
		)

		return itemRenderer(
			t('Label_TotalTurnover'),
			vipRebateDetail.map(({ validBet }) => numberFormatter.format(validBet)),
			numberFormatter.format(totalValidTurnover)
		)
	}

	// Valid Turnover //

	const validTurnoverElement = () => {
		const totalValidTurnover = reduce(
			vipRebateDetail,
			(sum, current) => sum + current.validTurnover,
			0
		)

		return itemRenderer(
			t('Label_ValidTurnover'),
			vipRebateDetail.map(({ validTurnover }) =>
				numberFormatter.format(validTurnover)
			),
			numberFormatter.format(totalValidTurnover)
		)
	}

	const rebateElement = () => {
		return itemRenderer(
			t('Label_RebateByGame'),
			vipRebateDetail.map(({ percentage }) => `${percentage}%`),
			''
		)
	}

	const amountElement = () => {
		const totalRedeemAmount = reduce(
			vipRebateDetail,
			(sum, current) => sum + current.calculatedAmount,
			0
		)
		return itemRenderer(
			t('Label_RedeemAmount'),
			vipRebateDetail.map(({ calculatedAmount }) => calculatedAmount),
			totalRedeemAmount
		)
	}

	return (
		<Modal open={visible} onCancel={onCancel} width={600} footer={null}>
			<Spin spinning={loading}>
				<Title
					style={{
						display: 'flex',
						justifyContent: 'center',
					}}
					level={4}
				>
					{`${userName} - ${categoryName}`}
				</Title>
				<div style={{ marginBottom: '-10px' }}>
					{moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
				</div>
				<Descriptions
					layout='vertical'
					bordered
					size='small'
					column={10}
					style={{
						marginTop: '10px',
						marginBottom: '10px',
						overflowX: 'auto',
					}}
				>
					{titleElement()}
					{totalTurnoverElement()}
					{validTurnoverElement()}
					{rebateElement()}
					{amountElement()}
				</Descriptions>
				<div>
					{t('Label_MinPayout')}：
					{minPayout ? numberFormatter.format(minPayout) : minPayout}
				</div>
				<div>
					{t('Label_MaxPayout')}：
					{maxPayout ? numberFormatter.format(maxPayout) : maxPayout}
				</div>
			</Spin>
		</Modal>
	)
}

export default VipRebateReportDetailModal
