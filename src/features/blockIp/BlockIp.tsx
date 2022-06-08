import { FC, useEffect } from 'react'
import { isEmpty } from 'lodash'
import moment from 'moment'
import { Form, message, TablePaginationConfig } from 'antd'
import { dateRangeToUtcFormatter, withOutSiteIdParams } from 'common/utils'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useTimeZone } from 'components/TimeZoneSelect'
import { AffixButtons } from 'components/AffixButtons'
import {
	useDeleteBlockIpMutation,
	useLazyGetBlockIpListQuery,
	useAddBlockIpMutation,
} from './api'
import BlockIpFilter from './BlockIpFilter'
import BlockIpTable from './BlockIpTable'
import AddBlockIpFormModal from './AddBlockIpFormModal'
import { IBlockIpResponse } from './type'

const BlockIp: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { addPermission, deletePermission } = {} } =
		useAuth()

	const [queryParams, setQueryParams] = useQueryParams()
	const [form] = Form.useForm()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const userSite = useAppSelector(selectUserSite)

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
				tz: timeZoneUtcOffset,
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
			await deleteBlockIp({ ip }).unwrap()

			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleAddBlockIp = async (ip: string, memo: string) => {
		try {
			await addBlockIp({ ip, memo }).unwrap()

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

		setPagination(prev => ({ ...prev, current, pageSize }))
	}

	useEffect(() => {
		const { current, pageSize } = pagination

		handleSearch({
			current,
			pageSize,
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}, [pagination.current, pagination.pageSize])

	useEffect(() => {
		if (!userSite?.siteId) return

		const init = () => {
			if (isEmpty(withOutSiteIdParams(queryParams))) return

			const { startDate, endDate, ip = '', tz } = queryParams

			onTimeZoneChange(Number(tz))

			form.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				ip,
			})

			handleSearch({
				currentTimeZoneUtcOffset: Number(tz),
			})
		}

		init()
	}, [userSite?.siteId])

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
