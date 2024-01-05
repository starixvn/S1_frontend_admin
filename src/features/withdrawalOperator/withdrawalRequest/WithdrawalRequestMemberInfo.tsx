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
import React, { useEffect } from 'react'
import { VipLevelEnum } from 'features/depositOperator/type'
import {
	IAdjustmentLogLimitData,
	ICustomerAssociateBankUserData,
	IGetWithdrawalData,
} from 'features/withdrawalOperator/type'
import { useCopy, useQueryParams } from 'common/hooks'
import { CopyOutlined } from '@ant-design/icons'
import { ICheckDuplicateNameData } from 'features/memberProfile/type'

interface IWithdrawalRequestMemberInfoProps {
	loading: boolean
	memberInfo?: IMemberInfo
	withdrawalDetailData?: IGetWithdrawalData
	checkDuplicateNameList: ICheckDuplicateNameData[]
	associateBankUserList: ICustomerAssociateBankUserData[]
	adjustmentLimitList: IAdjustmentLogLimitData[]
	onIpCountClick: (ip: string) => void
	onDeviceCountClick: (deviceId: string) => void
	onDuplicateAccountClick: () => void
	onAssociateBankUserClick: () => void
	onAdjustmentLimitClick: () => void
}

const { Item } = Descriptions

/**
 * 檢查贏錢是否超過存款太多，畫面亮警示燈
 * @returns boolon
 * @description 檢查 winLoss 是否大於 totalDeposit 5倍 (測試為2倍)
 * @requires byTotalWinLoss number | undefined
 * @requires byTotalDeposit number | undefined
 *
 * ```tsx
 * checkWinLossExceedAlert(300, 100) // true
 * checkWinLossExceedAlert(300, 300) // false
 * ```
 */
const checkWinLossExceedAlert = (
	byTotalWinLoss: number | undefined,
	byTotalDeposit: number | undefined
) => {
	if (byTotalWinLoss !== undefined && byTotalDeposit !== undefined) {
		return byTotalWinLoss > byTotalDeposit * 2
	}

	return false
}

const WithdrawalRequestMemberInfo = ({
	loading,
	memberInfo,
	withdrawalDetailData,
	checkDuplicateNameList,
	associateBankUserList,
	adjustmentLimitList,
	onIpCountClick,
	onDeviceCountClick,
	onDuplicateAccountClick,
	onAssociateBankUserClick,
	onAdjustmentLimitClick,
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
		totalAdjustment,
		accountName,
	} = memberInfo ?? {}

	const deviceAllowStatusDisplayKey = DEVICE_ALLOW_STATUS_DISPLAY_KEYS[risk]
	const vipLevelColor = VIP_LEVELS_COLOR[vipLevel as VipLevelEnum]

	const isWinLossExceedAlert = checkWinLossExceedAlert(
		totalWinLoss,
		totalDeposit
	)

	useEffect(() => {
		if (isWinLossExceedAlert) {
			// * winLoss TotalDeposit 警示動畫
			const elements = Array.from(
				document.getElementsByClassName('alert-description-element')
			)

			elements.forEach(el => {
				el.animate(
					[
						{
							// from
							opacity: 1.0,
							backgroundColor: '#F9F900',
						},
						{
							// from
							opacity: 0.2,
							backgroundColor: '#F9F900',
						},
						{
							// to
							opacity: 1.0,
							backgroundColor: '#F9F900',
						},
					],
					{
						// timing options
						duration: 1500,
						iterations: Infinity,
					}
				)
			})
		}
	}, [isWinLossExceedAlert])

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
				<Item label={t('Label_FullName')}>
					<Row justify='space-between'>
						<Typography.Text>{accountName}</Typography.Text>
						<Typography.Link
							onClick={onDuplicateAccountClick}
							disabled={checkDuplicateNameList.length === 0}
						>
							{checkDuplicateNameList.length}
						</Typography.Link>
					</Row>
				</Item>
				<Item label={t('Label_BonusAmount')}>
					{numberFormatter.format(bonusAmount)}
				</Item>
				<Item label={t('Label_VipLevel')}>
					<Tag color={vipLevelColor}>{levelName || '-'}</Tag>
				</Item>

				<Item label={t('Label_TotalBonusAmount')}>
					{numberFormatter.format(totalBonusAmount || 0)}
				</Item>
				<Item label={t('Label_Deposited')}>
					{actStatus === ActStatusEnum.Active && t('Label_Yes')}
					{actStatus === ActStatusEnum.unActive && t('Label_No')}
				</Item>
				<Item
					label={t('Label_TotalDeposit')}
					// * WinLoss 大於 TotalDeposit css 警示
					className={isWinLossExceedAlert ? 'alert-description-element' : ''}
					contentStyle={
						isWinLossExceedAlert
							? {
									backgroundColor: '#F9F900',
									borderBottom: '1px solid #FFA042',
									borderTop: '1px solid #FFA042',
									borderRight: '1px solid #FFA042',
							  }
							: undefined
					}
					labelStyle={
						isWinLossExceedAlert
							? {
									backgroundColor: '#F9F900',
									borderBottom: '1px solid #FFA042',
									borderTop: '1px solid #FFA042',
									borderLeft: '2px solid #FFA042',
							  }
							: undefined
					}
				>
					{numberFormatter.format(totalDeposit || 0)}
				</Item>
				<Item label={t('Label_WithdrawalCount')}>{withdrawlCnt}</Item>
				<Item label={t('Label_TotalWithdrawal')}>
					{numberFormatter.format(totalWithdrawal || 0)}
				</Item>
				<Item label={t('Label_MailWalletAmount')}>
					{numberFormatter.format(mailWalletAmount || 0)}
				</Item>
				<Item label={t('Label_TotalAdjustmentAmount')}>
					{numberFormatter.format(totalAdjustment || 0)}
				</Item>
				<Item label={t('Label_EligibleWithdrawal')}>
					{numberFormatter.format(eligibleWithdrawal || 0)}
				</Item>
				<Item label={t('Label_TotalWithdrawalAdjustmentRecord')}>
					<Typography.Link
						onClick={onAdjustmentLimitClick}
						disabled={adjustmentLimitList.length === 0}
					>
						{adjustmentLimitList.length}
					</Typography.Link>
				</Item>

				<Item label={t('Label_DeviceScore')}>
					{risk && score ? `${risk}(${score})` : '-'}
				</Item>
				<Item
					label={t('Label_TotalWinLoss')}
					// * WinLoss 大於 TotalDeposit css 警示

					className={isWinLossExceedAlert ? 'alert-description-element' : ''}
					contentStyle={
						isWinLossExceedAlert
							? {
									backgroundColor: '#F9F900',
									borderBottom: '1px solid #FFA042',
									borderTop: '1px solid #FFA042',
									borderRight: '1px solid #FFA042',
							  }
							: undefined
					}
					labelStyle={
						isWinLossExceedAlert
							? {
									backgroundColor: '#F9F900',
									borderBottom: '1px solid #FFA042',
									borderTop: '1px solid #FFA042',
									borderLeft: '2px solid #FFA042',
							  }
							: undefined
					}
				>
					{numberFormatter.format(totalWinLoss || 0)}
				</Item>
				<Item
					label={t('Label_DOB')}
				>{`${birthDay}/${birthMonth}/${birthYear}`}</Item>
				<Item label={t('Label_DeviceAssociateCount')}>
					<Typography.Link
						onClick={() => onDeviceCountClick(deviceId)}
						disabled={!deviceId}
					>
						{associateCount}
					</Typography.Link>
				</Item>
				<Item label={t('Label_IovationStatus')}>
					{deviceAllowStatusDisplayKey ? t(deviceAllowStatusDisplayKey) : '-'}
				</Item>
				<Item label={t('Label_IpUserCount')}>
					<Typography.Link
						onClick={() => onIpCountClick(loginIp)}
						disabled={!loginIp}
					>
						{userCount}
					</Typography.Link>
				</Item>
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
				<Item label={t('Label_AssociateAccountCount')}>
					<Typography.Link
						onClick={onAssociateBankUserClick}
						disabled={associateBankUserList.length === 0}
					>
						{associateBankUserList.length}
					</Typography.Link>
				</Item>
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
