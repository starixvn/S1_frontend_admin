import { FC, useEffect, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { apiKey } from './constants'

interface ITinymceEditorProps {
	defaultHtmlState?: string
	onHtmlStateChange: (html: string) => void
}

const TinymceEditor: FC<ITinymceEditorProps> = ({
	defaultHtmlState,
	onHtmlStateChange,
}) => {
	const editorRef = useRef<any>(null)
	const [defaultHtml, setDefaultHtml] = useState<string>()

	useEffect(() => {
		// initialValue 只能更新一次
		if (!defaultHtml) {
			setDefaultHtml(defaultHtmlState)
		}
	}, [defaultHtmlState])

	return (
		<Editor
			// eslint-disable-next-line no-return-assign
			onInit={(evt, editor) => (editorRef.current = editor)}
			apiKey={apiKey}
			onChange={(evt, editor) => {
				onHtmlStateChange(editor.getContent())
			}}
			initialValue={defaultHtml}
			init={{
				height: 500,
				min_width: 300,
				width: '100%',
				menubar: false,
				plugins: [
					'image',
					'link',
					'lists',
					'preview',
					'table',
					'code',
					'help',
					'fullscreen',
					// * 先註解掉此付費功能
					// 'powerpaste',
				],
				toolbar: [
					'undo redo bold italic underline strikethrough fontfamily fontsize forecolor backcolor alignleft aligncenter alignright alignjustify numlist bullist table link image code preview help fullscreen',
				],
				powerpaste_allow_local_images: true,
				powerpaste_word_import: 'prompt',
				powerpaste_html_import: 'prompt',
			}}
		/>
	)
}

export { TinymceEditor }
