import { useTranslation } from 'react-i18next'
import { Space, TablePaginationConfig, Typography, Modal, Input } from 'antd'
import dayjs from 'dayjs'
import { Table } from 'components'
import { LayoutContent } from 'app/pages/layout'
import { PaginationInterface } from 'common/hooks'
import { timeFormat } from 'common/utils/format'
import { IQuestionnaireReportData } from 'features/surveyQuestionnaire/type'
import { PermissionInterface } from 'type'

interface ISurveyQuestionnaireTableProps {
	questionnaire: IQuestionnaireReportData[]
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	onTableChange: (newPagination: TablePaginationConfig) => void
	onEdit: (record: IQuestionnaireReportData) => void
	editPermission?: PermissionInterface
}

const SurveyQuestionnaireTable = ({
	questionnaire,
	loading,
	pagination,
	timeZoneUtcOffset,
	onTableChange,
	onEdit,
	editPermission,
}: ISurveyQuestionnaireTableProps) => {
	const { t } = useTranslation()

	const handleContentModal = (content: string) => {
		Modal.info({
			title: t('Label_Content'),
			closable: true,
			content: <Input.TextArea rows={18} value={content} disabled />,
			width: '540px',
		})
	}

	const columns = [
		{
			title: t('Label_Id'),
			dataIndex: 'id',
			key: 'id',
			width: 40,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Currency'),
			dataIndex: 'currency',
			key: 'currency',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_MemberId'),
			key: 'userName',
			dataIndex: 'userName',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Contact'),
			dataIndex: 'contactInfo',
			key: 'contactInfo',
			width: 150,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Content'),
			dataIndex: 'content',
			key: 'content',
			align: 'center' as 'center',
			render: (content: string) =>
				content.length > 20 ? (
					<Typography.Text>
						{content.substring(0, 20)}...
						<Typography.Link onClick={() => handleContentModal(content)}>
							more
						</Typography.Link>
					</Typography.Text>
				) : (
					<Typography.Text>{content || '-'}</Typography.Text>
				),
		},
		{
			title: t('Label_CreateTime'),
			dataIndex: 'createTime',
			key: 'createTime',
			width: 150,
			align: 'center' as 'center',
			render: (createTime: string | null) => (
				<Typography.Text style={{ whiteSpace: 'nowrap' }}>
					{createTime &&
						dayjs(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Action'),
			key: 'action',
			width: 80,
			align: 'center' as 'center',
			render: (record: IQuestionnaireReportData) => {
				return (
					<Space size='middle'>
						<Typography.Link onClick={() => onEdit(record)}>
							{editPermission?.canUse ? t('Label_Edit') : t('Label_Detail')}
						</Typography.Link>
					</Space>
				)
			},
		},
		{
			title: t('Label_Feedback'),
			dataIndex: 'feedback',
			width: 150,
			key: 'feedback',
			align: 'center' as 'center',
		},
		{
			title: t('Label_LastUpdateUser'),
			key: 'lastUpdateUser',
			dataIndex: 'lastUpdateUser',
			width: 100,
			align: 'center' as 'center',
			render: (lastUpdateUser: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{lastUpdateUser ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_LastUpdateTime'),
			key: 'lastUpdateTime',
			dataIndex: 'lastUpdateTime',
			width: 150,
			align: 'center' as 'center',
			render: (lastUpdateTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap' }}>
					{lastUpdateTime
						? dayjs(lastUpdateTime)
								.utcOffset(timeZoneUtcOffset)
								.format(timeFormat)
						: ''}
				</Typography.Text>
			),
		},
	]
	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={questionnaire}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export default SurveyQuestionnaireTable
