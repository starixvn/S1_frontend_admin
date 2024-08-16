import paths from 'app/constants/paths'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { List, Modal, Typography } from 'antd'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { TFpsAssociateAccountData } from 'features/fpsDeviceReport/type'

interface IFpsAssociateAccountModalProps {
	loading: boolean
	userList: TFpsAssociateAccountData[]
	visible: boolean
	onCancel: () => void
}

const FpsAssociateAccountModal = ({
	loading,
	userList,
	visible,
	onCancel,
}: IFpsAssociateAccountModalProps) => {
	const { t } = useTranslation()

	const [modalListState, setModalListState] = useState<
		TFpsAssociateAccountData[]
	>([])

	useEffect(() => {
		if (!loading) {
			setModalListState(userList)
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
				<div style={{ textAlign: 'center' }}>{t('Label_AssociateAccount')}</div>
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
					renderItem={item => (
						<List.Item>
							<Typography.Link
								href={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${item.custId}`}
								target='_blank'
							>
								{item.userName}
							</Typography.Link>
						</List.Item>
					)}
				/>
			</div>
		</Modal>
	)
}

export default FpsAssociateAccountModal
