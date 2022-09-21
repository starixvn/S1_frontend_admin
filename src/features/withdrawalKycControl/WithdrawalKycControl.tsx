import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import {
	useLazyGetWithdrawalKycListQuery,
	useUpdateWithdrawalKycMutation,
} from 'features/withdrawalKycControl/api'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import {
	IGetWithdrawalKycListData,
	IGetWithdrawalKycResponse,
	IUpdateWithdrawalData,
} from 'features/withdrawalKycControl/type'
import { WithdrawalKycControlTable } from 'features/withdrawalKycControl/WithdrawalKycControlTable'
import { useAuth } from 'common/hooks'
import { Form, message } from 'antd'
import { useEffect, useState } from 'react'

const WithdrawalKycControl = ({
	pageTitle,
}: {
	pageTitle?: string
}): JSX.Element => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [form] = Form.useForm<{ amount: number }>()
	const [editingCurrencyId, setEditingCurrencyId] = useState<
		number | undefined
	>(undefined)

	const [
		getWithdrawalKycList,
		{
			data: { data: withdrawalLimitList } = {} as IGetWithdrawalKycResponse,
			isFetching: isGetWithdrawalLimitLoading,
		},
	] = useLazyGetWithdrawalKycListQuery()

	const [updateWithdrawalKyc, { isLoading: isUpdateWithdrawalKycLoading }] =
		useUpdateWithdrawalKycMutation()

	// 因為要手動 trigger 所以寫 lazy 手動觸發
	const handleGetWithdrawalKyc = async () => {
		await getWithdrawalKycList({ siteId })
	}

	const handleSaved = async (record: IGetWithdrawalKycListData) => {
		const { amount } = await form.validateFields()
		const { currencyId, amount: amountBefore } = record
		const before: IUpdateWithdrawalData = {
			amount: amountBefore,
		}
		const after: IUpdateWithdrawalData = {
			amount,
		}
		try {
			await updateWithdrawalKyc({ siteId, currencyId, before, after }).unwrap()
			// 確保更新完資料才關閉 input 框 , 不想要有數字閃爍的行為
			await handleGetWithdrawalKyc()
			message.success(t('System.Label_Success'))
			setEditingCurrencyId(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		handleGetWithdrawalKyc()
	}, [siteId])

	const loading = isGetWithdrawalLimitLoading || isUpdateWithdrawalKycLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<WithdrawalKycControlTable
				editPermission={editPermission}
				loading={loading}
				form={form}
				withdrawalKycListData={withdrawalLimitList}
				onSaved={handleSaved}
				setEditingKey={setEditingCurrencyId}
				editingKey={editingCurrencyId}
			/>
		</LayoutContent.Main>
	)
}

export default WithdrawalKycControl
