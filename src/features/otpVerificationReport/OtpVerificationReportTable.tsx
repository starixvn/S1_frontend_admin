import React from 'react'
import dayjs from 'dayjs'
import { TablePaginationConfig, Typography } from 'antd'
import { find } from 'lodash'
import { Table } from 'components'
import { LayoutContent } from 'app/pages/layout'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { maskPhoneNumber } from 'common/utils/maskUtils'
import paths from 'app/constants/paths'
import { PaginationInterface, useAuth } from 'common/hooks'
import { timeFormat } from 'common/utils/format'
import { useTranslation } from 'react-i18next'
import { OTP_STATUS_OPTIONS } from './constants'
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
	// ====== hook ======

	const { t } = useTranslation()
	const { actionPermissions: { readDetailPermission } = {} } = useAuth()

	// ====== 常數 ======

	/** 沒有閱讀權限，需要隱藏 'PhoneNo' 欄位 */
	const needMaskPhoneNumber = !readDetailPermission?.canUse

	// ====== columns ======

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
			key: 'userName',
			align: 'center' as 'center',
			render: ({ custId, userName }: IOtpReportData) => (
				<Typography.Link
					href={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${custId}`}
					target='_blank'
				>
					{userName}
				</Typography.Link>
			),
		},
		{
			title: t('Label_PhoneNumber'),
			dataIndex: 'phoneNo',
			key: 'phoneNo',
			align: 'center' as 'center',
			render: (phoneNo: string) => {
				return needMaskPhoneNumber ? maskPhoneNumber(phoneNo) : phoneNo
			},
		},
		{
			title: t('Label_Content'),
			dataIndex: 'content',
			key: 'content',
			align: 'center' as 'center',
		},
		{
			title: t('Label_OTPStatus'),
			dataIndex: 'otpStatus',
			key: 'otpStatus',
			align: 'center' as 'center',
			render: (otpStatus: number) => {
				const { name } = find(OTP_STATUS_OPTIONS, { value: otpStatus }) ?? {}
				return name ?? null
			},
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
						dayjs(createTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
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
						dayjs(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
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
						dayjs(verifiedTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
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
