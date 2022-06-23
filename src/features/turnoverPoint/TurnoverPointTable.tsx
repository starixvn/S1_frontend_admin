import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Divider, Space, Table, Tabs, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { Currency } from 'common/enum/type'
import { PermissionInterface } from 'type'
import { trimEnd, concat } from 'lodash'
import { ColumnsType } from 'antd/lib/table'
import { EditFilled } from '@ant-design/icons'
import { createSearchParams, useNavigate } from 'react-router-dom'
import {
	CategoryTurnoverPointSetting,
	IGetTpCategoryData,
	IGetTurnoverPointSettingListData,
} from './type'
import { useQueryParams } from '../../common/hooks'
import { NEW_SITE_PREFIX_URL } from '../../app/config'
import paths from '../../app/constants/paths'

interface TurnoverPointTableInterface {
	loading: boolean
	onTabsChange: (TabsKey: string) => void
	currencyList: Currency[] | undefined
	categoryList: IGetTpCategoryData[]
	editPermission?: PermissionInterface
	tabActiveKey?: string
	turnoverTableData: IGetTurnoverPointSettingListData[]
	handleCategoryClick: (categoryId: number, modalTitle: string) => void
}

const TurnoverPointTable: FC<TurnoverPointTableInterface> = ({
	loading,
	onTabsChange,
	currencyList,
	editPermission,
	tabActiveKey,
	turnoverTableData,
	categoryList,
	handleCategoryClick,
}) => {
	const { t } = useTranslation()
	const { TabPane } = Tabs
	const [queryParams] = useQueryParams()
	const navigate = useNavigate()
	const getColumns = (): ColumnsType<IGetTurnoverPointSettingListData> => {
		const initColumns: ColumnsType<IGetTurnoverPointSettingListData> = [
			{
				title: t('Label_Action'),
				key: 'operation',
				width: 60,
				align: 'center' as 'center',
				render: (values: IGetTurnoverPointSettingListData) => {
					return (
						<Typography.Link
							disabled={!editPermission?.canUse}
							onClick={() => {
								const { currencyId } = queryParams
								const searchParams = createSearchParams({
									vipLevelName: trimEnd(
										values.vipLevelName.toUpperCase(),
										'CLUB'
									),
									currencyId,
								})
								navigate(
									`/${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.pointSetting.sub.turnoverPointSetting.root}/${values.vipLevel}?${searchParams}`
								)
							}}
						>
							<EditFilled />
						</Typography.Link>
					)
				},
			},
			{
				title: t('Label_VipLevel'),
				key: 'vipLevel',
				width: 100,
				align: 'center' as 'center',
				dataIndex: 'vipLevelName',
				render: (value: string) => trimEnd(value.toUpperCase(), 'CLUB'),
			},
			{
				title: '',
				key: 'Turnover',
				width: 80,
				align: 'center' as 'center',
				render: () => (
					<>
						{t('Label_TurnOver')}
						<Divider />
						{t('Label_PointRate')}
					</>
				),
			},
		]
		const subColumn: ColumnsType<IGetTurnoverPointSettingListData> = []
		categoryList.forEach(categoryItem => {
			const columnItem = {
				title: (
					<Space>
						{categoryItem.categoryName}
						<Typography.Link
							onClick={() =>
								handleCategoryClick(
									categoryItem.categoryId,
									categoryItem.categoryName
								)
							}
						>
							<EditFilled />
						</Typography.Link>
					</Space>
				),
				key: categoryItem.categoryId.toString(),
				dataIndex: 'tpCategoryTurnoverPointSetting',
				width: 100,
				align: 'center' as 'center',
				render: (list: CategoryTurnoverPointSetting[]) => {
					const currentCategory = list.find(
						item => item.tpCategoryId === categoryItem.categoryId
					)
					return currentCategory ? (
						<>
							{currentCategory.turnover}
							<Divider />
							{currentCategory.pointRate}
						</>
					) : (
						<>
							N/A
							<Divider />
							N/A
						</>
					)
				},
			}
			subColumn.push(columnItem)
		})
		return concat(initColumns, subColumn)
	}

	return (
		<LayoutContent.Card>
			<Tabs
				defaultActiveKey='1'
				onChange={onTabsChange}
				type='card'
				activeKey={tabActiveKey}
			>
				{currencyList?.map(item => (
					<TabPane tab={item.isoCode} key={item.currencyId}>
						{/* 確保有 categoryList 才做渲染 */}
						{categoryList && (
							<Table
								loading={loading}
								columns={getColumns()}
								bordered
								dataSource={turnoverTableData ?? []}
								pagination={false}
							/>
						)}
					</TabPane>
				))}
			</Tabs>
		</LayoutContent.Card>
	)
}

export { TurnoverPointTable }
