import { FC } from 'react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { TablePaginationConfig, Table as AntdTable } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { PaginationInterface } from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import { timeFormat } from 'common/utils/format'
import { IStickerReportData, IStickerReportCurrencyTotalData } from './type'
import { ReportCurrencyTypeEnum } from './constant'

interface ILotteryStickerReportProps {
	loading: boolean
	stickerReportData: IStickerReportData[]
	stickerReportCurrencyTotal: IStickerReportCurrencyTotalData[]
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
}
const LotteryStickerReportTable: FC<ILotteryStickerReportProps> = ({
	loading,
	stickerReportData,
	stickerReportCurrencyTotal,
	pagination,
	onTableChange,
}) => {
	const { t } = useTranslation()
	const { timeZoneUtcOffset } = useTimeZone()

	/** 是否有 currency 資料 */
	const showCurrencyTable = stickerReportCurrencyTotal.length > 0

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
			dataIndex: ['roundStartDate', 'roundEndDate'],
			width: 180,
			align: 'center' as 'center',
			render: (
				_: any,
				{ roundStartDate, roundEndDate }: IStickerReportData
			) => {
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
			key: 'sticker',
			dataIndex: 'stickerName',
			width: 50,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Currency'),
			key: 'currencyId',
			dataIndex: 'isoCode',
			width: 70,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Amount'),
			key: 'stickerAmount',
			dataIndex: 'stickerAmount',
			width: 50,
			align: 'center' as 'center',
		},
		{
			title: t('Label_PurchaseTime'),
			key: 'purchaseTime',
			dataIndex: 'purchaseTime',
			width: 100,
			align: 'center' as 'center',
			render: (_: any, { purchaseTime }: IStickerReportData) => {
				return purchaseTime
					? dayjs(purchaseTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '-'
			},
		},
	]

	/** currency 購買欄位，根據資料動態生成 */
	const currencyColumns = [
		// 依照設計圖，第一格空白
		{
			title: '',
			dataIndex: 'title',
			key: 'title',
			width: 50,
			align: 'center' as 'center',
		},
		// 根據貨幣陣列資料動態生成
		...stickerReportCurrencyTotal.map(({ isoCode }) => ({
			title: isoCode,
			dataIndex: isoCode,
			key: isoCode,
			width: 100,
			align: 'center' as 'center',
		})),
	]

	/**
	 * currency 購買資料，根據資料動態生成
	 * 該陣列包含兩個物件，分別為 count 物件／amount 物件：
	 * @count物件 紀錄 currency 總購買數量的物件
	 * @amount物件 紀錄 currency 總販售金額的物件 */
	const currencyPurchaseRecord: {
		key: string
		title: string
		[key: string]: number | string
	}[] = [
		{ key: 'count', title: t('Label_Count') },
		{ key: 'amount', title: t('Label_Amount') },
	]

	// 根據 stickerReportCurrencyTotal 將資料動態塞入 currencyPurchaseRecord
	stickerReportCurrencyTotal.forEach(
		({ isoCode, currencyCount, currencyAmount }) => {
			// 塞入各幣值的 Count 資料
			currencyPurchaseRecord[ReportCurrencyTypeEnum.Count][isoCode] =
				currencyCount

			// 塞入各幣值的 Amount 資料
			currencyPurchaseRecord[ReportCurrencyTypeEnum.Amount][isoCode] =
				currencyAmount
		}
	)

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
			{/* 應 ＰＭ 需求有資料再顯示，使用 AntdTable，
			    如使用components/Table 一定會有頁碼，這裡依照設計不需要頁碼 */}
			{showCurrencyTable && (
				<AntdTable
					loading={loading}
					columns={currencyColumns}
					dataSource={currencyPurchaseRecord ?? []}
					pagination={false}
					style={{ width: 'fit-content', marginTop: '20px' }}
					bordered
				/>
			)}
		</LayoutContent.Card>
	)
}

export { LotteryStickerReportTable }
