import { useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'common/hooks'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { Form, message } from 'antd'
import {
	useGetLeaderboardPointCalculationQuery,
	useGetLeaderboardRankingBonusQuery,
	useSetLeaderboardPointCalculationMutation,
	useSetLeaderboardRankingBonusMutation,
} from 'features/leaderboardManagement/api'
import { SiteIds } from 'app/constants/siteIds'
import { CalculationForm } from 'features/leaderboardManagement/CalculationForm'
import {
	ILeaderboardPointCalculationData,
	IRankingData,
} from 'features/leaderboardManagement/type'
import { RankingBonusTab } from 'features/leaderboardManagement/RankingBonusTab'
import { isPositiveInteger } from 'features/leaderboardManagement/utils'

const LeaderboardManagement = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [calculationForm] = Form.useForm<ILeaderboardPointCalculationData>()
	const [calculationKey, setCalculationKey] = useState<number | undefined>(
		undefined
	)

	const [rankingForm] = Form.useForm<IRankingData>()
	const [rankingFormKey, setRankingFormKey] = useState<string | undefined>(
		undefined
	)

	// 用於是否有任何資料在編輯中，編輯中其他所有可編輯項目會 disable
	const isInEdit = calculationKey !== undefined || rankingFormKey !== undefined

	const {
		data: { data: leaderboardCalculationData = [] } = {},
		isFetching: isGetLeaderboardCalculationFetching,
	} = useGetLeaderboardPointCalculationQuery(
		{
			siteIds: [siteId ?? SiteIds.Nova88],
		},
		{
			skip: !siteId,
		}
	)

	const {
		data: { data: leaderboardRankingBonusData = [] } = {},
		isFetching: isGetLeaderboardRankingBonusFetching,
	} = useGetLeaderboardRankingBonusQuery(
		{
			siteIds: [siteId ?? SiteIds.Nova88],
		},
		{
			skip: !siteId,
		}
	)

	const [
		setLeaderboardPointCalculation,
		{ isLoading: isSetLeaderboardPointCalculationLoading },
	] = useSetLeaderboardPointCalculationMutation()

	const [
		setLeaderboardRankingBonus,
		{ isLoading: isSetLeaderboardRankingBonusLoading },
	] = useSetLeaderboardRankingBonusMutation()

	const handleUpdateCalculation = async () => {
		if (!siteId) return

		const { status, sportTurnOver, slotTurnOver, liveCasinoTurnOver } =
			await calculationForm.validateFields()
		const { currencyId } = calculationForm.getFieldsValue(true)

		// 非 >= 1 的正整數不給送出
		if (
			!isPositiveInteger(sportTurnOver) ||
			!isPositiveInteger(slotTurnOver) ||
			!isPositiveInteger(liveCasinoTurnOver)
		) {
			message.error(t('Label_PositiveIntegerError'))
			return
		}

		try {
			await setLeaderboardPointCalculation({
				siteId,
				status: Number(status),
				currencyId,
				sportTurnOver,
				slotTurnOver,
				liveCasinoTurnOver,
			}).unwrap()
			message.success(t('System.Label_Success'))
			setCalculationKey(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleUpdateRankingForm = async (currencyId: number) => {
		if (!siteId) return
		const { bonus, minPoint } = await rankingForm.validateFields()
		const { ranking } = rankingForm.getFieldsValue(true)

		// 非 >= 1 的正整數不給送出
		if (!isPositiveInteger(bonus) || !isPositiveInteger(minPoint)) {
			message.error(t('Label_PositiveIntegerError'))
			return
		}

		try {
			await setLeaderboardRankingBonus({
				ranking,
				siteId,
				bonus,
				minPoint,
				currencyId,
			}).unwrap()
			message.success(t('System.Label_Success'))
			setRankingFormKey(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const calculationLoading =
		isGetLeaderboardCalculationFetching ||
		isSetLeaderboardPointCalculationLoading

	const rankingBonusLoading =
		isGetLeaderboardRankingBonusFetching || isSetLeaderboardRankingBonusLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<CalculationForm
				isInEdit={isInEdit}
				form={calculationForm}
				loading={calculationLoading}
				editingKey={calculationKey}
				leaderboardCalculationData={leaderboardCalculationData}
				editPermission={editPermission}
				setEditingKey={setCalculationKey}
				onSave={handleUpdateCalculation}
			/>
			<RankingBonusTab
				isInEdit={isInEdit}
				form={rankingForm}
				loading={rankingBonusLoading}
				leaderboardRankingBonusData={leaderboardRankingBonusData}
				editingKey={rankingFormKey}
				setEditingKey={setRankingFormKey}
				onSave={handleUpdateRankingForm}
				editPermission={editPermission}
			/>
		</LayoutContent.Main>
	)
}

export default LeaderboardManagement
