import { Descriptions, Row, Spin, Tag, Typography } from 'antd'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { useTranslation } from 'react-i18next'
import {
	ActStatusEnum,
	DEVICE_ALLOW_STATUS_DISPLAY_KEYS,
	VIP_LEVELS_COLOR,
} from 'features/depositOperator/constants'
import { numberFormatter } from 'common/utils/format'
import { IMemberInfo } from 'features/withdrawalOperator/withdrawalRequest/hooks/useMemberInfo'
import { BONUS_STATUS } from 'features/withdrawalOperator/constants'
import React from 'react'
import { VipLevelEnum } from 'features/depositOperator/type'
import { IGetWithdrawalData } from 'features/withdrawalOperator/type'
import { useCopy, useQueryParams } from 'common/hooks'
import { CopyOutlined } from '@ant-design/icons'

interface IWithdrawalRequestMemberInfoProps {
	loading: boolean
	memberInfo?: IMemberInfo
	withdrawalDetailData?: IGetWithdrawalData
	onIpCountClick: (ip: string) => void
	onDeviceCountClick: (deviceId: string) => void
}

const { Item } = Descriptions

const WithdrawalRequestMemberInfo = ({
	loading,
	memberInfo,
	withdrawalDetailData,
	onIpCountClick,
	onDeviceCountClick,
}: IWithdrawalRequestMemberInfoProps) => {
	const { t } = useTranslation()
	const [queryParams] = useQueryParams()
	const { withdrawlCnt } = withdrawalDetailData ?? {}
	const { onCopy } = useCopy()

	const {
		currency,
		custId,
		userName,
		vipLevel,
		levelName,
		actStatus,
		mailWalletAmount,
		eligibleWithdrawal,
		newestDeviceScore: {
			risk = '',
			score = null,
			associateCount = 0,
			deviceId = '',
		} = {},
		newestPromotions: {
			bonusInfoStatus = 0,
			description = '',
			bonusAmount = 0,
		} = {},
		newestIpList: { userCount = 0, loginIp = '' } = {},
		birthMonth,
		birthYear,
		birthDay,
		tagList = [],
		isKyc,
		isRisk,
		phoneVerified,
		emailVerified,
		totalWinLoss,
		totalWithdrawal,
		totalBonusAmount,
		totalDeposit,
	} = memberInfo ?? {}

	const deviceAllowStatusDisplayKey = DEVICE_ALLOW_STATUS_DISPLAY_KEYS[risk]
	const vipLevelColor = VIP_LEVELS_COLOR[vipLevel as VipLevelEnum]

	return (
		<Spin spinning={loading}>
			<Descriptions
				bordered
				size='small'
				layout='horizontal'
				column={2}
				title={t('Label_MemberInfo')}
			>
				<Item label={t('Label_Currency')}>{currency}</Item>
				<Item label={t('Label_NewestBonusClaimed')}>{description}</Item>
				<Item label={t('Label_MemberId')}>
					<Row justify='space-between'>
						<Typography.Link
							disabled={queryParams?.isAllSite}
							href={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${custId}`}
							target='_blank'
						>
							{userName}
						</Typography.Link>
						<Typography.Link
							disabled={!userName}
							onClick={() => onCopy(String(userName))}
						>
							<CopyOutlined style={{ fontSize: '1.5rem' }} />
						</Typography.Link>
					</Row>
				</Item>
				<Item label={t('Label_BonusStatus')}>
					{t(BONUS_STATUS[bonusInfoStatus])}
				</Item>
				<Item label={t('Label_VipLevel')}>
					<Tag color={vipLevelColor}>{levelName || '-'}</Tag>
				</Item>
				<Item label={t('Label_BonusAmount')}>
					{numberFormatter.format(bonusAmount)}
				</Item>
				<Item label={t('Label_Deposited')}>
					{actStatus === ActStatusEnum.Active && t('Label_Yes')}
					{actStatus === ActStatusEnum.unActive && t('Label_No')}
				</Item>
				<Item label={t('Label_TotalBonusAmount')}>
					{numberFormatter.format(totalBonusAmount || 0)}
				</Item>
				<Item label={t('Label_WithdrawalCount')}>{withdrawlCnt}</Item>

				<Item label={t('Label_TotalDeposit')}>
					{numberFormatter.format(totalDeposit || 0)}
				</Item>
				<Item label={t('Label_MailWalletAmount')}>
					{numberFormatter.format(mailWalletAmount || 0)}
				</Item>

				<Item label={t('Label_TotalWithdrawal')}>
					{numberFormatter.format(totalWithdrawal || 0)}
				</Item>
				<Item label={t('Label_EligibleWithdrawal')}>
					{numberFormatter.format(eligibleWithdrawal || 0)}
				</Item>

				<Item label={t('Label_TotalWinLoss')}>
					{numberFormatter.format(totalWinLoss || 0)}
				</Item>
				<Item label={t('Label_DeviceScore')}>
					{risk && score ? `${risk}(${score})` : '-'}
				</Item>

				<Item label={t('Label_DeviceAssociateCount')}>
					<Typography.Link
						onClick={() => onDeviceCountClick(deviceId)}
						disabled={!deviceId}
					>
						{associateCount}
					</Typography.Link>
				</Item>
				<Item
					label={t('Label_DOB')}
				>{`${birthDay}/${birthMonth}/${birthYear}`}</Item>

				<Item label={t('Label_IpUserCount')}>
					<Typography.Link
						onClick={() => onIpCountClick(loginIp)}
						disabled={!loginIp}
					>
						{userCount}
					</Typography.Link>
				</Item>
				<Item label={t('Label_IovationStatus')}>
					{deviceAllowStatusDisplayKey ? t(deviceAllowStatusDisplayKey) : '-'}
				</Item>
				{/* 排版需要，留空 */}
				<Item>{` `}</Item>
				<Item label={t('Label_Tag')}>
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
				</Item>
				{/* 排版需要，留空 */}
				<Item>{` `}</Item>
				<Item label={t('Label_isKyc')}>
					{isKyc ? t('Label_Yes') : t('Label_No')}
				</Item>
				{/* 排版需要，留空 */}
				<Item>{` `}</Item>
				<Item label={t('Label_isRisk')}>
					{isRisk ? t('Label_Yes') : t('Label_No')}
				</Item>
				{/* 排版需要，留空 */}
				<Item>{` `}</Item>
				<Item label={t('Label_PhoneVerified')}>
					{phoneVerified ? t('Label_Yes') : t('Label_No')}
				</Item>
				{/* 排版需要，留空 */}
				<Item>{` `}</Item>
				<Item label={t('Label_EmailVerified')}>
					{emailVerified ? t('Label_Yes') : t('Label_No')}
				</Item>
				{/* 排版需要，留空 */}
				<Item>{` `}</Item>
			</Descriptions>
		</Spin>
	)
}

export { WithdrawalRequestMemberInfo }
