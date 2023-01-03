import { useState } from 'react'
import { Table } from 'components'
import { isJSON } from 'common/utils'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { TablePaginationConfig, Typography } from 'antd'
import { PaginationInterface, useModal } from 'common/hooks'
import { IGetFailRecordReportData } from 'features/failBet/type'
import FailBetInfoModal from 'features/failBet/FailBetInfoModal'

interface FailBetTableProps {
	loading: boolean
	pagination: PaginationInterface
	failRecordReportList: IGetFailRecordReportData[]
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const FailBetTable = ({
	loading,
	pagination,
	failRecordReportList,
	onTableChange,
}: FailBetTableProps) => {
	const { t } = useTranslation()
	const failBetInfoModal = useModal()
	const [infoDetail, setInfoDetail] = useState<string>('{}')

	const handleInfoModal = async (info: string) => {
		if (!isJSON(info)) return
		await setInfoDetail(info)
		await failBetInfoModal.onOpen()
	}

	const columns = [
		{
			title: t('Label_Currency'),
			key: 'currencyName',
			dataIndex: 'currencyName',
			align: 'center' as 'center',
			render: (currencyName: string) => currencyName || '-',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			dataIndex: 'userName',
			align: 'center' as 'center',
			render: (userName: string) => userName || '-',
		},
		{
			title: t('Label_TransTime'),
			key: 'transTime',
			dataIndex: 'transTime',
			align: 'center' as 'center',
			render: (transTime: string) => transTime || '-',
		},
		{
			title: t('Label_Vender'),
			key: 'tpName',
			dataIndex: 'tpName',
			align: 'center' as 'center',
			render: (tpName: string) => tpName || '-',
		},
		{
			title: t('Label_TransId'),
			key: 'transId',
			dataIndex: 'transId',
			align: 'center' as 'center',
			render: (transId: string) => transId || '-',
		},
		{
			title: t('Label_Info'),
			key: 'info',
			render: (Record: IGetFailRecordReportData) => {
				const { info } = Record
				return isJSON(info) ? (
					<Typography.Link onClick={() => handleInfoModal(info)}>
						{t('Label_Detail')}
					</Typography.Link>
				) : (
					'-'
				)
			},
			align: 'center' as 'center',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={failRecordReportList ?? []}
				pagination={pagination as TablePaginationConfig}
				rowKey='id'
				onChange={onTableChange}
			/>

			<FailBetInfoModal
				loading={loading}
				onCancel={failBetInfoModal.onCancel}
				visible={failBetInfoModal.visible}
				FailBetInfoDetail={infoDetail}
			/>
		</LayoutContent.Card>
	)
}

export default FailBetTable
