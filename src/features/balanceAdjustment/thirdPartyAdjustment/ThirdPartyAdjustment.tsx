import { FC, useEffect } from 'react'
import { find, head, isEmpty } from 'lodash'
import { Collapse, Divider, Form, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAuth, useQueryParams } from 'common/hooks'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { AffixButtons } from 'components/AffixButtons'
import {
	useGetAdjustmentReasonListQuery,
	useGetTpListBySiteIdQuery,
	useLazyGetCustInfoWithTpBalanceQuery,
	useSetTpFundsAdjustmentMutation,
} from './api'
import ThirdPartyAdjustmentSearchForm from './ThirdPartyAdjustmentSearchForm'
import ThirdPartyAdjustmentInfoForm from './ThirdPartyAdjustmentInfoForm'
import { MethodTypeEnum } from '../constants'
import { IMethodType } from '../type'
import {
	ICustInfoWithTpBalanceResponse,
	ISetTpFundsAdjustmentArgs,
} from './type'
import { adjustmentTypeList } from './constants'

const ThirdPartyAdjustment: FC<{
	methodType: MethodTypeEnum
	filteredMethodTypes: IMethodType[]
	onMethodTypeChange: (type: MethodTypeEnum) => void
}> = ({ methodType, filteredMethodTypes, onMethodTypeChange }) => {
	const { t } = useTranslation()
	const { actionPermissions: { add3RDPermission } = {} } = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const [searchForm] = Form.useForm<{
		userName: string
		sabaId: string
	}>()

	const [infoForm] = Form.useForm<{
		tpId: number
		adjustmentType: number
		reasonId: number
		amount: number
		memo: string
		transId: string
	}>()

	const formAdjustmentType = Form.useWatch('adjustmentType', infoForm)

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
	} = useGetAdjustmentReasonListQuery(
		{
			methodTypeID: methodType,
			adjustmentTypeID: formAdjustmentType,
		},

		{ skip: !methodType || !formAdjustmentType }
	)

	const [
		getCustInfoWithTpBalance,
		{
			data: {
				data: custInfoWithTpBalance,
			} = {} as ICustInfoWithTpBalanceResponse,
			isFetching: isFetCustInfoWithTpBalanceFetching,
		},
	] = useLazyGetCustInfoWithTpBalanceQuery()

	const [setTpFundsAdjustment, { isLoading: isSetAdjustmentBalanceLoading }] =
		useSetTpFundsAdjustmentMutation()

	const handleSearch = async () => {
		if (!siteId) return
		const { userName, sabaId } = await searchForm.validateFields()

		if (!isEmpty(userName) && !isEmpty(sabaId)) {
			message.error(
				t('Label_FieldsOneTime', {
					FieldA: t('Label_MemberId'),
					FieldB: t('Label_SabaId'),
				})
			)
		} else {
			try {
				// * 取得客戶資料、主錢包餘額及三方錢包餘額
				await getCustInfoWithTpBalance({
					siteId,
					userName,
					sabaId,
				}).unwrap()

				setQueryParams({
					userName,
					sabaId,
					methodType,
				})
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}
	}

	// * 送出調整餘額資訊
	const handleSetTpFundsAdjustment = async () => {
		const { userName } = await searchForm.validateFields()
		const { currencyId, custId } = custInfoWithTpBalance
		const { tpId, adjustmentType, reasonId, amount, memo, transId } =
			await infoForm.validateFields()
		const { tpName = '' } = find(tpListBySiteId, { tpId }) ?? {}

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
			methodType,
		}

		try {
			await setTpFundsAdjustment(args).unwrap()
			infoForm.setFieldsValue({
				tpId: undefined,
				adjustmentType: head(adjustmentTypeList)?.id,
				reasonId: undefined,
				amount: undefined,
				memo: '',
				transId: '',
			})
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// * 等待 fetch 完成並初始 searchForm 搜尋條件
	useEffect(() => {
		if (!isGetTpListBySiteIdLoading && tpListBySiteId.length > 0) {
			infoForm.setFieldsValue({
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

	useEffect(() => {
		const { userName = '', sabaId = '' } = queryParams

		if (userName || sabaId) {
			searchForm.setFieldsValue({
				userName,
				sabaId,
			})
			handleSearch()
		}
	}, [])

	const loading =
		isGetTpListBySiteIdFetching || isFetCustInfoWithTpBalanceFetching

	return (
		<>
			<Collapse defaultActiveKey={1}>
				<Collapse.Panel header='' key='1'>
					<ThirdPartyAdjustmentSearchForm
						form={searchForm}
						loading={loading}
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
								tpWalletList={custInfoWithTpBalance?.tpWalletList ?? []}
								adjustmentReasonList={adjustmentReasonList}
								tpListBySiteId={tpListBySiteId}
							/>
						</>
					)}
				</Collapse.Panel>
			</Collapse>

			<AffixButtons>
				<AffixButtons.BackToTop />

				{custInfoWithTpBalance && (
					<AffixButtons.Saved
						disabled={!add3RDPermission?.canUse}
						loading={isSetAdjustmentBalanceLoading}
						onClick={handleSetTpFundsAdjustment}
					/>
				)}
			</AffixButtons>
		</>
	)
}

export default ThirdPartyAdjustment
