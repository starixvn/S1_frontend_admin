import { useGetPromotionCategoryQuery } from 'features/bonusManagement/api'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useLazyGetBonusLogQuery } from 'features/memberProfile/api'
import { BonusLogFilter } from 'features/memberProfile/pages/marketing/bonusLog/BonusLogFilter'
import { Form, message, TablePaginationConfig } from 'antd'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useEffect } from 'react'
import { head, isEmpty } from 'lodash'
import { PAGINATION, usePagination } from 'common/hooks'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useParams } from 'react-router-dom'
import { BonusLogTable } from 'features/memberProfile/pages/marketing/bonusLog/BonusLogTable'

const BonusLog = () => {
	const { t } = useTranslation()
	const [filterForm] = Form.useForm()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const { custId } = useParams()

	// 0 = 全帶
	const {
		data: { data: categoryList = [] } = {},
		isLoading: isCategoryListLoading,
	} = useGetPromotionCategoryQuery({ walletType: 0 })

	const [
		getBonusLog,
		{
			data: { data: bonusLog = [], rowCount: bonusLogTotal = 0 } = {},
			isFetching: isGetBonusLogLoading,
		},
	] = useLazyGetBonusLogQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: bonusLogTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		const { dateRange, refTransId, promoCategoryId } =
			filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)

		try {
			await getBonusLog({
				custId: Number(custId),
				pageSize,
				pageNumber: current,
				startDate,
				endDate,
				// 沒填就要傳 null , api 才會正常 return 參數
				refTransId: !isEmpty(refTransId) ? refTransId : null,
				promoCategoryId,
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

	const loading = isGetBonusLogLoading || isCategoryListLoading

	useEffect(() => {
		if (!isCategoryListLoading && categoryList?.length > 0) {
			filterForm.setFieldsValue({
				promoCategoryId: head(categoryList)?.id,
			})
		}
	}, [isCategoryListLoading])

	useEffect(() => {
		if (custId) {
			handleSearch({})
		}
	}, [])

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Marketing.Label_BonusLog')}
			/>
			<LayoutContent.Card>
				<BonusLogFilter
					loading={loading}
					form={filterForm}
					onSearch={handleSearch}
					onTimeZoneChange={onTimeZoneChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
					categoryList={categoryList}
				/>
				<BonusLogTable
					loading={loading}
					bonusLog={bonusLog}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onTableChange={handleTableChange}
					pagination={pagination}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default BonusLog
