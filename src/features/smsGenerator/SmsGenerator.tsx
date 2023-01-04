import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { SmsGeneratorFilter } from 'features/smsGenerator/SmsGeneratorFilter'
import { Form, message, TablePaginationConfig } from 'antd'
import moment, { Moment } from 'moment/moment'

import {
	useDeleteMessageMutation,
	useExportMessageResultMutation,
	useLazyGetMessageListQuery,
	useSendMessageMutation,
	useUpdateMessageMutation,
} from 'features/smsGenerator/api'
import { IEditForm } from 'features/smsGenerator/type'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useEffect } from 'react'
import { find, isEmpty } from 'lodash'
import { SmsGeneratorTable } from 'features/smsGenerator/SmsGeneratorTable'
import { AffixButtons } from 'components/AffixButtons'
import download from 'downloadjs'
import { SetMessageModal } from 'features/smsGenerator/messageModal/SetMessageModal'
import { MethodEnum } from 'features/smsGenerator/constants'
import { RcFile } from 'antd/lib/upload'
import { formMessageConverter } from 'features/smsGenerator/utils'

const SmsGenerator = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const {
		actionPermissions: {
			editPermission,
			deletePermission,
			exportExcelPermission,
		} = {},
	} = useAuth()

	const [filterForm] = Form.useForm<{
		dateRange: [Moment, Moment]
	}>()
	const [editForm] = Form.useForm<IEditForm>()
	const editModal = useModal()

	const [
		getMessageList,
		{
			data: { data: messageList = [], rowCount: messageListTotal = 0 } = {},
			isLoading: isGetMessageListLoading,
		},
	] = useLazyGetMessageListQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: messageListTotal,
	})

	const [updateMessage, { isLoading: isUpdateMessageLoading }] =
		useUpdateMessageMutation()

	const [deleteMessage, { isLoading: isDeleteMessageLoading }] =
		useDeleteMessageMutation()

	const [sendMessage, { isLoading: isSendMessageLoading }] =
		useSendMessageMutation()

	const [exportMessageResult, { isLoading: isExportMessageResultLoading }] =
		useExportMessageResultMutation()

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
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			currentTimeZoneUtcOffset
		)

		const args = {
			siteIds: siteId,
			startDate,
			endDate,
			pageNumber: current,
			pageSize,
		}

		try {
			await getMessageList(args).unwrap()
			setQueryParams({ timeZone: currentTimeZoneUtcOffset, ...args })
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
		})
	}

	const handleExport = async (batchId: number) => {
		try {
			const blob = await exportMessageResult({ batchId }).unwrap()
			download(
				blob,
				`SendMessageResult_ID_${batchId}_${moment().format(
					'YYYYMMDDHHmmss'
				)}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDelete = async (batchId: number) => {
		try {
			await deleteMessage({ batchId }).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetMessageClicked = async (batchId: number | 'Add') => {
		// 用 "Add" 表示新增
		editForm.setFieldsValue({
			batchId,
		})
		editModal.onOpen()
	}

	// 新增發送訊息
	const handleSendMessage = async () => {
		if (!siteId) return
		try {
			const { method, currencyId, fileList, isPopup, accountStatus } =
				await editForm.validateFields()
			// 這裡單獨用 getFieldsValue(true) 取 messages value
			const { messages } = editForm.getFieldsValue(true)
			const formData = new FormData()
			formData.append('optSite', String(siteId))
			formData.append('currency', String(currencyId))
			formData.append('isPopup', String(isPopup))
			formData.append('personalMsg', JSON.stringify(messages))
			if (method === MethodEnum.BatchUpload) {
				formData.append('excelUpload', fileList[0].originFileObj as RcFile)
			} else {
				formData.append('accountStatus', String(accountStatus))
			}
			// fetch api
			try {
				const response = await sendMessage(formData).unwrap()
				message.success(response?.message || t('System.Label_Success'))
				editModal.onCancel()
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		} catch (error) {
			// 驗證層
			const { errorFields = [] } = error
			// 因只有 en 需要驗證並彈窗 , 故判斷 name.length > 1 ，只要有出現就跳特定 msg
			// name.length > 1 代表是巢狀結構內的資料
			if (
				find(errorFields, (item: any) => {
					const { name = [] } = item ?? {}
					return (name.length as number) > 1
				})
			) {
				message.error(t('Label_EnLangRequiredMsg'))
			}
		}
	}

	// update 已發送的 message
	const handleUpdateMessage = async () => {
		try {
			await editForm.validateFields()
			const { messages, isPopup, batchId } = editForm.getFieldsValue(true)
			try {
				const response = await updateMessage({
					batchId,
					isPopup,
					languageDatas: formMessageConverter(messages),
				}).unwrap()
				message.success(response?.message || t('System.Label_Success'))
				editModal.onCancel()
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		} catch (error) {
			// 驗證層
			const { errorFields = [] } = error
			// 因只有 en 需要驗證並彈窗 , 故判斷 name.length > 1 ，只要有出現就跳特定 msg
			// name.length > 1 代表是巢狀結構內的資料
			if (
				find(errorFields, (item: any) => {
					const { name = [] } = item ?? {}
					return (name.length as number) > 1
				})
			) {
				message.error(t('Label_EnLangRequiredMsg'))
			}
		}
	}

	const handleSubmitMessage = (isAdd: boolean) => {
		if (isAdd) {
			handleSendMessage()
		} else {
			handleUpdateMessage()
		}
	}

	useEffect(() => {
		if (!isEmpty(queryParams)) {
			const { startDate, endDate, pageNumber, pageSize, timeZone } = queryParams
			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}
	}, [])

	const tableLoading =
		isGetMessageListLoading ||
		isDeleteMessageLoading ||
		isExportMessageResultLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<SmsGeneratorFilter
				loading={isGetMessageListLoading}
				form={filterForm}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>
			{!isEmpty(queryParams) && (
				<SmsGeneratorTable
					loading={tableLoading}
					messageList={messageList}
					deletePermission={deletePermission}
					exportExcelPermission={exportExcelPermission}
					pagination={pagination}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onTableChange={handleTableChange}
					onEdit={handleSetMessageClicked}
					onExport={handleExport}
					onDelete={handleDelete}
				/>
			)}
			<SetMessageModal
				open={editModal.visible}
				form={editForm}
				loading={isSendMessageLoading || isUpdateMessageLoading}
				currencyListBySite={currencyListBySite}
				onCancel={editModal.onCancel}
				onFinish={handleSubmitMessage}
			/>
			<AffixButtons>
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					onClick={() => handleSetMessageClicked('Add')}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default SmsGenerator
