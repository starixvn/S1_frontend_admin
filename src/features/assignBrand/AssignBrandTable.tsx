import { FC } from 'react'
import moment from 'moment'
import { TablePaginationConfig, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { PAGINATION, useAuth } from 'common/hooks'
import { Table } from 'components'
import { timeFormat } from 'common/utils/format'
import { AssignBrandState } from './type'

interface AssignBrandTableProps {
	loading: boolean
	assignBrands: AssignBrandState[]
	onOpenEditBrandModal: ({ userId }: { userId: number }) => void
}

const AssignBrandTable: FC<AssignBrandTableProps> = ({
	loading,
	assignBrands,
	onOpenEditBrandModal,
}) => {
	const { t } = useTranslation()
	const { userData } = useAuth()

	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: 80,
			align: 'center' as 'center',
			render: (values: any) => (
				<Typography.Link
					disabled={userData?.userId === values?.userId}
					onClick={() => {
						onOpenEditBrandModal({
							userId: values?.userId,
						})
					}}
				>
					{t('Label_Edit')}
				</Typography.Link>
			),
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			dataIndex: 'userName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Brand'),
			key: 'brand',
			dataIndex: 'brand',
			width: 120,
			align: 'center' as 'center',
			render: (brand: { siteId: number; siteName: string }[]) => {
				const siteNames = brand.map(item => item.siteName)
				return siteNames.join(' / ')
			},
		},
		{
			title: t('Label_LoginTime'),
			key: 'loginTime',
			dataIndex: 'loginTime',
			width: 120,
			align: 'center' as 'center',
			render: (loginTime: string) =>
				loginTime ? moment(loginTime).format(timeFormat) : '',
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: 120,
			align: 'center' as 'center',
			render: (updateTime: string) =>
				updateTime ? moment(updateTime).format(timeFormat) : '',
		},
	]
	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={assignBrands}
				pagination={PAGINATION as TablePaginationConfig}
			/>
		</LayoutContent.Card>
	)
}

export default AssignBrandTable
