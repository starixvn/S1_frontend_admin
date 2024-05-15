import dayjs from 'dayjs'
import { FC, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { selectUserSite } from 'common/enum'
import { useAppSelector } from 'app/store'
import { Form, message, TablePaginationConfig } from 'antd'
import { dateRangeToUtcFormatter } from 'common/utils'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import { AffixButtons } from 'components/AffixButtons'
import { IBlockIpResponse, IForm } from 'features/blockIp/type'
import {
	useDeleteBlockIpMutation,
	useLazyGetBlockIpListQuery,
	useAddBlockIpMutation,
} from 'features/blockIp/api'
import BlockIpFilter from 'features/blockIp/BlockIpFilter'
import BlockIpTable from 'features/blockIp/BlockIpTable'
import AddBlockIpFormModal from 'features/blockIp/AddBlockIpFormModal'

const BlockIp: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { addPermission, deletePermission } = {} } =
		useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const [form] = Form.useForm<IForm>()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const addBlockIpModal = useModal()

	const [
		getBlockIpList,
		{
			data: {
				data: blockIpListData,
				rowCount: blockIpListPaginationTotal,
			} = {} as IBlockIpResponse,
			isFetching: isGetBlockIPListFetching,
		},
	] = useLazyGetBlockIpListQuery()

	const [deleteBlockIp] = useDeleteBlockIpMutation()

	const [addBlockIp, { isLoading: isAddBlockIpLoading }] =
		useAddBlockIpMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: blockIpListPaginationTotal,
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
		const { dateRange, ip } = form.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)
		try {
			await getBlockIpList({
				ip,
				startDate,
				endDate,
				pageNumber: current,
				pageSize,
			})
			setQueryParams({
				ip,
				startDate,
				endDate,
				pageNumber: current,
				tz: currentTimeZoneUtcOffset,
			})
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDeleteBlockIp = async (ip: string) => {
		try {
			await deleteBlockIp({ siteId, before: { ip } }).unwrap()

			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleAddBlockIp = async (ip: string, memo: string) => {
		try {
			await addBlockIp({
				siteId,
				after: { ip, memo },
			}).unwrap()

			addBlockIpModal.onCancel()
			message.success(t('System.Label_Success'))
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

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams)) return

			const { startDate, endDate, ip = '', tz, pageNumber } = queryParams

			onTimeZoneChange(Number(tz))

			form.setFieldsValue({
				dateRange: [dayjs(startDate), dayjs(endDate)],
				ip,
			})

			handleSearch({
				currentTimeZoneUtcOffset: Number(tz),
				current: Number(pageNumber),
			})
		}

		init()
	}, [])

	const loading = isGetBlockIPListFetching || isAddBlockIpLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<BlockIpFilter
				loading={loading}
				form={form}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>

			<BlockIpTable
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				blockIpListData={blockIpListData ?? []}
				deletePermission={deletePermission}
				pagination={pagination}
				onDeleteBlockIp={handleDeleteBlockIp}
				onTableChange={handleTableChange}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />

				<AffixButtons.Create
					disabled={!addPermission?.canUse}
					loading={loading}
					onClick={() => addBlockIpModal.onOpen()}
				/>
			</AffixButtons>

			<AddBlockIpFormModal
				loading={isAddBlockIpLoading}
				visible={addBlockIpModal.visible}
				onCancel={addBlockIpModal.onCancel}
				onFinish={handleAddBlockIp}
			/>
		</LayoutContent.Main>
	)
}

export default BlockIp
