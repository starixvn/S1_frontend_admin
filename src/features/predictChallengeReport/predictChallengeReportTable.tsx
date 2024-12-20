import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { find, isBoolean, isNumber } from 'lodash'
import { Checkbox, Popconfirm, Space, Typography } from 'antd'
import { LayoutContent } from '../../app/pages/layout'
import { numFormatToDigits } from '../../common/utils/format'
import { Table } from '../../components'
import { PREDICT_STATUS_OPTIONS, PredictStatusEnum } from './constants'
import type {
	IClaimPredictPromotionArgs,
	IPredictionChallengeReportData,
	IPredictionChallengeReportTransformedData,
} from './type'
import { transformMatchData } from './utils'
import { PermissionInterface } from '../../type'

interface IPredictChallengeReportTableProps {
	loading: boolean
	predictionChallengeReportList: IPredictionChallengeReportData[]
	timeZoneUtcOffset: number
	addPermission?: PermissionInterface
	onClaimPrediction: ({
		bonusCode,
		matchId,
		custIdList,
		currencyId,
	}: IClaimPredictPromotionArgs) => void
}

const PredictChallengeReportTable = ({
	loading,
	predictionChallengeReportList,
	timeZoneUtcOffset,
	addPermission,
	onClaimPrediction,
}: IPredictChallengeReportTableProps) => {
	const { t } = useTranslation()
	const transformedData: IPredictionChallengeReportTransformedData[] =
		transformMatchData(predictionChallengeReportList)

	const baseColumns: any = [
		{
			title: t('Label_BonusCode'),
			key: 'bonusCode',
			width: 300,
			align: 'center' as 'center',
			render: (record: IPredictionChallengeReportTransformedData) => {
				const { bonusCode, battleTime, homeTeamName, awayTeamName } =
					record || {}
				const battleTimeFormat = battleTime
					? dayjs(battleTime)
							.utcOffset(timeZoneUtcOffset)
							.format('YYYY-MM-DD  HH:mm:ss')
					: '-'

				return (
					<Typography.Paragraph style={{ margin: 0, textAlign: 'center' }}>
						<Typography.Text style={{ fontWeight: 'bold' }}>
							{bonusCode}
						</Typography.Text>
						<br />
						<Typography.Text type='secondary'>
							{`${battleTimeFormat} ${homeTeamName}-vs-${awayTeamName}`}
						</Typography.Text>
					</Typography.Paragraph>
				)
			},
		},
		{
			title: t('Label_UserName'),
			key: 'userName',
			dataIndex: 'userName',
			align: 'center' as 'center',
			width: 80,
			render: (userName: string) => userName ?? '-',
		},
		{
			title: t('Label_Predict_Time'),
			key: 'predictTime',
			dataIndex: 'predictTime',
			align: 'center' as 'center',
			width: 80,
			render: (predictTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{predictTime
						? dayjs(predictTime)
								.utcOffset(timeZoneUtcOffset)
								.format('YYYY-MM-DD  HH:mm:ss')
						: '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Predict_Match_Status'),
			key: 'predictMatchStatus',
			width: 80,
			align: 'center' as 'center',
			render: (record: IPredictionChallengeReportTransformedData) => {
				const { custAwayScore, custHomeScore } = record || {}
				const displayPredictMatchStatus =
					!isNumber(custAwayScore) || !isNumber(custHomeScore)
						? '-'
						: `${custHomeScore}-${custAwayScore}`
				return (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
						{displayPredictMatchStatus}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_Predict_Status'),
			key: 'predictStatus',
			dataIndex: 'predictStatus',
			align: 'center' as 'center',
			width: 80,
			render: (predictStatus: number) => {
				const displayName = find(
					PREDICT_STATUS_OPTIONS,
					predictStatusOption => predictStatusOption.value === predictStatus
				)?.displayName

				return (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
						{displayName ? t(displayName) : '-'}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_DepositAmount'),
			key: 'depositAmount',
			dataIndex: 'depositAmount',
			width: 80,
			align: 'center' as 'center',
			render: (depositAmount: number) =>
				depositAmount ? numFormatToDigits(depositAmount) : 0,
		},
		{
			title: t('Label_DepositCountAchieved'),
			key: 'depositCount',
			dataIndex: 'depositCount',
			width: 80,
			align: 'center' as 'center',
			render: (depositCount: number) =>
				depositCount ? numFormatToDigits(depositCount) : 0,
		},
		{
			title: t('Label_Awardee'),
			key: 'isPayout',
			width: 80,
			align: 'center' as 'center',
			render: (record: IPredictionChallengeReportTransformedData) => {
				const {
					isPayout,
					custId,
					matchId,
					bonusCodeByClaim,
					currencyId,
					predictStatus,
				} = record || {}

				return isBoolean(isPayout) ? (
					<Space size='middle'>
						<Popconfirm
							title={t('Label_SureToProcess')}
							disabled={!addPermission?.canUse}
							onConfirm={() =>
								onClaimPrediction({
									custIdList: [custId ?? 0],
									matchId,
									bonusCode: bonusCodeByClaim ?? '',
									currencyId,
								})
							}
						>
							<Checkbox
								disabled={isPayout || predictStatus === PredictStatusEnum.Loss}
								checked={isPayout}
							/>
						</Popconfirm>
					</Space>
				) : (
					'-'
				)
			},
		},
		{
			title: t('Label_Predict_Reward'),
			key: 'bonus',
			dataIndex: 'bonus',
			width: 80,
			align: 'center' as 'center',
			render: (bonus: number) => (bonus ? numFormatToDigits(bonus) : 0),
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={baseColumns}
				dataSource={transformedData}
				expandable={{ expandRowByClick: false }}
			/>
		</LayoutContent.Card>
	)
}

export default PredictChallengeReportTable
