import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IGetEWalletInfoResponse } from 'features/memberProfile/type'
import { LayoutContent } from 'app/pages/layout'
import { message, TablePaginationConfig } from 'antd'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { PAGINATION, usePagination } from 'common/hooks'
import EWalletInfoTable from 'features/memberProfile/pages/finance/eWalletInfoLog/EWalletInfoTable'
import { useLazyGetEWalletLogQuery } from 'features/memberProfile/api'

const EWalletInfoLog = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset } = useTimeZone()

	const [
		getEWalletInfoLog,
		{
			data: {
				data: eWalletInfoLogList = [],
				rowCount: custEWalletInfoLogTotal = 0,
			} = {} as IGetEWalletInfoResponse,
			isFetching: isGetEWalletInfoLoading,
		},
	] = useLazyGetEWalletLogQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: custEWalletInfoLogTotal,
	})

	const {
		data: { data: statusList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetStatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'EWalletinfoLogStatusEnum' })

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!custId) return
		try {
			await getEWalletInfoLog({
				pageNumber: current,
				pageSize,
				custId: Number(custId),
			}).unwrap()
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

	useEffect(() => {
		if (custId) {
			handleSearch({})
		}
	}, [custId])

	const loading = isGetEWalletInfoLoading || isGetStatusListLoading

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Finance.Label_EWalletInfoLog')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<EWalletInfoTable
					eWalletInfoLogList={eWalletInfoLogList}
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
					onTableChange={handleTableChange}
					statusList={statusList}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default EWalletInfoLog
