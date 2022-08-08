import { FC, useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { LineDepositChannelFilter } from 'features/lineDepositChannel/LineDepositChannelFilter'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { Form, message, TablePaginationConfig } from 'antd'
import { useTranslation } from 'react-i18next'
import {
	useDeleteChannelMutation,
	useLazyGetChannelListQuery,
	useSetChannelMutation,
} from 'features/lineDepositChannel/api'
import {
	IDeleteChannelArg,
	IGetLineChannelListData,
	IGetLineChannelListResponse,
	ILineChannelArg,
} from 'features/lineDepositChannel/type'
import { isEmpty } from 'lodash'
import { AffixButtons } from 'components/AffixButtons'
import { LineDepositChannelTable } from 'features/lineDepositChannel/LineDepositChannelTable'
import { timeZoneLocalOffset } from 'common/utils'
import { AddLineChannelModal } from 'features/lineDepositChannel/AddLineChannelModal'

const LineDepositChannel: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission, deletePermission } = {} } =
		useAuth()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [queryParams, setQueryParams] = useQueryParams()
	const [filterForm] = Form.useForm<{
		currencyIds: number[]
	}>()

	const [tableForm] = Form.useForm<{
		link: string
		status: boolean
	}>()

	const [AddModalForm] = Form.useForm<{
		link: string
		status: boolean
		currencyId: number
	}>()
	const addLineChannelModal = useModal()
	const [addLineChannelSuccess, setAddLineChannelSuccess] = useState(false)

	const [editingKey, setEditingKey] = useState<number | undefined>(undefined)

	const [
		getChannelList,
		{
			data: {
				data: lineChannelList,
				rowCount: lineChannelListTotal = 0,
			} = {} as IGetLineChannelListResponse,
			isFetching: isGetChannelListLoading,
		},
	] = useLazyGetChannelListQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: lineChannelListTotal,
	})

	const [setChannel, { isLoading: isSetChannelLoading }] =
		useSetChannelMutation()

	const [deleteChannel, { isLoading: isDeleteChannelLoading }] =
		useDeleteChannelMutation()

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		const { currencyIds } = filterForm.getFieldsValue()
		try {
			await getChannelList({
				siteId,
				pageNumber: current,
				pageSize,
				currencyIds,
			}).unwrap()

			setQueryParams({
				pageNumber: current,
				pageSize,
				currencyIds,
			})

			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		setEditingKey(undefined)
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination
		await handleSearch({
			current,
			pageSize,
		})
	}

	const handleRowSaved = async (record: IGetLineChannelListData) => {
		const { link, status } = await tableForm.validateFields()
		const { id, status: beforeStatus, link: beforeLink, currencyId } = record

		const before: ILineChannelArg = {
			id,
			status: beforeStatus,
			link: beforeLink,
		}

		const after: ILineChannelArg = {
			id,
			link,
			status: Number(status),
		}

		// 後端表示 transId 都帶 null
		try {
			await setChannel({
				siteId,
				currencyId,
				transId: null,
				before,
				after,
			}).unwrap()
			setEditingKey(undefined)
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDeleteChannel = async (record: IGetLineChannelListData) => {
		const { currencyId, id, link } = record
		const channelArg: IDeleteChannelArg = {
			id,
			link,
		}
		try {
			// 後端表示 transId 都帶 null
			await deleteChannel({
				siteId,
				currencyId,
				transId: null,
				before: channelArg,
				after: channelArg,
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleAddLineChannel = async () => {
		const { link, status, currencyId } = await AddModalForm.validateFields()
		const after: ILineChannelArg = {
			id: 0,
			status: Number(status),
			link,
		}
		try {
			await setChannel({
				siteId,
				currencyId,
				transId: null,
				after,
			}).unwrap()
			setAddLineChannelSuccess(true)
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
				handleSearch({})
			} else {
				const { pageNumber, pageSize, currencyIds } = queryParams
				filterForm.setFieldsValue({
					currencyIds: currencyIds.map((currency: string) => Number(currency)),
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
		isGetChannelListLoading || isSetChannelLoading || isDeleteChannelLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<LineDepositChannelFilter
				form={filterForm}
				currencyListBySite={currencyListBySite}
				onSearch={handleSearch}
				loading={loading}
			/>

			{!isEmpty(queryParams) && (
				<LineDepositChannelTable
					form={tableForm}
					lineChannelList={lineChannelList}
					loading={loading}
					timeZoneUtcOffset={timeZoneLocalOffset}
					editingKey={editingKey}
					setEditingKey={setEditingKey}
					onRowSaved={handleRowSaved}
					pagination={pagination}
					editPermission={editPermission}
					deletePermission={deletePermission}
					onTableChange={handleTableChange}
					onDeleteChannel={handleDeleteChannel}
				/>
			)}

			<AddLineChannelModal
				loading={loading}
				visible={addLineChannelModal.visible}
				success={addLineChannelSuccess}
				onFinish={handleAddLineChannel}
				onCancel={addLineChannelModal.onCancel}
				form={AddModalForm}
				currencyListBySite={currencyListBySite}
				setAddLineChannelSuccess={setAddLineChannelSuccess}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					onClick={() => {
						addLineChannelModal.onOpen()
						setEditingKey(undefined)
					}}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default LineDepositChannel
