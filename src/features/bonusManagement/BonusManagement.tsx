import { FC, useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { BonusManagementFilter } from 'features/bonusManagement/BonusManagementFilter'
import { useTimeZone } from 'components/TimeZoneSelect'
import { Form, message, TablePaginationConfig } from 'antd'
import {
	useDuplicateBonusMutation,
	useGetPromotionListQuery,
	useLazyGetBonusListQuery,
	useUpdateStatusMutation,
} from 'features/bonusManagement/api'
import {
	IGetBonusListData,
	IGetBonusListResponse,
	IGetPromotionTypeResponse,
	UpdateMethodsEnum,
} from 'features/bonusManagement/type'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import moment from 'moment/moment'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useTranslation } from 'react-i18next'
import { isEmpty, trim } from 'lodash'
import { BonusManagementTable } from 'features/bonusManagement/BonusManagementTable'
import { AffixButtons } from 'components/AffixButtons'
import { useNavigate } from 'react-router-dom'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { DuplicateBonusModal } from 'features/bonusManagement/dupblicateBonusModal/DuplicateBonusModal'

const BonusManagement: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { t } = useTranslation()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const navigate = useNavigate()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const [filterForm] = Form.useForm<{
		dateRange: [moment.Moment, moment.Moment]
		currencyIds: number[]
		promotionTypes: number[]
		bonusCode: string
		isSpecial: boolean
		status: number
		device: number
	}>()

	const [duplicateForm] = Form.useForm<{
		newBonusCode: string
		newSpecialCode: string
	}>()
	const duplicateModal = useModal()
	// 供 duplicateModal 使用的紀錄資料
	const [duplicateRecord, setDuplicateRecord] = useState<
		IGetBonusListData | undefined
	>(undefined)

	const {
		data: { data: promotionListData } = {} as IGetPromotionTypeResponse,
		isLoading: isGetPromotionListDataLoading,
	} = useGetPromotionListQuery(null)

	const [
		getBonusList,
		{
			data: {
				data: bonusListData,
				rowCount: bonusListTotal = 0,
			} = {} as IGetBonusListResponse,
			isFetching: isGetBonusListLoading,
		},
	] = useLazyGetBonusListQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: bonusListTotal,
	})

	const [updateStatus, { isLoading: isUpdateStatusLoading }] =
		useUpdateStatusMutation()

	const [duplicateBonus, { isLoading: isDuplicateBonusLoading }] =
		useDuplicateBonusMutation()

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		const { dateRange, bonusCode, ...args } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)
		try {
			await getBonusList({
				startDate,
				endDate,
				pageNumber: current,
				pageSize,
				bonusCode: isEmpty(bonusCode) ? null : trim(bonusCode),
				...args,
			}).unwrap()

			setQueryParams({
				startDate,
				endDate,
				pageNumber: current,
				pageSize,
				timeZone: currentTimeZoneUtcOffset,
				// 測試時複製貼上若有複製到空白就會無法正確搜尋 , 故在送出時先把前後空白區塊清除
				bonusCode: isEmpty(bonusCode) ? null : trim(bonusCode),
				...args,
			})
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination
		await handleSearch({
			current,
			pageSize,
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}

	const handleUpdateStatus = async ({
		bonusCode,
		status,
	}: {
		bonusCode: string
		status: boolean
	}) => {
		try {
			const response = await updateStatus({
				siteId,
				bonusCode,
				status: Number(status),
			}).unwrap()
			message.success(response?.message || t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleCopiedClicked = (record: IGetBonusListData) => {
		setDuplicateRecord(record)
		duplicateModal.onOpen()
	}

	const handleDuplicateBonus = async () => {
		if (!duplicateRecord) return
		// 有可能不需要填 specialCode
		const { newBonusCode, newSpecialCode = '' } =
			await duplicateForm.validateFields()
		const { bonusCode, isSpecial } = duplicateRecord
		try {
			const response = await duplicateBonus({
				siteId,
				newBonusCode,
				newSpecialCode,
				bonusCode,
				isSpecial,
			}).unwrap()
			duplicateForm.resetFields()
			message.success(response?.message || t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (!isGetPromotionListDataLoading) {
			filterForm.setFieldsValue({
				promotionTypes: promotionListData.map(promotion => promotion.type),
			})
		}
	}, [isGetPromotionListDataLoading])

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams)) return
			const {
				startDate,
				endDate,
				pageNumber,
				pageSize,
				timeZone,
				currencyIds,
				promotionTypes,
				bonusCode = '',
				isSpecial,
				status = 0,
				device = 0,
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				bonusCode,
				currencyIds: currencyIds.map((currency: string) => Number(currency)),
				promotionTypes: promotionTypes.map((promotion: string) =>
					Number(promotion)
				),
				isSpecial: Boolean(isSpecial),
				status: Number(status),
				device: Number(device),
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
		init()
	}, [])

	const loading =
		isGetBonusListLoading ||
		isGetPromotionListDataLoading ||
		isUpdateStatusLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<BonusManagementFilter
				loading={loading}
				form={filterForm}
				currencyListBySite={currencyListBySite}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
				timeZoneUtcOffset={timeZoneUtcOffset}
				promotionList={promotionListData}
			/>
			{!isEmpty(queryParams) && (
				<BonusManagementTable
					loading={loading}
					pagination={pagination}
					onTableChange={handleTableChange}
					bonusList={bonusListData}
					timeZoneUtcOffset={timeZoneUtcOffset}
					editPermission={editPermission}
					promotionList={promotionListData}
					onUpdateStatus={handleUpdateStatus}
					onCopiedClicked={handleCopiedClicked}
				/>
			)}
			<DuplicateBonusModal
				loading={isDuplicateBonusLoading}
				visible={duplicateModal.visible}
				onFinish={handleDuplicateBonus}
				onCancel={() => {
					duplicateModal.onCancel()
					setDuplicateRecord(undefined)
				}}
				form={duplicateForm}
				promotionList={promotionListData}
				duplicateRecord={duplicateRecord}
			/>
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					onClick={() => {
						navigate(
							`/${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.bonusManagement.root}/${UpdateMethodsEnum.create}`
						)
					}}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default BonusManagement
