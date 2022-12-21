import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, message, TablePaginationConfig } from 'antd'
import { isEmpty } from 'lodash'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { useAppSelector } from 'app/store'
import { StatusEnum } from 'features/bettingMonitorSetting/constants'
import ExternalDomainFilter from 'features/externalDomain/ExternalDomainFilter'
import ExternalDomainTable from 'features/externalDomain/ExternalDomainTable'
import AddExternalDomainModal from 'features/externalDomain/AddExternalDomainModal'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import {
	PAGINATION,
	useAuth,
	useModal,
	usePagination,
	useQueryParams,
} from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	useCreateDomainMutation,
	useDeleteDomainMutation,
	useLazyGetDomainListQuery,
	useUpdateDomainMutation,
} from 'features/externalDomain/api'
import {
	IAddForm,
	IDomainForm,
	IFilterForm,
	IGetDomainListData,
	IGetDomainListResponse,
} from 'features/externalDomain/type'

const ExternalDomain = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const [queryParams, setQueryParams] = useQueryParams()
	const { timeZoneUtcOffset } = useTimeZone()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [editingKey, setEditingKey] = useState<number | undefined>(undefined)
	const addExternalDomainModal = useModal()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [domainForm] = Form.useForm<IDomainForm>()
	const [filterForm] = Form.useForm<IFilterForm>()
	const [addForm] = Form.useForm<IAddForm>()

	const [
		getDomainList,
		{
			data: {
				data: domainList = [],
				rowCount: domainListTotal = 0,
			} = {} as IGetDomainListResponse,
			isFetching: isGetDomainListLoading,
		},
	] = useLazyGetDomainListQuery()

	const [createDomain, { isLoading: isCreateDomainLoading }] =
		useCreateDomainMutation()

	const [updateDomain, { isLoading: isUpdateDomainLoading }] =
		useUpdateDomainMutation()

	const [deleteDomain, { isLoading: isDeleteDomainLoading }] =
		useDeleteDomainMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: domainListTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!siteId) return

		const { currencyIds } = filterForm.getFieldsValue()

		try {
			const args = {
				siteId,
				pageNumber: current,
				pageSize,
				currencyIds,
			}
			await getDomainList(args).unwrap()
			setPagination(prev => ({ ...prev, current, pageSize }))
			setQueryParams({ ...args })
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const { current, pageSize } = newPagination

		await handleSearch({
			current,
			pageSize,
		})
	}

	const handleSaved = async ({ dId: id }: IGetDomainListData) => {
		const { domain, status, sort } = await domainForm.validateFields()
		try {
			await updateDomain({
				id,
				domain,
				status: status ? StatusEnum.Active : StatusEnum.InActive,
				sort,
			}).unwrap()
			setEditingKey(undefined)
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDelete = async ({ dId: id }: IGetDomainListData) => {
		try {
			await deleteDomain({ id }).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleCreateExternalDomain = async () => {
		if (!siteId) return

		const { currencyId, domain, status, sort } = await addForm.validateFields()

		const args = {
			siteId,
			currencyId,
			domain,
			status,
			sort,
		}
		try {
			await createDomain(args).unwrap()
			addExternalDomainModal.onCancel()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = async () => {
			const { currencyIds, pageNumber, pageSize } = queryParams
			filterForm.setFieldsValue({
				currencyIds: currencyIds.map((currencyId: string) =>
					Number(currencyId)
				),
			})
			handleSearch({
				current: Number(pageNumber),
				pageSize: Number(pageSize),
			})
		}
		if (!isEmpty(queryParams)) {
			init()
		}
	}, [])

	const loading =
		isGetDomainListLoading ||
		isCreateDomainLoading ||
		isUpdateDomainLoading ||
		isDeleteDomainLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<ExternalDomainFilter
				form={filterForm}
				loading={loading}
				currencyListBySite={currencyListBySite}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<ExternalDomainTable
					form={domainForm}
					loading={loading}
					domainList={domainList}
					pagination={pagination}
					editPermission={editPermission}
					timeZoneUtcOffset={timeZoneUtcOffset}
					editingKey={editingKey}
					setEditingKey={setEditingKey}
					onTableChange={handleTableChange}
					onSaved={handleSaved}
					onDelete={handleDelete}
				/>
			)}
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					loading={loading}
					onClick={addExternalDomainModal.onOpen}
				/>
			</AffixButtons>
			<AddExternalDomainModal
				form={addForm}
				loading={loading}
				currencyListBySite={currencyListBySite}
				visible={addExternalDomainModal.visible}
				onCancel={addExternalDomainModal.onCancel}
				onFinish={handleCreateExternalDomain}
			/>
		</LayoutContent.Main>
	)
}

export default ExternalDomain
