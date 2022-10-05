import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import {
	useCreateReasonMutation,
	useGetFuncKeysListQuery,
	useLazyGetReasonListQuery,
	useSetReasonMutation,
} from 'features/reasonManagement/api'
import {
	IGetFuncKeysListResponse,
	IGetReasonListResponse,
} from 'features/reasonManagement/type'
import { ReasonManagementFilter } from 'features/reasonManagement/ReasonManagementFilter'
import { Form, message, TablePaginationConfig } from 'antd'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { useEffect, useState } from 'react'
import { ReasonManagementTable } from 'features/reasonManagement/ReasonManagementTable'
import { useTimeZone } from 'components/TimeZoneSelect'
import { AffixButtons } from 'components/AffixButtons'
import { isEmpty } from 'lodash'
import { CreateReasonModal } from 'features/reasonManagement/CreateReasonModal'

const ReasonManagement = ({
	pageTitle,
}: {
	pageTitle?: string
}): JSX.Element => {
	const { t } = useTranslation()
	const [filterForm] = Form.useForm<{ funcKeys: string[] }>()
	const [tableForm] = Form.useForm<{
		description: string
	}>()
	const [modalForm] = Form.useForm<{
		funcKey: string
		description: string
	}>()
	const createModal = useModal()
	const { timeZoneUtcOffset } = useTimeZone()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [queryParams, setQueryParams] = useQueryParams()

	const {
		data: { data: funcKeysList = [] } = {} as IGetFuncKeysListResponse,
		isLoading: isGetFuncKeysLoading,
	} = useGetFuncKeysListQuery(null)

	const [editingId, setEditingId] = useState<number | undefined>(undefined)

	const [
		getReasonList,
		{
			data: {
				data: reasonList = [],
				rowCount: reasonListTotal = 0,
			} = {} as IGetReasonListResponse,
			isFetching: isGetReasonListLoading,
		},
	] = useLazyGetReasonListQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: reasonListTotal,
	})

	const [setReason, { isLoading: isSetReasonLoading }] = useSetReasonMutation()

	const [createReason, { isLoading: isCreateReasonLoading }] =
		useCreateReasonMutation()

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		const { funcKeys } = filterForm.getFieldsValue()
		setEditingId(undefined)
		try {
			await getReasonList({
				funcKeys,
				pageNumber: current,
				pageSize,
			}).unwrap()
			setQueryParams({ funcKeys, pageNumber: current, pageSize })
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

	const handleSaved = async () => {
		if (editingId === undefined) return
		const { description } = tableForm.getFieldsValue()
		const { pageNumber, pageSize } = queryParams
		try {
			await setReason({ id: editingId, description }).unwrap()
			await handleSearch({
				current: pageNumber ? Number(pageNumber) : PAGINATION.defaultCurrent,
				pageSize: pageSize ? Number(pageSize) : PAGINATION.defaultPageSize,
			})
			message.success(t('System.Label_Success'))
			setEditingId(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleCreateReason = async () => {
		const { funcKey, description = '' } = await modalForm.validateFields()
		try {
			await createReason({ funcKey, description }).unwrap()
			message.success(t('System.Label_Success'))
			modalForm.resetFields()
			createModal.onCancel()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (
			!isGetFuncKeysLoading &&
			funcKeysList.length > 0 &&
			isEmpty(queryParams)
		) {
			filterForm.setFieldsValue({
				funcKeys: funcKeysList?.map(key => key.funcKey),
			})
		}
	}, [isGetFuncKeysLoading])

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams)) return
			const { funcKeys = [], pageNumber, pageSize } = queryParams
			filterForm.setFieldsValue({
				funcKeys: funcKeys.map((key: string) => key),
			})
			handleSearch({ current: Number(pageNumber), pageSize: Number(pageSize) })
		}
		init()
	}, [])

	const loading =
		isGetFuncKeysLoading || isGetReasonListLoading || isSetReasonLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<ReasonManagementFilter
				loading={loading}
				form={filterForm}
				onSearch={handleSearch}
				funcKeysList={funcKeysList}
			/>
			{!isEmpty(queryParams) && (
				<ReasonManagementTable
					loading={loading}
					form={tableForm}
					pagination={pagination}
					reasonList={reasonList}
					setEditingKey={setEditingId}
					editingKey={editingId}
					onSaved={handleSaved}
					timeZoneUtcOffset={timeZoneUtcOffset}
					editPermission={editPermission}
					onTableChange={handleTableChange}
				/>
			)}
			<CreateReasonModal
				loading={isCreateReasonLoading}
				visible={createModal.visible}
				onFinish={handleCreateReason}
				onCancel={() => {
					createModal.onCancel()
					modalForm.resetFields()
				}}
				form={modalForm}
				funcKeysList={funcKeysList}
			/>
			<AffixButtons>
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					loading={loading}
					onClick={createModal.onOpen}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default ReasonManagement
