import { FC } from 'react'
import { Button, Col, Form, FormInstance, Input, Row, Select } from 'antd'
import { MultipleSelect } from 'components/Select'
import { SearchOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { GIFT_LIST_STATUS, GIFT_LIST_STATUS_OPTIONS } from '../../constants'
import { ICategoriesData, IGiftTagsData } from '../../type'

const { Option } = Select
const { CLOSE, OPEN } = GIFT_LIST_STATUS_OPTIONS

interface IGiftListingFormProps {
	form: FormInstance
	loading: boolean
	categories: ICategoriesData[]
	giftTags: IGiftTagsData[]
	onCategoryIdsChange: (newCategoryIds: number[]) => void
	onTagsChange: (newTags: number[]) => void
	onStatusChange: (newStatuses: (number | 'all')[]) => void
	onSearch: (values: any) => void
}
const GiftListingForm: FC<IGiftListingFormProps> = ({
	form,
	loading,
	categories,
	giftTags,
	onCategoryIdsChange,
	onTagsChange,
	onStatusChange,
	onSearch,
}) => {
	const { t } = useTranslation()

	const handleFinish = async () => {
		const values = form.getFieldsValue()
		onSearch(values)
	}

	return (
		<Form
			form={form}
			initialValues={{
				categoryIds: [],
				tags: [],
				status: [CLOSE, OPEN],
				giftName: '',
			}}
			layout='vertical'
			size='middle'
			onFinish={handleFinish}
		>
			<Row align='middle' gutter={16}>
				<Col lg={6} md={12} xs={12}>
					<Form.Item name='categoryIds' label={t('Label_Category')}>
						<MultipleSelect onChange={onCategoryIdsChange} maxTagCount={0}>
							{categories.length > 1 && (
								<Option value={0}>{t('Label_SelectAll')}</Option>
							)}

							{categories?.map(category => (
								<Option
									key={`${category.categoryName}-${category.categoryId}`}
									value={category.categoryId}
								>
									{category.categoryName}
								</Option>
							))}
						</MultipleSelect>
					</Form.Item>
				</Col>

				<Col lg={6} md={12} xs={12}>
					<Form.Item name='tags' label={t('Label_Tags')}>
						<MultipleSelect onChange={onTagsChange} maxTagCount={0}>
							{giftTags.length > 1 && (
								<Option value={0}>{t('Label_SelectAll')}</Option>
							)}

							{giftTags?.map(giftTag => (
								<Option
									key={`${giftTag.tagName}-${giftTag.tagId}`}
									value={giftTag.tagId}
								>
									{giftTag.tagName}
								</Option>
							))}
						</MultipleSelect>
					</Form.Item>
				</Col>

				<Col lg={6} md={12} xs={12}>
					<Form.Item name='status' label={t('Label_Status')}>
						<MultipleSelect onChange={onStatusChange}>
							<Option value='all'>{t('Label_SelectAll')}</Option>
							{GIFT_LIST_STATUS?.map(status => (
								<Option key={status.value} value={status.value}>
									{t(status.displayKey)}
								</Option>
							))}
						</MultipleSelect>
					</Form.Item>
				</Col>

				<Col lg={6} md={12} xs={12}>
					<Form.Item name='giftName' label={t('Label_Name')}>
						<Input allowClear />
					</Form.Item>
				</Col>
			</Row>

			<br />

			<Row justify='end' align='middle'>
				<Col>
					<Button
						icon={<SearchOutlined />}
						htmlType='submit'
						type='primary'
						loading={loading}
					>
						{t('Label_Search')}
					</Button>
				</Col>
			</Row>
		</Form>
	)
}

export default GiftListingForm
