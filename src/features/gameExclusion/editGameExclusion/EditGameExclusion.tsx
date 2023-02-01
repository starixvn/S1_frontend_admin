import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { GameExclusionMethodEnum, ITpGame } from 'features/gameExclusion/type'
import { Form, message, Spin } from 'antd'
import { BasicInfoForm } from 'features/gameExclusion/editGameExclusion/BasicInfoForm'
import { useGetSlotTpListQuery } from 'common/service/allDataApi'
import { AffixButtons } from 'components/AffixButtons'
import { useAuth } from 'common/hooks'
import { useLazyGetGameCasinoByTpIdQuery } from 'common/service/baseDataApi'
import { useEffect, useRef, useState } from 'react'
import { find, includes } from 'lodash'
import { GameInfoForm } from 'features/gameExclusion/editGameExclusion/GameInfoForm'
import { SelectedInfo } from 'features/gameExclusion/editGameExclusion/SelectedInfo'
import {
	useLazyGetGameExclusionByIdQuery,
	useSetGameExclusionMutation,
} from 'features/gameExclusion/api'
import {
	gameExclusionReqConverter,
	gameExclusionResConverter,
} from 'features/gameExclusion/utils'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'

const EditGameExclusion = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { custId } = useParams()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const isEdit = custId !== GameExclusionMethodEnum.add
	const [form] = Form.useForm()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	// 前次資料
	const prevTps = useRef<number[]>([])
	// 當前資料
	const selectedTps = Form.useWatch<number[]>('selectedTp', form)
	// 用來渲染第二部分已選擇的遊戲
	const [selectedTpGames, setSelectedTpGames] = useState<ITpGame[]>([])

	const { data: { data: tpList = [] } = {} } = useGetSlotTpListQuery(null)

	const [getGameExclusionById, { isFetching: isGetGameExclusionByIdLoading }] =
		useLazyGetGameExclusionByIdQuery()

	const [getGameCasinoByTpId, { isFetching: isGetGamesLoading }] =
		useLazyGetGameCasinoByTpIdQuery()

	const [setGameExclusion, { isLoading: isSetGameExclusionLoading }] =
		useSetGameExclusionMutation()

	// 編輯模式初始化資料
	const handleGetEditInfo = async () => {
		if (!custId) return
		try {
			const { data: gameExclusionData } = await getGameExclusionById({
				custId: Number(custId),
			}).unwrap()
			const { userName, disableGames } = gameExclusionData ?? {}
			const { selectedGames, selectedTp } =
				gameExclusionResConverter(disableGames)
			form.setFieldsValue({
				userName,
				selectedTp,
				selectedGames,
			})
		} catch (error) {
			message.error(t((error as Error).message))
		}
	}

	const handleGetGames = async (id: number) => {
		try {
			const { data: tpGames = [] } = await getGameCasinoByTpId({
				tpId: id,
			}).unwrap()

			// 取得 tpName
			const tpName = find(tpList, ({ tpId }) => tpId === id)?.tpName ?? ''
			setSelectedTpGames(prev => {
				return [
					...prev,
					{
						tpId: id,
						tpName,
						tpGames,
					},
				]
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSaved = async () => {
		const { userName, selectedTp, selectedGames } = await form.validateFields()
		const disableTpGame = gameExclusionReqConverter({
			selectedTp,
			selectedGames,
		})
		try {
			await setGameExclusion({ siteId, userName, disableTpGame }).unwrap()
			message.success(t('System.Label_Success'))
			navigate(-1)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		// 控制當 form 表單被異動時要同步的行為，這段不能寫在 onChange 上，因為會有初始化從 api response 填值的情境，不會觸發 onChange
		const handleSyncSelectedTps = () => {
			// 篩出新增的 id
			const newId = selectedTps?.filter(id => !includes(prevTps.current, id))
			// 篩出移除的 id
			const removeId = prevTps.current?.filter(id => !includes(selectedTps, id))
			prevTps.current = selectedTps

			if (newId.length > 0) {
				// 新增 TP 選項
				newId.forEach(id => handleGetGames(id))
			} else if (removeId.length > 0) {
				// 移除取消選取的部分 , 移除該 tp 底下所有已選擇的 games
				form.resetFields([['selectedGames', String(removeId[0]), 'games']])
				setSelectedTpGames(prev =>
					prev.filter(({ tpId }) => tpId !== removeId[0])
				)
			}
		}

		if (selectedTps !== undefined) {
			handleSyncSelectedTps()
		}
	}, [selectedTps])

	useEffect(() => {
		// 編輯模式初始化表單資料
		if (isEdit) {
			handleGetEditInfo()
		}
	}, [isEdit])

	return (
		<Spin spinning={isGetGameExclusionByIdLoading || isSetGameExclusionLoading}>
			<LayoutContent.Main>
				<LayoutContent.Title title={t('Label_DisableUserForGame')} />
				<BasicInfoForm form={form} isEdit={isEdit} tpList={tpList} />

				{selectedTps?.length > 0 && (
					<Form form={form} component={false}>
						<GameInfoForm
							form={form}
							loading={isGetGamesLoading}
							selectedTpGames={selectedTpGames}
						/>
						<SelectedInfo form={form} selectedTpGames={selectedTpGames} />
					</Form>
				)}

				<AffixButtons>
					<AffixButtons.GoBackRoute />
					<AffixButtons.BackToTop />
					<AffixButtons.Saved
						disabled={!editPermission?.canUse}
						onClick={handleSaved}
					/>
				</AffixButtons>
			</LayoutContent.Main>
		</Spin>
	)
}

export default EditGameExclusion
