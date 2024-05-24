import { IWithdrawalCommentData } from 'features/withdrawalOperator/type'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { Form, Input, Typography } from 'antd'
import dayjs from 'dayjs'
import { timeFormat } from 'common/utils/format'
import { isEmpty } from 'lodash'

interface IWithdrawalCommentTableProps {
	withdrawalCommentData: IWithdrawalCommentData[]
	timeZoneUtcOffset: number
}

const { TextArea } = Input
const WithdrawalRequestComment = ({
	withdrawalCommentData,
	timeZoneUtcOffset,
}: IWithdrawalCommentTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: '#',
			key: 'index',
			width: 60,
			align: 'center' as 'center',
			render: (_item: any, _record: IWithdrawalCommentData, index: number) =>
				index + 1,
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 100,
			align: 'center' as 'center',
			render: (createTime: string) =>
				createTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{dayjs(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_Comment'),
			key: 'comment',
			dataIndex: 'comment',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Action'),
			key: 'action',
			dataIndex: 'actionName',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 80,
			align: 'center' as 'center',
		},
	]
	return (
		<>
			{!isEmpty(withdrawalCommentData) && (
				<Table
					dataSource={withdrawalCommentData ?? []}
					pagination={false}
					columns={columns}
					style={{ marginTop: '20px' }}
				/>
			)}
			<br />
			<Form.Item name='comment'>
				<TextArea
					allowClear
					placeholder={`${t('Label_Comment')}...`}
					rows={3}
				/>
			</Form.Item>
		</>
	)
}

export { WithdrawalRequestComment }
