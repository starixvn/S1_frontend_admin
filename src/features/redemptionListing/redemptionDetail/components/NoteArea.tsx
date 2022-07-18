import { FC } from 'react'
import { Form, FormInstance, Input } from 'antd'
import { useTranslation } from 'react-i18next'

interface NoteAreaInterface {
	form: FormInstance
}
const { TextArea } = Input

const NoteArea: FC<NoteAreaInterface> = ({ form }) => {
	const { t } = useTranslation()
	return (
		<Form form={form} layout='vertical'>
			<Form.Item
				label={t('Label_Note')}
				name='comment'
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_Note'),
						}),
					},
				]}
			>
				<TextArea style={{ height: 80 }} />
			</Form.Item>
		</Form>
	)
}

export { NoteArea }
