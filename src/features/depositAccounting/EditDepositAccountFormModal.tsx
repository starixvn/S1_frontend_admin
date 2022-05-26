import { FC, useEffect } from 'react'
import { Form, Input, message, Modal, Select, Spin } from 'antd'
import { ModalState } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { selectUserSite } from 'common/enum'
import { useAppSelector } from 'app/store'
import {
	GET_BANK_INFO_OFF_LIST_ARGS,
	useGetBankInfoOffListQuery,
} from 'common/service/baseDataApi/api'
import { useLazyGetDepositAccountByTransIdQuery } from './api'

const { Option } = Select

interface IEditDepositAccountFormModalProps {
	editTransId: string
	editCurrencyId?: number
	loading: boolean
	modal: ModalState
	onFinish: ({
		transId,
		accountNo,
		memo,
	}: {
		transId: string
		accountNo: string
		memo: string
	}) => void
}

const EditDepositAccountFormModal: FC<IEditDepositAccountFormModalProps> = ({
	editTransId,
	editCurrencyId,
	loading,
	modal,
	onFinish,
}) => {
	const { visible, onCancel } = modal
	const [form] = Form.useForm()
	const { t } = useTranslation()
	const userSite = useAppSelector(selectUserSite)

	const {
		data: { data: bankInfoOffList } = {},
		isFetching: isBankInfoOffListFetching,
	} = useGetBankInfoOffListQuery({
		siteId: userSite?.siteId,
		currencyId: editCurrencyId,
		purpose: GET_BANK_INFO_OFF_LIST_ARGS.PURPOSE.DEPOSIT,
	})

	const [
		getDepositAccountByTransId,
		{ isFetching: isDepositAccountByTransIdFetching },
	] = useLazyGetDepositAccountByTransIdQuery()

	const handleDepositAccountByTransId = async (transId: string) => {
		try {
			const { data: depositAccount } = await getDepositAccountByTransId(
				transId
			).unwrap()

			const { userName, amount, accountNo, memo } = depositAccount ?? {}
			form.setFieldsValue({
				userName,
				amount,
				accountNo,
				memo,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (visible) {
			handleDepositAccountByTransId(editTransId)
		} else {
			form.resetFields()
		}
	}, [visible])

	return (
		<Modal
			visible={visible}
			title={t('Label_EditDepositAccount')}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			onOk={() => {
				form.validateFields().then(async values => {
					const { accountNo, memo } = values
					await onFinish({ transId: editTransId, accountNo, memo })

					onCancel()
				})
			}}
		>
			<Spin
				spinning={
					isDepositAccountByTransIdFetching || isBankInfoOffListFetching
				}
			>
				<Form
					form={form}
					layout='vertical'
					initialValues={{ accountNo: '', memo: '' }}
				>
					<Form.Item label={t('Label_MemberId')} name='userName'>
						<Input readOnly />
					</Form.Item>

					<Form.Item label={t('Label_DepositAmount')} name='amount'>
						<Input readOnly />
					</Form.Item>

					<Form.Item
						name='accountNo'
						label={t('Label_AccountNo')}
						rules={[{ required: true }]}
					>
						<Select placeholder='select'>
							{bankInfoOffList?.map(bankInfo => (
								<Option key={bankInfo.bankId} value={bankInfo.accountNo}>
									{`${bankInfo.accountName} / ${bankInfo.bankName} / ${bankInfo.accountNo}`}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item label={t('Label_Memo')} name='memo'>
						<Input allowClear />
					</Form.Item>
				</Form>
			</Spin>
		</Modal>
	)
}

export default EditDepositAccountFormModal
