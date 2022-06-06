import { FC, useEffect, useState } from 'react'
import { convertToRaw, EditorState, ContentState } from 'draft-js'
import {
	Editor,
	EditorState as IEditorState,
	EditorProps,
} from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const coverHtmlToEditorState = (html: string) => {
	const blocksFromHtml = htmlToDraft(html)
	const { contentBlocks } = blocksFromHtml
	const contentState = ContentState.createFromBlockArray(contentBlocks)
	const editorState = EditorState.createWithContent(contentState)

	return editorState
}

const coverDraftToHtml = (editorState: IEditorState) =>
	draftToHtml(convertToRaw(editorState.getCurrentContent()))

interface BaseEditorProps extends EditorProps {
	defaultHtmlState?: string
	onHtmlStateChange: (html: string) => void
}

const BaseEditor: FC<BaseEditorProps> = ({
	defaultHtmlState,
	onHtmlStateChange,
}) => {
	const [isInit, setIsInit] = useState(false)

	const [editorState, setEditorState] = useState(EditorState.createEmpty())

	const onEditorStateChange = (newEditorState: IEditorState) => {
		setEditorState(newEditorState)

		onHtmlStateChange(coverDraftToHtml(newEditorState))
	}

	useEffect(() => {
		if (defaultHtmlState !== undefined && !isInit) {
			onEditorStateChange(coverHtmlToEditorState(defaultHtmlState ?? ''))
			setIsInit(true)
		}
	}, [defaultHtmlState])

	return (
		<Editor
			editorState={editorState}
			onEditorStateChange={onEditorStateChange}
		/>
	)
}

export { BaseEditor as Editor }
