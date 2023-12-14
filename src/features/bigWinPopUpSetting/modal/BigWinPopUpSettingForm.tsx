import React from 'react'
import { Col, Form, FormInstance, Row, Select, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { InputNumber } from 'components'
import { MultipleSelect } from 'components/Select'
import { IGetCategoryResponse } from 'features/betList/type'
import { useGetCategoryQuery } from 'features/betList/api'

const { Option } = Select

interface IBigWinPopUpSettingFormProps {
	form: FormInstance<{
		siteId: number
		currencyId: number
		multipleOfWinning: number
		minOfWinning: number
		iTpCategoryList: number[]
	}>
	loading: boolean
}

const BigWinPopUpSettingForm = ({
	form,
	loading,
}: IBigWinPopUpSettingFormProps) => {
	const { t } = useTranslation()

	const {
		data: { data: categories = [] } = {} as IGetCategoryResponse,
		isFetching: isGetCategoryFetching,
	} = useGetCategoryQuery(null)

	const onChangeCurrency = (newCategory: Array<string | number>) => {
		if (newCategory.includes('all')) {
			form.setFieldsValue({
				iTpCategoryList: categories?.map(({ categoryId }) => categoryId),
			})
		} else {
			form.setFieldsValue({
				iTpCategoryList: newCategory,
			})
		}
	}

	return (
		<Spin spinning={loading || isGetCategoryFetching}>
			<Form layout='vertical' size='middle' form={form}>
				<Row gutter={16}>
					<Col lg={12} md={12} xs={24}>
						<Form.Item
							name='iTpCategoryList'
							label={t('Label_Category')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_Category'),
									}),
								},
							]}
						>
							<MultipleSelect
								showSearch
								onChange={onChangeCurrency}
								placeholder={t('Label_Select')}
								filterOption={(input, option) =>
									(option!.children as unknown as string)
										.toLowerCase()
										.includes(input.toLowerCase())
								}
							>
								{(categories?.length as number) > 1 && (
									<Option value='all'>{t('Label_SelectAll')}</Option>
								)}

								{categories?.map(({ categoryId, categoryName }) => (
									<Option key={categoryId} value={categoryId}>
										{categoryName}
									</Option>
								))}
							</MultipleSelect>
						</Form.Item>
					</Col>
					<Col lg={12} md={12} xs={24}>
						<Form.Item
							name='multipleOfWinning'
							label={t('Label_MultipleOfWinning')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_MultipleOfWinning'),
									}),
								},
							]}
						>
							<InputNumber min={0} />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col lg={12} md={12} xs={24}>
						<Form.Item
							name='minOfWinning'
							label={t('Label_WinProfit')}
							rules={[
								{
									required: true,
									message: t('Label_Required', {
										key: t('Label_WinProfit'),
									}),
								},
							]}
						>
							<InputNumber min={0} />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Spin>
	)
}

export default BigWinPopUpSettingForm
