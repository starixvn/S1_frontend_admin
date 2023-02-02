import { Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { TextAreaProps } from 'antd/lib/input'

interface INoteAreaProps extends TextAreaProps {
	form: any
}
const { TextArea } = Input

const NoteArea = ({ form, ...rest }: INoteAreaProps) => {
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
				<TextArea style={{ height: 80 }} {...rest} />
			</Form.Item>
		</Form>
	)
}

export { NoteArea }
