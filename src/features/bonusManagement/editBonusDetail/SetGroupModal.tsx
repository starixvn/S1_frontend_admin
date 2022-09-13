import { FC, useContext, useEffect } from 'react'
import { Button, Form, Input, Modal, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { EditBonusContext } from 'features/bonusManagement/editBonusDetail/editBonusContext'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { AmountTypeEnum } from 'features/bonusManagement/constants'

interface ISetGroupModalProps {
	visible: boolean
	onFinish: () => void
}

const SetGroupModal: FC<ISetGroupModalProps> = ({ visible, onFinish }) => {
	const { t } = useTranslation()
	const { form, currentActiveCurrency } = useContext(EditBonusContext)
	const { isoCode } = currentActiveCurrency
	const type = form?.getFieldValue(['specific', isoCode, 'bonusType'])
	// 這裡另外寫一個 Form 主要是 Form.List 不支援 validate 特定 路徑 , 所以若用共用的 Form 在驗證時會全部一起驗證 ,
	// 這邊希望先驗證這個 modal 內的資料就好 , 故先使用獨立的 form 表單再將資料寫入共用 form
	const [modalForm] = Form.useForm()

	const handleFinished = async () => {
		const { tierAmountList } = await modalForm.validateFields()
		form?.setFieldsValue({
			specific: {
				[isoCode]: {
					tierAmountList,
				},
			},
		})
		onFinish()
	}

	useEffect(() => {
		if (visible) {
			// init
			const currentList = form?.getFieldValue([
				'specific',
				isoCode,
				'tierAmountList',
			])
			modalForm.setFieldsValue({
				tierAmountList: currentList,
			})
		}
	}, [visible])

	return (
		<Modal
			visible={visible}
			onCancel={onFinish}
			onOk={handleFinished}
			okText={t('Label_Save')}
			cancelText={t('Label_Cancel')}
		>
			<Form form={modalForm} layout='vertical' style={{ marginTop: 8 }}>
				<Form.List name='tierAmountList'>
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<Space
									key={key}
									style={{ display: 'flex', marginBottom: 8 }}
									align='baseline'
								>
									<Form.Item
										{...restField}
										name={[name, 'requiredAmount']}
										label={key === 0 ? t('Label_RedepositAmount') : null}
										rules={[
											{
												required: true,
												message: t('Label_RequiredText'),
											},
										]}
									>
										<Input type='number' />
									</Form.Item>
									{type === AmountTypeEnum.Percentage && (
										<>
											<Form.Item
												{...restField}
												name={[name, 'bonus']}
												label={key === 0 ? t('Label_Percentage') : null}
												rules={[
													{
														required: true,
														message: t('Label_RequiredText'),
													},
												]}
											>
												<Input
													type='number'
													placeholder={t('Label_Percentage')}
												/>
											</Form.Item>
											<Form.Item
												{...restField}
												name={[name, 'maxBonus']}
												label={key === 0 ? t('Label_MaxBonus') : null}
												rules={[
													{
														required: true,
														message: t('Label_RequiredText'),
													},
												]}
											>
												<Input
													type='number'
													placeholder={t('Label_MaxBonus')}
												/>
											</Form.Item>
										</>
									)}
									{type === AmountTypeEnum.Amount && (
										<Form.Item
											{...restField}
											name={[name, 'bonus']}
											label={key === 0 ? t('Label_Bonus') : null}
											rules={[
												{
													required: true,
													message: t('Label_RequiredText'),
												},
											]}
										>
											<Input type='number' placeholder={t('Label_Bonus')} />
										</Form.Item>
									)}
									<Form.Item label={key === 0 ? ' ' : null}>
										{/* 為了讓第一筆 的刪除符號可以在正確位置 , 所以在 label 動了手腳  */}
										<MinusCircleOutlined onClick={() => remove(name)} />
									</Form.Item>
								</Space>
							))}
							<Form.Item>
								<Button
									type='dashed'
									onClick={() => add()}
									block
									icon={<PlusOutlined />}
								>
									{t('Label_AddBonusSetting')}
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>
			</Form>
		</Modal>
	)
}

export { SetGroupModal }
