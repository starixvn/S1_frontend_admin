import { Table, TablePaginationConfig, Typography } from 'antd'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { PaginationInterface } from 'common/hooks'
import { numberFormatter } from 'common/utils/format'
import { IVerificationRewardReportData } from 'features/verificationReport/type'

interface IVerificationReportTableProps {
	loading: boolean
	pagination: PaginationInterface
	verificationRewardReportList: IVerificationRewardReportData[]
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const VerificationReportTable = ({
	loading,
	pagination,
	verificationRewardReportList,
	onTableChange,
}: IVerificationReportTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'currency',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			dataIndex: 'userName',
			width: 100,
			align: 'center' as 'center',
			render: (userName: string) => (!isEmpty(userName) ? userName : '-'),
		},
		{
			title: t('Label_SabaId'),
			key: 'sabaId',
			dataIndex: 'sabaId',
			width: 100,
			align: 'center' as 'center',
			render: (sabaId: string) => (!isEmpty(sabaId) ? sabaId : '-'),
		},
		{
			title: t('Label_Agent'),
			key: 'agent',
			dataIndex: 'agent',
			width: 100,
			align: 'center' as 'center',
			render: (agent: string) => (!isEmpty(agent) ? agent : '-'),
		},
		{
			title: t('Label_PhoneVerified'),
			key: 'phoneVerified',
			dataIndex: 'phoneVerified',
			width: 80,
			align: 'center' as 'center',
			render: (phoneVerified: boolean) =>
				phoneVerified ? t('Label_Yes') : t('Label_No'),
		},
		{
			title: t('Label_PhoneReward'),
			key: 'phoneReward',
			dataIndex: 'phoneReward',
			width: 100,
			align: 'center' as 'center',
			render: (phoneReward: number) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{numberFormatter.format(phoneReward || 0)}
				</Typography.Text>
			),
		},
		{
			title: t('Label_PhoneRewardTime'),
			key: 'phoneRewardTime',
			dataIndex: 'phoneRewardTime',
			width: 100,
			align: 'center' as 'center',
			render: (phoneRewardTime: string) =>
				!isEmpty(phoneRewardTime) ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{phoneRewardTime}
					</Typography.Text>
				) : (
					'-'
				),
		},
		{
			title: t('Label_EmailVerified'),
			key: 'emailVerified',
			dataIndex: 'emailVerified',
			width: 80,
			align: 'center' as 'center',
			render: (emailVerified: boolean) =>
				emailVerified ? t('Label_Yes') : t('Label_No'),
		},
		{
			title: t('Label_EmailReward'),
			key: 'emailReward',
			dataIndex: 'emailReward',
			width: 100,
			align: 'center' as 'center',
			render: (emailReward: number) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{numberFormatter.format(emailReward || 0)}
				</Typography.Text>
			),
		},
		{
			title: t('Label_EmailRewardTime'),
			key: 'emailRewardTime',
			dataIndex: 'emailRewardTime',
			width: 100,
			align: 'center' as 'center',
			render: (emailRewardTime: string) =>
				!isEmpty(emailRewardTime) ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{emailRewardTime}
					</Typography.Text>
				) : (
					'-'
				),
		},
		{
			title: t('Label_VerificationRewardAmount'),
			key: 'verificationReawardAmount',
			dataIndex: 'verificationReawardAmount',
			width: 100,
			align: 'center' as 'center',
			render: (verificationReawardAmount: number) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{numberFormatter.format(verificationReawardAmount || 0)}
				</Typography.Text>
			),
		},
		{
			title: t('Label_VerificationRewardTime'),
			key: 'verificationReawardTime',
			dataIndex: 'verificationReawardTime',
			width: 100,
			align: 'center' as 'center',
			render: (verificationReawardTime: string) =>
				!isEmpty(verificationReawardTime) ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{verificationReawardTime}
					</Typography.Text>
				) : (
					'-'
				),
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				pagination={pagination as TablePaginationConfig}
				dataSource={verificationRewardReportList ?? []}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export default VerificationReportTable
