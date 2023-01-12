import { Form, message, TablePaginationConfig } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import moment from 'moment'
import {
	useGetPaySettingListQuery,
	useLazyGetModifyPaymentChargeFeeListQuery,
	useSubmitPaySettingMutation,
} from 'features/modifyPaymentFeeLog/api'
import { IFilterForm, IModalForm } from 'features/modifyPaymentFeeLog/type'
import ModifyPaymentFeeLogFilter from 'features/modifyPaymentFeeLog/ModifyPaymentFeeLogFilter'
import ModifyPaymentFeeLogTable from 'features/modifyPaymentFeeLog/ModifyPaymentFeeLogTable'
import AddModifyPaymentFeeLogModal from 'features/modifyPaymentFeeLog/AddModifyPaymentFeeLogModal'
import { dateRangeToUtcFormatter } from 'common/utils'
import { AffixButtons } from 'components/AffixButtons'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import { isEmpty } from 'lodash'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'

const ModifyPaymentFeeLog = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { actionPermissions: { addPermission } = {} } = useAuth()
	const [queryParams, setQueryParams] = useQueryParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const {
		timeZoneUtcOffset: modalTimeZoneUtcOffset,
		onTimeZoneChange: onModalTimeZoneChange,
	} = useTimeZone()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [filterForm] = Form.useForm<IFilterForm>()
	const [modalForm] = Form.useForm<IModalForm>()
	const addModifyPaymentFeeLogModal = useModal()

	const [
		getModifyPaymentChargeFeeList,
		{
			data: {
				data: modifyPaymentChargeFeeList = [],
				rowCount: modifyPaymentChargeFeeTotal = 0,
			} = {},
			isFetching: isGetModifyPaymentChargeFeeListFetching,
		},
	] = useLazyGetModifyPaymentChargeFeeListQuery()

	const {
		data: { data: paySettingList = [] } = {},
		isLoading: isGetPaySettingListLoading,
	} = useGetPaySettingListQuery(null)

	const [submitPaySetting, { isLoading: isSubmitPaySettingLoading }] =
		useSubmitPaySettingMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: modifyPaymentChargeFeeTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		const { dateRange } = filterForm.getFieldsValue()
		const [startTime, endTime] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)
		try {
			const args = {
				startTime,
				endTime,
				pageNumber: current,
				pageSize,
			}
			await getModifyPaymentChargeFeeList(args).unwrap()
			setQueryParams({ timezone: currentTimeZoneUtcOffset, ...args })
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
		handleSearch({
			current,
			pageSize,
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}

	const handleAddModifyPaymentFeeLog = async () => {
		const {
			currencyId,
			channelId,
			chargeFeePercentage,
			chargeFeePreCount,
			dateRange,
		} = modalForm.getFieldsValue()
		const [startTime, endTime] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			modalTimeZoneUtcOffset
		)
		try {
			const args = {
				currencyId,
				channelId,
				chargeFeePercentage,
				chargeFeePreCount,
				startTime,
				endTime,
			}
			await submitPaySetting(args).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = () => {
			if (!isEmpty(queryParams)) {
				const { startTime, endTime, timezone, pageNumber, pageSize } =
					queryParams
				onTimeZoneChange(Number(timezone))
				filterForm.setFieldsValue({
					dateRange: [moment(startTime), moment(endTime)],
				})
				handleSearch({
					current: Number(pageNumber),
					pageSize: Number(pageSize),
				})
			}
		}
		init()
	}, [])

	const loading =
		isGetModifyPaymentChargeFeeListFetching ||
		isGetPaySettingListLoading ||
		isSubmitPaySettingLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<ModifyPaymentFeeLogFilter
				form={filterForm}
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
			/>
			<ModifyPaymentFeeLogTable
				loading={loading}
				modifyPaymentChargeFeeList={modifyPaymentChargeFeeList}
				pagination={pagination}
				timeZoneUtcOffset={timeZoneUtcOffset}
				currencyListBySite={currencyListBySite}
				onTableChange={handleTableChange}
			/>
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.Create
					disabled={!addPermission?.canUse}
					loading={loading}
					onClick={() => addModifyPaymentFeeLogModal.onOpen()}
				/>
			</AffixButtons>

			<AddModifyPaymentFeeLogModal
				loading={isSubmitPaySettingLoading}
				form={modalForm}
				paySettingList={paySettingList}
				visible={addModifyPaymentFeeLogModal.visible}
				timeZoneUtcOffset={modalTimeZoneUtcOffset}
				onTimeZoneChange={onModalTimeZoneChange}
				onCancel={addModifyPaymentFeeLogModal.onCancel}
				onFinish={handleAddModifyPaymentFeeLog}
			/>
		</LayoutContent.Main>
	)
}

export default ModifyPaymentFeeLog
