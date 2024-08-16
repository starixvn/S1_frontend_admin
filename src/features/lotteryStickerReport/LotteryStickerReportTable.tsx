import { FC } from 'react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { TablePaginationConfig } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { PaginationInterface } from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import { timeFormat, numberFormatter } from 'common/utils/format'
import { IStickerReportData } from './type'

interface ILotteryStickerReportProps {
	loading: boolean
	stickerReportData: IStickerReportData[]
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
}
const LotteryStickerReportTable: FC<ILotteryStickerReportProps> = ({
	loading,
	stickerReportData,
	pagination,
	onTableChange,
}) => {
	const { t } = useTranslation()
	const { timeZoneUtcOffset } = useTimeZone()

	/** report 紀錄 */
	const reportColumns = [
		{
			title: t('Label_Site'),
			key: 'siteName',
			dataIndex: 'siteName',
			width: 50,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Round'),
			key: 'roundId',
			dataIndex: 'roundId',
			width: 50,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Period'),
			key: 'period',
			width: 180,
			align: 'center' as 'center',
			render: ({ roundStartDate, roundEndDate }: IStickerReportData) => {
				const hasTime = roundStartDate && roundEndDate

				const startDate = dayjs(roundStartDate)
					.utcOffset(timeZoneUtcOffset)
					.format(timeFormat)

				const endDate = dayjs(roundEndDate)
					.utcOffset(timeZoneUtcOffset)
					.format(timeFormat)

				return hasTime ? `${startDate} - ${endDate}` : '-'
			},
		},
		{
			title: t('Label_UserName'),
			key: 'userName',
			dataIndex: 'userName',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_SabaId'),
			key: 'sabaId',
			dataIndex: 'sabaId',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Sticker'),
			key: 'stickerName',
			dataIndex: 'stickerName',
			width: 50,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: 70,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Amount'),
			key: 'stickerAmount',
			width: 50,
			align: 'center' as 'center',
			render: ({ stickerAmount }: IStickerReportData) => {
				return numberFormatter.format(stickerAmount) ?? '-'
			},
		},
		{
			title: t('Label_PurchaseTime'),
			key: 'purchaseTime',
			width: 100,
			align: 'center' as 'center',
			render: ({ purchaseTime }: IStickerReportData) => {
				return purchaseTime
					? dayjs(purchaseTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '-'
			},
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={reportColumns}
				dataSource={stickerReportData ?? []}
				pagination={pagination as TablePaginationConfig}
				scroll={{ y: '500px' }}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export { LotteryStickerReportTable }
