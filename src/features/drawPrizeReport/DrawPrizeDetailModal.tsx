import { useTranslation } from 'react-i18next'
import { Modal, Spin, TablePaginationConfig } from 'antd'
import { IGetDrawPrizeReportLogData } from 'features/drawPrizeReport/type'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { timeFormat, numFormatToDigits } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { Table } from 'components'

interface IDrawPrizeDetailModalProps {
	loading: boolean
	visible: boolean
	timeZoneUtcOffset: number
	prizeName: string
	pagination: PaginationInterface
	drawPrizeDetailData: IGetDrawPrizeReportLogData[]
	onTableChange: (newPagination: TablePaginationConfig) => void
	onCancel: () => void
}

const DrawPrizeDetailModal = ({
	loading,
	visible,
	timeZoneUtcOffset,
	prizeName,
	pagination,
	drawPrizeDetailData,
	onTableChange,
	onCancel,
}: IDrawPrizeDetailModalProps) => {
	const { t } = useTranslation()
	const [tableData, setTableData] = useState<IGetDrawPrizeReportLogData[]>([])
	const columns = [
		{
			title: t('Label_UserName'),
			key: 'userName',
			dataIndex: 'userName',
			width: '40%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_DrawTime'),
			key: 'drawTime',
			dataIndex: 'drawTime',
			width: '60%',
			align: 'center' as 'center',
			render: (drawTime: string) =>
				drawTime
					? dayjs(drawTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_Amount'),
			key: 'userName',
			dataIndex: 'userName',
			width: '40%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_BaseCurrency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: '40%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Rate_USD'),
			key: 'usdRate',
			dataIndex: 'usdRate',
			width: '40%',
			align: 'center' as 'center',
			render: (usdRate: number) => numFormatToDigits(usdRate),
		},
	]

	const onClosed = () => {
		setTableData([])
	}

	useEffect(() => {
		if (!loading) {
			setTableData(drawPrizeDetailData)
		}
	}, [loading])

	return (
		<Modal
			open={visible}
			footer={null}
			onCancel={onCancel}
			title={`${t('Label_PrizeName')} : ${prizeName}`}
			width='50vw'
			bodyStyle={{ paddingTop: 0 }}
			afterClose={onClosed}
		>
			<Spin spinning={loading}>
				<Table
					dataSource={tableData}
					columns={columns}
					pagination={pagination as TablePaginationConfig}
					onChange={onTableChange}
					scroll={{ y: 500 }}
					style={{ height: 600 }}
				/>
			</Spin>
		</Modal>
	)
}

export { DrawPrizeDetailModal }
