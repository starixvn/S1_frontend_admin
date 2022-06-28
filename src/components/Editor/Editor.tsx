import { FC, useEffect, useState } from 'react'
import { EditorState as IEditorState, EditorProps } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { useEditorModule } from './hooks/useEditorModule'
import { coverDraftToHtml, coverHtmlToEditorState } from './utils'

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
				editorState={editorState}
				onEditorStateChange={onEditorStateChange}
			/>
		)
	)
}

export { BaseEditor as Editor }
