import React from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { FormInstance, Typography, Form, Input } from 'antd'
import { Table } from 'components'
import { IDepositCommentData } from 'features/depositOperator/type'
import { timeFormat } from 'common/utils/format'

const { TextArea } = Input

interface IDepositRequestCommentsProps {
	form: FormInstance
	loading: boolean
	depositComments: IDepositCommentData[]
	timeZoneUtcOffset: number
}

const DepositRequestComments = ({
	form,
	loading,
	depositComments,
	timeZoneUtcOffset,
}: IDepositRequestCommentsProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: '#',
			key: 'index',
			width: 60,
			align: 'center' as 'center',
			render: (item: any, record: IDepositCommentData, index: number) =>
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
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
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
			key: 'actionName',
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
			<Table
				loading={loading}
				dataSource={depositComments}
				pagination={false}
				columns={columns}
				style={{ marginTop: '20px' }}
			/>
			<br />
			<Form form={form}>
				<Form.Item name='comment' style={{ marginTop: '10px' }}>
					<TextArea allowClear placeholder={`${t('Label_Comment')}...`} />
				</Form.Item>
			</Form>
		</>
	)
}

export default DepositRequestComments
