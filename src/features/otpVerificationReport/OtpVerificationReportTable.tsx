import moment from 'moment'
import { TablePaginationConfig, Typography } from 'antd'
import { Table } from 'components'
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
			key: 'otpProvider',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Currency'),
			dataIndex: 'isoCode',
			key: 'isoCode',
			align: 'center' as 'center',
		},
		{
			title: t('Label_MemberId'),
			dataIndex: 'userName',
			key: 'userName',
			align: 'center' as 'center',
		},
		{
			title: t('Label_PhoneNumber'),
			dataIndex: 'phoneNo',
			key: 'phoneNo',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Content'),
			dataIndex: 'content',
			key: 'content',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Verified'),
			dataIndex: 'verified',
			key: 'verified',
			align: 'center' as 'center',
			render: (verified: VerifiedEnum) =>
				verified ? t('System.Label_Success') : t('System.Label_Failed'),
		},
		{
			title: t('Label_CreateTime'),
			dataIndex: 'createTime',
			key: 'createTime',
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
			key: 'updateTime',
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
			key: 'verifiedTime',
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
				columns={columns}
				dataSource={otpReport}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export default OtpVerificationReportTable
