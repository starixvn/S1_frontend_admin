import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { Spin, TablePaginationConfig } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import React from 'react'
import { IGetFailRecordReportData } from 'features/failBet/type'
import { PaginationInterface, useModal } from 'common/hooks'
import FailBetInfoModal from 'features/failBet/FailBetInfoModal'
import { isJSON } from 'common/utils'

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
			align: 'center' as 'center',
			render: (Record: IGetFailRecordReportData) => {
				return isJSON(JSON.parse(Record.info)) ? (
					<FailBetInfoModal
						loading={loading}
						onCancel={failBetInfoModal.onCancel}
						visible={failBetInfoModal.visible}
						failBetInfoList={Record.info}
					/>
				) : null
			},
		},
	]

	return (
		<Spin spinning={loading}>
			<LayoutContent.Card>
				<Table
					loading={loading}
					columns={columns}
					dataSource={failRecordReportList ?? []}
					pagination={pagination as TablePaginationConfig}
					size='middle'
					onChange={onTableChange}
				/>
			</LayoutContent.Card>
		</Spin>
	)
}

export default FailBetTable
