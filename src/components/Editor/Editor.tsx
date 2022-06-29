import { FC, useEffect, useState } from 'react'
import { EditorState as IEditorState, EditorProps } from 'react-draft-wysiwyg'
import { useEditorModule } from './hooks/useEditorModule'
import { coverDraftToHtml, coverHtmlToEditorState } from './utils'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import ColorPicker from './ColorPicker'

interface BaseEditorProps extends EditorProps {
	defaultHtmlState?: string
	onHtmlStateChange: (html: string) => void
}

const BaseEditor: FC<BaseEditorProps> = ({
	defaultHtmlState,
	onHtmlStateChange,
}) => {
	const Editor = useEditorModule()
	const [isInit, setIsInit] = useState(false)
	const [editorState, setEditorState] = useState<any>()

	const onEditorStateChange = async (newEditorState: IEditorState) => {
		setEditorState(newEditorState)

		const newHtml = await coverDraftToHtml(newEditorState)

		onHtmlStateChange(newHtml)
	}

	useEffect(() => {
		const init = async () => {
			const { EditorState } = await import('draft-js')
			if (defaultHtmlState !== undefined && !isInit) {
				const newEditState = await coverHtmlToEditorState(
					defaultHtmlState ?? ''
				)
				onEditorStateChange(newEditState ?? EditorState.createEmpty())
				setIsInit(true)
			}
		}

		init()
	}, [defaultHtmlState])

	return (
		Editor && (
			<Editor
				editorClassName='editor-main'
				editorState={editorState}
				onEditorStateChange={onEditorStateChange}
				toolbar={{
					options: [
						'inline',
						'blockType',
						'fontSize',
						'fontFamily',
						'list',
						'textAlign',
						'colorPicker',
						'link',
						'emoji',
						'image',
						'remove',
						'history',
					],
					colorPicker: { component: ColorPicker },
					blockType: {
						inDropdown: true,
						options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
						className: undefined,
						component: undefined,
						dropdownClassName: undefined,
					},
				}}
			/>
		)
	)
}

export { BaseEditor as Editor }
