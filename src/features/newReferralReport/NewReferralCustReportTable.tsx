import { Typography } from 'antd'
import { Table } from 'components'
import paths from 'app/constants/paths'
import { useTranslation } from 'react-i18next'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { numberFormatter } from 'common/utils/format'
import { IDetailByCustIdData } from 'features/newReferralReport/type'

interface INewReferralCustReportTableProps {
	loading: boolean
	detailByCustIdList: IDetailByCustIdData[]
}

const NewReferralCustReportTable = ({
	loading,
	detailByCustIdList,
}: INewReferralCustReportTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_DepositDate'),
			key: 'depositDate',
			dataIndex: 'depositDate',
			width: 100,
			align: 'center' as 'center',
			render: (depositDate: string) => depositDate || '-',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			width: 100,
			align: 'center' as 'center',
			render: ({ custId, userName }: IDetailByCustIdData) =>
				userName ? (
					<Typography.Link
						href={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${custId}`}
						target='_blank'
					>
						{userName}
					</Typography.Link>
				) : (
					'-'
				),
		},
		{
			title: t('Label_DepositAmount'),
			key: 'totalDeposit',
			dataIndex: 'totalDeposit',
			width: 100,
			align: 'center' as 'center',
			render: (totalDeposit: number) =>
				numberFormatter.format(totalDeposit) ?? '-',
		},
		{
			title: t('Label_RewardAmount'),
			key: 'referralAmount',
			dataIndex: 'referralAmount',
			width: 100,
			align: 'center' as 'center',
			render: (referralAmount: number) =>
				numberFormatter.format(referralAmount) ?? '-',
		},
	]

	return (
		<Table
			loading={loading}
			pagination={false}
			dataSource={detailByCustIdList}
			columns={columns}
		/>
	)
}

export default NewReferralCustReportTable
