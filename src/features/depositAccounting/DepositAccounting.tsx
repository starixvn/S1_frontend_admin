import { FC, useEffect, useState } from 'react'
import _ from 'lodash'
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
import { dateRangeToUtcFormatter, withOutSiteIdParams } from 'common/utils'
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
	const {
		actionPermissions: {
			viewPermission,
			editPermission,
			exportExcelPermission,
		} = {},
	} = useAuth()
	const [queryParams, setQueryParams] = useQueryParams()
	const [form] = Form.useForm()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const userSite = useAppSelector(selectUserSite)
	const editDepositAccountModal = useModal()

	const [editTransId, setEditTransId] = useState<string>('')

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
				siteIds: userSite?.siteId ? [userSite?.siteId] : [],
				startDate,
				endDate,
				currencyIds,
				userName,
				transId,
				pageSize,
				pageNumber: current,
			}).unwrap()

			setQueryParams({
				siteId: userSite?.siteId,
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

	const handleEditDepositAccountModal = async (transId: string) => {
		setEditTransId(transId)
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

			const response = await exportDepositAccountsFile({
				siteIds: userSite?.siteId ? [userSite?.siteId] : [],
				startDate,
				endDate,
				currencyIds,
				userName,
				transId,
			}).unwrap()

			download(
				response.data,
				`ExportDepositAccounts_${moment().format('YYYYMMDDHHmmss')}`
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

	const onChangeCurrency = (newCurrencyIds: number[]) => {
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
		if (!userSite?.siteId) return

		const init = () => {
			if (_.isEmpty(withOutSiteIdParams(queryParams))) {
				onChangeCurrency([0])

				return
			}

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

			onTimeZoneChange(Number(tz))

			form.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				currencyIds: _.isArray(currencyIds)
					? currencyIds.map((currencyId: string) => Number(currencyId))
					: [],
				userName,
				transId,
			})

			handleSearch({
				current: Number(current),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(tz),
			})
		}

		init()
	}, [userSite?.siteId])

	const loading = isDepositAccountsFetching

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<DepositAccountingFilter
				viewPermission={viewPermission}
				loading={loading}
				form={form}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
				onChangeCurrency={onChangeCurrency}
			/>

			{depositAccounts !== undefined && (
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

			<EditDepositAccountFormModal
				editTransId={editTransId}
				loading={isEditDepositAccountLoading}
				modal={editDepositAccountModal}
				onFinish={handleEditDepositAccount}
			/>
		</LayoutContent.Main>
	)
}

export default DepositAccounting
