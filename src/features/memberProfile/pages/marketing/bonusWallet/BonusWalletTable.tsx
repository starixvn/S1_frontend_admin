import { IBonusWalletInfoData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'

interface IBonusWalletTableProps {
	loading: boolean
	bonusWalletInfos: IBonusWalletInfoData[]
}

const BonusWalletTable = ({
	loading,
	bonusWalletInfos,
}: IBonusWalletTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_PromotionCategory'),
			key: 'promotionCategory',
			dataIndex: 'promotionCategory',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_BonusCode'),
			key: 'bonusCode',
			dataIndex: 'bonusCode',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Bonus'),
			key: 'bonus',
			dataIndex: 'bonus',
			width: 100,
			align: 'center' as 'center',
		},
	]
	return (
		<Table
			loading={loading}
			pagination={false}
			dataSource={bonusWalletInfos ?? []}
			columns={columns}
			style={{ marginTop: '10px', marginBottom: '10px' }}
		/>
	)
}

export { BonusWalletTable }
