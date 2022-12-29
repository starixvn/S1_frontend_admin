/* eslint-disable react/no-unstable-nested-components */
import { IHotGameData } from 'features/hotGameManagement/type'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import {
	DraggableBodyRow,
	DraggableContainer,
	DragHandle,
	Table,
} from 'components'
import { Popconfirm, Space, TablePaginationConfig, Typography } from 'antd'
import moment from 'moment/moment'
import { timeFormat } from 'common/utils/format'
import { PaginationInterface } from 'common/hooks'
import { PermissionInterface } from 'type'
import { Dispatch, SetStateAction, useContext } from 'react'
import { HotGameContext } from 'features/hotGameManagement/hotGameContext'
import { SortEnd } from 'react-sortable-hoc'
import { arrayMoveImmutable } from 'array-move'
import { ColumnsType } from 'antd/es/table'

interface IHotGameManagementTableProps {
	hotGameList: IHotGameData[]
	editPermission?: PermissionInterface
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	setTableSource: Dispatch<SetStateAction<IHotGameData[]>>
	onEditClick: (id: number) => void
	onTableChange: (newPagination: TablePaginationConfig) => void
	onDeleteHotGame: (id: number) => void
}

const HotGameManagementTable = ({
	hotGameList,
	editPermission,
	pagination,
	timeZoneUtcOffset,
	setTableSource,
	onEditClick,
	onTableChange,
	onDeleteHotGame,
}: IHotGameManagementTableProps) => {
	const { t } = useTranslation()
	const { isSortMode, loading } = useContext(HotGameContext)

	const columns = [
		isSortMode && {
			title: t('Label_Sort'),
			dataIndex: 'sort',
			width: 30,
			align: 'center' as 'center',
			render: () => <DragHandle />,
		},
		{
			title: t('Label_Action'),
			key: 'action',
			width: 100,
			align: 'center' as 'center',
			render: (record: IHotGameData) => {
				const { id } = record
				return (
					<Space size='middle'>
						<Typography.Link
							onClick={() => onEditClick(id)}
							disabled={!editPermission?.canUse || isSortMode}
						>
							{t('Label_Edit')}
						</Typography.Link>
						<Popconfirm
							title={t('Label_SureToDelete')}
							onConfirm={() => onDeleteHotGame(id)}
						>
							<Typography.Link disabled={!editPermission?.canUse || isSortMode}>
								{t('Label_Delete')}
							</Typography.Link>
						</Popconfirm>
					</Space>
				)
			},
		},
		{
			title: t('Label_TopCategory'),
			key: 'topCategory',
			dataIndex: 'topCategory',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_TpName'),
			key: 'tpName',
			dataIndex: 'tpName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_TpGameType'),
			key: 'tpGameType',
			dataIndex: 'tpGameType',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_TpGameType'),
			key: 'tpGameType',
			dataIndex: 'tpGameType',
			width: 120,
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
			title: t('Label_GameId'),
			key: 'gameId',
			dataIndex: 'gameId',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Sort'),
			key: 'sort',
			dataIndex: 'sort',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_LastUpdateTime'),
			dataIndex: 'lastUpdateTime',
			width: 120,
			align: 'center' as 'center',
			render: (updateTime: string) =>
				updateTime ? (
					<div style={{ whiteSpace: 'nowrap' }}>
						{moment(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</div>
				) : (
					''
				),
		},
		{
			title: t('Label_LastUpdateUser'),
			key: 'lastUpdateUser',
			dataIndex: 'lastUpdateUser',
			width: 80,
			align: 'center' as 'center',
		},
	].filter(Boolean) as ColumnsType<any>

	const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
		if (oldIndex !== newIndex) {
			const newData = arrayMoveImmutable(
				hotGameList.slice(),
				oldIndex,
				newIndex
			).filter((el: any) => !!el)
			setTableSource(newData)
		}
	}

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				dataSource={hotGameList}
				columns={columns}
				components={{
					body: {
						wrapper: (wrapper: any) => (
							<DraggableContainer {...wrapper} onSortEnd={onSortEnd} />
						),
						row: (row: any) => (
							<DraggableBodyRow {...row} dataSource={hotGameList} rowKey='id' />
						),
					},
				}}
				rowKey='id'
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export { HotGameManagementTable }
