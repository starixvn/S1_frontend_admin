import { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'

const useEditorModule = (): typeof Editor | null => {
	const [editorModule, setEditorModule] = useState<any>()

	useEffect(() => {
		const init = async () => {
			const module = await import('react-draft-wysiwyg')

			setEditorModule(module)
		}
		init()

		return () => {
			setEditorModule(null)
		}
	}, [])

	return editorModule?.Editor ?? null
}

export { useEditorModule }
