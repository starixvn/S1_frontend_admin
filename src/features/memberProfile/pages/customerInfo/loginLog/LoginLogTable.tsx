import { useTranslation } from 'react-i18next'
import { IGetLoginLogData } from 'features/memberProfile/type'
import { Table } from 'components'
import { PaginationInterface } from 'common/hooks'
import { TablePaginationConfig, Typography } from 'antd'
import dayjs from 'dayjs'
import { timeFormat } from 'common/utils/format'

interface ILoginLogTableProps {
	loading: boolean
	loginLog: IGetLoginLogData[]
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const LoginLogTable = ({
	loading,
	loginLog,
	pagination,
	timeZoneUtcOffset,
	onTableChange,
}: ILoginLogTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_LoginTime'),
			key: 'loginTime',
			dataIndex: 'loginTime',
			width: 120,
			align: 'center' as 'center',
			render: (loginTime: string) =>
				loginTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{dayjs(loginTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_LoginIp'),
			key: 'loginIp',
			dataIndex: 'loginIp',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Location'),
			key: 'location',
			dataIndex: 'location',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_FromUrl'),
			key: 'fromUrl',
			dataIndex: 'fromUrl',
			width: 120,
			align: 'center' as 'center',
		},
	]
	return (
		<Table
			loading={loading}
			pagination={pagination as TablePaginationConfig}
			style={{ marginTop: '10px', marginBottom: '10px' }}
			dataSource={loginLog ?? []}
			onChange={onTableChange}
			columns={columns}
		/>
	)
}

export { LoginLogTable }
