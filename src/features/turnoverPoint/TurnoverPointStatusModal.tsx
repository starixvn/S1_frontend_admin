import { FC, useEffect } from 'react'
import { Form, FormInstance, Modal, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { MultipleSelect } from 'components/Select'
import { IGetTurnoverPointStatusSettingData } from './type'

const { Option } = Select
interface ITurnoverPointStatusModal {
	loading: boolean
	visible: boolean
	onFinish: () => void
	onCancel: () => void
	turnoverPointStatusData: IGetTurnoverPointStatusSettingData[]
	modalTitle: string
	form: FormInstance
}

const TurnoverPointStatusModal: FC<ITurnoverPointStatusModal> = ({
	loading,
	visible,
	onFinish,
	onCancel,
	turnoverPointStatusData,
	modalTitle,
	form,
}) => {
	const { t } = useTranslation()
	const selectAll = turnoverPointStatusData?.map(item => item.tpGameTypeId)
	const handleSelectOnChange = (newCategoryList: Array<number | string>) => {
		if (newCategoryList.includes('all')) {
			form.setFieldsValue({
				selectCategoryList: selectAll,
			})
		} else {
			form.setFieldsValue({ selectCategoryList: newCategoryList })
		}
	}
	useEffect(() => {
		if (!loading && turnoverPointStatusData.length !== 0) {
			const selectValue: Array<number | string> = []
			turnoverPointStatusData.forEach(item => {
				if (item.status) {
					selectValue.push(item.tpGameTypeId)
				}
			})
			if (selectValue.length === turnoverPointStatusData.length) {
				form.setFieldsValue({
					selectCategoryList: selectAll,
				})
			} else {
				form.setFieldsValue({ selectCategoryList: selectValue })
			}
		}
	}, [loading])

	return (
		<Modal
			open={visible}
			title={<div style={{ textAlign: 'center' }}>{modalTitle}</div>}
			okText={t('Label_Save')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={() => {
				onCancel()
			}}
			onOk={onFinish}
		>
			<Form form={form} layout='vertical'>
				<Form.Item name='selectCategoryList'>
					<MultipleSelect
						placeholder={t('Label_Select')}
						onChange={handleSelectOnChange}
						style={{ width: '80%' }}
					>
						{/* 怕gameTypeId 有可能重複 , 這裏全選取 'all' */}
						{(turnoverPointStatusData?.length as number) > 1 && (
							<Option value='all'>{t('Label_SelectAll')}</Option>
						)}

						{turnoverPointStatusData?.map(pointStatusData => (
							<Option
								key={pointStatusData.tpGameTypeId}
								value={pointStatusData.tpGameTypeId}
							>
								{pointStatusData.tpGameTypeName}
							</Option>
						))}
					</MultipleSelect>
				</Form.Item>
			</Form>
		</Modal>
	)
}

export { TurnoverPointStatusModal }
