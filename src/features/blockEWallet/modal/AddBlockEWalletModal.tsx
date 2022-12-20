import React from 'react'
import { Form, Input, Modal, ModalProps, Select } from 'antd'
import { filter } from 'lodash'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import { useTranslation } from 'react-i18next'
import { useGetEWalletTypesQuery } from 'features/blockEWallet/api'

const { Option } = Select

interface IAddBlockEWalletModalProps extends ModalProps {
	onSubmit: ({
		sysId,
		accountNum,
	}: {
		sysId: number

		accountNum: string
	}) => void
}

const AddBlockEWalletModal = ({
	open,
	onOk,
	onSubmit,

	...props
}: IAddBlockEWalletModalProps) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [form] = Form.useForm<{
		currencyId: number
		sysId: number
		accountNum: string
	}>()
	const formCurrencyId = Form.useWatch('currencyId', form)

	const { data: eWalletTypes } = useGetEWalletTypesQuery(null, {
		selectFromResult: ({ data: { data } = {}, isFetching }) => {
			const newData = filter(data, { currencyId: formCurrencyId })
			return { data: newData, isFetching }
		},
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
					label={t('Label_EWalletName')}
					rules={[
						{
							required: true,
							message: t('Label_Required', {
								key: t('Label_EWalletName'),
							}),
						},
					]}
				>
					<Select placeholder={t('Label_EWalletName')}>
						{eWalletTypes?.map(({ sysId, eWalletName }) => (
							<Option key={sysId} value={sysId}>
								{eWalletName}
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

export { AddBlockEWalletModal }
