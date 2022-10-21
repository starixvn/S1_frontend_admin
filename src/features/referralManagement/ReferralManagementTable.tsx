import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
	TablePaginationConfig,
	Space,
	Popconfirm,
	Switch,
	Typography,
} from 'antd'
import { numberFormatter } from 'common/utils/format'
import { LayoutContent } from 'app/pages/layout'
import { PAGINATION } from 'common/hooks'
import { Table } from 'components'
import { PermissionInterface } from 'type'
import { Link } from 'react-router-dom'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { IReferralsState } from './type'

interface IReferralManagementTableProps {
	loading: boolean
	referrals: IReferralsState[]
	editPermission?: PermissionInterface
	setActivePermission?: PermissionInterface
	onUpdateReferralStatus: ({
		currencyId,
		status,
	}: {
		currencyId: number
		status: boolean
	}) => void
}

const ReferralManagementTable: FC<IReferralManagementTableProps> = ({
	loading,
	referrals,
	editPermission,
	setActivePermission,
	onUpdateReferralStatus,
}) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_Action'),
			width: 80,
			align: 'center' as 'center',
			render: (values: any) => (
				<Typography.Link disabled={!editPermission?.canUse}>
					<Link
						to={`/${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.editReferralManagement.root}/${values.currencyId}`}
					>
						{t('Label_Edit')}
					</Link>
				</Typography.Link>
			),
		},
		{
			title: t('Label_Status'),
			width: 80,
			align: 'center' as 'center',
			render: (values: { currencyId: number; status: number }) => {
				const { currencyId, status } = values ?? {}
				return (
					<Space>
						<Popconfirm
							disabled={!setActivePermission?.canUse}
							title={t('Label_AreYouSure')}
							onConfirm={() =>
								onUpdateReferralStatus({ currencyId, status: !status })
							}
						>
							<Switch
								checked={Boolean(status)}
								disabled={!setActivePermission?.canUse}
							/>
						</Popconfirm>
					</Space>
				)
			},
		},
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_BonusAmount'),
			key: 'bonusAmount',
			dataIndex: 'bonusAmount',
			width: 120,
			align: 'center' as 'center',
			render: (bonusAmount: number) => numberFormatter.format(bonusAmount),
		},
		{
			title: t('Label_DepositAmount'),
			key: 'agentDeposit',
			dataIndex: 'agentDeposit',
			width: 120,
			align: 'center' as 'center',
			render: (agentDeposit: number) => numberFormatter.format(agentDeposit),
		},
		{
			title: t('Label_SettleBetAmount'),
			key: 'agentValidBet',
			dataIndex: 'agentValidBet',
			width: 120,
			align: 'center' as 'center',
			render: (agentValidBet: number) => numberFormatter.format(agentValidBet),
		},
		{
			title: t('Label_InvitationLimit'),
			key: 'invitationLimit',
			dataIndex: 'invitationLimit',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_ReferralFreeCredit'),
			key: 'referralFreeCredit',
			dataIndex: 'referralFreeCredit',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_ValidityDeposit'),
			key: 'deposit',
			dataIndex: 'deposit',
			width: 120,
			align: 'center' as 'center',
			render: (deposit: number) => numberFormatter.format(deposit),
		},
		{
			title: t('Label_ValidBet'),
			key: 'validBet',
			dataIndex: 'validBet',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_PeriodDays'),
			key: 'periodDays',
			dataIndex: 'periodDays',
			width: 120,
			align: 'center' as 'center',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={referrals}
				pagination={PAGINATION as TablePaginationConfig}
			/>
		</LayoutContent.Card>
	)
}

export default ReferralManagementTable
