import { Table } from 'components'
import paths from 'app/constants/paths'
import { Link } from 'react-router-dom'
import { PermissionInterface } from 'type'
import { useTranslation } from 'react-i18next'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { numberFormatter } from 'common/utils/format'
import { Popconfirm, Space, Switch, Typography } from 'antd'
import {
	IDepositReferralData,
	ReferralStatusEnum,
} from 'features/newReferralManagement/type'

interface INewReferralManagementTableProps {
	loading: boolean
	editPermission?: PermissionInterface
	setActivePermission?: PermissionInterface
	depositReferralList: IDepositReferralData[]
	onUpdateReferralStatus: ({
		currencyId,
		status,
	}: {
		currencyId: number
		status: boolean
	}) => void
}

const NewReferralManagementTable = ({
	loading,
	editPermission,
	setActivePermission,
	depositReferralList,
	onUpdateReferralStatus,
}: INewReferralManagementTableProps) => {
	const { t } = useTranslation()

	// 目前新的推薦系統是在 status 0 2 做切換，但原始資料也有可能有1的狀態(參雜舊系統狀態)
	// 如果之後都運行新制推薦的話，不會有1
	const isNewReferralStatus = (status: number) => {
		switch (status) {
			case ReferralStatusEnum.Disable:
				return false
			case ReferralStatusEnum.ReferralEnable:
				return false
			case ReferralStatusEnum.DepositReferralEnable:
				return true
			default:
				return false
		}
	}

	const columns = [
		{
			title: t('Label_Action'),
			width: 80,
			align: 'center' as 'center',
			render: ({ currencyId }: IDepositReferralData) => (
				<Typography.Link disabled={!editPermission?.canUse}>
					<Link
						to={`/${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.editNewReferralManagement.root}/${currencyId}`}
					>
						{t('Label_Edit')}
					</Link>
				</Typography.Link>
			),
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: 80,
			align: 'center' as 'center',
			render: ({ currencyId, status }: IDepositReferralData) => {
				return (
					<Space>
						<Popconfirm
							disabled={!setActivePermission?.canUse}
							title={t('Label_AreYouSure')}
							onConfirm={() =>
								onUpdateReferralStatus({
									currencyId,
									status: !isNewReferralStatus(status),
								})
							}
						>
							<Switch
								checked={isNewReferralStatus(status)}
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
			title: t('Label_ReferralRewardRate'),
			key: 'depositRewardPercentage',
			dataIndex: 'depositRewardPercentage',
			width: 120,
			align: 'center' as 'center',
			render: (depositRewardPercentage: number) => {
				return `${depositRewardPercentage || 0}%`
			},
		},
		{
			title: t('Label_MinPayout'),
			key: 'minPayout',
			dataIndex: 'minPayout',
			width: 120,
			align: 'center' as 'center',
			render: (minPayout: number) => numberFormatter.format(minPayout),
		},
		{
			title: t('Label_MaxPayout'),
			key: 'maxPayout',
			dataIndex: 'maxPayout',
			width: 120,
			align: 'center' as 'center',
			render: (maxPayout: number) => numberFormatter.format(maxPayout),
		},
	]

	return (
		<Table
			loading={loading}
			columns={columns}
			dataSource={depositReferralList}
			pagination={false}
		/>
	)
}

export default NewReferralManagementTable
