import { Descriptions, Row, Spin, Tag, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { numberFormatter } from 'common/utils/format'
import { IMemberInfo } from 'features/depositOperator/depositRequest/hooks/useMemberInfo'
import {
	ActStatusEnum,
	VIP_LEVELS_COLOR,
} from 'features/depositOperator/constants'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { IDepositOperatorData } from 'features/depositOperator/type'
import { useCopy, useQueryParams } from 'common/hooks'
import { CopyOutlined } from '@ant-design/icons'
import React from 'react'

interface IDepositRequestMemberInfoProps {
	loading: boolean
	memberInfo: IMemberInfo | undefined
	depositInfo: IDepositOperatorData
}

const DepositRequestMemberInfo = ({
	loading,
	memberInfo,
	depositInfo: { depositCnt },
}: IDepositRequestMemberInfoProps) => {
	const { t } = useTranslation()
	const { onCopy } = useCopy()

	const [queryParams] = useQueryParams()
	const {
		currency,
		custId,
		userName,
		accountName,
		vipLevel,
		levelName,
		actStatus,
		isKyc,
		isRisk,
		phoneVerified,
		emailVerified,
		mailWalletAmount,
		eligibleWithdrawal,
		// 2024.08.21 Member Info 顯示 Iovation Status 改成顯示 Fps Risk Level，先註解
		// newestDeviceScore: { risk = '', score = null } = {},
		newestFpsDevice: { riskLevel = '' } = {},
		tagList = [],
	} = memberInfo ?? {}

	// const deviceAllowStatusDisplayKey = DEVICE_ALLOW_STATUS_DISPLAY_KEYS[risk]

	return (
		<Spin spinning={loading}>
			<Descriptions
				title={t('Label_MemberInfo')}
				bordered
				column={1}
				labelStyle={{ minWidth: '200px' }}
				size='small'
			>
				<Descriptions.Item label={t('Label_Currency')}>
					{currency || '-'}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_MemberId')}>
					<Row justify='space-between'>
						<Typography.Link
							disabled={queryParams?.isAllSite}
							href={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${custId}`}
							target='_blank'
						>
							{userName || '-'}
						</Typography.Link>
						<Typography.Link
							disabled={!userName}
							onClick={() => onCopy(String(userName))}
						>
							<CopyOutlined style={{ fontSize: '1.5rem' }} />
						</Typography.Link>
					</Row>
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_FullName')}>
					{accountName || '-'}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_VipLevel')}>
					{levelName ? (
						<Tag color={VIP_LEVELS_COLOR[vipLevel as number]}>{levelName}</Tag>
					) : (
						'-'
					)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_Deposited')}>
					{actStatus === ActStatusEnum.Active && t('Label_Yes')}
					{actStatus === ActStatusEnum.unActive && t('Label_No')}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_DepositCount')}>
					{depositCnt || '-'}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_MailWalletAmount')}>
					{numberFormatter.format(mailWalletAmount || 0)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_EligibleWithdrawal')}>
					{numberFormatter.format(eligibleWithdrawal || 0)}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_DeviceScore')}>
					-{/* {risk && score ? `${risk}(${score})` : '-'} */}
				</Descriptions.Item>
				<Descriptions.Item label={t('Label_RiskLevel')}>
					{riskLevel || '-'}
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
