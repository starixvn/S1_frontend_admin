import paths from 'app/constants/paths'
import { FC, useEffect } from 'react'
import { Form, message, Space, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useAuth } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { AffixButtons } from 'components/AffixButtons'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import TransferAccountManagementForm from './TransferAccountManagementForm'
import {
	useGetBankTransferAccountAgentListQuery,
	useGetBankTransferAccountByIdQuery,
	useSetBankTransferAccountMutation,
} from './api'
import {
	IAddEditForm,
	IBankTransferAccountAgentListResponse,
	IBankTransferAccountData,
} from './type'

const UpdateTransferAccountManagement: FC = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [form] = Form.useForm<IAddEditForm>()
	// * editId:0 時為新增，其它為編輯
	const { editId } = useParams()

	const {
		data: { data: bankTransferAccount = {} as IBankTransferAccountData } = {},
		isFetching: isGetBankTransferAccountByIdFetching,
	} = useGetBankTransferAccountByIdQuery({ id: Number(editId) })

	const [
		setBankTransferAccount,
		{ isLoading: isSetBankTransferAccountLoading },
	] = useSetBankTransferAccountMutation()

	const {
		data: {
			data: agentList = [],
		} = {} as IBankTransferAccountAgentListResponse,
	} = useGetBankTransferAccountAgentListQuery({ siteId })

	const handleSubmit = async () => {
		const values = await form.validateFields()

		try {
			const response = await setBankTransferAccount({
				id: Number(editId),
				siteId,
				...values,
			}).unwrap()

			if (Number(editId) === 0) {
				navigate(
					`/${NEW_SITE_PREFIX_URL}/${paths.bankTransfer.sub.transferAccountManagement.root}`
				)
			}

			message.success(response.message ?? t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const { reason, payId, ...rest } = bankTransferAccount
		form.setFieldsValue({
			...rest,
			reason: reason === 0 ? undefined : reason,
			payId: payId === 0 ? undefined : payId,
		})
	}, [isGetBankTransferAccountByIdFetching])

	if (!editPermission?.canUse) return <Navigate to='/403' />
	return (
		<LayoutContent.Main>
			<LayoutContent.Title title='Finance Account Info' />

			<Space style={{ margin: '0 16px', width: '660px' }}>
				<Typography.Text type='danger'>
					{t('Label_EditTransferAccountManagementDescribe1')}
				</Typography.Text>
			</Space>

			<TransferAccountManagementForm
				form={form}
				loading={isSetBankTransferAccountLoading}
				agentList={agentList}
			/>

			<AffixButtons>
				<AffixButtons.Saved
					loading={isSetBankTransferAccountLoading}
					disabled={!editPermission?.canUse}
					onClick={handleSubmit}
				/>
				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default UpdateTransferAccountManagement
