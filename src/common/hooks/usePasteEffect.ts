import { useEffect, MutableRefObject } from 'react'

// 傳入 callBack 與 ref (控制作用區域)
// callBack 會 return paste 內容 與 kind , 透過 判斷 kind 去篩選掉不希望出現的內容
// Kind 只會有 'file' | 'string' 兩種
const usePasteEffect = (
	callBack: (result: File | string | null, kind: 'file' | 'string') => void,
	ref: MutableRefObject<any>
) => {
	const onPaste = async (e: ClipboardEvent) => {
		if (e.clipboardData && e.clipboardData.items) {
			// @ts-ignore
			const [firstItem] = e.clipboardData.items

			if (firstItem.kind === 'file') {
				callBack(firstItem.getAsFile(), 'file')
			} else if (firstItem.kind === 'string') {
				await firstItem.getAsString((text: any) => {
					callBack(text || '', 'string')
				})
			}
		}
	}

	useEffect(() => {
		ref.current?.addEventListener('paste', onPaste)
		return () => ref.current?.removeEventListener('paste', onPaste)
	}, [])
}

export { usePasteEffect }
