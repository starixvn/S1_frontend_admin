/* eslint-disable react/no-unstable-nested-components */
import moment from 'moment/moment'
import { filter } from 'lodash'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { timeFormat } from 'common/utils/format'
import { SortEnd } from 'react-sortable-hoc'
import { ColumnsType } from 'antd/es/table'
import {
	DraggableBodyRow,
	DraggableContainer,
	DragHandle,
	Table,
} from 'components'
import {
	IHeaderSettingData,
	IHeaderSettingEnum,
} from 'features/headerManagement/type'

interface IHeaderManagementTableProps {
	loading: boolean
	isSortMode: boolean
	headerManagementList: IHeaderSettingData[]
	timeZoneUtcOffset: number
	handleSetSort: (id: number, sort: number) => void
}

const HeaderManagementTable = ({
	loading,
	isSortMode,
	headerManagementList,
	timeZoneUtcOffset,
	handleSetSort,
}: IHeaderManagementTableProps) => {
	const { t } = useTranslation()

	const headerManagementWithStatusList = filter(headerManagementList, {
		status: IHeaderSettingEnum.True,
	})

	const columns = [
		isSortMode && {
			title: t('Label_Sort'),
			dataIndex: 'sortIcon',
			width: 30,
			align: 'center' as 'center',
			render: () => <DragHandle />,
		},
		{
			title: t('Label_Sort'),
			key: 'sort',
			width: 120,
			align: 'center' as 'center',
			// * 這裡因會有從 product status 關掉的情況，所以用 index 顯示
			render: (_: any, __: any, idx: number) => idx + 1,
		},
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'currency',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_LobbyCategory'),
			key: 'lobbyCategory',
			dataIndex: 'lobbyCategory',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_TpID'),
			key: 'tpId',
			dataIndex: 'tpId',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_ProductName'),
			key: 'productName',
			dataIndex: 'productName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Memo'),
			key: 'memo',
			dataIndex: 'memo',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_UpdateTime'),
			dataIndex: 'updateTime',
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
			title: t('Label_Updater'),
			key: 'updater',
			dataIndex: 'updater',
			width: 60,
			align: 'center' as 'center',
		},
	].filter(Boolean) as ColumnsType<any>

	const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
		// 有效 sorting
		if (oldIndex !== newIndex) {
			const { id } = headerManagementWithStatusList[oldIndex]
			const { sort } = headerManagementWithStatusList[newIndex]
			handleSetSort(id, sort)
		}
	}

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				dataSource={headerManagementWithStatusList}
				columns={columns}
				pagination={false}
				components={{
					body: {
						wrapper: (wrapper: any) => (
							<DraggableContainer {...wrapper} onSortEnd={onSortEnd} />
						),
						row: (row: any) => (
							<DraggableBodyRow
								{...row}
								dataSource={headerManagementWithStatusList}
								rowKey='id'
							/>
						),
					},
				}}
				rowKey='id'
			/>
		</LayoutContent.Card>
	)
}

export default HeaderManagementTable
