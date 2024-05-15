import { FC, useEffect } from 'react'
import { usePagination, PAGINATION, useQueryParams } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import {
	DatePicker,
	message,
	Space,
	TablePaginationConfig,
	Typography,
} from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import dayjs from 'dayjs'
import { dateFormat } from 'common/utils/format'
import { useLazyGetMemberRewardPointLogQuery } from '../api'
import { IGetMemberRewardPointLogResponse } from '../type'
import { MemberListLogTable } from './MemberListLogTable'

const { RangePicker } = DatePicker
const MemberListLog: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const [queryParams, setQueryParams] = useQueryParams()
	const {
		userName,
		tpUserName,
		startTime,
		endTime,
		timeZoneUtcOffset,
		current: currentPage = PAGINATION.defaultCurrent,
		pageSize: currentPageSize = PAGINATION.defaultPageSize,
	} = queryParams
	const { custId } = useParams()
	const [
		getMemberRewardPointLog,
		{
			data: {
				data: memberRewardPointData,
				rowCount: memberRewardPointTotal = 0,
			} = {} as IGetMemberRewardPointLogResponse,
			isFetching: isGetMemberRewardPointLoading,
		},
	] = useLazyGetMemberRewardPointLogQuery()
	const [pagination, setPagination] = usePagination({
		paginationTotal: memberRewardPointTotal,
	})

	const handleFetching = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		try {
			await getMemberRewardPointLog({
				pageNumber: current,
				pageSize,
				startTime,
				endTime,
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
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination
		await handleFetching({
			current,
			pageSize,
		})
		setQueryParams({
			userName,
			tpUserName,
			startTime,
			endTime,
			timeZoneUtcOffset,
			current,
			pageSize,
		})
	}

	// 這裡要放 currentPage 是因為 backRoutes click的時候queryString 裡的 current 會回到上一頁 , 有監聽到變化畫面才可以跟著更新
	useEffect(() => {
		if (!custId) return
		handleFetching({
			current: Number(currentPage),
			pageSize: Number(currentPageSize),
		})
	}, [custId, currentPage])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title
				title={`${pageTitle ?? ''} > ${t('Label_PointLog')}`}
			/>
			<LayoutContent.Card style={{ marginTop: 0 }}>
				<Space size='large' style={{ marginTop: '20px' }}>
					<RangePicker
						defaultValue={[
							dayjs(startTime, dateFormat),
							dayjs(endTime, dateFormat),
						]}
						format={dateFormat}
						disabled
					/>
					<Typography.Text style={{ fontSize: '1.05rem' }}>
						{`${t('Label_MemberId')} : ${userName}`}
					</Typography.Text>
					<Typography.Text style={{ fontSize: '1.05rem' }}>
						{`${t('Label_SabaId')} : ${tpUserName}`}
					</Typography.Text>
				</Space>
				<MemberListLogTable
					loading={isGetMemberRewardPointLoading}
					pagination={pagination}
					onTableChange={handleTableChange}
					memberLogData={memberRewardPointData}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
			</LayoutContent.Card>
			<AffixButtons>
				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default MemberListLog
