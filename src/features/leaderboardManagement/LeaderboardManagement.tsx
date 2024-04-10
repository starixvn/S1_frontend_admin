import { useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'common/hooks'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { Form, message, Col, Row } from 'antd'
import {
	useGetLeaderboardPointCalculationQuery,
	useGetLeaderboardRankingBonusQuery,
	useSetLeaderboardPointCalculationMutation,
	useSetLeaderboardRankingBonusMutation,
	useGetLeaderboardTagExcludeListQuery,
	useSetLeaderboardTagExcludeListMutation,
} from 'features/leaderboardManagement/api'
import { SiteIds } from 'app/constants/siteIds'
import { CalculationForm } from 'features/leaderboardManagement/CalculationForm'
import {
	ILeaderboardPointCalculationData,
	ILeaderboardTagExcludeData,
	IRankingData,
} from 'features/leaderboardManagement/type'
import { RankingBonusTab } from 'features/leaderboardManagement/RankingBonusTab'
import { isPositiveInteger } from 'features/leaderboardManagement/utils'
import TaggingRestrictInput from 'features/leaderboardManagement/TaggingRestrictInput'
import { useGetAllTagQuery } from 'features/memberAdministrationList/api'
import { isEmpty } from 'lodash'

const LeaderboardManagement = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [calculationForm] = Form.useForm<ILeaderboardPointCalculationData>()
	const [calculationKey, setCalculationKey] = useState<number | undefined>(
		undefined
	)
	const [excludeForm] = Form.useForm<{ tagsExclude: number[] }>()

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

	const {
		data: {
			data: leaderboardTagExcludeObject = {} as ILeaderboardTagExcludeData,
		} = {},
		isFetching: isGetLeaderboardTagExcludeListFetching,
	} = useGetLeaderboardTagExcludeListQuery(
		{
			siteId,
		},
		{
			skip: !siteId,
		}
	)

	const { data: { data: tagList = [] } = {} } = useGetAllTagQuery()

	const [
		setLeaderboardPointCalculation,
		{ isLoading: isSetLeaderboardPointCalculationLoading },
	] = useSetLeaderboardPointCalculationMutation()

	const [
		setLeaderboardRankingBonus,
		{ isLoading: isSetLeaderboardRankingBonusLoading },
	] = useSetLeaderboardRankingBonusMutation()

	const [
		setLeaderboardTagExcludeList,
		{ isLoading: isSetLeaderboardTagExcludeListLoading },
	] = useSetLeaderboardTagExcludeListMutation()

	const handleUpdateCalculation = async (
		record: ILeaderboardPointCalculationData
	) => {
		if (!siteId) return

		const { status, sportTurnOver, slotTurnOver, liveCasinoTurnOver } =
			await calculationForm.validateFields()
		const { currencyId } = calculationForm.getFieldsValue(true)
		const {
			status: rawStatus,
			sportTurnOver: rawSportTurnOver,
			slotTurnOver: rawSlotTurnOver,
			liveCasinoTurnOver: rawLiveCasinoTurnOver,
		} = record

		const before = {
			status: rawStatus,
			sportTurnOver: rawSportTurnOver,
			slotTurnOver: rawSlotTurnOver,
			liveCasinoTurnOver: rawLiveCasinoTurnOver,
		}

		const after = {
			status: Number(status),
			sportTurnOver,
			slotTurnOver,
			liveCasinoTurnOver,
		}

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
				currencyId,
				before,
				after,
			}).unwrap()
			message.success(t('System.Label_Success'))
			setCalculationKey(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleUpdateRankingForm = async ({
		currencyId,
		record,
	}: {
		currencyId: number
		record: IRankingData
	}) => {
		if (!siteId) return
		const { bonus, minPoint } = await rankingForm.validateFields()
		const { ranking } = rankingForm.getFieldsValue(true)

		const { bonus: rawBonus, minPoint: rawMinPoint } = record

		// 非 >= 1 的正整數不給送出
		if (!isPositiveInteger(bonus) || !isPositiveInteger(minPoint)) {
			message.error(t('Label_PositiveIntegerError'))
			return
		}

		const before = {
			bonus: rawBonus,
			minPoint: rawMinPoint,
			ranking,
		}

		const after = {
			bonus,
			minPoint,
			ranking,
		}

		try {
			await setLeaderboardRankingBonus({
				siteId,
				currencyId,
				before,
				after,
			}).unwrap()
			message.success(t('System.Label_Success'))
			setRankingFormKey(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleUpdateExcludeTagForm = async () => {
		if (!siteId) return
		const { tagsExclude: tagsExcludeFormData } =
			await excludeForm.getFieldsValue(true)
		const { tagsExclude } = leaderboardTagExcludeObject || {}
		const before = {
			tagExcludeList: isEmpty(tagsExclude) ? [] : tagsExclude,
		}

		const after = {
			tagExcludeList: tagsExcludeFormData,
		}

		try {
			await setLeaderboardTagExcludeList({
				siteId,
				before,
				after,
			}).unwrap()
			message.success(t('System.Label_Success'))
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

	const tagExcludeListLoading =
		isGetLeaderboardTagExcludeListFetching ||
		isSetLeaderboardTagExcludeListLoading

	useEffect(() => {
		if (!isEmpty(leaderboardTagExcludeObject)) {
			excludeForm.setFieldsValue({
				tagsExclude: leaderboardTagExcludeObject?.tagsExclude,
			})
		}
	}, [isGetLeaderboardTagExcludeListFetching])

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

			<Row gutter={16}>
				<Col span={14}>
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
				</Col>
				<Col span={10}>
					<TaggingRestrictInput
						isLoading={tagExcludeListLoading}
						form={excludeForm}
						tagList={tagList}
						handleUpdateExcludeTagForm={handleUpdateExcludeTagForm}
					/>
				</Col>
			</Row>
		</LayoutContent.Main>
	)
}

export default LeaderboardManagement
