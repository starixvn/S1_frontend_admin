import { Form, message, TablePaginationConfig } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import {
	IAddForm,
	IFilterForm,
	IGetBannerListData,
	IGetBannerListResponse,
	IGetBannerResponse,
} from 'features/bannerManagement/type'
import { StatusEnum } from 'features/bannerManagement/constants'
import { head, includes, isEmpty } from 'lodash'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { useAppSelector } from 'app/store'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTimeZone } from 'components/TimeZoneSelect'
import { withOutSiteIdParams } from 'common/utils'
import { AffixButtons } from 'components/AffixButtons'
import {
	useDeleteBannerMutation,
	useLazyGetBannerListQuery,
	useLazyGetBannerQuery,
	useUpdateStatusMutation,
} from 'features/bannerManagement/api'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import BannerManagementFilter from 'features/bannerManagement/BannerManagementFilter'
import BannerManagementTable from 'features/bannerManagement/BannerManagementTable'
import BannerModal from 'features/bannerManagement/BannerModal'

interface IBannerManagementProps {
	pageTitle?: string
}

const BannerManagement = ({ pageTitle }: IBannerManagementProps) => {
	const [filterForm] = Form.useForm<IFilterForm>()
	const [addForm] = Form.useForm<IAddForm>()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const { t } = useTranslation()
	const [queryParams, setQueryParams] = useQueryParams()
	const { timeZoneUtcOffset } = useTimeZone()
	const addBannerModal = useModal()

	const paramCurrencyId: number = Number(queryParams?.currencyId)
	const [currencyId, setCurrencyId] = useState<number>(() => {
		const currencyIds = currencyListBySite.map(item => item.currencyId)
		if (includes(currencyIds, paramCurrencyId)) return paramCurrencyId
		return Number(head(currencyListBySite)?.currencyId) ?? undefined
	})
	const [isEditing, setIsEditing] = useState<boolean>(false)

	const [
		getBannerList,
		{
			data: {
				data: bannerList = [],
				rowCount: bannerListTotal = 0,
			} = {} as IGetBannerListResponse,
			isFetching: isGetBannerListFetching,
		},
	] = useLazyGetBannerListQuery()

	const [
		getBanner,
		{
			data: { data: editBannerData } = {} as IGetBannerResponse,
			isFetching: isGetBannerFetching,
		},
	] = useLazyGetBannerQuery()

	const {
		data: { data: bannerTypeList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetBannerTypeListLoading,
	} = useGetEnumTypeQuery({ enumName: 'BannerTypeEnum' })

	const {
		data: { data: bannerActionModeList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetBannerActionModeListLoading,
	} = useGetEnumTypeQuery({ enumName: 'BannerActionModeEnum' })

	const {
		data: { data: showStatusList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetShowStatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'ShowStatusEnum' })

	const [deleteBanner, { isLoading: isDeleteBannerLoading }] =
		useDeleteBannerMutation()

	const [updateStatus, { isLoading: isUpdateStatusLoading }] =
		useUpdateStatusMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: bannerListTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!siteId) return
		const { bannerTypes, statuses } = filterForm.getFieldsValue()

		const args = {
			siteId,
			currencyId,
			bannerTypes,
			statuses,
			pageNumber: current,
			pageSize,
		}
		try {
			await getBannerList(args).unwrap()
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

	const handleDelete = async (bannerName: string) => {
		if (!siteId) return
		const args = {
			siteId,
			currencyId,
			bannerName,
		}
		try {
			await deleteBanner(args).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleEditing = async ({ bannerName }: IGetBannerListData) => {
		if (!siteId) return
		const args = {
			siteId,
			currencyId,
			bannerName,
		}
		try {
			await getBanner(args).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
		setIsEditing(true)
		addBannerModal.onOpen()
	}

	const handleStatusChange = async ({
		status,
		bannerName,
	}: IGetBannerListData) => {
		if (!siteId) return
		const args = {
			siteId,
			status: status ? StatusEnum.Inactive : StatusEnum.Active,
			bannerName,
		}
		try {
			await updateStatus(args).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleCloseModal = () => {
		addBannerModal.onCancel()
		setIsEditing(false)
	}

	useEffect(() => {
		const init = () => {
			if (isEmpty(withOutSiteIdParams(queryParams))) return

			const { bannerTypes, statuses, pageNumber, pageSize } = queryParams
			filterForm.setFieldsValue({
				bannerTypes: bannerTypes?.map((type: string) => Number(type)),
				statuses: statuses?.map((status: string) => Number(status)),
			})
			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
			})
		}
		init()
	}, [])

	useEffect(() => {
		if (
			!isGetBannerTypeListLoading &&
			isEmpty(withOutSiteIdParams(queryParams))
		) {
			filterForm.setFieldsValue({
				bannerTypes: bannerTypeList.map(({ value }) => value),
			})
		}
	}, [isGetBannerTypeListLoading])

	const loading =
		isGetBannerListFetching ||
		isGetBannerTypeListLoading ||
		isGetBannerActionModeListLoading ||
		isGetShowStatusListLoading ||
		isDeleteBannerLoading ||
		isUpdateStatusLoading ||
		isGetBannerFetching

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<BannerManagementFilter
				filterForm={filterForm}
				loading={loading}
				currencyId={currencyId}
				bannerTypeList={bannerTypeList}
				setCurrencyId={setCurrencyId}
				setQueryParams={setQueryParams}
				onSearch={handleSearch}
			/>
			{!isEmpty(withOutSiteIdParams(queryParams)) && (
				<BannerManagementTable
					loading={loading}
					pagination={pagination}
					timeZoneUtcOffset={timeZoneUtcOffset}
					editPermission={editPermission}
					bannerTypeList={bannerTypeList}
					bannerActionModeList={bannerActionModeList}
					showStatusList={showStatusList}
					bannerList={bannerList}
					onTableChange={handleTableChange}
					onEditing={handleEditing}
					onDelete={handleDelete}
					onStatusChange={handleStatusChange}
				/>
			)}
			{addBannerModal.visible && (
				<BannerModal
					form={addForm}
					loading={loading}
					visible={addBannerModal.visible}
					currencyListBySite={currencyListBySite}
					bannerTypeList={bannerTypeList}
					showStatusList={showStatusList}
					bannerActionModeList={bannerActionModeList}
					currencyId={currencyId}
					editBannerData={editBannerData}
					isEditing={isEditing}
					onCancel={handleCloseModal}
					onDelete={handleDelete}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.Create
					loading={loading}
					onClick={addBannerModal.onOpen}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default BannerManagement
