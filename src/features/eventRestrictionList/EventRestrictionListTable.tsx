import { Form, Space, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { timeFormat } from 'common/utils/format'
import { PermissionInterface } from 'type'
import {
	IGetEventRestrictionListData,
	IDelEventRestrictionArgs,
} from 'features/eventRestrictionList/type'
import { EditableTableCell } from 'features/vipRebateManagement/vipRebateManagementTable/EditableTableCell'

interface IExternalDomainTableProps {
	eventRestrictionList: IGetEventRestrictionListData[]
	editPermission?: PermissionInterface
	loading: boolean
	handleDelete: (record: IDelEventRestrictionArgs) => void
}

/**
 * ExternalDomainTable 欄位顯示
 * @param eventRestrictionList 資料
 * @param editPermission 編輯權限
 * @param loading 加載狀態
 * @param loading 刪除函數 */
const ExternalDomainTable = ({
	eventRestrictionList,
	editPermission,
	loading,
	handleDelete,
}: IExternalDomainTableProps) => {
	const { t } = useTranslation()

	/** 表格欄位定義 */
	const columns = [
		{
			title: t('Label_UserName'),
			key: 'userName',
			width: 150,
			dataIndex: 'userName',
			align: 'center' as 'center',
		},
		{
			title: t('Label_SabaId'),
			key: 'sabaId',
			width: 150,
			dataIndex: 'sabaId',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Currency'),
			key: 'currency',
			width: 100,
			dataIndex: 'currency',
			align: 'center' as 'center',
		},
		{
			title: t('Label_TaggingTime'),
			key: 'taggingTime',
			width: 180,
			dataIndex: 'taggingTime',
			align: 'center' as 'center',
			render: (taggingTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{dayjs(taggingTime).format(timeFormat)}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Creator'),
			key: 'creator',
			width: 100,
			dataIndex: 'creator',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Reason'),
			key: 'reason',
			width: 150,
			dataIndex: 'reason',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Remove'),
			key: 'remove',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetEventRestrictionListData) => {
				return (
					<Space size='middle'>
						<Typography.Link
							// 確認編輯權限
							disabled={!editPermission?.canUse}
							onClick={() => {
								const args: IDelEventRestrictionArgs = {
									UserName: record.userName,
								}
								handleDelete(args)
							}}
						>
							{t('Label_Delete')}
						</Typography.Link>
					</Space>
				)
			},
		},
	]

	const mergedColumns = columns.map(col => {
		return {
			...col,
			onCell: (record: IGetEventRestrictionListData) => ({
				record,
				dataIndex: col.dataIndex,
				title: col.title,
			}),
		}
	})

	return (
		<LayoutContent.Card>
			<Form component={false}>
				<Table
					components={{
						body: {
							cell: EditableTableCell,
						},
					}}
					loading={loading}
					columns={mergedColumns}
					dataSource={eventRestrictionList}
					pagination={false}
					scroll={{ y: 450 }}
					rowKey='custId'
				/>
			</Form>
		</LayoutContent.Card>
	)
}

export default ExternalDomainTable
