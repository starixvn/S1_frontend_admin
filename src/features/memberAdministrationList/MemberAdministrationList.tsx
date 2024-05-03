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
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { AffixButtons } from 'components/AffixButtons'
import { isArray, isEmpty, trim } from 'lodash'
import download from 'downloadjs'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import {
	useLazyGetMemberListQuery,
	useGetAllTagQuery,
	useGetVipLevelSettingsQuery,
	useExportMemberMutation,
	useGetRegisterMemberMutation,
} from './api'
import MemberAdministrationListFilter from './MemberAdministrationListFilter'
import MemberAdministrationListTable from './MemberAdministrationListTable'
import MemberAdministrationModal from './MemberAdministrationModal'
import { IdentityEnum, DateTypeEnum } from './constants'
import { IForm, IAddForm, IMemberResponse, IExportMemberArgs } from './type'

const MemberAdministrationList = ({
	pageTitle = '',
}: {
	pageTitle?: string
}) => {
	const { t } = useTranslation()
	const {
		actionPermissions: { exportExcelPermission, registerMemberPermission } = {},
	} = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const [queryParams, setQueryParams] = useQueryParams()
	const [form] = Form.useForm<IForm>()
	const [addForm] = Form.useForm<IAddForm>()
	const registerMemberModal = useModal()

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

	const [registerMember, { isLoading: isRegisterMemberLoading }] =
		useGetRegisterMemberMutation()

	const { data: { data: allTagEnums = [] } = {} } = useGetAllTagQuery()

	const { data: { data: vipLevelEnums = [] } = {} } =
		useGetVipLevelSettingsQuery({
			siteId,
		})

	const {
		data: { data: memberTypeEnums = [] } = {},
		isLoading: isMemberTypeEnumsLoading,
	} = useGetEnumTypeQuery({
		enumName: 'MemberTypeEnum',
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
			userName,
			tpUserName,
			excludeTag,
			userTypes,
			eWalletAccountNumber,
			cryptoAddress,
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
				userName: userName ? trim(userName) : '',
				tpUserName: tpUserName ? trim(tpUserName) : '',
				excludeTag: Boolean(excludeTag),
				userTypes,
				...values,
				exportTransferWallet: Boolean(exportTransferWallet),
				startDate,
				endDate,
				pageNumber: current,
				pageSize,
				eWalletAccountNumber,
				cryptoAddress,
			}).unwrap()

			setQueryParams({
				currencyIds,
				tags: tags.length !== 0 ? tags : null,
				statuses,
				vipLevel,
				userName: userName ? trim(userName) : '',
				tpUserName: tpUserName ? trim(tpUserName) : '',
				userTypes,
				...values,
				exportTransferWallet: Boolean(exportTransferWallet),
				startDate,
				endDate,
				pageNumber: current,
				pageSize,
				timeZone: currentTimeZoneUtcOffset,
				excludeTag,
				eWalletAccountNumber,
				cryptoAddress,
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
		if (!siteId) return

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
			userTypes = [],
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
			excludeTag,
			eWalletAccountNumber,
			cryptoAddress,
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
			userTypes: isArray(userTypes)
				? userTypes.map(value => Number(value))
				: [],
			dateType: Number(dateType) || DateTypeEnum.All,
			startDate,
			endDate,
			exportTransferWallet: Boolean(exportTransferWallet),
			excludeTag: Boolean(excludeTag),
			eWalletAccountNumber,
			cryptoAddress,
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

	const handleRegisterMember = async () => {
		if (!siteId) return
		const {
			userName,
			userpwd,
			memberType,
			email,
			currencyId,
			areaCode,
			phoneNo,
			affCode,
			realName,
		} = await addForm.validateFields()

		try {
			const response = await registerMember({
				siteId,
				userName: trim(userName),
				userpwd: trim(userpwd),
				memberType,
				email,
				currencyId,
				areaCode,
				phoneNo: String(phoneNo),
				affCode,
				realName,
			}).unwrap()
			message.success(response?.message || t('System.Label_Success'))
			registerMemberModal.onCancel()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading = isGetMemberListFetching || isMemberTypeEnumsLoading

	useEffect(() => {
		if (!loading) {
			form.setFieldsValue({
				userTypes: memberTypeEnums.map(({ value }) => value),
			})
		}
	}, [isMemberTypeEnumsLoading])

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
				userTypes = [],
				exportTransferWallet,
				eWalletAccountNumber,
				cryptoAddress,
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
				userTypes: isArray(userTypes)
					? userTypes.map(value => Number(value))
					: [],
				userName,
				tpUserName: sabaId,
				affiliateName,
				exportTransferWallet: exportTransferWallet ? 1 : 0,
				eWalletAccountNumber,
				cryptoAddress,
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
				memberTypeEnums={memberTypeEnums}
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

			<MemberAdministrationModal
				loading={false}
				form={addForm}
				memberTypeEnums={memberTypeEnums}
				currencyListBySite={currencyListBySite}
				visible={registerMemberModal.visible}
				onCancel={registerMemberModal.onCancel}
				onFinish={handleRegisterMember}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.Create
					loading={isRegisterMemberLoading}
					onClick={registerMemberModal.onOpen}
					disabled={!registerMemberPermission?.canUse}
				/>
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExportMember}
					loading={isExportMemberLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default MemberAdministrationList
