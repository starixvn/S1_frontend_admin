import { Modal, Typography } from 'antd'
import ReactJson from 'react-json-view'

interface IFailBetInfoModalProps {
	loading: boolean
	visible: boolean
	onCancel: () => void
	FailBetInfoDetail: string
}

const FailBetInfoModal = ({
	loading,
	visible,
	onCancel,
	FailBetInfoDetail,
}: IFailBetInfoModalProps) => {
	return (
		<Modal
			confirmLoading={loading}
			open={visible}
			footer={false}
			onCancel={onCancel}
			width='50vw'
		>
			<Typography.Text>
				{/* ReactJson 套件貌似無法處理客製化正負數字顏色 */}
				<ReactJson
					style={{ wordBreak: 'break-word' }}
					src={JSON.parse(FailBetInfoDetail)}
					displayDataTypes={false}
				/>
			</Typography.Text>
		</Modal>
	)
}

export default FailBetInfoModal
