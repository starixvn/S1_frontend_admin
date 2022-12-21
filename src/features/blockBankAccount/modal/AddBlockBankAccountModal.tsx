import React from 'react'
import { Form, Input, Modal, ModalProps, Select } from 'antd'
import {
	selectBankInfoSysByCurrencyIds,
	useGetBankInfoSysQuery,
} from 'common/service/allDataApi'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import { useTranslation } from 'react-i18next'

const { Option } = Select

interface IAddBlockBankAccountModalProps extends ModalProps {
	onSubmit: ({
		sysId,
		accountNum,
	}: {
		sysId: number

		accountNum: string
	}) => void
}

const AddBlockBankAccountModal = ({
	open,
	onOk,
	onSubmit,
	...props
}: IAddBlockBankAccountModalProps) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [form] = Form.useForm<{
		currencyId: number
		sysId: number
		accountNum: string
	}>()
	const formCurrencyId = Form.useWatch('currencyId', form)

	const { bankInfoSys } = useGetBankInfoSysQuery(null, {
		selectFromResult: selectBankInfoSysByCurrencyIds([formCurrencyId]),
		// * 選擇 currencyId 後才觸發 api
		skip: !formCurrencyId,
	})

	const onClosed = () => {
		form.resetFields()
	}

	return (
		<Modal
			forceRender
			open={open}
			width={400}
			onOk={async () => {
				await form.validateFields().then(async ({ sysId, accountNum }) => {
					onSubmit({ sysId, accountNum })
					form.resetFields()
				})
			}}
			afterClose={onClosed}
			{...props}
		>
			<Form
				layout='vertical'
				form={form}
				initialValues={{
					currencyId: null,
					sysId: null,
					accountNum: '',
				}}
			>
				<Form.Item
					label={t('Label_Currency')}
					name='currencyId'
					rules={[
						{
							required: true,
							message: t('Label_Required', {
								key: t('Label_Currency'),
							}),
						},
					]}
				>
					<Select
						placeholder={t('Label_Currency')}
						onChange={() => form.setFieldValue('sysId', null)}
					>
						{currencyListBySite?.map(({ currencyId, isoCode }) => (
							<Option key={currencyId} value={currencyId}>
								{isoCode}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					name='sysId'
					label={t('Label_Bank')}
					rules={[
						{
							required: true,
							message: t('Label_Required', {
								key: t('Label_Bank'),
							}),
						},
					]}
				>
					<Select placeholder={t('Label_Bank')}>
						{bankInfoSys?.map(({ sysId, bankName }) => (
							<Option key={sysId} value={sysId}>
								{bankName}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					label={t('Label_AccountNum')}
					name='accountNum'
					rules={[
						{
							required: true,
							message: t('Label_Required', {
								key: t('Label_AccountNum'),
							}),
						},
					]}
				>
					<Input allowClear />
				</Form.Item>
			</Form>
		</Modal>
	)
}

export { AddBlockBankAccountModal }
