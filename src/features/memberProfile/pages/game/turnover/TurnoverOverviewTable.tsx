import { IGetTurnoverData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { Descriptions, Spin, Typography } from 'antd'
import { numFormatToDigits } from 'common/utils/format'
import { isPositiveNum } from 'common/utils'

const { Text } = Typography
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

	const turnoverDataTotal = turnoverData?.reduce(
		(prev, cur) => prev + cur.stakeSettled,
		0
	)

	const stakeNotRolloverTotal = turnoverData?.reduce(
		(prev, cur) => prev + cur.stakeNotRollover,
		0
	)

	const winlostAmountTotal = turnoverData?.reduce(
		(prev, cur) => prev + cur.winlostAmount,
		0
	)

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
					<Text
						type={isPositiveNum(sumTotalTO()) ? undefined : 'danger'}
						style={{ whiteSpace: 'nowrap', padding: '5px' }}
					>
						{numFormatToDigits(sumTotalTO())}
					</Text>
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
					<Text
						type={isPositiveNum(turnoverDataTotal) ? undefined : 'danger'}
						style={{ whiteSpace: 'nowrap', padding: '5px' }}
					>
						{numFormatToDigits(turnoverDataTotal)}
					</Text>
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
					<Text
						type={isPositiveNum(stakeNotRolloverTotal) ? undefined : 'danger'}
						style={{ whiteSpace: 'nowrap', padding: '5px' }}
					>
						{numFormatToDigits(stakeNotRolloverTotal)}
					</Text>
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
					<Text
						type={isPositiveNum(winlostAmountTotal) ? undefined : 'danger'}
						style={{ whiteSpace: 'nowrap', padding: '5px' }}
					>
						{numFormatToDigits(winlostAmountTotal)}
					</Text>
				</Item>
			</Descriptions>
		</Spin>
	)
}

export { TurnoverOverviewTable }
