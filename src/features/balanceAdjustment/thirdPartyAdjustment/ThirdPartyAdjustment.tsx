import { FC, useEffect } from 'react'
import { find, head } from 'lodash'
import { Collapse, Divider, Form, message, TablePaginationConfig } from 'antd'
import { useTranslation } from 'react-i18next'
import { PAGINATION, useAuth, usePagination } from 'common/hooks'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { AffixButtons } from 'components/AffixButtons'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	useGetAdjustmentReasonListQuery,
	useGetTpListBySiteIdQuery,
	useLazyGetCustInfoWithTpBalanceQuery,
	useLazyGetTpLogQuery,
	useSetTpFundsAdjustmentMutation,
} from './api'
import ThirdPartyAdjustmentSearchForm from './ThirdPartyAdjustmentSearchForm'
import ThirdPartyAdjustmentInfoForm from './ThirdPartyAdjustmentInfoForm'
import ThirdPartyAdjustmentTable from './ThirdPartyAdjustmentTable'
import { MethodTypeEnum } from '../constants'
import { IMethodType } from '../type'
import {
	ICustInfoWithTpBalanceResponse,
	ISetTpFundsAdjustmentArgs,
} from './type'

const ThirdPartyAdjustment: FC<{
	methodType: MethodTypeEnum
	filteredMethodTypes: IMethodType[]
	onMethodTypeChange: (type: MethodTypeEnum) => void
}> = ({ methodType, filteredMethodTypes, onMethodTypeChange }) => {
	const { t } = useTranslation()
	const { actionPermissions: { add3RDPermission } = {} } = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { timeZoneUtcOffset } = useTimeZone()

	const [searchForm] = Form.useForm<{
		tpId: number
		userName: string
		sabaId: string
	}>()

	const [infoForm] = Form.useForm<{
		adjustmentType: number
		reasonId: number
		amount: number
		memo: string
		transId: string
	}>()

	const {
		data: { data: tpListBySiteId = [] } = {},
		isFetching: isGetTpListBySiteIdFetching,
		// * isLoading only trigger once
		isLoading: isGetTpListBySiteIdLoading,
	} = useGetTpListBySiteIdQuery({
		siteId,
	})

	const {
		data: { data: adjustmentReasonList = [] } = {},
		isFetching: isGetAdjustmentReasonListFetching,
	} = useGetAdjustmentReasonListQuery(null)

	const [
		getCustInfoWithTpBalance,
		{
			data: {
				data: custInfoWithTpBalance,
			} = {} as ICustInfoWithTpBalanceResponse,
			isFetching: isFetCustInfoWithTpBalanceFetching,
		},
	] = useLazyGetCustInfoWithTpBalanceQuery()

	const [
		getTpLog,
		{
			data: { data: tpLog = [], rowCount: tpLogTotal = 0 } = {},
			isFetching: isGetTpLogFetching,
			isSuccess: isGetTpLogSuccess,
		},
	] = useLazyGetTpLogQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: tpLogTotal,
	})

	const [setTpFundsAdjustment, { isLoading: isSetAdjustmentBalanceLoading }] =
		useSetTpFundsAdjustmentMutation()

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!siteId) return
		const { tpId, userName, sabaId } = await searchForm.validateFields()

		try {
			// * 取得客戶資料、主錢包餘額及三方錢包餘額
			const { data: { custId } = {} } = await getCustInfoWithTpBalance({
				siteId,
				userName,
				sabaId,
			}).unwrap()

			// * 取得第三方調帳紀錄
			await getTpLog({
				siteId,
				tpId,
				userName,
				custId: custId as number,
				pageSize,
				pageNumber: current,
			}).unwrap()
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// * 送出調整餘額資訊
	const handleSetTpFundsAdjustment = async () => {
		const { tpId, userName } = await searchForm.validateFields()
		const { tpName = '' } = find(tpListBySiteId, { tpId }) ?? {}
		const { currencyId, custId } = custInfoWithTpBalance
		const { adjustmentType, reasonId, amount, memo, transId } =
			await infoForm.validateFields()

		const args: ISetTpFundsAdjustmentArgs = {
			siteId,
			currencyId,
			custId,
			tpId,
			tpName,
			userName,
			option: adjustmentType,
			amount,
			memo,
			reasonId,
			transId,
		}

		try {
			await setTpFundsAdjustment(args).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const { current, pageSize } = newPagination
		handleSearch({
			current,
			pageSize,
		})
	}

	// * 等待 fetch 完成並初始 searchForm 搜尋條件
	useEffect(() => {
		if (!isGetTpListBySiteIdLoading && tpListBySiteId.length > 0) {
			searchForm.setFieldsValue({
				tpId: head(tpListBySiteId)?.tpId,
			})
		}
	}, [isGetTpListBySiteIdLoading])

	// * 等待 fetch 完成並初始 infoForm 資訊
	useEffect(() => {
		if (!isGetAdjustmentReasonListFetching) {
			infoForm.setFieldsValue({
				reasonId: head(adjustmentReasonList)?.id,
			})
		}
	}, [isGetAdjustmentReasonListFetching])

	const loading =
		isGetTpListBySiteIdFetching ||
		isFetCustInfoWithTpBalanceFetching ||
		isGetTpLogFetching

	return (
		<>
			<Collapse defaultActiveKey={1}>
				<Collapse.Panel header='' key='1'>
					<ThirdPartyAdjustmentSearchForm
						form={searchForm}
						loading={loading}
						tpListBySiteId={tpListBySiteId}
						methodType={methodType}
						filteredMethodTypes={filteredMethodTypes}
						onMethodTypeChange={onMethodTypeChange}
						onSearch={handleSearch}
					/>

					{custInfoWithTpBalance && (
						<>
							<Divider />
							<ThirdPartyAdjustmentInfoForm
								form={infoForm}
								loading={loading}
								balance={custInfoWithTpBalance?.balance ?? 0}
								adjustmentReasonList={adjustmentReasonList}
							/>
						</>
					)}
				</Collapse.Panel>
			</Collapse>

			{isGetTpLogSuccess && (
				<ThirdPartyAdjustmentTable
					tpLog={tpLog}
					loading={loading}
					pagination={pagination}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onTableChange={handleTableChange}
				/>
			)}

			<AffixButtons>
				<AffixButtons.BackToTop />

				<AffixButtons.Saved
					disabled={!add3RDPermission?.canUse}
					loading={isSetAdjustmentBalanceLoading}
					onClick={handleSetTpFundsAdjustment}
				/>
			</AffixButtons>
		</>
	)
}

export default ThirdPartyAdjustment
