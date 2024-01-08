import React from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import { IBigWinReportData } from 'features/bigWinPopUpReport/type'
import { numberFormatter } from 'common/utils/format'

interface IBigWinPopUpReportTableProps {
	loading: boolean
	bigWinReportList: IBigWinReportData[]
}

const BigWinPopUpReportTable = ({
	loading,
	bigWinReportList,
}: IBigWinPopUpReportTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_SiteName'),
			key: 'site',
			dataIndex: 'site',
			width: 100,
			align: 'center' as 'center',
			render: (siteName: string) => siteName || '-',
		},
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'currency',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_EventDate'),
			key: 'eventDate',
			dataIndex: 'eventDate',
			width: 100,
			align: 'center' as 'center',
			render: (eventDate: string) => eventDate || '-',
		},
		{
			title: t('Label_MemberId'),
			key: 'memberID',
			dataIndex: 'memberID',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Category'),
			key: 'category',
			dataIndex: 'category',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Vender'),
			key: 'venderName',
			dataIndex: 'venderName',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_GameName'),
			key: 'gameName',
			dataIndex: 'gameName',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Amount'),
			key: 'amount',
			dataIndex: 'amount',
			width: 100,
			align: 'center' as 'center',
			render: (amount: number) => numberFormatter.format(amount),
		},
	]
	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={bigWinReportList ?? []}
			/>
		</LayoutContent.Card>
	)
}

export default BigWinPopUpReportTable
