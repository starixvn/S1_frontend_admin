import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { PAGINATION, usePagination } from 'common/hooks'
import { useLazyGetVipLevelLogQuery } from 'features/memberProfile/api'
import { IGetVipLevelLogResponse } from 'features/memberProfile/type'
import { VipLevelLogTable } from 'features/memberProfile/pages/customerInfo/vipLevelLog/VipLevelLogTable'
import { message, TablePaginationConfig } from 'antd'
import { useEffect } from 'react'
import {
	IVipLevelsResponse,
	useGetVipLevelQuery,
} from 'common/service/allDataApi'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useTimeZone } from 'components/TimeZoneSelect'

const VipLevelLog = () => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { custId } = useParams()
	const { timeZoneUtcOffset } = useTimeZone()

	const [
		getVipLevelLog,
		{
			data: {
				data: vipLevelLog = [],
				rowCount: vipLevelTotal = 0,
			} = {} as IGetVipLevelLogResponse,
			isLoading: isGetVipLevelLogLoading,
		},
	] = useLazyGetVipLevelLogQuery()

	const {
		data: { data: vipLevelList } = {} as IVipLevelsResponse,
		isLoading: isGetVipLevelListLoading,
	} = useGetVipLevelQuery({ siteIdForFilter: siteId })

	const [pagination, setPagination] = usePagination({
		paginationTotal: vipLevelTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!custId) return
		try {
			await getVipLevelLog({
				custId: Number(custId),
				pageNumber: current,
				pageSize,
			}).unwrap()
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

	useEffect(() => {
		if (custId) {
			handleSearch({})
		}
	}, [])

	const loading = isGetVipLevelListLoading || isGetVipLevelLogLoading
	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.CustomerInfo.Label_VIPLevel')}
			/>
			<VipLevelLogTable
				loading={loading}
				vipLevelLog={vipLevelLog}
				pagination={pagination}
				onTableChange={handleTableChange}
				vipLevelList={vipLevelList}
				timeZoneUtcOffset={timeZoneUtcOffset}
			/>
		</>
	)
}

export default VipLevelLog
