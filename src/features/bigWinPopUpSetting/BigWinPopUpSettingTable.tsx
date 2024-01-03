import React from 'react'
import { useTranslation } from 'react-i18next'
import { Space, Switch, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { numberFormatter } from 'common/utils/format'
import { IGetCategoryData } from 'common/service/allDataApi'
import { Table } from 'components'
import { PermissionInterface } from 'type'
import { IBigWinSettingData } from 'features/bigWinPopUpSetting/type'

interface IBigWinPopUpSettingTableProps {
	loading: boolean
	editPermission?: PermissionInterface
	bigWinSettingList: IBigWinSettingData[]
	categoryList: IGetCategoryData[]
	onToggle: (status: boolean, siteId: number, currencyId: number) => void
	onEdit: ({
		siteId,
		currencyId,
		iTpCategoryList,
		multipleOfWinning,
		minOfWinning,
		status,
	}: {
		siteId: number
		currencyId: number
		iTpCategoryList: number[]
		multipleOfWinning: number
		minOfWinning: number
		status: number
	}) => void
}

const BigWinPopUpSettingTable = ({
	loading,
	editPermission,
	bigWinSettingList,
	categoryList,
	onToggle,
	onEdit,
}: IBigWinPopUpSettingTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_Action'),
			key: 'status',
			width: 100,
			align: 'center' as 'center',
			render: (record: IBigWinSettingData) => {
				const {
					siteId,
					currencyId,
					status,
					iTpCategoryList,
					multipleOfWinning,
					minOfWinning,
				} = record

				return (
					<Space
						style={{
							display: 'flex',
							justifyContent: 'space-around',
							width: 'auto',
						}}
					>
						<Typography.Link
							disabled={!editPermission?.canUse}
							onClick={() =>
								onEdit({
									siteId,
									currencyId,
									iTpCategoryList,
									multipleOfWinning,
									minOfWinning,
									status,
								})
							}
						>
							{t('Label_Edit')}
						</Typography.Link>
						<Switch
							disabled={!editPermission?.canUse}
							checked={Boolean(status)}
							onClick={value => onToggle(value, siteId, currencyId)}
						/>
					</Space>
				)
			},
		},
		{
			title: t('Label_SiteName'),
			key: 'siteName',
			dataIndex: 'siteName',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Currency'),
			key: 'currencyName',
			dataIndex: 'currencyName',
			width: 100,
			align: 'center' as 'center',
			render: (currencyName: string) => currencyName || '-',
		},
		{
			title: t('Label_Category'),
			key: 'iTpCategoryList',
			dataIndex: 'iTpCategoryList',
			width: 100,
			align: 'center' as 'center',
			render: (iTpCategoryList: number[]) =>
				iTpCategoryList.map((category, index, array) => {
					const foundCategory = categoryList.find(
						({ categoryId }) => categoryId === category
					)
					return index === array.length - 1
						? foundCategory?.categoryName
						: `${foundCategory?.categoryName}, `
				}),
		},
		{
			title: t('Label_MultipleOfWinning'),
			key: 'multipleOfWinning',
			dataIndex: 'multipleOfWinning',
			width: 100,
			align: 'center' as 'center',
			render: (multipleOfWinning: number) =>
				numberFormatter.format(multipleOfWinning) ?? '-',
		},
		{
			title: t('Label_WinProfit'),
			key: 'minOfWinning',
			dataIndex: 'minOfWinning',
			width: 100,
			align: 'center' as 'center',
			render: (minOfWinning: number) =>
				numberFormatter.format(minOfWinning) ?? '-',
		},
	]

	return (
		<LayoutContent.Card style={{ marginTop: '20px' }}>
			<Table
				loading={loading}
				columns={columns}
				dataSource={bigWinSettingList}
			/>
		</LayoutContent.Card>
	)
}

export default BigWinPopUpSettingTable
