import { Typography } from 'antd'
import { v4 as uuidV4 } from 'uuid'
import { cloneDeep, upperFirst } from 'lodash'
import { AlignType } from 'rc-table/lib/interface'
import { isPositiveNum } from 'common/utils'
import { numFormatToDigits } from 'common/utils/format'
import { useTranslation } from 'react-i18next'
import { IWinLossTableData } from 'features/winLostReport/type'
import { i18nKeyInfo, OrderEnum } from 'features/winLostReport/constants'

// S2C
export const winLossReportConverter = (
	winLossReport: IWinLossTableData[] | any[]
): IWinLossTableData[] => {
	if (!winLossReport || winLossReport.length === 0) {
		return []
	}
	const cloneWinLossReport = cloneDeep(winLossReport)
	cloneWinLossReport.forEach(item => {
		const { displayKey, children } = item
		Object.assign(item, {
			key: uuidV4(),
		})
		if (displayKey === 'total') {
			delete item.children
		} else {
			children?.forEach((childItem: any) => {
				const { data, displayKey: childDisplayKey } = childItem
				const cloneItem = cloneDeep(item)
				const cloneChildItem = cloneDeep(data)
				delete cloneItem.children
				delete cloneItem.key
				delete cloneItem.displayKey
				delete cloneChildItem.key
				// 如果data內資料完全相同就不展開顯示
				if (
					displayKey === childDisplayKey &&
					JSON.stringify(cloneItem) === JSON.stringify(cloneChildItem)
				) {
					delete item.children
				} else {
					Object.assign(childItem, {
						...data,
						key: uuidV4(),
					})
					delete childItem.data
				}
			})
		}
	})
	return cloneWinLossReport
}

export const tableColumnConverter = (tableList: object[]) => {
	const { t } = useTranslation()
	let tableColumns: object[] = []
	if (tableList.length > 0) {
		const excludeList = ['displayKey', 'children', 'key']
		const noTwoDecimalPlaceFields = [
			'betCount',
			'uniquePlayers',
			'depositCount',
			'withDrawCount',
		]
		const columns = Object.keys(tableList[0]).filter(
			value => !excludeList.includes(value)
		)
		const baseColumn = {
			title: t('Label_Group'),
			key: 'group',
			dataIndex: 'displayKey',
			sorter: true,
			align: 'left' as AlignType,
			width: 150,
			fixed: true,
			render: (displayKey: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap' }} ellipsis>
					{displayKey ?? '-'}
				</Typography.Text>
			),
		}
		tableColumns = columns.map(dataIndex => {
			if (dataIndex === 'margin') {
				return {
					title: t(i18nKeyInfo[upperFirst(dataIndex)]),
					key: dataIndex,
					dataIndex,
					align: 'right' as AlignType,
					sorter: true,
					width: 80,
					render: (data: number | string) => {
						if (Number(data)) {
							return (
								<Typography.Text
									style={{ whiteSpace: 'nowrap' }}
									type={isPositiveNum(data) ? undefined : 'danger'}
								>
									{numFormatToDigits(Number(data) * 100 || 0, 2, 2)}%
								</Typography.Text>
							)
						}
						return <Typography.Text>{data ?? '-'}</Typography.Text>
					},
				}
			}
			return {
				title: t(i18nKeyInfo[upperFirst(dataIndex)]) || upperFirst(dataIndex),
				key: dataIndex,
				dataIndex,
				align: 'right' as AlignType,
				sorter: true,
				width: 80,
				render: (data: number | string) =>
					Number(data) ? (
						<Typography.Text
							style={{ whiteSpace: 'nowrap' }}
							type={isPositiveNum(data) ? undefined : 'danger'}
						>
							{noTwoDecimalPlaceFields.includes(dataIndex)
								? numFormatToDigits(Number(data) || 0)
								: numFormatToDigits(Number(data) || 0, 2, 2)}
						</Typography.Text>
					) : (
						<Typography.Text>{data ?? '-'}</Typography.Text>
					),
			}
		})
		tableColumns.splice(0, 0, baseColumn)
	}
	return tableColumns
}

export const orderDirectionConverter = (orderBy: string) => {
	return orderBy === 'ascend'
		? (OrderEnum.ascend as number)
		: (OrderEnum.descend as number)
}
