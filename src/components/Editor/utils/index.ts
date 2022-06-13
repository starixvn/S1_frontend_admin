import { EditorState as IEditorState } from 'react-draft-wysiwyg'

export const coverHtmlToEditorState = async (html: string) => {
	const { EditorState, ContentState } = await import('draft-js')
	const htmlToDraft = (await import('html-to-draftjs')).default

	const blocksFromHtml = htmlToDraft(html)
	const { contentBlocks } = blocksFromHtml
	const contentState = ContentState.createFromBlockArray(contentBlocks)
	const editorState = EditorState.createWithContent(contentState)
	return editorState
}

export const coverDraftToHtml = async (editorState: IEditorState) => {
	const draftToHtml = (await import('draftjs-to-html')).default
	const { convertToRaw } = await import('draft-js')

	return draftToHtml(convertToRaw(editorState.getCurrentContent()))
}
