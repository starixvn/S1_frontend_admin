import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { DEFAULT_COLOR, useColorPicker } from 'components'
import { timeZoneLocalOffset } from 'common/utils'
import { AffixButtons } from 'components/AffixButtons'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import {
	useLazyGetTagListQuery,
	useEditTagMutation,
	useSetTagStatusMutation,
} from 'features/tagManagement/api'
import { Form, message, TablePaginationConfig } from 'antd'
import {
	IFilterForm,
	IEditForm,
	ICreateForm,
	IGetTagListData,
} from 'features/tagManagement/type'
import TagManagementFilter from 'features/tagManagement/TagManagementFilter'
import TagManagementTable from 'features/tagManagement/TagManagementTable'
import TagManagementModal from 'features/tagManagement/TagManagementModal'

const TagManagement = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const [editForm] = Form.useForm<IEditForm>()
	const [filterForm] = Form.useForm<IFilterForm>()
	const [createForm] = Form.useForm<ICreateForm>()
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { addEditPermission } = {} } = useAuth()
	const [editingKey, setEditingKey] = useState<number | undefined>(undefined)
	const [tableData, setTableData] = useState<IGetTagListData[]>([])
	const { color, onChangeColor, onChangeRawColor } = useColorPicker()
	const createModal = useModal()
	const [
		getTagList,
		{
			data: { data: tagList = [], rowCount: tagListTotal = 0 } = {},
			isFetching: isGetTagListLoading,
		},
	] = useLazyGetTagListQuery()

	const [setTagStatus, { isLoading: isSetTagLoading }] =
		useSetTagStatusMutation()
	const [editTag, { isLoading: isEditTagLoading }] = useEditTagMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: tagListTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		const { status } = filterForm.getFieldsValue()

		try {
			await getTagList({
				pageNumber: current,
				pageSize,
				status,
			}).unwrap()
			setQueryParams({ status, pageNumber: current, pageSize })
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

	const handleStatusChange = async ({ id, status }: IGetTagListData) => {
		const args = {
			before: {
				id,
				status,
			},
			after: {
				id,
				status,
			},
		}
		try {
			await setTagStatus(args).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleCreateTag = async () => {
		const { pageNumber, pageSize } = queryParams
		const args = await createForm.validateFields()
		const { tagName, description } = args

		try {
			const response = await editTag({
				after: {
					tagName,
					tagColour: color,
					description,
				},
			}).unwrap()
			await handleSearch({
				current: pageNumber ? Number(pageNumber) : PAGINATION.defaultCurrent,
				pageSize: pageSize ? Number(pageSize) : PAGINATION.defaultPageSize,
			})
			createModal.onCancel()
			message.success(response?.message || t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleRowSaved = async () => {
		const { pageNumber, pageSize } = queryParams
		const args = await editForm.validateFields()
		const { tagName, description } = args
		try {
			const response = await editTag({
				before: {
					id: Number(editingKey),
					tagName,
					tagColour: color,
					description,
				},
				after: {
					id: Number(editingKey),
					tagName,
					tagColour: color,
					description,
				},
			}).unwrap()
			// 修改完後初始化 color
			await onChangeRawColor(DEFAULT_COLOR)
			await handleSearch({
				current: pageNumber ? Number(pageNumber) : PAGINATION.defaultCurrent,
				pageSize: pageSize ? Number(pageSize) : PAGINATION.defaultPageSize,
			})
			message.success(response?.message || t('System.Label_Success'))
			setEditingKey(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams)) return

			const { status, pageNumber, pageSize } = queryParams
			filterForm.setFieldsValue({
				status,
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
			})
		}
		init()
	}, [])

	useEffect(() => {
		const { status } = filterForm.getFieldsValue()

		const filterTagData = () => {
			if (Number(status) === 2) {
				const filterResult = tagList.filter(item => item.status === 0)
				setTableData(filterResult)
			} else {
				setTableData(tagList)
			}
		}
		filterTagData()
	}, [isGetTagListLoading])

	const loading = isGetTagListLoading || isSetTagLoading || isEditTagLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<TagManagementFilter
				onSearch={handleSearch}
				form={filterForm}
				loading={loading}
			/>
			{!isEmpty(queryParams) && (
				<TagManagementTable
					form={editForm}
					loading={loading}
					pagination={pagination}
					timeZoneUtcOffset={timeZoneLocalOffset}
					addEditPermission={addEditPermission}
					editingKey={editingKey}
					tagList={tableData}
					color={color}
					onChangeColor={onChangeColor}
					onChangeRawColor={onChangeRawColor}
					setEditingKey={setEditingKey}
					onTableChange={handleTableChange}
					onRowSaved={handleRowSaved}
					onStatusChange={handleStatusChange}
				/>
			)}

			<AffixButtons>
				<AffixButtons.Create
					disabled={!addEditPermission?.canUse}
					loading={loading}
					onClick={createModal.onOpen}
				/>
			</AffixButtons>

			<TagManagementModal
				loading={isSetTagLoading}
				form={createForm}
				visible={createModal.visible}
				color={color}
				onChangeColor={onChangeColor}
				onChangeRawColor={onChangeRawColor}
				onCancel={createModal.onCancel}
				onFinish={handleCreateTag}
			/>
		</LayoutContent.Main>
	)
}

export default TagManagement
