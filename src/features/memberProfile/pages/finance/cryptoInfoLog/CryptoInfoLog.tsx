import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IGetCryptoLogResponse } from 'features/memberProfile/type'
import { LayoutContent } from 'app/pages/layout'
import { message, TablePaginationConfig } from 'antd'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { PAGINATION, usePagination } from 'common/hooks'
import { useLazyGetCryptoLogQuery } from 'features/memberProfile/api'
import CryptoInfoTable from 'features/memberProfile/pages/finance/cryptoInfoLog/CryptoInfoTable'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'

const CryptoInfoLog = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset } = useTimeZone()

	const [
		getCryptoInfoLog,
		{
			data: {
				data: cryptoLogList = [],
				rowCount: custCryptoLogTotal = 0,
			} = {} as IGetCryptoLogResponse,
			isFetching: isGetCryptoLogLoading,
		},
	] = useLazyGetCryptoLogQuery()

	const {
		data: { data: statusList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetStatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'CryptoWalletLogStatusEnum' })

	const [pagination, setPagination] = usePagination({
		paginationTotal: custCryptoLogTotal,
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
			await getCryptoInfoLog({
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

	const loading = isGetCryptoLogLoading || isGetStatusListLoading

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Finance.Label_CryptoInfoLog')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<CryptoInfoTable
					cryptoLogList={cryptoLogList}
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

export default CryptoInfoLog
