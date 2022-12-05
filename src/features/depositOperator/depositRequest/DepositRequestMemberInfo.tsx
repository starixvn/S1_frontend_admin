import { Descriptions, Spin, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { numberFormatter } from 'common/utils/format'
import { IMemberInfo } from 'features/depositOperator/depositRequest/hooks/useMemberInfo'
import {
	ActStatusEnum,
	DEVICE_ALLOW_STATUS_DISPLAY_KEYS,
} from 'features/depositOperator/constants'

interface IDepositRequestMemberInfoProps {
	loading: boolean
	memberInfo: IMemberInfo | undefined
}

const DepositRequestMemberInfo = ({
	loading,
	memberInfo,
}: IDepositRequestMemberInfoProps) => {
	const { t } = useTranslation()
	const {
		currency,
		userName,
		vipLevel,
		actStatus,
		isKyc,
		isRisk,
		phoneVerified,
		emailVerified,
		mailWalletAmount,
		eligibleWithdrawal,
		newestDeviceScore: { risk = '', score = null } = {},
		tagList = [],
	} = memberInfo ?? {}

	const deviceAllowStatusDisplayKey = DEVICE_ALLOW_STATUS_DISPLAY_KEYS[risk]

	return (
		<Spin spinning={loading}>
			<Descriptions
				title='Member Info'
				bordered
				column={1}
				labelStyle={{ minWidth: '200px' }}
				size='small'
			>
				<Descriptions.Item label={t('Label_Currency')}>
					{currency || '-'}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_MemberId')}>
					{userName || '-'}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_VipLevel')}>
					{vipLevel || '-'}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_Deposited')}>
					{actStatus === ActStatusEnum.Active && t('Label_Yes')}
					{actStatus === ActStatusEnum.unActive && t('Label_No')}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_MailWalletAmount')}>
					{numberFormatter.format(mailWalletAmount || 0)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_EligibleWithdrawal')}>
					{numberFormatter.format(eligibleWithdrawal || 0)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_DeviceScore')}>
					{risk && score ? `${risk}(${score})` : '-'}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_IovationStatus')}>
					{deviceAllowStatusDisplayKey ? t(deviceAllowStatusDisplayKey) : '-'}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_Tag')}>
					{tagList.length > 0
						? tagList?.map(tag => (
								<Tag
									key={tag.id}
									color={tag.tagColour}
									style={{ marginRight: '8px', marginTop: '8px' }}
								>
									{tag.tagName}
								</Tag>
						  ))
						: '-'}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_isKyc')}>
					{isKyc ? t('Label_Yes') : t('Label_No')}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_isRisk')}>
					{isRisk ? t('Label_Yes') : t('Label_No')}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_PhoneVerified')}>
					{phoneVerified ? t('Label_Yes') : t('Label_No')}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_EmailVerified')}>
					{emailVerified ? t('Label_Yes') : t('Label_No')}
				</Descriptions.Item>
			</Descriptions>
		</Spin>
	)
}

export default DepositRequestMemberInfo
