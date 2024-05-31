import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { Space, TablePaginationConfig, Tag, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { PaginationInterface } from 'common/hooks'
import {
	numberFormatter,
	numFormatToDigits,
	timeFormat,
} from 'common/utils/format'
import dayjs from 'dayjs'
import { find, isNumber, isObject, isString } from 'lodash'
import { isJSON } from 'common/utils'
import { ColumnsType } from 'antd/es/table'
import type { SorterResult } from 'antd/es/table/interface'
import { IGetBetListData, IGetTagsData } from './type'

interface IBetListTableProps {
	loading: boolean
	pagination: PaginationInterface
	onTableChange: (
		newPagination: TablePaginationConfig,
		_: any,
		sorter: SorterResult<IGetBetListData>
	) => void
	betListData: IGetBetListData[]
	timeZoneUtcOffset: number
	tagList: IGetTagsData[]
}
const renderDetailItem = (item: { [key: string]: any }, key: any): any => {
	if (isString(item[key])) return item[key]
	if (isNumber(item[key])) return numberFormatter.format(Number(item[key]))
	if (isObject(item[key])) {
		return Object.keys(item[key]).map(detailItemKey => (
			<div
				key={detailItemKey}
				style={{ marginLeft: '12px', marginBottom: '2px' }}
			>
				<Typography.Text type='secondary'>{detailItemKey}: </Typography.Text>
				{renderDetailItem(item[key], detailItemKey)}
			</div>
		))
	}
	return 'null'
}

const renderJsonValue = (value: string) => {
	const obj: {} = JSON.parse(value)
	return Object.keys(obj).map(key => (
		<div key={key} style={{ width: 180 }}>
			<Typography.Text type='secondary' strong>
				{key}:{' '}
			</Typography.Text>
			{renderDetailItem(obj, key)}
		</div>
	))
}

const BetListTable: FC<IBetListTableProps> = ({
	loading,
	pagination,
	onTableChange,
	betListData,
	timeZoneUtcOffset,
	tagList,
}) => {
	const { t } = useTranslation()

	const columns: ColumnsType<IGetBetListData> = [
		{
			title: t('Label_MemberId'),
			key: 'userName',
			dataIndex: 'userName',
			align: 'center' as 'center',
			render: (userName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{userName ?? ''}
				</Typography.Text>
			),
		},
		{
			title: t('Label_TpUserName'),
			key: 'tpUserName',
			dataIndex: 'tpUserName',
			align: 'center' as 'center',
			render: (tpUserName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{tpUserName ?? ''}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'currency',
			align: 'center' as 'center',
			render: (currency: string) => (
				<div style={{ width: '80px' }}>{currency ?? ''}</div>
			),
		},
		{
			title: t('Label_VipLevel'),
			key: 'levelName',
			dataIndex: 'levelName',
			align: 'center' as 'center',
			render: (levelName: string) => (
				<div style={{ width: '120px' }}>
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{levelName}
					</Typography.Text>
				</div>
			),
		},
		{
			title: t('Label_Tag'),
			key: 'tags',
			dataIndex: 'tags',
			align: 'center' as 'center',
			render: (tags: number[]) => {
				const tagNames: Array<IGetTagsData | undefined> = []
				tags?.forEach(tagId => {
					const tagName = find(tagList, ['id', tagId])
					tagNames.push(tagName)
				})
				return (
					<Space direction='vertical' style={{ padding: '10px' }}>
						{tagNames?.map(tag => (
							<Tag color='blue' key={tag?.id}>
								{tag?.tagName}
							</Tag>
						))}
					</Space>
				)
			},
		},
		{
			title: t('Label_BetTime'),
			key: 'transTime',
			dataIndex: 'transTime',
			align: 'center' as 'center',
			sorter: true,
			render: (transTime: string) => (
				<div style={{ width: '180px' }}>
					{transTime ? (
						<Typography.Text style={{ whiteSpace: 'nowrap' }}>
							{dayjs(transTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
						</Typography.Text>
					) : (
						''
					)}
				</div>
			),
		},
		{
			title: t('Label_SettleTime'),
			key: 'settledTime',
			dataIndex: 'settledTime',
			align: 'center' as 'center',
			sorter: true,
			render: (settledTime: string) => (
				<div style={{ width: '180px' }}>
					{settledTime ? (
						<Typography.Text style={{ whiteSpace: 'nowrap' }}>
							{dayjs(settledTime)
								.utcOffset(timeZoneUtcOffset)
								.format(timeFormat)}
						</Typography.Text>
					) : (
						''
					)}
				</div>
			),
		},
		{
			title: t('Label_RefNo'),
			key: 'refNo',
			dataIndex: 'refNo',
			align: 'center' as 'center',
			render: (refNo: string) => (
				<div style={{ width: '120px' }}>{refNo ?? ''}</div>
			),
		},
		{
			title: t('Label_GameId'),
			key: 'gameID',
			dataIndex: 'gameID',
			align: 'center' as 'center',
			render: (gameID: string) => (
				<div style={{ width: '120px' }}>{gameID ?? ''}</div>
			),
		},
		{
			title: t('Label_Provider'),
			key: 'provider',
			dataIndex: 'provider',
			align: 'center' as 'center',
			render: (provider: string) => (
				<div style={{ width: '80px' }}>{provider ?? ''}</div>
			),
		},
		{
			title: t('Label_Product'),
			key: 'product',
			dataIndex: 'product',
			align: 'center' as 'center',
			render: (product: string) => (
				<div style={{ width: '150px' }}>
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{product ?? ''}
					</Typography.Text>
				</div>
			),
		},
		{
			title: t('Label_Category'),
			key: 'category',
			dataIndex: 'category',
			align: 'center' as 'center',
			render: (category: string) => (
				<div style={{ width: '100px' }}>{category ?? ''}</div>
			),
		},
		{
			title: t('Label_Game'),
			key: 'game',
			dataIndex: 'game',
			align: 'center' as 'center',
			render: (game: string) => (
				<div style={{ width: '100px' }}>{game ?? ''}</div>
			),
		},
		{
			title: t('Label_Title'),
			key: 'title',
			dataIndex: 'title',
			align: 'center' as 'center',
			render: (title: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{title ?? ''}
				</Typography.Text>
			),
		},
		{
			title: t('Label_MatchId'),
			key: 'matchID',
			dataIndex: 'matchID',
			align: 'center' as 'center',
			render: (matchID: string) => (
				<div style={{ width: '100px' }}>{matchID ?? ''}</div>
			),
		},
		{
			title: t('Label_TransId'),
			key: 'transId',
			dataIndex: 'transId',
			align: 'center' as 'center',
			render: (transId: string) => (
				<div style={{ width: '120px' }}>{transId ?? ''}</div>
			),
		},
		{
			title: t('Label_BetType'),
			key: 'betType',
			dataIndex: 'betType',
			align: 'center' as 'center',
			render: (betType: string) => (
				<div style={{ width: '80px' }}>{betType ?? ''}</div>
			),
		},
		{
			title: t('Label_BetChoice'),
			key: 'betChoice',
			dataIndex: 'betChoice',
			width: 100,
			render: (betChoice: string) => {
				if (isJSON(betChoice)) {
					return renderJsonValue(betChoice)
				}
				if (isString(betChoice)) {
					return <div style={{ width: '80px' }}>{betChoice ?? ''}</div>
				}
				return null
			},
		},
		{
			title: t('Label_Result'),
			key: 'result',
			dataIndex: 'result',
			align: 'center' as 'center',
			render: (result: string) => {
				if (isJSON(result)) {
					return renderJsonValue(result)
				}
				if (isString(result)) {
					return <div style={{ width: '80px' }}>{result ?? ''}</div>
				}
				return null
			},
		},
		{
			title: t('Label_Odds'),
			key: 'odds',
			dataIndex: 'odds',
			align: 'center' as 'center',
			sorter: true,
			render: (odds: number) => (
				<div style={{ width: '60px' }}>{numFormatToDigits(odds)}</div>
			),
		},
		{
			title: t('Label_OddsType'),
			key: 'oddsType',
			dataIndex: 'oddsType',
			align: 'center' as 'center',
			render: (oddsType: string) => (
				<div style={{ width: '60px' }}>{oddsType ?? ''}</div>
			),
		},
		{
			title: t('Label_Stake'),
			key: 'stake',
			dataIndex: 'stake',
			width: 100,
			align: 'center' as 'center',
			sorter: true,
			render: (stake: number) => (
				<div style={{ width: '60px' }}>{numberFormatter.format(stake)}</div>
			),
		},
		{
			title: t('Label_ValidStake'),
			key: 'validBet',
			dataIndex: 'validBet',
			align: 'center' as 'center',
			sorter: true,
			render: (validBet: number) => (
				<div style={{ width: '60px' }}>{numberFormatter.format(validBet)}</div>
			),
		},
		{
			title: t('Label_WinLoss'),
			key: 'winlostAmount',
			dataIndex: 'winlostAmount',
			align: 'center' as 'center',
			sorter: true,
			render: (winlostAmount: number) => (
				<div style={{ width: '60px' }}>
					{numberFormatter.format(winlostAmount)}
				</div>
			),
		},
		{
			title: t('Label_Platform'),
			key: 'platform',
			dataIndex: 'platform',
			align: 'center' as 'center',
			render: (platform: string) => (
				<div style={{ width: '60px' }}>{platform ?? ''}</div>
			),
		},
		{
			title: t('Label_Live'),
			key: 'live',
			dataIndex: 'live',
			align: 'center' as 'center',
			render: (live: string) => (
				<div style={{ width: '60px' }}>{live ?? ''}</div>
			),
		},
		{
			title: t('Label_Ip'),
			key: 'ip',
			dataIndex: 'ip',
			align: 'center' as 'center',
			render: (ip: string) => <div style={{ width: '80px' }}>{ip ?? ''}</div>,
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={betListData ?? []}
				pagination={pagination as TablePaginationConfig}
				// @ts-ignore
				onChange={onTableChange}
				scroll={{ x: 500 }}
				size='middle'
			/>
		</LayoutContent.Card>
	)
}
export { BetListTable }
