import styled from 'styled-components'
import { Button, Dropdown, Layout, Menu, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import {
	MenuDividerType,
	MenuItemGroupType,
	MenuItemType,
	SubMenuType,
} from 'antd/lib/menu/hooks/useItems'
import { FaUser } from '@react-icons/all-files/fa/FaUser'
import { useMediaQuery } from 'usehooks-ts'

type ItemType = MenuItemType | SubMenuType | MenuItemGroupType | MenuDividerType

const { Header } = Layout

const StyledHeader = styled(Header)`
	width: -webkit-fill-available; // 使 header 滿版
	background: white;
	border: 1px solid white;
`

interface IMemberProfileHeaderProps {
	onOpenDrawer: () => void
}

const MemberProfileHeader = ({ onOpenDrawer }: IMemberProfileHeaderProps) => {
	const isDesktopMedia = useMediaQuery('(max-width: 992px)')
	const { t } = useTranslation()
	const { custId } = useParams()

	const customerInfoMenu = (
		<Menu
			items={[
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/customerInfo/memberFlowLog/${custId}`}
						>
							{t('MemberProfile.Menu.CustomerInfo.Label_MemberFlowLog')}
						</Link>
					),
					key: '1',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/customerInfo/vipLevel/${custId}`}
						>
							{t('MemberProfile.Menu.CustomerInfo.Label_VIPLevel')}
						</Link>
					),
					key: '2',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/customerInfo/referralHistory/${custId}`}
						>
							{t('MemberProfile.Menu.CustomerInfo.Label_ReferralHistory')}
						</Link>
					),
					key: '3',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/customerInfo/notes/${custId}`}
						>
							{t('MemberProfile.Menu.CustomerInfo.Label_Notes')}
						</Link>
					),
					key: '4',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/customerInfo/SMSInfo/${custId}`}
						>
							{t('MemberProfile.Menu.CustomerInfo.Label_SMSInfo')}
						</Link>
					),
					key: '5',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/customerInfo/loginLog/${custId}`}
						>
							{t('MemberProfile.Menu.CustomerInfo.Label_LoginLog')}
						</Link>
					),
					key: '6',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/customerInfo/deviceList/${custId}`}
						>
							{t('MemberProfile.Menu.CustomerInfo.Label_DeviceList')}
						</Link>
					),
					key: '7',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/customerInfo/ipLog/${custId}`}
						>
							{t('MemberProfile.Menu.CustomerInfo.Label_IPList')}
						</Link>
					),
					key: '8',
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
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/finance/depositInfo/${custId}`}
						>
							{t('MemberProfile.Menu.Finance.Label_DepositInfo')}
						</Link>
					),
					key: '1',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/finance/withdrawalInfo/${custId}`}
						>
							{t('MemberProfile.Menu.Finance.Label_WithdrawalInfo')}
						</Link>
					),
					key: '2',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/finance/adjustmentInfo/${custId}`}
						>
							{t('MemberProfile.Menu.Finance.Label_AdjustmentInfo')}
						</Link>
					),
					key: '3',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/finance/3RDPartyAdjustmentInfo/${custId}`}
						>
							{t('MemberProfile.Menu.Finance.Label_3RDPartyAdjustmentInfo')}
						</Link>
					),
					key: '4',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/finance/withdrawalLimitLog/${custId}`}
						>
							{t('MemberProfile.Menu.Finance.Label_WithdrawalLimitLog')}
						</Link>
					),
					key: '5',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/finance/transferInfo/${custId}`}
						>
							{t('MemberProfile.Menu.Finance.Label_TransferInfo')}
						</Link>
					),
					key: '6',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/finance/financialLog/${custId}`}
						>
							{t('MemberProfile.Menu.Finance.Label_FinancialLog')}
						</Link>
					),
					key: '7',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/finance/bankInfoLog/${custId}`}
						>
							{t('MemberProfile.Menu.Finance.Label_BankInfoLog')}
						</Link>
					),
					key: '8',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/finance/eWalletInfoLog/${custId}`}
						>
							{t('MemberProfile.Menu.Finance.Label_EWalletInfoLog')}
						</Link>
					),
					key: '9',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/finance/cryptoInfoLog/${custId}`}
						>
							{t('MemberProfile.Menu.Finance.Label_CryptoInfoLog')}
						</Link>
					),
					key: '10',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/finance/bankList/${custId}`}
						>
							{t('MemberProfile.Menu.Finance.Label_BankList')}
						</Link>
					),
					key: '11',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/finance/eWalletList/${custId}`}
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
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/game/statement/${custId}`}
						>
							{t('MemberProfile.Menu.Game.Label_Statement')}
						</Link>
					),
					key: '1',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/game/turnover/${custId}`}
						>
							{t('MemberProfile.Menu.Game.Label_Turnover')}
						</Link>
					),
					key: '2',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/game/3RDPartyAccount/${custId}`}
						>
							{t('MemberProfile.Menu.Game.Label_3RDPartyAccount')}
						</Link>
					),
					key: '3',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/game/winLoseSummary/${custId}`}
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
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/marketing/bonusWallet/${custId}`}
						>
							{t('MemberProfile.Menu.Marketing.Label_BonusWallet')}
						</Link>
					),
					key: '1',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/marketing/bonusLog/${custId}`}
						>
							{t('MemberProfile.Menu.Marketing.Label_BonusLog')}
						</Link>
					),
					key: '2',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/marketing/vipRebateLog/${custId}`}
						>
							{t('MemberProfile.Menu.Marketing.Label_VipRebateLog')}
						</Link>
					),
					key: '3',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/marketing/promotionReport/${custId}`}
						>
							{t('MemberProfile.Menu.Marketing.Label_PromotionReport')}
						</Link>
					),
					key: '4',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/marketing/rewardsPointLog/${custId}`}
						>
							{t('MemberProfile.Menu.Marketing.Label_RewardsPointLog')}
						</Link>
					),
					key: '5',
				},
				{
					label: (
						<Link
							to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/marketing/cashBackReport/${custId}`}
						>
							{t('MemberProfile.Menu.Marketing.Label_CashBackReport')}
						</Link>
					),
					key: '6',
				},
			]}
		/>
	)

	const items: (ItemType | boolean)[] = [
		// * 如果為手機版則渲染 User Icon 用於打開 drawer
		isDesktopMedia && {
			key: 99,
			onClick: () => onOpenDrawer(),
			label: <FaUser />,
		},
		{
			key: 1,
			label: (
				<Link
					to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${custId}`}
				>
					{t('MemberProfile.Menu.Label_Dashboard')}
				</Link>
			),
		},
		{
			key: 2,
			label: (
				<Dropdown overlay={customerInfoMenu} trigger={['click', 'hover']}>
					<Button>
						<Space>
							{t('MemberProfile.Menu.Label_CustomerInfo')}
							<DownOutlined />
						</Space>
					</Button>
				</Dropdown>
			),
		},
		{
			key: 3,
			label: (
				<Dropdown overlay={financeMenu} trigger={['click', 'hover']}>
					<Button>
						<Space>
							{t('MemberProfile.Menu.Label_Finance')}
							<DownOutlined />
						</Space>
					</Button>
				</Dropdown>
			),
		},
		{
			key: 4,
			label: (
				<Dropdown overlay={gameMenu} trigger={['click', 'hover']}>
					<Button>
						<Space>
							{t('MemberProfile.Menu.Label_Game')}
							<DownOutlined />
						</Space>
					</Button>
				</Dropdown>
			),
		},
		{
			key: 5,
			label: (
				<Dropdown overlay={marketingMenu} trigger={['click', 'hover']}>
					<Button>
						<Space>
							{t('MemberProfile.Menu.Label_Marketing')}
							<DownOutlined />
						</Space>
					</Button>
				</Dropdown>
			),
		},
		{
			key: 6,
			label: (
				<Link
					to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/setting/${custId}`}
				>
					{t('MemberProfile.Menu.Label_Setting')}
				</Link>
			),
		},
		{
			key: 7,
			label: (
				<Link
					to={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/adminUserLog/${custId}`}
				>
					{t('MemberProfile.Menu.Label_AdminUserLog')}
				</Link>
			),
		},
	].filter(Boolean)

	return (
		<StyledHeader>
			<Menu theme='light' mode='horizontal' items={items as ItemType[]} />
		</StyledHeader>
	)
}

export default MemberProfileHeader
