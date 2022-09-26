import React from 'react'
import styled from 'styled-components'
import { Button, Divider, Dropdown, Layout, Menu, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'

const { Header } = Layout

const StyledHeader = styled(Header)`
	background: #fff;
	position: fixed;
	z-index: 1;
	width: 100%;
	border: 1px solid #f0f0f0;
`

const MemberProfileHeader = () => {
	const { t } = useTranslation()

	const customerInfoMenu = (
		<Menu
			items={[
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/customerInfo/memberFlowLog`}
						>
							{t('MemberProfile.Menu.CustomerInfo.Label_MemberFlowLog')}
						</Link>
					),
					key: '1',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/customerInfo/vipLevel`}
						>
							{t('MemberProfile.Menu.CustomerInfo.Label_VIPLevel')}
						</Link>
					),
					key: '2',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/customerInfo/referralHistory`}
						>
							{t('MemberProfile.Menu.CustomerInfo.Label_ReferralHistory')}
						</Link>
					),
					key: '3',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/customerInfo/notes`}
						>
							{t('MemberProfile.Menu.CustomerInfo.Label_Notes')}
						</Link>
					),
					key: '4',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/customerInfo/SMSInfo`}
						>
							{t('MemberProfile.Menu.CustomerInfo.Label_SMSInfo')}
						</Link>
					),
					key: '5',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/customerInfo/loginLog`}
						>
							{t('MemberProfile.Menu.CustomerInfo.Label_LoginLog')}
						</Link>
					),
					key: '6',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/customerInfo/ipLog`}
						>
							{t('MemberProfile.Menu.CustomerInfo.Label_IPLog')}
						</Link>
					),
					key: '6',
				},
			]}
		/>
	)

	const financeMenu = (
		<Menu
			items={[
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/finance/depositInfo`}
						>
							{t('MemberProfile.Menu.Finance.Label_DepositInfo')}
						</Link>
					),
					key: '1',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/finance/withdrawalInfo`}
						>
							{t('MemberProfile.Menu.Finance.Label_WithdrawalInfo')}
						</Link>
					),
					key: '2',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/finance/adjustmentInfo`}
						>
							{t('MemberProfile.Menu.Finance.Label_AdjustmentInfo')}
						</Link>
					),
					key: '3',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/finance/3RDPartyAdjustmentInfo`}
						>
							{t('MemberProfile.Menu.Finance.Label_3RDPartyAdjustmentInfo')}
						</Link>
					),
					key: '4',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/finance/withdrawalLimitLog`}
						>
							{t('MemberProfile.Menu.Finance.Label_WithdrawalLimitLog')}
						</Link>
					),
					key: '5',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/finance/transferInfo`}
						>
							{t('MemberProfile.Menu.Finance.Label_TransferInfo')}
						</Link>
					),
					key: '6',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/finance/financialLog`}
						>
							{t('MemberProfile.Menu.Finance.Label_FinancialLog')}
						</Link>
					),
					key: '7',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/finance/bankInfoLog`}
						>
							{t('MemberProfile.Menu.Finance.Label_BankInfoLog')}
						</Link>
					),
					key: '8',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/finance/eWalletInfoLog`}
						>
							{t('MemberProfile.Menu.Finance.Label_EWalletInfoLog')}
						</Link>
					),
					key: '9',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/finance/cryptoInfoLog`}
						>
							{t('MemberProfile.Menu.Finance.Label_CryptoInfoLog')}
						</Link>
					),
					key: '10',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/finance/bankList`}
						>
							{t('MemberProfile.Menu.Finance.Label_BankList')}
						</Link>
					),
					key: '11',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/finance/eWalletList`}
						>
							{t('MemberProfile.Menu.Finance.Label_EWalletList')}
						</Link>
					),
					key: '12',
				},
			]}
		/>
	)

	const gameMenu = (
		<Menu
			items={[
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/game/statement`}
						>
							{t('MemberProfile.Menu.Game.Label_Statement')}
						</Link>
					),
					key: '1',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/game/turnover`}
						>
							{t('MemberProfile.Menu.Game.Label_Turnover')}
						</Link>
					),
					key: '2',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/game/3RDPartyAccount`}
						>
							{t('MemberProfile.Menu.Game.Label_3RDPartyAccount')}
						</Link>
					),
					key: '3',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/game/winLoseSummary`}
						>
							{t('MemberProfile.Menu.Game.Label_WinLoseSummary')}
						</Link>
					),
					key: '4',
				},
			]}
		/>
	)

	const marketingMenu = (
		<Menu
			items={[
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/marketing/bonusWallet`}
						>
							{t('MemberProfile.Menu.Marketing.Label_BonusWallet')}
						</Link>
					),
					key: '1',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/marketing/bonusLog`}
						>
							{t('MemberProfile.Menu.Marketing.Label_BonusLog')}
						</Link>
					),
					key: '2',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/marketing/vipRebateLog`}
						>
							{t('MemberProfile.Menu.Marketing.Label_VipRebateLog')}
						</Link>
					),
					key: '3',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/marketing/promotionReport`}
						>
							{t('MemberProfile.Menu.Marketing.Label_PromotionReport')}
						</Link>
					),
					key: '4',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/marketing/rewardsPointLog`}
						>
							{t('MemberProfile.Menu.Marketing.Label_RewardsPointLog')}
						</Link>
					),
					key: '5',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/marketing/cashBackReport`}
						>
							{t('MemberProfile.Menu.Marketing.Label_CashBackReport')}
						</Link>
					),
					key: '6',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/marketing/vipRebateMenu`}
						>
							{t('MemberProfile.Menu.Marketing.Label_VipRebateMenu')}
						</Link>
					),
					key: '7',
				},
			]}
		/>
	)

	return (
		<StyledHeader>
			<Space
				size={8}
				split={<Divider type='vertical' />}
				style={{ overflow: 'hidden' }}
			>
				<Link
					to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}`}
				>
					Dashboard
				</Link>
				<Dropdown overlay={customerInfoMenu} trigger={['click']}>
					<Button>
						<Space>
							Customer Info
							<DownOutlined />
						</Space>
					</Button>
				</Dropdown>
				<Dropdown overlay={financeMenu} trigger={['click']}>
					<Button>
						<Space>
							Finance
							<DownOutlined />
						</Space>
					</Button>
				</Dropdown>
				<Dropdown overlay={gameMenu} trigger={['click']}>
					<Button>
						<Space>
							Game
							<DownOutlined />
						</Space>
					</Button>
				</Dropdown>
				<Dropdown overlay={marketingMenu} trigger={['click']}>
					<Button>
						<Space>
							Marketing
							<DownOutlined />
						</Space>
					</Button>
				</Dropdown>
				<Link
					to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/setting`}
				>
					Setting
				</Link>
				<Link
					to={`/${NEW_SITE_PREFIX_URL}/${paths.customerSupport.sub.memberAdministration.root}/adminUserLog`}
				>
					Admin User Log
				</Link>
			</Space>
		</StyledHeader>
	)
}

export default MemberProfileHeader
