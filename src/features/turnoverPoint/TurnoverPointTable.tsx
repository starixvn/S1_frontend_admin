import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Divider, Space, Tabs, Typography } from 'antd'
import { Table } from 'components'
import { LayoutContent } from 'app/pages/layout'
import { Currency } from 'common/enum/type'
import { PermissionInterface } from 'type'
import { trimEnd, concat } from 'lodash'
import { ColumnsType } from 'antd/lib/table'
import { EditFilled } from '@ant-design/icons'
import { createSearchParams, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useQueryParams } from 'common/hooks'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import {
	CategoryTurnoverPointSetting,
	IGetTpCategoryData,
	IGetTurnoverPointSettingListData,
} from './type'

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
					const { vipLevelName, vipLevel } = values
					return (
						<Typography.Link
							disabled={!editPermission?.canUse}
							onClick={() => {
								const { currencyId } = queryParams
								const searchParams = createSearchParams({
									vipLevelName: trimEnd(vipLevelName.toUpperCase(), 'CLUB'),
									currencyId,
								})
								navigate(
									`/${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.pointSetting.sub.turnoverPointSetting.root}/${vipLevel}?${searchParams}`
								)
							}}
						>
							{t('Label_Edit')}
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
				render: (vipLevelName: string) =>
					trimEnd(vipLevelName.toUpperCase(), 'CLUB'),
			},
			{
				title: '',
				key: 'Turnover',
				width: 80,
				align: 'center' as 'center',
				render: () => (
					<>
						<Typography.Text style={{ height: '30px' }}>
							{t('Label_TurnOver')}
						</Typography.Text>
						<Divider style={{ margin: '16px 0' }} />
						<Typography.Text style={{ height: '30px', whiteSpace: 'nowrap' }}>
							{t('Label_PointRate')}
						</Typography.Text>
					</>
				),
			},
		]
		const subColumn: ColumnsType<IGetTurnoverPointSettingListData> = []
		categoryList.forEach(categoryItem => {
			const { categoryName, categoryId } = categoryItem
			const columnItem = {
				title: (
					<Space>
						{categoryName}
						<Typography.Link
							onClick={() => handleCategoryClick(categoryId, categoryName)}
						>
							<EditFilled />
						</Typography.Link>
					</Space>
				),
				key: categoryId.toString(),
				dataIndex: 'tpCategoryTurnoverPointSetting',
				width: 100,
				align: 'center' as 'center',
				render: (list: CategoryTurnoverPointSetting[]) => {
					const currentCategory = list.find(
						item => item.tpCategoryId === categoryItem.categoryId
					)
					const currentPoint = () => {
						const getTime = (time: string) => dayjs(time).format('YYYY/MM/DD')
						if (currentCategory) {
							const {
								promotionStatus,
								promotionPointRate,
								promotionStartTime,
								promotionEndTime,
								pointRate,
							} = currentCategory
							return promotionStatus ? (
								<>
									<Divider style={{ margin: '16px 0 8px' }} />
									<Space
										direction='vertical'
										align='center'
										style={{ height: '30px' }}
										size={0}
									>
										<Typography.Text>{promotionPointRate}</Typography.Text>
										<Typography.Text
											style={{
												fontSize: '5px',
												whiteSpace: 'nowrap',
											}}
										>
											{getTime(promotionStartTime)} ~{' '}
											{getTime(promotionEndTime)}
										</Typography.Text>
									</Space>
								</>
							) : (
								<>
									<Divider style={{ margin: '16px 0' }} />
									<Typography.Text style={{ height: '30px' }}>
										{pointRate}
									</Typography.Text>
								</>
							)
						}
						return 'N/A'
					}
					return currentCategory ? (
						<>
							<Typography.Text style={{ height: '30px' }}>
								{currentCategory.turnover}
							</Typography.Text>
							{currentPoint()}
						</>
					) : (
						<>
							<Typography.Text style={{ height: '30px' }}>N/A</Typography.Text>
							<Divider style={{ margin: '16px 0' }} />
							<Typography.Text style={{ height: '30px' }}>N/A</Typography.Text>
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
								dataSource={turnoverTableData ?? []}
								pagination={false}
								size='large'
							/>
						)}
					</TabPane>
				))}
			</Tabs>
		</LayoutContent.Card>
	)
}

export { TurnoverPointTable }
