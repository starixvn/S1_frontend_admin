import { IGetIpUserListData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { List, Modal, Typography } from 'antd'
import { useEffect, useState } from 'react'
import paths from 'app/constants/paths'
import { NEW_SITE_PREFIX_URL } from 'app/config'

interface IpListUserModalProps {
	loading: boolean
	userList: IGetIpUserListData[]
	visible: boolean
	onCancel: () => void
}

// 因在 customerInfo 內有重複使用到 , 故獨立放在 components

const UserListModal = ({
	loading,
	userList,
	visible,
	onCancel,
}: IpListUserModalProps) => {
	const { t } = useTranslation()

	// 這裡為了方便控制資料 , 另外寫 state 儲存 並在關閉 modal 後把資料抹除
	const [modalListState, setModalListState] = useState<IGetIpUserListData[]>([])

	useEffect(() => {
		if (!loading) {
			setModalListState(userList)
		}
	}, [loading])

	useEffect(() => {
		if (!visible) {
			setTimeout(() => setModalListState([]), 500)
		}
	}, [visible])

	return (
		<Modal
			open={visible}
			onCancel={onCancel}
			footer={false}
			title={
				<div style={{ textAlign: 'center' }}>{t('Label_AssociateAccount')}</div>
			}
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

export { UserListModal }
