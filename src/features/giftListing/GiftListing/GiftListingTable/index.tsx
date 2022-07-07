/* eslint-disable react/no-unstable-nested-components */

import { FC } from 'react'
import { Space, Switch, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import moment from 'moment'
import { LayoutContent } from 'app/pages/layout'
import { timeFormat } from 'common/utils/format'
import {
	DraggableBodyRow,
	DraggableContainer,
	DragHandle,
	Table,
} from 'components'
import type { SortEnd } from 'react-sortable-hoc'
import { padStart } from 'lodash'
import { useTranslation } from 'react-i18next'
import { PermissionInterface } from 'type'
import { useNavigate } from 'react-router-dom'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { IGiftData } from '../../type'

interface IGiftListingTableProps {
	currencyId: number
	dataSource: IGiftData[]
	loading: boolean
	timeZoneUtcOffset: number
	editPermission?: PermissionInterface
	isSortMode: boolean
	onSortEnd: ({ oldIndex, newIndex }: SortEnd) => void
	onUpdateGift: (record: IGiftData) => void
}
const GiftListingTable: FC<IGiftListingTableProps> = ({
	currencyId,
	dataSource,
	loading,
	timeZoneUtcOffset,
	editPermission,
	isSortMode,
	onSortEnd,
	onUpdateGift,
}) => {
	const { t } = useTranslation()

	const navigate = useNavigate()

	const toggleGiftStatus = (record: IGiftData) => {
		const { status } = record
		onUpdateGift({ ...record, status: !status })
	}

	const columns = [
		isSortMode && {
			title: t('Label_Sort'),
			dataIndex: 'sort',
			width: 30,
			align: 'center' as 'center',
			render: () => <DragHandle />,
		},
		{
			title: t('Label_Id'),
			key: 'giftId',
			dataIndex: 'giftId',
			width: 120,
			align: 'center' as 'center',
			render: (giftId: string | null) =>
				// 格式化 categoryId，ex: 3 => GT003
				giftId ? `GT${padStart(giftId, 3, '0')}` : 'N/A',
		},
		{
			title: t('Label_Action'),
			key: 'operation',
			width: 80,
			align: 'center' as 'center',
			render: (record: IGiftData) => (
				<Space>
					<Typography.Link
						disabled={!editPermission?.canUse}
						onClick={() =>
							navigate(
								`/${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.giftManagement.sub.editGiftListing.root}/${currencyId}/${record.giftId}?defaultEditLang=${record.lang}}`
							)
						}
					>
						{t('Label_Edit')}
					</Typography.Link>
				</Space>
			),
		},
		{
			title: t('Label_GiftName'),
			dataIndex: 'giftName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Description'),
			dataIndex: 'description',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Tags'),
			dataIndex: 'tags',
			width: 120,
			align: 'center' as 'center',
			render: (tags: { tagId: number; tagName: string; lang: string }[]) =>
				tags.map(tag => (
					<Tag color='blue' key={tag.tagName} style={{ marginBottom: '4px' }}>
						{tag.tagName}
					</Tag>
				)),
		},
		{
			title: t('Label_Point'),
			dataIndex: 'point',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_PriceWorth'),
			width: 140,
			align: 'center' as 'center',
			render: (record: IGiftData) => `${record.isoCode} ${record.priceWorth}`,
		},
		{
			title: t('Label_Stock'),
			dataIndex: 'stock',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Status'),
			width: 80,
			align: 'center' as 'center',
			render: (record: IGiftData) => {
				const { status } = record ?? {}
				return (
					<Space>
						<Switch
							checked={Boolean(status)}
							onChange={() => toggleGiftStatus(record)}
							size='small'
						/>
					</Space>
				)
			},
		},
		{
			title: t('Label_LastUpdateUser'),
			dataIndex: `lastUpdater`,
			width: 100,
			align: 'center' as 'center',
			editable: false,
		},
		{
			title: t('Label_LastUpdateTime'),
			dataIndex: 'lastUpdateTime',
			width: '180px',
			align: 'center' as 'center',
			editable: false,
			render: (lastUpdateTime: string) =>
				lastUpdateTime
					? moment(lastUpdateTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)
					: '',
		},
	].filter(Boolean) as ColumnsType<any>

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				pagination={false}
				dataSource={dataSource}
				columns={columns}
				rowKey='giftId'
				components={{
					body: {
						wrapper: (wrapper: any) => (
							<DraggableContainer {...wrapper} onSortEnd={onSortEnd} />
						),
						row: (row: any) => (
							<DraggableBodyRow
								{...row}
								dataSource={dataSource}
								rowKey='giftId'
							/>
						),
					},
				}}
			/>
		</LayoutContent.Card>
	)
}

export default GiftListingTable
