import { FC, useEffect } from 'react'
import { Form, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { assign } from 'lodash'
import {
	AddOrDeduct,
	AddPointModalFilter,
	CategoryTypeEnum,
} from './AddPointModalFilter'
import { IGetCategoryData, IManualRewardPointArgs } from '../type'

interface IAddPointModal {
	loading: boolean
	visible: boolean
	success: boolean
	onFinish: (args: IManualRewardPointArgs) => void
	onCancel: () => void
	categoryList: IGetCategoryData[]
}

const AddPointModal: FC<IAddPointModal> = ({
	loading,
	visible,
	success,
	onFinish,
	onCancel,
	categoryList,
}) => {
	const [form] = Form.useForm()
	const { t } = useTranslation()

	const convertFormValue = async (): Promise<IManualRewardPointArgs> => {
		const { userName, categoryId, method, memo, point } =
			await form.validateFields()
		const result: IManualRewardPointArgs = {
			categoryId,
			memo: memo ?? '',
			point: 0,
			userName,
		}
		if (categoryId === CategoryTypeEnum.BirthdayRewardPoint) {
			return assign(result, { point })
		}
		if (method === AddOrDeduct.Add) {
			return assign(result, { point: Math.abs(point) })
		}
		return assign(result, { point: Math.abs(point) * -1 })
	}
	useEffect(() => {
		if (!visible || success) {
			form.resetFields()
		}
	}, [visible, success])
	return (
		<Modal
			open={visible}
			title={<div style={{ textAlign: 'center' }}>{t('Label_AddPoint')}</div>}
			okText={t('Label_Save')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			onOk={async () => {
				const args = await convertFormValue()
				onFinish(args)
			}}
			width={400}
		>
			<AddPointModalFilter form={form} categoryList={categoryList} />
		</Modal>
	)
}

export { AddPointModal }
