import { Card, Col, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { SettingEditTypeEnum } from 'features/memberProfile/type'

interface ISettingInfoCardProps {
	openTagsModal: () => void
	openVipLevelModal: () => void
	onEditTypeChange: (newEditType: SettingEditTypeEnum | undefined) => void
}

const SettingInfoCard = ({
	openTagsModal,
	openVipLevelModal,
	onEditTypeChange,
}: ISettingInfoCardProps) => {
	const { t } = useTranslation()

	return (
		<Col xxl={5} xl={5} lg={12} span={12} style={{ marginBottom: 8 }}>
			<Card title={t('Label_Info')} style={{ height: '100%' }}>
				<p>
					<Typography.Link
						onClick={() => onEditTypeChange(SettingEditTypeEnum.FullName)}
					>
						{t('Label_FullName')}
					</Typography.Link>
				</p>
				<p>
					<Typography.Link
						onClick={() => onEditTypeChange(SettingEditTypeEnum.Email)}
					>
						{t('Label_Email')}
					</Typography.Link>
				</p>
				<p>
					<Typography.Link
						onClick={() => onEditTypeChange(SettingEditTypeEnum.PhoneNo)}
					>
						{t('Label_PhoneNumber')}
					</Typography.Link>
				</p>
				<p>
					<Typography.Link onClick={openVipLevelModal}>
						{t('Label_VipLevel')}
					</Typography.Link>
				</p>
				<p>
					<Typography.Link
						onClick={() => onEditTypeChange(SettingEditTypeEnum.Birthday)}
					>
						{t('Label_Birthday')}
					</Typography.Link>
				</p>
				<p>
					<Typography.Link
						onClick={() => onEditTypeChange(SettingEditTypeEnum.Address)}
					>
						{t('Label_ShippingAddress')}
					</Typography.Link>
				</p>
				<p>
					<Typography.Link onClick={openTagsModal}>
						{t('Label_Tag')}
					</Typography.Link>
				</p>
			</Card>
			<br />
		</Col>
	)
}

export default SettingInfoCard
