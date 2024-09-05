import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { List, Modal } from 'antd'
import { TFpsAssociateDevicesData } from 'features/fpsDeviceReport/type'

interface IFpsAssociateAccountModalProps {
	loading: boolean
	deviceList: TFpsAssociateDevicesData[]
	visible: boolean
	onCancel: () => void
}

const FpsAssociateAccountModal = ({
	loading,
	deviceList,
	visible,
	onCancel,
}: IFpsAssociateAccountModalProps) => {
	const { t } = useTranslation()

	const [modalListState, setModalListState] = useState<
		TFpsAssociateDevicesData[]
	>([])

	useEffect(() => {
		if (!loading) {
			setModalListState(deviceList)
		}
	}, [loading])

	const onClosed = () => {
		setModalListState([])
	}

	return (
		<Modal
			open={visible}
			onCancel={onCancel}
			footer={false}
			title={
				<div style={{ textAlign: 'center' }}>{t('Label_AssociateDevices')}</div>
			}
			afterClose={onClosed}
		>
			<div style={{ height: '60vh', overflow: 'auto' }}>
				<List
					loading={loading}
					header={false}
					footer={false}
					bordered
					dataSource={modalListState ?? []}
					size='small'
					renderItem={item => <List.Item>{item.deviceId}</List.Item>}
				/>
			</div>
		</Modal>
	)
}

export default FpsAssociateAccountModal
