import moment from 'moment'
import { Table, TablePaginationConfig, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { PaginationInterface } from 'common/hooks'
import { timeFormat } from 'common/utils/format'
import { useTranslation } from 'react-i18next'
import { IOtpReportData, VerifiedEnum } from './type'

interface IOtpVerificationReportTableProps {
	otpReport: IOtpReportData[]
	loading: boolean
	pagination: PaginationInterface
	timeZoneUtcOffset: number
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const OtpVerificationReportTable = ({
	otpReport,
	loading,
	pagination,
	timeZoneUtcOffset,
	onTableChange,
}: IOtpVerificationReportTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_Provider'),
			dataIndex: 'otpProvider',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Currency'),
			dataIndex: 'isoCode',
			align: 'center' as 'center',
		},
		{
			title: t('Label_MemberId'),
			dataIndex: 'userName',
			align: 'center' as 'center',
		},
		{
			title: t('Label_PhoneNumber'),
			dataIndex: 'phoneNo',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Content'),
			dataIndex: 'content',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Verified'),
			dataIndex: 'verified',
			align: 'center' as 'center',
			render: (verified: VerifiedEnum) =>
				verified ? t('System.Label_Success') : t('System.Label_Failed'),
		},
		{
			title: t('Label_CreateTime'),
			dataIndex: 'createTime',
			align: 'center' as 'center',
			render: (createTime: string | null) => (
				<Typography.Text style={{ whiteSpace: 'nowrap' }}>
					{createTime &&
						moment(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
				</Typography.Text>
			),
		},
		{
			title: t('Label_UpdateTime'),
			dataIndex: 'updateTime',
			align: 'center' as 'center',
			render: (updateTime: string | null) => (
				<Typography.Text style={{ whiteSpace: 'nowrap' }}>
					{updateTime &&
						moment(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
				</Typography.Text>
			),
		},
		{
			title: t('Label_CompletedTime'),
			dataIndex: 'verifiedTime',
			align: 'center' as 'center',
			render: (verifiedTime: string | null) => (
				<Typography.Text style={{ whiteSpace: 'nowrap' }}>
					{verifiedTime &&
						moment(verifiedTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
				</Typography.Text>
			),
		},
	]
	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				rowKey={(record: IOtpReportData) => record.request_id}
				columns={columns}
				dataSource={otpReport}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export default OtpVerificationReportTable
