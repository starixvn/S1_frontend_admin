import { Typography } from 'antd'
import { Table } from 'components'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { INewUserOnlineReportData } from 'features/userOnlineReport/type'

interface IUserOnlineReportTableProps {
	userOnlineReportList: INewUserOnlineReportData[]
	loading: boolean
}

const UserOnlineReportTable = ({
	userOnlineReportList,
	loading,
}: IUserOnlineReportTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_LocalTime'),
			key: 'localTime',
			dataIndex: 'localTime',
			width: 100,
			align: 'center' as 'center',
			render: (localTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{localTime}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Desktop'),
			key: 'Desktop',
			dataIndex: 'desktop',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_H5'),
			key: 'H5',
			dataIndex: 'h5',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_App'),
			key: 'APP',
			dataIndex: 'app',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Line'),
			key: 'LINE',
			dataIndex: 'line',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Total'),
			key: 'Total',
			width: 100,
			align: 'center' as 'center',
			render: ({ desktop = 0, h5 = 0, app = 0 }: INewUserOnlineReportData) => {
				return desktop + h5 + app
			},
		},
	]
	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				pagination={false}
				dataSource={userOnlineReportList}
			/>
		</LayoutContent.Card>
	)
}

export default UserOnlineReportTable
