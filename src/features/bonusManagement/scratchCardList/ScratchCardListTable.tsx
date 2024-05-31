import React, { FC } from 'react'
import { IGetScratchCardListData } from 'features/bonusManagement/type'
import { TablePaginationConfig, Typography } from 'antd'
import { PaginationInterface } from 'common/hooks'
import { Table } from 'components'
import { LayoutContent } from 'app/pages/layout'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

interface IScratchCardListTableProps {
	loading: boolean
	scratchCardList: IGetScratchCardListData[]
	onTableChange: (newPagination: TablePaginationConfig) => void
	pagination: PaginationInterface
}

const ScratchCardListTable: FC<IScratchCardListTableProps> = ({
	loading,
	scratchCardList,
	onTableChange,
	pagination,
}) => {
	const { t } = useTranslation()
	const { timeZoneUtcOffset } = useTimeZone()
	const columns = [
		{
			title: t('Label_ScratchCardCode'),
			key: 'scratchCardCode',
			dataIndex: 'scratchCardCode',
			width: 100,
			align: 'center' as 'center',
			render: (scratchCardCode: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{scratchCardCode}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Joiner'),
			key: 'userName',
			dataIndex: 'userName',
			width: 80,
			align: 'center' as 'center',
			render: (scratchCardCode: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{scratchCardCode ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 120,
			align: 'center' as 'center',
			render: (createTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{createTime
						? dayjs(createTime)
								.utcOffset(timeZoneUtcOffset)
								.format('YYYY-MM-DD  HH:mm:ss')
						: '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: 120,
			align: 'center' as 'center',
			render: (updateTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{updateTime
						? dayjs(updateTime)
								.utcOffset(timeZoneUtcOffset)
								.format('YYYY-MM-DD  HH:mm:ss')
						: '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_LastUpdateUser'),
			key: 'lastUpdateUser',
			dataIndex: 'lastUpdateUser',
			width: 80,
			align: 'center' as 'center',
			render: (updateUser: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{updateUser ?? '-'}
				</Typography.Text>
			),
		},
	]
	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={scratchCardList ?? []}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export { ScratchCardListTable }
