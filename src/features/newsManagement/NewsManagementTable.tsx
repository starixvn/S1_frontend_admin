import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { message, Space, Switch, Typography, TablePaginationConfig } from 'antd'
import { Table } from 'components'
import { PermissionInterface } from 'type'
import { PaginationInterface } from 'common/hooks'
import { timeFormat } from 'common/utils/format'
import { LayoutContent } from 'app/pages/layout'
import { useSetNewsStatusMutation } from 'features/newsManagement/api'
import { INewsData } from 'features/newsManagement/type'

interface INewsManagementTableProps {
	newsList: INewsData[]
	pagination: PaginationInterface
	editPermission?: PermissionInterface
	getListLoading: boolean
	timeZoneUtcOffset: number
	onOpenModal: (newsId: number) => void
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const NewsManagementTable = ({
	newsList,
	pagination,
	editPermission,
	getListLoading,
	timeZoneUtcOffset,
	onOpenModal,
	onTableChange,
}: INewsManagementTableProps) => {
	const { t } = useTranslation()

	const [setNewsStatus, { isLoading: isSetNewsStatusLoading }] =
		useSetNewsStatusMutation()

	const onChangeStatus = async ({
		newsId,
		checked,
	}: {
		newsId: number
		checked?: boolean
	}) => {
		try {
			await setNewsStatus({
				newsId,
				status: checked ? 0 : 1,
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('Label_NotExpectedServerError')
			)
		}
	}

	const loading = getListLoading || isSetNewsStatusLoading

	const columns = [
		{
			title: t('Label_Title'),
			key: 'title',
			dataIndex: 'title',
			width: 100,
			align: 'center' as 'center',
			render: (title: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap' }}>
					{title || '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_PostTime'),
			key: 'postTime',
			dataIndex: 'postTime',
			width: 100,
			align: 'center' as 'center',
			render: (postTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{postTime
						? moment(postTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
						: ''}
				</Typography.Text>
			),
		},
		{
			title: t('Label_LastUpdateUser'),
			key: 'lastUpdateUser',
			dataIndex: 'lastUpdateUser',
			width: 100,
			align: 'center' as 'center',
			render: (user: string) => user || '-',
		},
		{
			title: t('Label_LastUpdateTime'),
			key: 'lastUpdateTime',
			dataIndex: 'lastUpdateTime',
			width: 120,
			align: 'center' as 'center',
			render: (updateTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{updateTime
						? moment(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
						: ''}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Sort'),
			key: 'sort',
			dataIndex: 'sort',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: 60,
			align: 'center' as 'center',
			render: ({ newsId, status }: INewsData) => {
				const checked = status === 1
				return (
					<Switch
						checked={checked}
						disabled={!editPermission?.canUse}
						onChange={() => onChangeStatus({ newsId, checked })}
					/>
				)
			},
		},
		{
			title: t('Label_Action'),
			key: 'newsId',
			width: 100,
			dataIndex: 'newsId',
			align: 'center' as 'center',
			render: (newsId: number) => {
				return (
					<Space size='middle'>
						<Typography.Link onClick={() => onOpenModal(newsId)}>
							{editPermission?.canUse ? t('Label_Edit') : t('Label_Detail')}
						</Typography.Link>
					</Space>
				)
			},
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				dataSource={newsList}
				columns={columns}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export { NewsManagementTable }
