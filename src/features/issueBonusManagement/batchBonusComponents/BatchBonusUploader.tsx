import { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { useTranslation } from 'react-i18next'
import { xlsxMimeType } from 'features/balanceAdjustment/balanceAdjustment/BalanceAdjustmentForm'
import { useEffect, useState } from 'react'
import { Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { StyleUpload } from 'features/bankCardManagement/StyleUpload'
import { RcFile } from 'antd/es/upload'

interface IBatchBonusUploaderProps {
	onUploadBonus: (file: RcFile) => void
}

const BatchBonusUploader = ({ onUploadBonus }: IBatchBonusUploaderProps) => {
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const { t } = useTranslation()

	const uploadProps: UploadProps = {
		fileList,
		onRemove: () => {
			setFileList([])
		},
		accept: xlsxMimeType,
		maxCount: 1,
		beforeUpload: () => false,
		onChange: async ({ fileList: newFileList }) => {
			// 只會有一個
			const currentFile = newFileList[0]
			// 狀態更新
			currentFile.status = 'uploading'
			setFileList([currentFile])
			try {
				await onUploadBonus(currentFile.originFileObj as RcFile)
				currentFile.status = 'done'
				setFileList([currentFile])
			} catch (error) {
				currentFile.status = 'error'
				setFileList([currentFile])
			}
		},
	}

	useEffect(() => {
		// unMount 直接抹掉資料
		return setFileList([])
	}, [])

	return (
		<StyleUpload {...uploadProps}>
			<Button icon={<UploadOutlined />}>
				{t('Label_Upload', { key: t('Label_File') })}
			</Button>
		</StyleUpload>
	)
}

export { BatchBonusUploader }
