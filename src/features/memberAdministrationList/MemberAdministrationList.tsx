import React, { useEffect } from 'react'
import { dateRangeToUtcFormatter } from 'common/utils'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { Form, message, TablePaginationConfig } from 'antd'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import {
	PAGINATION,
	useAuth,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { AffixButtons } from 'components/AffixButtons'
import { isArray, isEmpty } from 'lodash'
import download from 'downloadjs'
import {
	useLazyGetMemberListQuery,
	useGetAllTagQuery,
	useGetVipLevelSettingsQuery,
	useExportMemberMutation,
} from './api'
import MemberAdministrationListFilter from './MemberAdministrationListFilter'
import MemberAdministrationListTable from './MemberAdministrationListTable'
import { IdentityEnum, DateTypeEnum, UserTypeEnum } from './constants'
import { IForm, IMemberResponse, IExportMemberArgs } from './type'

const MemberAdministrationList = ({
	pageTitle = '',
}: {
	pageTitle?: string
}) => {
	const { t } = useTranslation()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const [form] = Form.useForm<IForm>()

	const [
		getMemberList,
		{
			data: {
				data: memberList = [],
				rowCount: memberListPaginationTotal = 0,
			} = {} as IMemberResponse,
			isFetching: isGetMemberListFetching,
		},
	] = useLazyGetMemberListQuery()

	const [exportMember, { isLoading: isExportMemberLoading }] =
		useExportMemberMutation()

	const { data: { data: allTagEnums = [] } = {} } = useGetAllTagQuery()

	const { data: { data: vipLevelEnums = [] } = {} } =
		useGetVipLevelSettingsQuery({
			siteId,
		})

	const [pagination, setPagination] = usePagination({
		paginationTotal: memberListPaginationTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => {
		if (!siteId) return

		const {
			dateRange,
			exportTransferWallet,
			tags,
			statuses,
			vipLevel,
			currencyIds,
			...values
		} = await form.validateFields()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)

		try {
			await getMemberList({
				siteId,
				currencyId: currencyIds,
				tags: tags.length !== 0 ? tags : null,
				status: statuses,
				vipLevel,
				...values,
				exportTransferWallet: Boolean(exportTransferWallet),
				startDate,
				endDate,
				pageNumber: current,
				pageSize,
			}).unwrap()

			setQueryParams({
				currencyIds,
				tags: tags.length !== 0 ? tags : null,
				statuses,
				vipLevel,
				...values,
				exportTransferWallet: Boolean(exportTransferWallet),
				startDate,
				endDate,
				pageNumber: current,
				pageSize,
				timeZone: currentTimeZoneUtcOffset,
			})

			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: TablePaginationConfig) => {
		handleSearch({
			current,
			pageSize,
			currentTimeZoneUtcOffset: timeZoneUtcOffset,
		})
	}

	const handleExportMember = async () => {
		if (!siteId || isEmpty(queryParams)) return

		const {
			currencyIds = [],
			statuses = [],
			identity,
			userName = '',
			sabaId = '',
			affiliateName = '',
			startDate,
			endDate,
			tags,
			vipLevel,
			accountName,
			dateType,
			userType,
			exportTransferWallet,
			loginIp,
			email,
			phoneNo,
			bankAccountNumber,
			affiliateCode,
			transId,
			shieldLevel,
			iovationLevel,
			deviceId,
		} = queryParams

		const args: IExportMemberArgs = {
			siteId,
			currencyId: isArray(currencyIds)
				? currencyIds.map(currencyId => Number(currencyId))
				: [],
			status: isArray(statuses) ? statuses.map(status => Number(status)) : [],
			identity: Number(identity) || IdentityEnum.All,
			userName,
			tags: isArray(tags) ? tags.map(tag => Number(tag)) : [],
			vipLevel: isArray(vipLevel) ? vipLevel.map(level => Number(level)) : [],
			accountName,
			tpUserName: sabaId,
			affiliateName,
			loginIp,
			email,
			phoneNo,
			bankAccountNumber,
			affiliateCode,
			transId,
			shieldLevel,
			iovationLevel,
			deviceId,
			userType: Number(userType) || UserTypeEnum.All,
			dateType: Number(dateType) || DateTypeEnum.All,
			startDate,
			endDate,
			exportTransferWallet: Boolean(exportTransferWallet),
		}

		try {
			const blob = await exportMember(args).unwrap()
			download(blob, `MemberProfile_${moment().format('YYYYMMDDHHmmss')}.xlsx`)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = () => {
			if (isEmpty(queryParams)) return

			const {
				currencyIds = [],
				statuses = [],
				identity,
				userName = '',
				sabaId = '',
				affiliateName = '',
				startDate,
				endDate,
				pageNumber,
				pageSize,
				timeZone,
				tags,
				vipLevel,
				dateType,
				userType,
				exportTransferWallet,
				...values
			} = queryParams

			if (timeZone) {
				onTimeZoneChange(Number(timeZone))
			}

			form.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				currencyIds: isArray(currencyIds)
					? currencyIds.map(currencyId => Number(currencyId))
					: [],
				statuses: isArray(statuses)
					? statuses.map(status => Number(status))
					: [],
				tags: isArray(tags) ? tags.map(tag => Number(tag)) : [],
				vipLevel: isArray(vipLevel) ? vipLevel.map(level => Number(level)) : [],
				identity: Number(identity) || IdentityEnum.All,
				dateType: Number(dateType) || DateTypeEnum.All,
				userType: Number(userType) || UserTypeEnum.All,
				userName,
				tpUserName: sabaId,
				affiliateName,
				exportTransferWallet: exportTransferWallet ? 1 : 0,
				...values,
			})

			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		}

		init()
	}, [])

	const loading = isGetMemberListFetching

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle} />
			<MemberAdministrationListFilter
				loading={loading}
				form={form}
				timeZoneUtcOffset={timeZoneUtcOffset}
				currencyListBySite={currencyListBySite}
				allTagEnums={allTagEnums}
				vipLevelEnums={vipLevelEnums}
				onTimeZoneChange={onTimeZoneChange}
				onSearch={handleSearch}
			/>
			<MemberAdministrationListTable
				loading={loading}
				allTagEnums={allTagEnums}
				memberList={memberList}
				timeZoneUtcOffset={timeZoneUtcOffset}
				pagination={pagination}
				onTableChange={handleTableChange}
			/>
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse}
					onClick={handleExportMember}
					loading={isExportMemberLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default MemberAdministrationList
