import { FC, useEffect, useState } from 'react'
import { isArray, isEmpty } from 'lodash'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { Form, message, TablePaginationConfig } from 'antd'
import download from 'downloadjs'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { AffixButtons } from 'components/AffixButtons'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	useEditDepositAccountMutation,
	useExportDepositAccountsFileMutation,
	useLazyGetDepositAccountsQuery,
} from './api'
import DepositAccountingFilter from './DepositAccountingFilter'
import DepositAccountingTable from './DepositAccountingTable'
import EditDepositAccountFormModal from './EditDepositAccountFormModal'
import { IGetDepositAccountsResponse } from './type'

const DepositAccounting: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { editPermission, exportExcelPermission } = {} } =
		useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const [form] = Form.useForm()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const editDepositAccountModal = useModal()
	const [editTransId, setEditTransId] = useState<string>('')
	const [editCurrencyId, setEditCurrencyId] = useState<number>()

	const [
		getDepositAccounts,
		{
			data: {
				data: depositAccounts,
				rowCount: paginationTotal = 0,
			} = {} as IGetDepositAccountsResponse,
			isFetching: isDepositAccountsFetching,
		},
	] = useLazyGetDepositAccountsQuery()

	const [pagination, setPagination] = usePagination({ paginationTotal })

	const [editDepositAccount, { isLoading: isEditDepositAccountLoading }] =
		useEditDepositAccountMutation()

	const [
		exportDepositAccountsFile,
		{ isLoading: isExportDepositAccountsFileLoading },
	] = useExportDepositAccountsFileMutation()

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}) => {
		const { dateRange, currencyIds, userName, transId } = form.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)
		try {
			await getDepositAccounts({
				siteIds: siteId ? [siteId] : [],
				startDate,
				endDate,
				currencyIds,
				userName,
				transId,
				pageSize,
				pageNumber: current,
			}).unwrap()

			setQueryParams({
				siteId,
				startDate,
				endDate,
				currencyIds,
				userName,
				transId,
				pageSize,
				current,
				tz: timeZoneUtcOffset,
			})
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleEditDepositAccountModal = async (
		newEditTransId: string,
		newEditCurrencyId: number
	) => {
		setEditTransId(newEditTransId)
		setEditCurrencyId(newEditCurrencyId)
		editDepositAccountModal.onOpen()
	}

	const handleEditDepositAccount = async ({
		transId,
		accountNo,
		memo,
	}: {
		transId: string
		accountNo: string
		memo: string
	}) => {
		try {
			await editDepositAccount({
				transId,
				accountNo,
				memo,
			})

			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		try {
			const { dateRange, currencyIds, userName, transId } =
				form.getFieldsValue()
			const [startDate, endDate] = dateRangeToUtcFormatter(
				dateRange,
				timeZoneUtcOffset
			)

			const blob = await exportDepositAccountsFile({
				siteIds: siteId ? [siteId] : [],
				startDate,
				endDate,
				currencyIds,
				userName,
				transId,
			}).unwrap()

			download(
				blob,
				`ExportDepositAccounts_${moment().format('YYYYMMDDHHmmss')}.xlsx`
			)
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

	const handleChangeCurrency = (newCurrencyIds: number[]) => {
		if (newCurrencyIds.includes(0)) {
			form.setFieldsValue({
				currencyIds: currencyListBySite?.map(item => item.currencyId),
			})
		} else {
			form.setFieldsValue({
				currencyIds: newCurrencyIds,
			})
		}
	}

	useEffect(() => {
		const init = () => {
			const {
				currencyIds,
				userName,
				transId,
				startDate,
				endDate,
				current,
				pageSize,
				tz,
			} = queryParams

			if (tz) {
				onTimeZoneChange(Number(tz))
			}

			form.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				currencyIds: isArray(currencyIds)
					? currencyIds.map((currencyId: string) => Number(currencyId))
					: currencyListBySite?.map(item => item.currencyId),
				userName,
				transId,
			})

			if (!isEmpty(queryParams)) {
				handleSearch({
					current,
					pageSize,
					currentTimeZoneUtcOffset: Number(tz),
				})
			}
		}

		init()
	}, [])

	const loading = isDepositAccountsFetching

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<DepositAccountingFilter
				loading={loading}
				form={form}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
				onChangeCurrency={handleChangeCurrency}
			/>

			{!isEmpty(queryParams) && (
				<DepositAccountingTable
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					depositAccounts={depositAccounts ?? []}
					pagination={pagination}
					editPermission={editPermission}
					onTableChange={handleTableChange}
					onEditDepositAccountModal={handleEditDepositAccountModal}
				/>
			)}

			<AffixButtons>
				<AffixButtons.BackToTop />

				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse}
					onClick={handleExport}
					loading={isExportDepositAccountsFileLoading}
				/>
			</AffixButtons>

			{editDepositAccountModal.visible && (
				<EditDepositAccountFormModal
					editTransId={editTransId}
					editCurrencyId={editCurrencyId}
					loading={isEditDepositAccountLoading}
					modal={editDepositAccountModal}
					onFinish={handleEditDepositAccount}
				/>
			)}
		</LayoutContent.Main>
	)
}

export default DepositAccounting
