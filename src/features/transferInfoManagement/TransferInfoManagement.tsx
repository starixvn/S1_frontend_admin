import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import {
	useDeleteBankTransferMutation,
	useExportBankTransferListMutation,
	useGetTransferAccountListQuery,
	useGetTransferReasonListQuery,
	useGetTransferTypeListQuery,
	useLazyGetBankTransferListQuery,
} from 'features/transferInfoManagement/api'
import {
	IGetBankTransferListResponse,
	IGetReasonListResponse,
	IGetTransferAccountListResponse,
	IGetTransferTypeResponse,
} from 'features/transferInfoManagement/type'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { TransferInfoManagementFilter } from 'features/transferInfoManagement/TransferInfoManagementFilter'
import { Form, message, TablePaginationConfig } from 'antd'
import { AffixButtons } from 'components/AffixButtons'
import { IGetAgentListResponse } from 'features/bankCardManagement/type'
import { useGetAgentListQuery } from 'features/bankCardManagement/api'
import { useEffect } from 'react'
import moment from 'moment'
import { dateRangeToUtcFormatter } from 'common/utils'
import { isEmpty } from 'lodash'
import { TransferInfoManagementTable } from 'features/transferInfoManagement/TransferInfoManagementTable'
import download from 'downloadjs'
import { useNavigate } from 'react-router-dom'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { TransferInfoMethodEnum } from 'features/transferInfoManagement/constants'

const TransferInfoManagement = ({
	pageTitle,
}: {
	pageTitle?: string
}): JSX.Element => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const navigate = useNavigate()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const { actionPermissions: { editPermission, exportExcelPermission } = {} } =
		useAuth()
	const [queryParams, setQueryParams] = useQueryParams()
	const [filterForm] = Form.useForm<{
		dateRange: [moment.Moment, moment.Moment]
		fromCurrencyId: number
		toCurrencyId: number
		transferTypes: number[]
		fromAccountNo: string
		toAccountNo: string
		fromChannel: number
		toChannel: number
		reason: number
		fromAgent: string
		toAgent: string
	}>()

	const {
		data: { data: transferTypeList = [] } = {} as IGetTransferTypeResponse,
		isLoading: isTransferTypeLoading,
	} = useGetTransferTypeListQuery(null)

	const {
		data: { data: reasonList = [] } = {} as IGetReasonListResponse,
		isLoading: isGetReasonListLoading,
	} = useGetTransferReasonListQuery(null)

	const {
		data: { data: transferChannelList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetTransferChannelLoading,
	} = useGetEnumTypeQuery({ enumName: 'TransferChannelEnum' })

	const {
		data: { data: agentList = [] } = {} as IGetAgentListResponse,
		isLoading: isGetAgentListLoading,
	} = useGetAgentListQuery({ siteId })

	const {
		data: { data: accountList = [] } = {} as IGetTransferAccountListResponse,
		isLoading: isGetTransferAccountListLoading,
	} = useGetTransferAccountListQuery({ siteId })

	const [
		getBankTransferList,
		{
			data: {
				data: bankTransferList = [],
				rowCount: bankTransferListTotal = 0,
			} = {} as IGetBankTransferListResponse,
			isFetching: isGetBankTransferListLoading,
		},
	] = useLazyGetBankTransferListQuery()

	const [exportBankTransferList, { isLoading: isExportListLoading }] =
		useExportBankTransferListMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: bankTransferListTotal,
	})

	const [deleteBankTransfer, { isLoading: isDeleteTransferLoading }] =
		useDeleteBankTransferMutation()

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		const {
			dateRange,
			fromCurrencyId,
			toCurrencyId,
			fromChannel,
			toChannel,
			fromAccountNo,
			toAccountNo,
			fromAgent,
			toAgent,
			transferTypes,
			reason,
		} = filterForm.getFieldsValue()

		const [startTime, endTime] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)
		try {
			await getBankTransferList({
				siteId,
				pageNumber: current,
				pageSize,
				fromCurrencyId: fromCurrencyId !== undefined ? fromCurrencyId : null,
				toCurrencyId: toCurrencyId !== undefined ? toCurrencyId : null,
				fromChannel: fromChannel !== undefined ? fromChannel : null,
				toChannel: toChannel !== undefined ? toChannel : null,
				fromAccountNo: fromAccountNo !== undefined ? fromAccountNo : null,
				toAccountNo: toAccountNo !== undefined ? toAccountNo : null,
				fromAgent: fromAgent !== undefined ? fromAgent : null,
				toAgent: toAgent !== undefined ? toAgent : null,
				reason: reason !== undefined ? reason : null,
				transferTypes,
				startTime,
				endTime,
			}).unwrap()
			setQueryParams({
				pageNumber: current,
				pageSize,
				fromCurrencyId,
				toCurrencyId,
				fromChannel,
				toChannel,
				fromAccountNo,
				toAccountNo,
				fromAgent,
				toAgent,
				transferTypes,
				reason,
				startTime,
				endTime,
				timeZone: currentTimeZoneUtcOffset,
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

	const handleExport = async () => {
		const {
			dateRange,
			fromCurrencyId,
			toCurrencyId,
			fromChannel,
			toChannel,
			fromAccountNo,
			toAccountNo,
			fromAgent,
			toAgent,
			transferTypes,
			reason,
		} = filterForm.getFieldsValue()
		const [startTime, endTime] = dateRangeToUtcFormatter(
			dateRange,
			timeZoneUtcOffset
		)
		try {
			const blob = await exportBankTransferList({
				fromCurrencyId: fromCurrencyId !== undefined ? fromCurrencyId : null,
				toCurrencyId: toCurrencyId !== undefined ? toCurrencyId : null,
				fromChannel: fromChannel !== undefined ? fromChannel : null,
				toChannel: toChannel !== undefined ? toChannel : null,
				fromAccountNo: fromAccountNo !== undefined ? fromAccountNo : null,
				toAccountNo: toAccountNo !== undefined ? toAccountNo : null,
				fromAgent: fromAgent !== undefined ? fromAgent : null,
				toAgent: toAgent !== undefined ? toAgent : null,
				reason: reason !== undefined ? reason : null,
				transferTypes,
				startTime,
				endTime,
				siteId,
			}).unwrap()
			download(
				blob,
				`ExportTransferInfoList_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDeleteTransfer = async (transferId: string) => {
		try {
			const response = await deleteBankTransfer({ transferId }).unwrap()
			message.success(response?.message || t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (!isTransferTypeLoading) {
			filterForm.setFieldsValue({
				transferTypes: transferTypeList?.map(type => type.value),
			})
		}
	}, [isTransferTypeLoading])

	useEffect(() => {
		// 初始化
		const init = () => {
			if (isEmpty(queryParams)) return
			const {
				pageNumber,
				pageSize,
				fromCurrencyId,
				toCurrencyId,
				fromChannel,
				toChannel,
				fromAccountNo,
				toAccountNo,
				fromAgent,
				toAgent,
				transferTypes,
				reason,
				startTime,
				endTime,
				timeZone,
			} = queryParams
			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				dateRange: [moment(startTime), moment(endTime)],
				transferTypes: transferTypes.map((type: string) => Number(type)),
				fromCurrencyId: fromCurrencyId ? Number(fromCurrencyId) : undefined,
				toCurrencyId: toCurrencyId ? Number(toCurrencyId) : undefined,
				fromChannel: fromChannel ? Number(fromChannel) : undefined,
				toChannel: toChannel ? Number(toChannel) : undefined,
				fromAccountNo,
				toAccountNo,
				fromAgent,
				toAgent,
				reason: reason ? Number(reason) : undefined,
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
		isTransferTypeLoading ||
		isGetReasonListLoading ||
		isGetTransferChannelLoading ||
		isGetAgentListLoading ||
		isGetTransferAccountListLoading ||
		isGetBankTransferListLoading ||
		isDeleteTransferLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<TransferInfoManagementFilter
				loading={loading}
				form={filterForm}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
				timeZoneUtcOffset={timeZoneUtcOffset}
				currencyListBySite={currencyListBySite}
				transferChannelList={transferChannelList}
				transferTypeList={transferTypeList}
				reasonList={reasonList}
				agentList={agentList}
				accountList={accountList}
			/>
			{!isEmpty(queryParams) && (
				<TransferInfoManagementTable
					loading={loading}
					pagination={pagination}
					onTableChange={handleTableChange}
					bankTransferList={bankTransferList}
					transferTypeList={transferTypeList}
					editPermission={editPermission}
					timeZoneUtcOffset={timeZoneUtcOffset}
					transferChannelList={transferChannelList}
					reasonList={reasonList}
					onDelete={handleDeleteTransfer}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={isExportListLoading}
				/>
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					onClick={() =>
						navigate(
							`/${NEW_SITE_PREFIX_URL}/${paths.bankTransfer.sub.transferInfoManagement.root}/${TransferInfoMethodEnum.Create}`
						)
					}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default TransferInfoManagement
