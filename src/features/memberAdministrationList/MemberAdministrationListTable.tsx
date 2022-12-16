import React from 'react'
import moment from 'moment'
import paths from 'app/constants/paths'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { useTranslation } from 'react-i18next'
import { find, map } from 'lodash'
import { numberFormatter, timeFormat } from 'common/utils/format'
import { Table, TablePaginationConfig, Tag, Typography } from 'antd'
import { PaginationInterface } from 'common/hooks'
import { LayoutContent } from 'app/pages/layout'
import { IMemberData, ITagData } from './type'
import {
	IDENTITY_ENUM_OPTIONS,
	STATUS_ENUM_OPTIONS,
	USER_TYPE_ENUM_OPTIONS,
} from './constants'

interface IMemberAdministrationListTableProps {
	loading: boolean
	allTagEnums: ITagData[]
	memberList: IMemberData[]
	timeZoneUtcOffset: number
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
}

const MemberAdministrationListTable = ({
	loading,
	allTagEnums,
	memberList,
	timeZoneUtcOffset,
	pagination,
	onTableChange,
}: IMemberAdministrationListTableProps) => {
	const { t } = useTranslation()

	const columns = [
		{
			title: t('Label_MemberId'),
			key: 'userName',
			width: 120,
			align: 'center' as 'center',
			render: ({ custId, userName }: IMemberData) => (
				<Typography.Link
					href={`/${NEW_SITE_PREFIX_URL}/${paths.memberProfile.root}/dashboard/${custId}`}
					target='_blank'
				>
					{userName}
				</Typography.Link>
			),
		},
		{
			title: t('Label_SabaId'),
			key: 'sabaId',
			dataIndex: 'sabaId',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_MemberType'),
			key: 'userType',
			dataIndex: 'userType',
			width: 120,
			align: 'center' as 'center',
			render: (userType: number) => {
				const { displayKey } =
					find(USER_TYPE_ENUM_OPTIONS, { value: userType }) ?? {}
				return displayKey ? t(displayKey) : userType
			},
		},
		{
			title: t('Label_Identity'),
			key: 'identity',
			dataIndex: 'identity',
			width: 120,
			align: 'center' as 'center',
			render: (identity: number) => {
				const { displayKey } =
					find(IDENTITY_ENUM_OPTIONS, { value: identity }) ?? {}
				return displayKey ? t(displayKey) : identity
			},
		},
		{
			title: t('Label_SuperiorAffiliateCode'),
			key: 'affiliateCode',
			dataIndex: 'affiliateCode',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_AffiliateName'),
			key: 'affiliateName',
			dataIndex: 'affiliateName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Tag'),
			key: 'tagList',
			dataIndex: 'tagList',
			width: 120,
			align: 'center' as 'center',
			render: (tagList: number[]) =>
				map(tagList, tagId => (
					<Tag color='blue'>
						{find(allTagEnums, { id: tagId })?.tagName ?? tagId}
					</Tag>
				)),
		},
		{
			title: t('Label_DeviceScore'),
			key: 'deviceScore',
			dataIndex: 'deviceScore',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_DeviceId'),
			key: 'deviceId',
			dataIndex: 'deviceId',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_VipLevel'),
			key: 'levelName',
			dataIndex: 'levelName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_PointLevel'),
			key: 'pointLevel',
			dataIndex: 'pointLevel',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Currency'),
			key: 'isoCode',
			dataIndex: 'isoCode',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Agent'),
			key: 'agent',
			dataIndex: 'agent',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_SeamlessWallet'),
			key: 'balance',
			dataIndex: 'balance',
			width: 120,
			align: 'center' as 'center',
			render: (balance: number) => numberFormatter.format(balance),
		},
		{
			title: t('Label_BonusWallet'),
			key: 'bonus',
			dataIndex: 'bonus',
			width: 120,
			align: 'center' as 'center',
			render: (bonus: number) => numberFormatter.format(bonus),
		},
		{
			title: t('Label_LastActivityIP'),
			key: 'ip',
			dataIndex: 'ip',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Status'),
			key: 'status',
			dataIndex: 'status',
			width: 120,
			align: 'center' as 'center',
			render: (status: number) => {
				const { displayKey } =
					find(STATUS_ENUM_OPTIONS, {
						value: status,
					}) ?? {}

				return displayKey ? <Tag color='blue'>{t(displayKey)}</Tag> : null
			},
		},
		{
			title: t('Label_RegistrationTime'),
			key: 'regTime',
			dataIndex: 'regTime',
			width: '140px',
			align: 'center' as 'center',
			render: (regTime: string) =>
				regTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{moment(regTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_LastActiveTime'),
			key: 'lastActiveTime',
			dataIndex: 'lastActiveTime',
			width: '140px',
			align: 'center' as 'center',
			render: (lastActiveTime: string) =>
				lastActiveTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{moment(lastActiveTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_LastTagUpdateTime'),
			key: 'lastTagUpdateTime',
			dataIndex: 'lastTagUpdateTime',
			width: '240',
			align: 'center' as 'center',
			render: (lastTagUpdateTime: string) =>
				lastTagUpdateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{moment(lastTagUpdateTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_LastStatusUpdateTime'),
			key: 'lastStatusUpdateTime',
			dataIndex: 'lastStatusUpdateTime',
			width: '20%',
			align: 'center' as 'center',
			render: (lastStatusUpdateTime: string) =>
				lastStatusUpdateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap' }}>
						{moment(lastStatusUpdateTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_IsTest'),
			key: 'isTest',
			dataIndex: 'isTest',
			width: 120,
			align: 'center' as 'center',
			render: (isTest: boolean) => String(isTest),
		},
	]
	return (
		<LayoutContent.Card>
			<Table
				size='small'
				loading={loading}
				bordered
				dataSource={memberList}
				columns={columns}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export default MemberAdministrationListTable
