import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { AffixButtons } from 'components/AffixButtons'
import { ScratchCardListFilter } from 'features/bonusManagement/scratchCardList/ScratchCardListFilter'
import { Form, message, TablePaginationConfig } from 'antd'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import {
	useCreateScratchCardMutation,
	useExportScratchCardListMutation,
	useLazyGetScratchCardListQuery,
} from 'features/bonusManagement/api'
import { IGetScratchCardListResponse } from 'features/bonusManagement/type'
import { PAGINATION, useAuth, useModal, usePagination } from 'common/hooks'
import download from 'downloadjs'
import dayjs from 'dayjs'
import { ScratchCardListTable } from 'features/bonusManagement/scratchCardList/ScratchCardListTable'
import { CreateScratchCardModal } from 'features/bonusManagement/scratchCardList/CreateScratchCardModal'

const ScratchCardList = () => {
	const { t } = useTranslation()
	const { actionPermissions: { editPermission, exportExcelPermission } = {} } =
		useAuth()

	const [filterForm] = Form.useForm<{
		status: number
	}>()
	const { specialCode } = useParams()
	const status = Form.useWatch('status', filterForm)
	const createScratchModal = useModal()
	const [modalForm] = Form.useForm<{
		num: number
	}>()

	const [
		getScratchCardList,
		{
			data: {
				data: scratchCardList,
				rowCount: scratchCardListTotal = 0,
			} = {} as IGetScratchCardListResponse,
			isFetching: isGetScratchCardLoading,
		},
	] = useLazyGetScratchCardListQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: scratchCardListTotal,
	})

	const [exportScratchCardList, { isLoading: isExportScratchCardLoading }] =
		useExportScratchCardListMutation()

	const [createScratchCard, { isLoading: isCreateScratchCardLoading }] =
		useCreateScratchCardMutation()

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!specialCode || status === undefined) return
		try {
			await getScratchCardList({
				specialCode,
				status,
				pageNumber: current,
				pageSize,
			}).unwrap()
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination
		await handleSearch({
			current,
			pageSize,
		})
	}

	const handleExportScratchCardList = async () => {
		if (!specialCode || status === undefined) return
		try {
			const blob = await exportScratchCardList({ status, specialCode }).unwrap()

			download(
				blob,
				`ExportScratchCard${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleCreateScratchCode = async () => {
		if (!specialCode) return
		const { num } = await modalForm.validateFields()
		try {
			const response = await createScratchCard({ specialCode, num }).unwrap()
			message.success(response?.message || t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		// 每次 status 改變時自動重新搜尋
		if (status !== undefined) {
			handleSearch({})
		}
	}, [status])

	const loading = isGetScratchCardLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={t('Label_ScratchCardList')} />
			<ScratchCardListFilter loading={loading} form={filterForm} />
			<ScratchCardListTable
				loading={loading}
				scratchCardList={scratchCardList}
				onTableChange={handleTableChange}
				pagination={pagination}
			/>
			<CreateScratchCardModal
				loading={isCreateScratchCardLoading}
				visible={createScratchModal.visible}
				onFinish={handleCreateScratchCode}
				onCancel={() => {
					modalForm.resetFields()
					createScratchModal.onCancel()
				}}
				form={modalForm}
			/>
			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					onClick={createScratchModal.onOpen}
				/>
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse}
					onClick={handleExportScratchCardList}
					loading={isExportScratchCardLoading}
				/>
				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default ScratchCardList
