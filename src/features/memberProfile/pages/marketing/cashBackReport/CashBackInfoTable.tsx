import { Table } from 'components'
import { IGetPromotionCashBackData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

interface ICashBackInfoTableProps {
	loading: boolean
	cashBackInfo: IGetPromotionCashBackData[]
	onBonusCodeClicked: (bonusCode: string) => void
}

const CashBackInfoTable = ({
	loading,
	cashBackInfo,
	onBonusCodeClicked,
}: ICashBackInfoTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_BonusCode'),
			key: 'bonusCode',
			dataIndex: 'bonusCode',
			width: '40%',
			align: 'center' as 'center',
			render: (bonusCode: string) => (
				<Typography.Link onClick={() => onBonusCodeClicked(bonusCode)}>
					{bonusCode}
				</Typography.Link>
			),
		},
		{
			title: t('Label_Description'),
			key: 'description',
			dataIndex: 'description',
			width: '60%',
			align: 'center' as 'center',
		},
	]

	return (
		<Table
			loading={loading}
			columns={columns}
			dataSource={cashBackInfo ?? []}
			pagination={false}
			style={{ marginTop: '10px', marginBottom: '10px' }}
		/>
	)
}

export { CashBackInfoTable }
