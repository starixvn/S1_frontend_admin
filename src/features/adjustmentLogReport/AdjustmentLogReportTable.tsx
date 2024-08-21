import { isArray, isBoolean, isNumber, isString } from 'lodash'
import dayjs from 'dayjs'
import { Table, TablePaginationConfig, Tag } from 'antd'
import styled from 'styled-components'
import { maskEmail, maskPhoneNumber } from 'common/utils/maskUtils'
import { LayoutContent } from 'app/pages/layout'
import { PaginationInterface, useAuth } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { ILogReportData } from './type'

const StaticTitle = styled.span`
	color: rgba(0, 0, 0, 0.45);
	font-size: 14px;
`

interface IAdjustmentLogReportTableProp {
	loading: boolean
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	adjustmentLogReportList: ILogReportData[]
}

const AdjustmentLogReportTable = ({
	loading,
	timeZoneUtcOffset,
	pagination,
	onTableChange,
	adjustmentLogReportList,
}: IAdjustmentLogReportTableProp) => {
	// ====== hook ======
	const { t } = useTranslation()
	const { actionPermissions: { readDetailPermission } = {} } = useAuth()

	// ====== 函數 ======

	const renderDetailItem = (item: { [key: string]: any }, key: any): any => {
		/** 沒有閱讀權限，隱藏 'Email' 欄位 */
		const needMaskEmail = !readDetailPermission?.canUse && key === 'Email'

		/** 沒有閱讀權限，隱藏 'PhoneNo' 欄位 */
		const needMaskPhoneNo = !readDetailPermission?.canUse && key === 'PhoneNo'

		if (isString(item[key]) || isNumber(item[key])) {
			if (needMaskEmail) return maskEmail(item[key] as string)
			if (needMaskPhoneNo) return maskPhoneNumber(item[key] as string)
			return item[key]
		}

		if (isBoolean(item[key])) {
			return item[key].toString()
		}

		if (isArray(item[key]))
			return (item[key] as any[]).map(detailItem =>
				Object.keys(detailItem).map(detailItemKey => (
					<div key={detailItemKey}>
						{detailItemKey}: {renderDetailItem(detailItem, detailItemKey)}
					</div>
				))
			)
		return 'null'
	}

	const renderDetailContent = (value: any): any => {
		if (!value) return 'N/A'

		const result = isArray(value) ? [...value] : [value]

		return result.map(item =>
			Object.keys(item).map((key: string) => (
				<div key={key} style={{ width: 180 }}>
					<StaticTitle>{key}:</StaticTitle> {renderDetailItem(item, key)}
				</div>
			))
		)
	}

	// ====== columns ======

	const columns = [
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: 120,
			align: 'center' as 'center',
			render: (isoCode: string | null) => isoCode || 'N/A',
		},
		{
			title: t('Label_Function'),
			key: 'menuFunction',
			dataIndex: 'menuFunction',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_ActionType'),
			key: 'actionTypeName',
			dataIndex: 'actionTypeName',
			width: 120,
			align: 'center' as 'center',
			render: (actionTypeName: string) => (
				<Tag color='blue' key={actionTypeName}>
					{actionTypeName}
				</Tag>
			),
		},
		{
			title: t('Label_Before'),
			key: 'beforeDetailInfoObject',
			dataIndex: 'beforeDetailInfoObject',
			width: 120,
			render: (
				beforeDetailInfoObject:
					| null
					| { [key: string]: string }
					| { [key: string]: string }[]
			) => renderDetailContent(beforeDetailInfoObject),
		},
		{
			title: t('Label_After'),
			key: 'afterDetailInfoObject',
			dataIndex: 'afterDetailInfoObject',
			width: 120,
			render: (
				afterDetailInfoObject:
					| null
					| { [key: string]: string }
					| { [key: string]: string }[]
			) => renderDetailContent(afterDetailInfoObject),
		},
		{
			title: t('Label_TransId'),
			key: 'refTransId',
			dataIndex: 'refTransId',
			width: 120,
			align: 'center' as 'center',
			render: (refTransId: any) => refTransId || 'N/A',
		},
		{
			title: t('Label_CreateTime'),
			key: 'createTime',
			dataIndex: 'createTime',
			width: 140,
			align: 'center' as 'center',
			render: (createTime: string) =>
				dayjs(createTime)
					.utcOffset(timeZoneUtcOffset)
					.format('YYYY-MM-DD  HH:mm:ss'),
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 120,
			align: 'center' as 'center',
			render: (operator: string) => (
				<Tag color='blue' key={operator}>
					{operator}
				</Tag>
			),
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				bordered
				rowKey={record => record.id}
				size='small'
				scroll={{ x: 240 }}
				loading={loading}
				columns={columns}
				dataSource={adjustmentLogReportList}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export { AdjustmentLogReportTable }
