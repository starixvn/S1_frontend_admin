import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import {
	useGetWithdrawalAdjustmentReasonListQuery,
	useLazyGetWithdrawalAdjustmentQuery,
	useSubmitWithdrawalAdjustmentMutation,
} from 'features/withdrawalAdjustment/api'
import {
	IGetWithdrawalAdjustmentResponse,
	IGetWithdrawalReasonListResponse,
} from 'features/withdrawalAdjustment/type'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useAuth, useQueryParams } from 'common/hooks'
import { WithdrawalAdjustmentFilter } from 'features/withdrawalAdjustment/WithdrawalAdjustmentFilter'
import { Form, message } from 'antd'
import { head, isEmpty } from 'lodash'
import { WithdrawalAdjustmentForm } from 'features/withdrawalAdjustment/WithdrawalAdjustmentForm'
import { AffixButtons } from 'components/AffixButtons'
import { useEffect } from 'react'

const WithdrawalAdjustment = ({
	pageTitle,
}: {
	pageTitle?: string
}): JSX.Element => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { addPermission } = {} } = useAuth()
	const [queryParams, setQueryParams] = useQueryParams()
	const [filterForm] = Form.useForm<{
		userName: string
		sabaId: string
	}>()

	const [form] = Form.useForm<{
		adjustType: number
		reasonId: number
		amount: number
		memo: string
	}>()

	const [
		getWithdrawalAdjustment,
		{
			data: {
				data: withdrawalAdjustment,
			} = {} as IGetWithdrawalAdjustmentResponse,
			isFetching: isGetWithdrawalAdjustmentLoading,
		},
	] = useLazyGetWithdrawalAdjustmentQuery()

	const {
		data: {
			data: withdrawalAdjustmentReasonList,
		} = {} as IGetWithdrawalReasonListResponse,
		isLoading: isGetWithdrawalReasonLoading,
	} = useGetWithdrawalAdjustmentReasonListQuery(null)

	const [
		submitWithdrawalAdjustment,
		{ isLoading: isSubmitWithdrawalAdjustmentLoading },
	] = useSubmitWithdrawalAdjustmentMutation()

	const handleSearch = async () => {
		const { userName, sabaId } = filterForm.getFieldsValue()
		if (!isEmpty(userName) && !isEmpty(sabaId)) {
			message.error(
				t('Label_FieldsOneTime', {
					FieldA: t('Label_MemberId'),
					FieldB: t('Label_SabaId'),
				})
			)
		} else {
			try {
				await getWithdrawalAdjustment({ siteId, userName, sabaId }).unwrap()
				setQueryParams({
					userName,
					sabaId,
				})
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}
	}

	const handleSubmit = async () => {
		const formData = await form.validateFields()
		const { custId } = withdrawalAdjustment
		if (!custId) return
		try {
			const response = await submitWithdrawalAdjustment({
				custId,
				...formData,
			}).unwrap()
			message.success(response?.message || t('System.Label_Success'))
			form.resetFields()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams)) return
			const { sabaId = '', userName = '' } = queryParams
			filterForm.setFieldsValue({
				sabaId,
				userName,
			})
			handleSearch()
		}
		init()
	}, [])

	useEffect(() => {
		if (!isGetWithdrawalReasonLoading) {
			form.setFieldsValue({
				reasonId: head(withdrawalAdjustmentReasonList)?.value,
			})
		}
	}, [isGetWithdrawalReasonLoading])

	const loading =
		isGetWithdrawalAdjustmentLoading ||
		isGetWithdrawalReasonLoading ||
		isSubmitWithdrawalAdjustmentLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<WithdrawalAdjustmentFilter
				loading={loading}
				form={filterForm}
				onSearch={handleSearch}
			/>

			{!isEmpty(queryParams) && (
				<WithdrawalAdjustmentForm
					loading={loading}
					withdrawalAdjustment={withdrawalAdjustment}
					withdrawalAdjustmentReasonList={withdrawalAdjustmentReasonList}
					form={form}
				/>
			)}
			<AffixButtons>
				<AffixButtons.Saved
					disabled={!addPermission?.canUse || isEmpty(queryParams)}
					onClick={handleSubmit}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default WithdrawalAdjustment
