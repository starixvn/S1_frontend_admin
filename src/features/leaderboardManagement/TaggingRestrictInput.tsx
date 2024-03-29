import { Button, Card, Col, Form, FormInstance, Row, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { ITagData } from 'features/memberAdministrationList/type'
import { MultipleSelect } from 'components/Select'

const { Option } = Select

interface ITaggingRestrictInputProps {
	isLoading: boolean
	form: FormInstance
	tagList: ITagData[]
	handleUpdateExcludeTagForm: () => void
}

const TaggingRestrictInput = ({
	isLoading,
	form,
	tagList,
	handleUpdateExcludeTagForm,
}: ITaggingRestrictInputProps) => {
	const { t } = useTranslation()

	const handleChangeTags = (newTags: number[]) => {
		if (newTags.includes(0)) {
			form?.setFieldsValue({
				tagsExclude: tagList?.map(({ id }) => id),
			})
		} else {
			form?.setFieldsValue({
				tagsExclude: newTags,
			})
		}
	}

	return (
		<Card
			title={t('Label_TaggingRestrict')}
			bordered={false}
			style={{ marginTop: 20, marginBottom: 20 }}
		>
			<Form
				form={form}
				initialValues={{
					tagsExclude: [],
				}}
			>
				<Form.Item
					name='tagsExclude'
					label={t('Label_Tags')}
					style={{ width: '100%' }}
				>
					<MultipleSelect onChange={handleChangeTags}>
						{(tagList?.length as number) > 1 && (
							<Option value={0}>{t('Label_SelectAll')}</Option>
						)}

						{tagList?.map(({ id, tagName }) => (
							<Option key={id} value={id}>
								{tagName}
							</Option>
						))}
					</MultipleSelect>
				</Form.Item>
			</Form>
			<Row justify='end' align='middle'>
				<Col>
					<Button
						loading={isLoading}
						onClick={handleUpdateExcludeTagForm}
						type='primary'
					>
						{t('Label_Submit')}
					</Button>
				</Col>
			</Row>
		</Card>
	)
}

export default TaggingRestrictInput
