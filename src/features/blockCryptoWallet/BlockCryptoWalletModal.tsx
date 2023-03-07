import { useTranslation } from 'react-i18next'
import { Row, Col, Form, Input, Modal, FormInstance } from 'antd'
import { IAddForm } from 'features/blockCryptoWallet/type'

interface IBlockCryptoWalletModalProps {
	open: boolean
	form: FormInstance<IAddForm>
	loading: boolean
	onCancel: () => void
	onFinish: () => void
}

const BlockCryptoWalletModal = ({
	open,
	form,
	loading,
	onCancel,
	onFinish,
}: IBlockCryptoWalletModalProps) => {
	const { t } = useTranslation()

	return (
		<Modal
			title={t('Label_AddBlockCryptoWallet')}
			open={open}
			width='30vw'
			onCancel={onCancel}
			confirmLoading={loading}
			onOk={onFinish}
			afterClose={() => form.resetFields()}
			destroyOnClose
		>
			<Form layout='vertical' form={form} initialValues={{ address: '' }}>
				<Row align='middle' gutter={16}>
					<Col span={18}>
						<Form.Item
							label={t('Label_CryptoWalletAddress')}
							name='address'
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_CryptoWalletAddress'),
									}),
								},
							]}
						>
							<Input />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	)
}

export { BlockCryptoWalletModal }
