import dayjs from 'dayjs'
import type { IPromotionUploadCustData } from 'features/bonusManagement/type'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Popconfirm, Space, Typography } from 'antd'
import { Table } from 'components'
import { numberFormatter, timeFormat } from '../../../common/utils/format'
import { PermissionInterface } from '../../../type'

interface IMemberListModalProps {
	loading: boolean
	visible: boolean
	onClose: () => void
	timeZoneUtcOffset: number
	editPermission?: PermissionInterface
	promotionUploadCustList: IPromotionUploadCustData[]
	onDeletePromotionUploadCustList: (custId: number) => void
}
const SpecialMemberListModal = ({
	loading,
	visible,
	onClose,
	timeZoneUtcOffset,
	editPermission,
	promotionUploadCustList,
	onDeletePromotionUploadCustList,
}: IMemberListModalProps) => {
	const { t } = useTranslation()
	const [memberList, setMemberList] = useState<IPromotionUploadCustData[]>([])
	const columns = [
		{
			title: t('Label_Action'),
			key: 'action',
			width: 150,
			align: 'center' as 'center',
			render: (record: IPromotionUploadCustData) => {
				const { custId, status } = record || {}
				return (
					<Space size='middle'>
						<Popconfirm
							title={t('Label_SureToDelete')}
							disabled={status}
							onConfirm={() => onDeletePromotionUploadCustList(custId)}
						>
							<Typography.Link disabled={!editPermission?.canUse || status}>
								{t('Label_Delete')}
							</Typography.Link>
						</Popconfirm>
					</Space>
				)
			},
		},
		{
			title: t('Label_UserName'),
			key: 'userName',
			dataIndex: 'userName',
			align: 'center' as 'center',
			width: '25%',
			render: (userName: string) => userName || '-',
		},
		{
			title: t('Label_Amount'),
			key: 'bonus',
			dataIndex: 'bonus',
			width: 100,
			align: 'center' as 'center',
			render: (bonus: number) => numberFormatter.format(bonus),
		},
		{
			title: t('Label_Rollover'),
			key: 'rollOver',
			dataIndex: 'rollOver',
			width: 120,
			align: 'center' as 'center',
			render: (rollOver: number) => numberFormatter.format(rollOver),
		},
		{
			title: t('Label_ExpiryDate'),
			key: 'expiryDate',
			dataIndex: 'expiryDate',
			align: 'center' as 'center',
			width: '50%',
			render: (expiryDate: string) =>
				expiryDate
					? dayjs(expiryDate).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
	]
	useEffect(() => {
		if (visible && !loading) {
			setMemberList(promotionUploadCustList)
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

export { SpecialMemberListModal }
