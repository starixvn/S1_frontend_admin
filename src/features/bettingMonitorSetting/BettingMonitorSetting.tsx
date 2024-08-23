import { Form, message, TablePaginationConfig } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import {
	IAddForm,
	IEditForm,
	IFilterForm,
	IGetListData,
	IGetListResponse,
	IGetTpGameTypeResponse,
	IGetTpListResponse,
} from 'features/bettingMonitorSetting/type'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useAppSelector } from 'app/store'
import {
	useDeleteBettingMonitorSettingMutation,
	useGetTpGameTypesQuery,
	useGetTpListQuery,
	useLazyGetBettingMonitorListQuery,
	useSetBettingMonitorSettingMutation,
} from 'features/bettingMonitorSetting/api'
import BettingMonitorSettingFilter from 'features/bettingMonitorSetting/BettingMonitorSettingFilter'
import BettingMonitorSettingTable from 'features/bettingMonitorSetting/BettingMonitorSettingTable'
import AddSettingModal from 'features/bettingMonitorSetting/AddSettingModal'
import { AffixButtons } from 'components/AffixButtons'
import { StatusEnum } from 'features/bettingMonitorSetting/constants'

interface IBettingMonitorSettingProps {
	pageTitle?: string
}

const BettingMonitorSetting = ({ pageTitle }: IBettingMonitorSettingProps) => {
	const { t } = useTranslation()
	const { timeZoneUtcOffset } = useTimeZone()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [queryParams, setQueryParams] = useQueryParams()
	const [filterForm] = Form.useForm<IFilterForm>()
	const [editForm] = Form.useForm<IEditForm>()
	const [addForm] = Form.useForm<IAddForm>()
	const filterFormTpIds = Form.useWatch('tpIds', filterForm)
	const addFormTpId = Form.useWatch('tpId', addForm)
	const addSettingModal = useModal()
	const [editingKey, setEditingKey] = useState<IGetListData | undefined>(
		undefined
	)

	const {
		data: { data: tpList = [] } = {} as IGetTpListResponse,
		isLoading: isGetTpListLoading,
	} = useGetTpListQuery(null)

	const {
		data: { data: tpGameList = [] } = {} as IGetTpGameTypeResponse,
		isLoading: isGetTpGameListLoading,
	} = useGetTpGameTypesQuery(null)

	const [
		getBettingMonitorList,
		{
			data: {
				data: bettingMonitorList = [],
				rowCount: bettingMonitorListTotal = 0,
			} = {} as IGetListResponse,
			isFetching: isGetBettingMonitorListFetching,
		},
	] = useLazyGetBettingMonitorListQuery()

	const [setBettingMonitorSetting, { isLoading: isSetBettingLoading }] =
		useSetBettingMonitorSettingMutation()

	const [deleteBettingMonitorSetting, { isLoading: isDelBettingLoading }] =
		useDeleteBettingMonitorSettingMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: bettingMonitorListTotal,
	})

	const filteredTpGameTypeOptions = tpGameList.filter(({ tpId }) =>
		filterFormTpIds?.includes(tpId)
	)

	const addedTpGameTypeOptions = tpGameList.filter(
		({ tpId }) => addFormTpId === tpId
	)

	const handleAddBetting = async (
		frequency: number,
		tpGameType: number,
		tpId: number,
		currencyId: number
	) => {
		if (!siteId) return
		const args = {
			siteId,
			currencyId,
			before: {},
			after: {
				tpId,
				gameType: tpGameType,
				frequency,
				// 預設新增狀態為false
				status: StatusEnum.InActive,
			},
		}
		try {
			await setBettingMonitorSetting(args).unwrap()
			addSettingModal.onCancel()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDeleteBetting = async ({
		currencyId,
		tpId,
		gameType,
	}: IGetListData) => {
		if (!siteId) return
		try {
			const args = {
				siteId,
				currencyId,
				before: {
					tpId,
					gameType,
				},
				after: {},
			}
			await deleteBettingMonitorSetting(args).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!siteId) return
		const {
			currencyIds,
			tpGameTypes: gameTypes,
			tpIds,
		} = filterForm.getFieldsValue()

		const filteredTpGameList =
			tpGameList.filter(({ tpId }) => tpIds?.includes(tpId)) ?? []

		const newCategoryIds: Array<number> = []
		filteredTpGameList.forEach(({ type, categoryId }) => {
			if (gameTypes.includes(type) && !newCategoryIds.includes(categoryId)) {
				newCategoryIds.push(categoryId)
			}
		})

		const args = {
			siteId,
			currencyIds,
			tpIds,
			categoryIds: newCategoryIds,
			gameTypes,
			pageSize,
			pageNumber: current,
		}

		try {
			await getBettingMonitorList(args).unwrap()
			setQueryParams(args)
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const { current, pageSize } = newPagination
		await handleSearch({
			current,
			pageSize,
		})
	}

	const handleSaved = async ({
		currencyId,
		tpId,
		gameType,
		status,
		frequency,
	}: IGetListData) => {
		if (!siteId) return
		const { frequency: formFrequency } = await editForm.validateFields()

		const args = {
			siteId,
			currencyId,
			before: {
				tpId,
				gameType,
				frequency,
				status,
			},
			after: {
				tpId,
				gameType,
				frequency: formFrequency,
				status,
			},
		}
		try {
			await setBettingMonitorSetting(args).unwrap()
			message.success(t('System.Label_Success'))
			setEditingKey(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleStatusChange = async (
		{ currencyId, tpId, gameType, frequency }: IGetListData,
		status: boolean
	) => {
		if (!siteId) return

		const args = {
			siteId,
			currencyId,
			before: {
				tpId,
				gameType,
				frequency,
				status: status ? StatusEnum.InActive : StatusEnum.Active,
			},
			after: {
				tpId,
				gameType,
				frequency,
				status: status ? StatusEnum.Active : StatusEnum.InActive,
			},
		}
		try {
			await setBettingMonitorSetting(args).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams)) {
				filterForm.setFieldsValue({
					tpIds: tpList?.map(({ id }) => id),
					tpGameTypes: tpGameList?.map(({ type }) => type),
				})
				handleSearch({})
			} else {
				const { currencyIds, tpIds, gameTypes, pageNumber, pageSize } =
					queryParams

				filterForm.setFieldsValue({
					currencyIds: currencyIds?.map((categoryId: string) =>
						Number(categoryId)
					),
					tpIds: tpIds?.map((tpId: string) => Number(tpId)),
					tpGameTypes: gameTypes?.map((gameType: string) => Number(gameType)),
				})
				handleSearch({
					current: Number(pageNumber),
					pageSize: Number(pageSize),
				})
			}
		}

		if (!isGetTpGameListLoading && !isGetTpListLoading) {
			init()
		}
	}, [isGetTpGameListLoading, isGetTpListLoading])

	const loading =
		isGetTpListLoading ||
		isGetTpGameListLoading ||
		isGetBettingMonitorListFetching ||
		isDelBettingLoading ||
		isSetBettingLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<BettingMonitorSettingFilter
				form={filterForm}
				loading={loading}
				currencyListBySite={currencyListBySite}
				tpList={tpList}
				tpGameList={filteredTpGameTypeOptions}
				onSearch={handleSearch}
			/>

			{!isEmpty(queryParams) && (
				<BettingMonitorSettingTable
					form={editForm}
					loading={loading}
					pagination={pagination}
					timeZoneUtcOffset={timeZoneUtcOffset}
					editingKey={editingKey}
					editPermission={editPermission}
					bettingMonitorList={bettingMonitorList}
					setEditingKey={setEditingKey}
					onTableChange={handleTableChange}
					onDelete={handleDeleteBetting}
					onSaved={handleSaved}
					onStatusChange={handleStatusChange}
				/>
			)}
			{addSettingModal.visible && (
				<AddSettingModal
					form={addForm}
					visible={addSettingModal.visible}
					loading={loading}
					currencyListBySite={currencyListBySite}
					tpList={tpList}
					tpGameList={addedTpGameTypeOptions}
					onCancel={() => addSettingModal.onCancel()}
					onSubmit={handleAddBetting}
				/>
			)}

			<AffixButtons>
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					onClick={() => addSettingModal.onOpen()}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default BettingMonitorSetting
