import moment from 'moment'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Typography, TablePaginationConfig } from 'antd'
import { Table } from 'components'
import { timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { IAdminUserLogData } from 'features/memberProfile/pages/adminUserLog/type'

interface IAdminUserLogTableProps {
	loading: boolean
	pagination: PaginationInterface
	adminUserLogList: IAdminUserLogData[]
	timeZoneUtcOffset: number
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const DetailTitle = styled.span`
	color: rgba(0, 0, 0, 0.45);
	font-size: 14px;
`

const AdminUserLogTable = ({
	loading,
	pagination,
	adminUserLogList,
	timeZoneUtcOffset,
	onTableChange,
}: IAdminUserLogTableProps) => {
	const { t } = useTranslation()

	const renderDetailContent = ({
		infoObject,
	}: {
		infoObject: null | {
			userName: string
			[action: string]: string
		}
	}) => {
		if (!infoObject) return 'N/A'

		return Object.keys(infoObject).map((key: string) => (
			<div key={key} style={{ width: 180 }}>
				<DetailTitle>{key}:</DetailTitle> {infoObject[key]}
			</div>
		))
	}

	const columns = [
		{
			title: t('Label_Menu'),
			key: 'menuFunction',
			dataIndex: 'menuFunction',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_ActionType'),
			key: 'actionTypeName',
			dataIndex: 'actionTypeName',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Before'),
			key: 'beforeDetailInfoObject',
			dataIndex: 'beforeDetailInfoObject',
			width: 100,
			render: (
				beforeDetailInfoObject: null | {
					userName: string
					[action: string]: string
				}
			) => renderDetailContent({ infoObject: beforeDetailInfoObject }),
		},
		{
			title: t('Label_After'),
			key: 'afterDetailInfoObject',
			dataIndex: 'afterDetailInfoObject',
			width: 120,
			render: (
				afterDetailInfoObject: null | {
					userName: string
					[action: string]: string
				}
			) => renderDetailContent({ infoObject: afterDetailInfoObject }),
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 100,
			align: 'center' as 'center',
			render: (createTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{createTime
						? moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
						: ''}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 60,
			align: 'center' as 'center',
		},
	]

	return (
		<Table
			loading={loading}
			dataSource={adminUserLogList}
			columns={columns}
			pagination={pagination as TablePaginationConfig}
			onChange={onTableChange}
		/>
	)
}

export { AdminUserLogTable }
