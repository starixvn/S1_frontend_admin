import { useTranslation } from 'react-i18next'
import { Space, TablePaginationConfig, Typography } from 'antd'
import dayjs from 'dayjs'
import { Table } from 'components'
import { LayoutContent } from 'app/pages/layout'
import { PaginationInterface } from 'common/hooks'
import { timeFormat } from 'common/utils/format'
import { IQuestionnaireReportData } from 'features/surveyQuestionnaire/type'

interface ISurveyQuestionnaireTableProps {
	questionnaire: IQuestionnaireReportData[]
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	onTableChange: (newPagination: TablePaginationConfig) => void
	onEdit: (record: IQuestionnaireReportData) => void
}

const SurveyQuestionnaireTable = ({
	questionnaire,
	loading,
	pagination,
	timeZoneUtcOffset,
	onTableChange,
	onEdit,
}: ISurveyQuestionnaireTableProps) => {
	const { t } = useTranslation()

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
			width: 90,
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
			align: 'center' as 'center',
		},
		{
			title: t('Label_Content'),
			dataIndex: 'content',
			key: 'content',
			align: 'center' as 'center',
		},
		{
			title: t('Label_CreateTime'),
			dataIndex: 'createTime',
			key: 'createTime',
			width: 180,
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
							{t('Label_Edit')}
						</Typography.Link>
					</Space>
				)
			},
		},
		{
			title: t('Label_Feedback'),
			dataIndex: 'feedback',
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
			width: 180,
			align: 'center' as 'center',
			render: (lastUpdateTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
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
