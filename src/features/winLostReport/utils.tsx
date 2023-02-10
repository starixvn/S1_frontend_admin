import { Typography } from 'antd'
import { v4 as uuidV4 } from 'uuid'
import { cloneDeep } from 'lodash'
import { AlignType } from 'rc-table/lib/interface'
import { isPositiveNum } from 'common/utils'
import { numFormatToDigits } from 'common/utils/format'
import { useTranslation } from 'react-i18next'
import { IWinLossTableData } from 'features/winLostReport/type'
import { i18nKeyInfo, OrderEnum } from 'features/winLostReport/constants'

// S2C
export const winLossReportConverter = (
	winLossReport: IWinLossTableData[] | any[],
	haveDetail: boolean
): IWinLossTableData[] => {
	if (!winLossReport || winLossReport.length === 0) {
		return []
	}
	const cloneWinLossReport = cloneDeep(winLossReport)
	cloneWinLossReport.forEach(item => {
		const { displayKey, children } = item
		Object.assign(item, { key: uuidV4() })
		if (displayKey === 'total') {
			delete item.children
		} else {
			children?.forEach((childItem: any) => {
				const { data } = childItem
				Object.assign(
					childItem,
					!haveDetail
						? {
								...data,
								key: uuidV4(),
						  }
						: {
								...data,
								key: uuidV4(),
								children: [],
						  }
				)
				delete childItem.data
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
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{displayKey ?? '-'}
				</Typography.Text>
			),
		}
		tableColumns = columns.map(dataIndex => {
			return {
				title: t(
					i18nKeyInfo[dataIndex.charAt(0).toUpperCase() + dataIndex.slice(1)]
				),
				key: dataIndex,
				dataIndex,
				align: 'right' as AlignType,
				sorter: true,
				width: 70,
				render: (data: number | string) =>
					Number(data) ? (
						<Typography.Text
							type={isPositiveNum(data) ? undefined : 'danger'}
							style={{ whiteSpace: 'nowrap', padding: '5px' }}
						>
							{numFormatToDigits(Number(data) || 0)}
						</Typography.Text>
					) : (
						<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
							{data ?? '-'}
						</Typography.Text>
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
