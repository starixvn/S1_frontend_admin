import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Space, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import { IGetRedemptionDetailData } from '../../type'

interface RedemptionDetailTableInterface {
	loading: boolean
	redemptionDetailData: IGetRedemptionDetailData
}

const RedemptionDetailTable: FC<RedemptionDetailTableInterface> = ({
	loading,
	redemptionDetailData,
}) => {
	const { t } = useTranslation()
	const { userName, pointBalance } = redemptionDetailData
	const columns = [
		{
			title: t('Label_ItemId'),
			key: 'itemId',
			dataIndex: 'itemId',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_ItemName'),
			key: 'itemName',
			dataIndex: 'itemName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_RedeemPoint'),
			key: 'redeemPoint',
			dataIndex: 'redeemPoint',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_PriceWorth'),
			key: 'priceWorth',
			dataIndex: 'priceWorth',
			width: 80,
			align: 'center' as 'center',
		},
	]
	return (
		<LayoutContent.Card style={{ marginTop: 0, paddingBottom: '20px' }}>
			<Space size='large' style={{ marginTop: '20px', marginBottom: '20px' }}>
				<Typography.Text strong style={{ fontSize: '1.05rem' }}>
					{`${t('Label_MemberId')} : ${userName}`}
				</Typography.Text>
				<Typography.Text strong style={{ fontSize: '1.05rem' }}>
					{`${t('Label_PointBalance')} : ${pointBalance}`}
				</Typography.Text>
			</Space>
			<Table
				loading={loading}
				columns={columns}
				dataSource={redemptionDetailData ? [redemptionDetailData] : []}
				pagination={false}
			/>
		</LayoutContent.Card>
	)
}

export { RedemptionDetailTable }
