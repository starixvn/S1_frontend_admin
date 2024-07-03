/* eslint-disable react/no-unstable-nested-components */
import dayjs from 'dayjs'
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
import { forwardRef, useImperativeHandle, useRef } from 'react'

interface IHeaderManagementTableProps {
	loading: boolean
	isSortMode: boolean
	headerManagementList: IHeaderSettingData[]
	timeZoneUtcOffset: number
	handleSetSort: (id: number, sort: number) => void
}

const HeaderManagementTable = forwardRef(
	(
		{
			loading,
			isSortMode,
			headerManagementList,
			timeZoneUtcOffset,
			handleSetSort,
		}: IHeaderManagementTableProps,
		ref
	) => {
		const { t } = useTranslation()

		const headerManagementWithStatusList = filter(headerManagementList, {
			status: IHeaderSettingEnum.True,
		})

		const ref1 = useRef(null)
		const ref2 = useRef(null)
		const ref3 = useRef(null)
		const ref4 = useRef(null)
		const ref5 = useRef(null)
		const divRef = useRef(null)

		useImperativeHandle(ref, () => ({
			step1: () => ref1.current,
			step2: () => ref2.current,
			step3: () => ref3.current,
			step4: () => ref4.current,
			step5: () => ref5.current,
			step6: () => divRef.current,
		}))

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
							{dayjs(updateTime)
								.utcOffset(timeZoneUtcOffset)
								.format(timeFormat)}
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
			<LayoutContent.Card ref={ref1} id='aaa'>
				<div id='aaa'>123123</div>
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
					scroll={{ y: 800 }}
					rowKey='id'
				/>
			</LayoutContent.Card>
		)
	}
)

export default HeaderManagementTable
