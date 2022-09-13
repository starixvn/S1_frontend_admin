import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Input, FormInstance, Select, Radio, Space } from 'antd'
import { IGetCategoryData } from '../type'

const { Option } = Select

interface AddModalFilterInterface {
	form: FormInstance
	categoryList: IGetCategoryData[]
}

export enum CategoryTypeEnum {
	Default = 0,
	BirthdayRewardPoint,
	SpecialRewardPoint,
}

export enum AddOrDeduct {
	Add,
	Deduct,
}

const birthdayPoints: Array<{ value: number; displayName: string }> = [
	{ value: 88, displayName: 'GameLevel.Label_VintageClub' },
	{ value: 188, displayName: 'GameLevel.Label_SilverClub' },
	{ value: 288, displayName: 'GameLevel.Label_GoldClub' },
	{ value: 388, displayName: 'GameLevel.Label_TitaniumClub' },
	{ value: 688, displayName: 'GameLevel.Label_DiamondClub' },
	{ value: 888, displayName: 'GameLevel.Label_NovaClub' },
]

const AddPointModalFilter: FC<AddModalFilterInterface> = ({
	form,
	categoryList,
}) => {
	const { t } = useTranslation()

	const categoryId: number = Form.useWatch('categoryId', form)

	const categoryTypeSwitcher = () => {
		if (categoryId === CategoryTypeEnum.BirthdayRewardPoint) {
			return (
				<Form.Item name='point' label={t('Label_AddPoint')}>
					<Select placeholder={t('Label_Select') + t('Label_Point')}>
						{birthdayPoints?.map(point => (
							<Option key={point.value} value={point.value}>{`${
								point.value
							} ${t('Label_Point')} - ${t(point.displayName)}`}</Option>
						))}
					</Select>
				</Form.Item>
			)
		}
		return (
			<>
				<Form.Item name='method' style={{ marginBottom: 0 }}>
					<Radio.Group>
						<Space size='large'>
							<Radio value={AddOrDeduct.Add}>{t('Label_AddPoint')}</Radio>
							<Radio value={AddOrDeduct.Deduct}>{t('Label_DeductPoint')}</Radio>
						</Space>
					</Radio.Group>
				</Form.Item>
				<Form.Item
					name='point'
					rules={[
						{
							required: true,
							message: t('Label_Required', { key: t('Label_Point') }),
						},
					]}
				>
					<Input type='number' />
				</Form.Item>
			</>
		)
	}

	useEffect(() => {
		if (categoryId !== CategoryTypeEnum.BirthdayRewardPoint) {
			form.setFieldsValue({
				point: null,
				method: AddOrDeduct.Add,
			})
		} else {
			form.setFieldsValue({
				point: birthdayPoints[0],
			})
		}
	}, [categoryId])

	return (
		<Form layout='vertical' size='middle' form={form}>
			<Form.Item
				name='userName'
				label={t('Label_MemberId')}
				rules={[
					{
						required: true,
						message: t('Label_Required', { key: t('Label_MemberId') }),
					},
				]}
			>
				<Input allowClear placeholder={t('Label_MemberId')} />
			</Form.Item>
			<Form.Item
				name='categoryId'
				label={t('Label_Category')}
				rules={[
					{
						required: true,
						message: t('Label_Required', { key: t('Label_Category') }),
					},
				]}
			>
				<Select placeholder={t('Label_Select')}>
					{categoryList?.map(item => (
						<Option value={item.id}>{item.name}</Option>
					))}
				</Select>
			</Form.Item>
			{categoryTypeSwitcher()}

			<Form.Item name='memo' label={t('Label_Memo')}>
				<Input allowClear placeholder={t('Label_Memo')} />
			</Form.Item>
		</Form>
	)
}

export { AddPointModalFilter }
