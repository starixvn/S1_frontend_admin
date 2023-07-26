import { Form, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { useAuth } from 'common/hooks'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import {
	useGetSlotGameListQuery,
	useGetSlotTpListQuery,
} from 'common/service/allDataApi'
import {
	useLazyGetRebateExcludeGameListQuery,
	useSetRebateExcludeGameMutation,
} from 'features/rebateExcludeGame/api'
import { RebateExcludeGameFilter } from 'features/rebateExcludeGame/RebateExcludeGameFilter'
import { useEffect, useState } from 'react'
import { RebateExcludeGameForm } from 'features/rebateExcludeGame/RebateExcludeGameForm'
import { IEditForm } from 'features/rebateExcludeGame/type'
import {
	rebateExcludeGameReqConverter,
	rebateExcludeGameResConverter,
} from 'features/rebateExcludeGame/utils'

const RebateExcludeGame = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [filterForm] = Form.useForm<{ currencyId: number }>()
	const [editForm] = Form.useForm<IEditForm>()
	const [isEdit, setIsEdit] = useState(false)

	const {
		data: { data: slotTpList = [] } = {},
		isLoading: isSlotTpListLoading,
	} = useGetSlotTpListQuery(null)

	const {
		data: { data: slotGameList = [] } = {},
		isLoading: isSlotGameListLoading,
	} = useGetSlotGameListQuery(null)

	const [
		getRebateExcludeGameList,
		{ isFetching: isGetRebateExcludeGameListLoading },
	] = useLazyGetRebateExcludeGameListQuery()

	const [setRebateExcludeGame, { isLoading: isSetRebateExcludeGameLoading }] =
		useSetRebateExcludeGameMutation()

	const handleSearch = async () => {
		const { currencyId } = filterForm.getFieldsValue()
		// 每次搜尋就先清空，確保後面行為正確
		editForm.resetFields()
		try {
			const { data: rebateExcludeGameList = [] } =
				await getRebateExcludeGameList({
					siteId,
					currencyId,
				}).unwrap()

			// 有資料才做
			if (rebateExcludeGameList.length > 0) {
				const formValue = rebateExcludeGameResConverter(rebateExcludeGameList)
				editForm.setFieldsValue(formValue)
			}
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSaved = async () => {
		const { selectedGames } = await editForm.validateFields()
		const { currencyId } = filterForm.getFieldsValue()
		const excludeGameList = rebateExcludeGameReqConverter({
			data: selectedGames,
			slotGameList,
		})
		try {
			await setRebateExcludeGame({
				siteId,
				currencyId,
				excludeGameList,
			}).unwrap()
			setIsEdit(false)
			await handleSearch()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading =
		isGetRebateExcludeGameListLoading || isSetRebateExcludeGameLoading

	const initValueLoading = isSlotGameListLoading || isSlotTpListLoading

	useEffect(() => {
		handleSearch()
	}, [])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<RebateExcludeGameFilter
				loading={isGetRebateExcludeGameListLoading}
				form={filterForm}
				currencyListBySite={currencyListBySite}
				onSearch={handleSearch}
				isEdit={isEdit}
			/>
			<RebateExcludeGameForm
				loading={loading}
				initValueLoading={initValueLoading}
				form={editForm}
				slotTpList={slotTpList}
				slotGameList={slotGameList}
				isEdit={isEdit}
			/>
			<AffixButtons>
				<AffixButtons.BackToTop />
				{isEdit ? (
					<>
						<AffixButtons.Close
							onClick={() => {
								// 取消就重搜恢復資料
								setIsEdit(false)
								handleSearch()
							}}
						/>
						<AffixButtons.Saved
							disabled={!editPermission?.canUse}
							onClick={handleSaved}
						/>
					</>
				) : (
					<AffixButtons.Edit
						disabled={!editPermission?.canUse}
						onClick={() => setIsEdit(true)}
					/>
				)}
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default RebateExcludeGame
