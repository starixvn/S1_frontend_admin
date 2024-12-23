import React from 'react'
import dayjs from 'dayjs'
import {
	Form,
	Select,
	Space,
	Table,
	TablePaginationConfig,
	Typography,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { IPaymentAgentData } from './type'
import { EditableCellRows } from '../../components'
import { LayoutContent } from '../../app/pages/layout'
import { IGetPaymentAdjustmentReportData } from '../paymentAdjustment/type'
import { multiEqual } from '../../common/utils'
import { AdjustmentTypeEnum } from '../paymentAdjustment/constants'
import { NEW_SITE_PREFIX_URL } from '../../app/config'
import paths from '../../app/constants/paths'
import { numberFormatter, timeFormat } from '../../common/utils/format'

interface IPaymentAgentManagementTableProps {
	paymentAgentList: IPaymentAgentData[]
}

const PaymentAgentManagementTable = ({
	paymentAgentList,
}: IPaymentAgentManagementTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: 120,
			align: 'center' as 'center',
			// render: (record: IGetPaymentAdjustmentReportData) => {
			// 	const { transId } = record
			// 	const editable = isEditing(transId)
			//
			// 	return editable ? (
			// 		<Space>
			// 			<Typography.Link
			// 				onClick={() => onSaved(record)}
			// 				style={{ marginRight: 8 }}
			// 			>
			// 				{t('Label_Save')}
			// 			</Typography.Link>
			// 			<Typography.Link onClick={() => setEditingKey(undefined)}>
			// 				{t('Label_Cancel')}
			// 			</Typography.Link>
			// 		</Space>
			// 	) : (
			// 		<Typography.Link
			// 			disabled={!editPermission?.canUse}
			// 			onClick={() => onEdit(record)}
			// 		>
			// 			{t('Label_Edit')}
			// 		</Typography.Link>
			// 	)
			// },
		},
		{
			title: t('Label_AgentName'),
			key: 'agentName',
			dataIndex: 'agentName',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Type'),
			key: 'transId',
			dataIndex: 'transId',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Sites'),
			key: 'siteIds',
			width: 100,
			dataIndex: 'siteIds',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Currency'),
			key: 'currencyIds',
			dataIndex: 'currencyIds',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_UserList'),
			key: 'walletType',
			dataIndex: 'walletType',
			width: 100,
			align: 'center' as 'center',
		},
	]

	return (
		<LayoutContent.Card>
			<Table dataSource={paymentAgentList} columns={columns} />
		</LayoutContent.Card>
	)
}

export default PaymentAgentManagementTable
