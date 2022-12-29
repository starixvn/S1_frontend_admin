import { Modal, Typography } from 'antd'
import ReactJson from 'react-json-view'

interface IFailBetInfoModalProps {
	loading: boolean
	visible: boolean
	onCancel: () => void
	failBetInfoList: string
}

const FailBetInfoModal = ({
	loading,
	visible,
	onCancel,
	failBetInfoList,
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
				<ReactJson
					style={{ wordBreak: 'break-word' }}
					src={JSON.parse(failBetInfoList)}
					displayDataTypes={false}
				/>
			</Typography.Text>
		</Modal>
	)
}

export default FailBetInfoModal
