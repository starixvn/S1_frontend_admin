import { useMemo } from 'react'
import { useGetDepositReceiptByTransIdQuery } from '../../api'

const useReceiptImage = ({ transId }: { transId: string | undefined }) => {
	const { data: originReceiptImg, isFetching } =
		useGetDepositReceiptByTransIdQuery({ transId })

	// * 每次 re-render 時，這張圖片有抖動的慶況，其原因為：
	// * 每次 re-render URL.createObjectURL 解析出來的 url 都會不同(就算是同一個 image 檔案)，故需要給 useMemo 減少計算量
	const receiptImg = useMemo(
		() => originReceiptImg && URL.createObjectURL(originReceiptImg),
		[originReceiptImg]
	)
	return { receiptImg, isReceiptImgLoading: isFetching }
}

export default useReceiptImage
