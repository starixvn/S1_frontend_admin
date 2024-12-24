import type { IBonusUsingListData } from 'features/bonusManagement/type'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from 'antd'
import { Table } from 'components'

interface IMemberListModalProps {
	loading: boolean
	visible: boolean
	onClose: () => void
	bonusUsingList: IBonusUsingListData[]
}
const RetentionMemberListModal = ({
	loading,
	visible,
	onClose,
	bonusUsingList,
}: IMemberListModalProps) => {
	const { t } = useTranslation()
	const [memberList, setMemberList] = useState<IBonusUsingListData[]>([])
	const columns = [
		{
			title: t('Label_MemberId'),
			key: 'userName',
			dataIndex: 'userName',
			align: 'center' as 'center',
			width: '50%',
			render: (userName: string) => userName || '-',
		},
		{
			title: t('Label_Status'),
			key: 'status',
			dataIndex: 'status',
			align: 'center' as 'center',
			width: '20%',
			// 1 === yes
			render: (status: number) =>
				status === 1 ? t('Label_Yes') : t('Label_No'),
		},
	]
	useEffect(() => {
		if (visible && !loading) {
			setMemberList(bonusUsingList)
		}
	}, [visible, loading])

	return (
		<Modal
			open={visible}
			title={<div style={{ textAlign: 'center' }}>{t('Label_MemberList')}</div>}
			footer={[]}
			onCancel={onClose}
			afterClose={() => setMemberList([])}
		>
			<Table
				loading={loading}
				columns={columns}
				dataSource={memberList}
				pagination={{ hideOnSinglePage: true }}
			/>
		</Modal>
	)
}

export { RetentionMemberListModal }
