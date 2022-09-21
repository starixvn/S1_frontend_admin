import { LayoutContent } from 'app/pages/layout'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
	HotEventMethodEnum,
	IGetSportLeaguesResponse,
	IGetSportLeaguesTitleResponse,
} from 'features/hotEventManagement/type'
import { Form, message } from 'antd'
import {
	useCreateHotEventMutation,
	useGetSportLeaguesQuery,
	useGetSportLeagueTitleQuery,
	useLazyGetHotEventDetailQuery,
	useSetHotEventMutation,
} from 'features/hotEventManagement/api'
import { EditForm } from 'features/hotEventManagement/editHotEvent/EditForm'
import { useEffect } from 'react'
import { useTimeZone } from 'components/TimeZoneSelect'
import { AffixButtons } from 'components/AffixButtons'
import { useAuth } from 'common/hooks'
import { utcFormatter } from 'common/utils'
import moment from 'moment'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'

const EditHotEvent = () => {
	const { t } = useTranslation()
	const { id } = useParams()
	const isEditing = id !== HotEventMethodEnum.Create
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const navigate = useNavigate()
	const [form] = Form.useForm<{
		tpId: number
		gameId: number
		sportLeaguesTitleId: number
		matchId: number
		battleTime: moment.Moment
		startTime: moment.Moment
		endTime: moment.Moment
		homeSportLeaguesId: number
		awaySportLeaguesId: number
		homeTeamNameId: number
		awayTeamNameId: number
	}>()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const { actionPermissions: { editPermission } = {} } = useAuth()

	const {
		data: { data: sportLeagueTitleList } = {} as IGetSportLeaguesTitleResponse,
		isLoading: isGetSportLeagueTitleLoading,
	} = useGetSportLeagueTitleQuery(null)

	const {
		data: { data: sportLeagueList } = {} as IGetSportLeaguesResponse,
		isLoading: isGetSportLeagueLoading,
	} = useGetSportLeaguesQuery(null)

	const [setHotEvent, { isLoading: isSetHotEventLoading }] =
		useSetHotEventMutation()

	const [getHotEventDetail, { isLoading: isGetHotEventDetailLoading }] =
		useLazyGetHotEventDetailQuery()

	const [createHotEvent, { isLoading: isCreateHotEventLoading }] =
		useCreateHotEventMutation()

	const handleGetHotEventDetail = async () => {
		// 獲取 edit data 與 init form
		if (!id) return
		try {
			const { data: hotEventDetail } = await getHotEventDetail({
				id: Number(id),
			}).unwrap()
			const {
				sportLeaguesTitleId,
				matchId,
				startTime,
				endTime,
				battleTime,
				homeSportLeaguesId,
				awaySportLeaguesId,
				homeTeamNameId,
				awayTeamNameId,
			} = hotEventDetail

			form.setFieldsValue({
				startTime: moment(startTime),
				endTime: moment(endTime),
				battleTime: moment(battleTime),
				sportLeaguesTitleId,
				matchId,
				homeSportLeaguesId,
				awaySportLeaguesId,
				homeTeamNameId,
				awayTeamNameId,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetHotEventDetail = async () => {
		const {
			homeSportLeaguesId,
			awaySportLeaguesId,
			homeTeamNameId,
			awayTeamNameId,
			sportLeaguesTitleId,
			matchId,
			battleTime: rawBattleTime,
			startTime: rawStartTime,
			endTime: rawEndTime,
		} = await form.validateFields()
		const battleTime = utcFormatter({
			date: rawBattleTime,
			utcOffset: timeZoneUtcOffset,
		})
		const startTime = utcFormatter({
			date: rawStartTime,
			utcOffset: timeZoneUtcOffset,
		})
		const endTime = utcFormatter({
			date: rawEndTime,
			utcOffset: timeZoneUtcOffset,
		})
		try {
			await setHotEvent({
				id: Number(id),
				matchId,
				homeSportLeaguesId,
				awaySportLeaguesId,
				homeTeamNameId,
				awayTeamNameId,
				sportLeaguesTitleId,
				battleTime,
				startTime,
				endTime,
			}).unwrap()
			message.success(t('System.Label_Success'))
			navigate(-1)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleCreateHotEventDetail = async () => {
		const {
			battleTime: rawBattleTime,
			startTime: rawStartTime,
			endTime: rawEndTime,
			...rest
		} = await form.validateFields()
		const battleTime = utcFormatter({
			date: rawBattleTime,
			utcOffset: timeZoneUtcOffset,
		})
		const startTime = utcFormatter({
			date: rawStartTime,
			utcOffset: timeZoneUtcOffset,
		})
		const endTime = utcFormatter({
			date: rawEndTime,
			utcOffset: timeZoneUtcOffset,
		})
		try {
			await createHotEvent({
				siteId,
				battleTime,
				startTime,
				endTime,
				...rest,
			}).unwrap()
			message.success(t('System.Label_Success'))
			form.resetFields()
			navigate(-1)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading =
		isGetSportLeagueLoading ||
		isGetSportLeagueTitleLoading ||
		isGetHotEventDetailLoading ||
		isSetHotEventLoading ||
		isCreateHotEventLoading

	useEffect(() => {
		if (isEditing) {
			handleGetHotEventDetail()
		}
	}, [isEditing])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title
				title={`${isEditing ? t('Label_Edit') : t('Label_Add')} - ${t(
					'Label_HotEventInfo'
				)}`}
			/>
			<EditForm
				loading={loading}
				form={form}
				sportLeagueTitleList={sportLeagueTitleList}
				sportLeaguesList={sportLeagueList}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTimeZoneChange={onTimeZoneChange}
				isEditing={isEditing}
			/>
			<AffixButtons>
				<AffixButtons.GoBackRoute />
				<AffixButtons.Saved
					disabled={!editPermission?.canUse}
					loading={isSetHotEventLoading || isCreateHotEventLoading}
					onClick={() =>
						isEditing ? handleSetHotEventDetail() : handleCreateHotEventDetail()
					}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default EditHotEvent
