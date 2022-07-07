import { FC } from 'react'
import {
	Button,
	Checkbox,
	Col,
	Divider,
	Form,
	FormInstance,
	Input,
	InputNumber,
	Row,
	Select,
} from 'antd'
import { MultipleSelect } from 'components/Select'
import { useTranslation } from 'react-i18next'
import { ICategoriesData, IGiftTagsData } from 'features/giftListing/type'
import ImageUploader from './ImageUploader'

const { Option } = Select

interface IAddGiftListingFormProps {
	form: FormInstance
	lang: string
	categories: ICategoriesData[]
	giftTags: IGiftTagsData[]
	pictureUrl?: string | undefined
}

const GiftListingForm: FC<IAddGiftListingFormProps> = ({
	form,
	lang,
	categories: originCategories,
	giftTags: originGiftTags,
	pictureUrl,
}) => {
	const { t } = useTranslation()
	const showStock = Form.useWatch<boolean>('showStock', form)

	// * 只回傳當前語系的資料
	const categories = originCategories.filter(category => category.lang === lang)
	const giftTags = originGiftTags.filter(giftTag => giftTag.lang === lang)

	const onToggleShowStockChecked = () => {
		form.setFieldsValue({
			showStock: !showStock,
		})
	}
	const onTagsChange = (newTags: number[]) => {
		const tagIds = newTags.includes(0)
			? giftTags?.map(({ tagId }) => tagId)
			: newTags
		form.setFieldsValue({
			tags: tagIds,
		})
	}

	return (
		<Form
			form={form}
			name='addGiftListingForm'
			layout='vertical'
			size='middle'
			initialValues={{
				categoryId: null,
				fileList: [],
				info: {},
				point: null,
				priceWorth: null,
				sort: null,
				showStock: false,
				stock: null,
				tags: [],
			}}
		>
			<Row gutter={24}>
				<Col span={12}>
					<Form.Item
						name={['infos', lang, 'name']}
						label={t('Label_GiftName')}
						rules={[
							{
								required: true,
								message: t('Label_Required', {
									key: t('Label_GiftName'),
								}),
							},
						]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						name={['infos', lang, 'description']}
						label={t('Label_GiftDescription')}
						rules={[
							{
								required: true,
								message: t('Label_Required', {
									key: t('Label_GiftDescription'),
								}),
							},
						]}
					>
						<Input />
					</Form.Item>
				</Col>
			</Row>

			<Divider />

			<Row gutter={24}>
				<Col span={12}>
					<Form.Item
						// * 當該語系的 'categories' 長度為零則不給值
						name={categories.length > 0 ? 'categoryId' : ''}
						label={t('Label_Category')}
					>
						<Select placeholder={t('Label_Select')}>
							{categories?.map(category => (
								<Option
									key={`${category.lang}-${category.categoryId}`}
									value={category.categoryId}
								>
									{category.categoryName}
								</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						// * 當該語系的 'giftTags' 長度為零，不給值
						name={giftTags.length > 0 ? 'tags' : ''}
						label={t('Label_Tags')}
					>
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
			</Row>
			<Row gutter={24}>
				<Col span={6}>
					<Form.Item
						name='priceWorth'
						label={t('Label_PriceWorth')}
						extra={t('Label_NoDisplayInFrontEnd')}
						rules={[
							{
								required: true,
								message: t('Label_Required', {
									key: t('Label_PriceWorth'),
								}),
							},
						]}
					>
						<InputNumber type='number' style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item
						name='point'
						label={t('Label_PointToApply')}
						rules={[
							{
								required: true,
								message: t('Label_Required', {
									key: t('Label_PointToApply'),
								}),
							},
						]}
					>
						<InputNumber type='number' style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col lg={6} span={12}>
					<Form.Item
						label={t('Label_Stock')}
						extra={t('Label_CheckedToDisplayStockInFrontEnd')}
					>
						<Input.Group compact>
							<Button onClick={onToggleShowStockChecked}>
								<Form.Item name='showStock' noStyle valuePropName='checked'>
									<Checkbox />
								</Form.Item>
							</Button>
							<Form.Item
								name='stock'
								noStyle
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_Stock'),
										}),
									},
								]}
							>
								<InputNumber
									type='number'
									style={{ width: 'calc(100% - 48px)' }}
								/>
							</Form.Item>
						</Input.Group>
					</Form.Item>
				</Col>
			</Row>

			<ImageUploader form={form} pictureUrl={pictureUrl} />
		</Form>
	)
}

export default GiftListingForm
