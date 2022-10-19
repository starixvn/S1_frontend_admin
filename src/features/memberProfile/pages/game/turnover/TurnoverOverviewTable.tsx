import { IGetTurnoverData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { Descriptions, Spin } from 'antd'
import { numberFormatter } from 'common/utils/format'

interface ITurnoverOverviewTableProps {
	loading: boolean
	turnoverData: IGetTurnoverData[]
}

const { Item } = Descriptions

const TurnoverOverviewTable = ({
	loading,
	turnoverData,
}: ITurnoverOverviewTableProps) => {
	const { t } = useTranslation()
	const sumTotalTO = () => {
		const init = 0
		const sumStakeSettled = turnoverData?.reduce(
			(prev, cur) => prev + cur.stakeSettled,
			init
		)
		const sumStakeNotRollover = turnoverData?.reduce(
			(prev, cur) => prev + cur.stakeNotRollover,
			init
		)
		return sumStakeSettled + sumStakeNotRollover
	}

	return (
		<Spin spinning={loading}>
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
				<Item
					label={`${t('Label_Total')} - ${t('Label_TotalTO')}`}
					style={{
						textAlign: 'center',
						paddingLeft: 0,
						paddingRight: 0,
						minWidth: '100px',
					}}
					span={1}
				>
					{numberFormatter.format(sumTotalTO())}
				</Item>
				<Item
					label={`${t('Label_Total')} - ${t('Label_ValidBet')}`}
					style={{
						textAlign: 'center',
						paddingLeft: 0,
						paddingRight: 0,
						minWidth: '100px',
					}}
					span={1}
				>
					{numberFormatter.format(
						turnoverData?.reduce((prev, cur) => prev + cur.stakeSettled, 0)
					)}
				</Item>
				<Item
					label={`${t('Label_Total')} - ${
						t('Label_TurnOver') + t('Label_ExcludeValidTO')
					}`}
					style={{
						textAlign: 'center',
						paddingLeft: 0,
						paddingRight: 0,
						minWidth: '100px',
					}}
					span={1}
				>
					{numberFormatter.format(
						turnoverData?.reduce((prev, cur) => prev + cur.stakeNotRollover, 0)
					)}
				</Item>
				<Item
					label={`${t('Label_Total')} - ${t('Label_WinLoss')}`}
					style={{
						textAlign: 'center',
						paddingLeft: 0,
						paddingRight: 0,
						minWidth: '100px',
					}}
					span={1}
				>
					{numberFormatter.format(
						turnoverData?.reduce((prev, cur) => prev + cur.winlostAmount, 0)
					)}
				</Item>
			</Descriptions>
		</Spin>
	)
}

export { TurnoverOverviewTable }
