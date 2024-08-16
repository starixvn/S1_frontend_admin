import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { Form, message } from 'antd'
import { isEmpty } from 'lodash'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { AffixButtons } from 'components/AffixButtons'
import EventRestrictionListFilter from 'features/eventRestrictionList/EventRestrictionListFilter'
import EventRestrictionListTable from 'features/eventRestrictionList/EventRestrictionListTable'
import AddEventRestrictionModal from 'features/eventRestrictionList/AddEventRestrictionModal'

import type {
	IFilterForm,
	IAddForm,
	IDelEventRestrictionArgs,
	TGetEventRestrictionListResponse,
	ISetEventRestrictionArgs,
} from 'features/eventRestrictionList/type'
import { useModal, useQueryParams, useAuth } from 'common/hooks'
import {
	useLazyGetEventRestrictionListQuery,
	useSetEventRestrictionMutation,
	useDelEventRestrictionMutation,
} from 'features/eventRestrictionList/api'

const EventRestrictionList = ({ pageTitle }: { pageTitle?: string }) => {
	/**  ======= hooks ======= */

	/** 編輯權限 */
	const { actionPermissions: { editPermission } = {} } = useAuth()

	const { t } = useTranslation()

	const { siteId } = useAppSelector(selectUserSite) ?? {}

	/** 彈窗 */
	const addEventRestrictionModal = useModal()

	const [queryParams, setQueryParams] = useQueryParams()

	const [filterForm] = Form.useForm<IFilterForm>()

	const [addForm] = Form.useForm<IAddForm>()

	/**  ======= API ======= */

	// 刪除當前欄位資料
	const [delEventRestriction, { isLoading: isDelEventRestrictionLoading }] =
		useDelEventRestrictionMutation()

	// 新增資料當前欄位資料
	const [setEventRestriction, { isLoading: isSetEventRestrictionLoading }] =
		useSetEventRestrictionMutation()

	// 取得所有欄位資料
	const [
		getEventRestrictionList,
		{
			data: {
				data: eventRestrictionList = [],
			} = {} as TGetEventRestrictionListResponse,
			isFetching: isGetEventRestrictionListLoading,
		},
	] = useLazyGetEventRestrictionListQuery()

	/**  ======= 常數 ======= */

	/** 加載狀態 */
	const loading =
		isDelEventRestrictionLoading ||
		isSetEventRestrictionLoading ||
		isGetEventRestrictionListLoading

	/**  ======= 函數 ======= */

	/** 新增欄位表
	 *  @param args api 參數 */
	const handleCreateEventRestriction = async (
		args: ISetEventRestrictionArgs
	) => {
		try {
			await setEventRestriction(args).unwrap()
			addEventRestrictionModal.onCancel()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	/** 取得當前搜尋的資料
	 *  @param args api 參數 */
	const handleSearch = async (args: {
		currencyId: number
		userName: string | null
	}) => {
		if (!siteId) return

		try {
			await getEventRestrictionList({ ...args, siteId }).unwrap()
			setQueryParams({ ...args })
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	/** 刪除當前欄位
	 *  @param args api 參數 */
	const handleDelete = async (args: IDelEventRestrictionArgs) => {
		try {
			await delEventRestriction(args).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	/** 初始化 */
	useEffect(() => {
		const init = async () => {
			const { currencyId, userName } = queryParams

			// UserName 參數如果是 null (代表沒有打任何字) 存 query 上會導致 query 抓不到 userName 的值
			// 如果抓不到就重新賦值為 null，如果有值就用 query 原本的值
			const newUserName = userName ?? null

			filterForm.setFieldsValue({
				currencyId: Number(currencyId),
				userName: newUserName,
			})

			handleSearch({
				currencyId: Number(currencyId),
				userName: newUserName,
			})
		}
		if (!isEmpty(queryParams)) init()
	}, [])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<EventRestrictionListFilter
				form={filterForm}
				loading={loading}
				handleSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<EventRestrictionListTable
					eventRestrictionList={eventRestrictionList}
					editPermission={editPermission}
					loading={loading}
					handleDelete={handleDelete}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					loading={loading}
					onClick={addEventRestrictionModal.onOpen}
				/>
			</AffixButtons>
			<AddEventRestrictionModal
				form={addForm}
				loading={loading}
				visible={addEventRestrictionModal.visible}
				onCancel={addEventRestrictionModal.onCancel}
				handleCreateEventRestriction={handleCreateEventRestriction}
			/>
		</LayoutContent.Main>
	)
}

export default EventRestrictionList
