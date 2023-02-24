import { useTranslation } from 'react-i18next'
import { List, Modal, Typography } from 'antd'
import paths from 'app/constants/paths'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { ICustomerAssociateBankUserData } from 'features/withdrawalOperator/type'

interface IpListUserModalProps {
	loading: boolean
	associateBankUserList: ICustomerAssociateBankUserData[]
	visible: boolean
	onCancel: () => void
}

// 因在 customerInfo 內有重複使用到 , 故獨立放在 components

const AssociateBankUserModal = ({
	loading,
	associateBankUserList,
	visible,
	onCancel,
}: IpListUserModalProps) => {
	const { t } = useTranslation()
	return (
		<Modal
			open={visible}
			onCancel={onCancel}
			footer={false}
			title={
				<div style={{ textAlign: 'center' }}>{t('Label_AssociateAccount')}</div>
			}
			width='40vw'
		>
			<div style={{ height: '60vh', overflow: 'auto' }}>
				<List
					loading={loading}
					header={false}
					footer={false}
					bordered
					dataSource={associateBankUserList ?? []}
					size='small'
					renderItem={item => (
						<List.Item>
							<Typography.Link
								href={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${item.custId}`}
								target='_blank'
							>
								{item.userName}
							</Typography.Link>
							<Typography.Text>
								{`( ${item.paymentName ?? ''} ${item.associateNo ?? ''} )`}
							</Typography.Text>
						</List.Item>
					)}
				/>
			</div>
		</Modal>
	)
}

export { AssociateBankUserModal }
