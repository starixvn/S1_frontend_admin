import { FC, useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { useAuth, useModal } from 'common/hooks'
import { head } from 'lodash'
import { AffixButtons } from 'components/AffixButtons'
import { DepositLimitationTab } from 'features/depositLimitation/DepositLimitationTab'
import { Form, message } from 'antd'
import {
	useCreateDepositLimitMutation,
	useDeleteDepositLimitMutation,
	useLazyGetDepositLimitListQuery,
	useUpdateDepositLimitMutation,
} from 'features/depositLimitation/api'
import {
	ErrorCodeEnum,
	IDepositTableData,
	IDepositTableFormData,
	IGetDepositLimitResponse,
} from 'features/depositLimitation/type'
import {
	DepositLimitationC2S,
	depositLimitationResponseConverter,
} from 'features/depositLimitation/utils'
import { CreateDepositLimitModal } from 'features/depositLimitation/CreateDepositLimitModal'

const DepositLimitation: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [currentCurrency, setCurrentCurrency] = useState<number>(
		head(currencyListBySite)?.currencyId ?? 0
	)
	const [editForm] = Form.useForm<IDepositTableFormData>()
	const [createForm] = Form.useForm<IDepositTableFormData>()
	const [editingKey, setEditingKey] = useState<number | undefined>(undefined)
	const [depositLimitationTableData, setDepositLimitationTableData] = useState<
		IDepositTableData[]
	>([])

	const createDepositLimitModal = useModal()

	const [
		getDepositLimitList,
		{
			data: { data: depositLimitListData } = {} as IGetDepositLimitResponse,
			isFetching: isGetDepositLimitListLoading,
		},
	] = useLazyGetDepositLimitListQuery()

	const [updateDepositLimit, { isLoading: isUpdateDepositLimitLoading }] =
		useUpdateDepositLimitMutation()

	const [createDepositLimit, { isLoading: isCreateDepositLimitLoading }] =
		useCreateDepositLimitMutation()

	const [deleteDepositLimit, { isLoading: isDeleteDepositLimitLoading }] =
		useDeleteDepositLimitMutation()

	const handleGetDepositLimit = async () => {
		try {
			await getDepositLimitList({
				siteId,
				currencyId: currentCurrency,
			}).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableRowSaved = async (record: IDepositTableData) => {
		const formData = await editForm.validateFields()
		const { create: createValue, ...rest } = DepositLimitationC2S.update({
			formData,
			record,
		})

		try {
			// 如果有 create value 則要一起打 create
			if ((createValue.length as number) > 0) {
				await Promise.all([
					await createDepositLimit({
						siteId,
						currencyId: currentCurrency,
						after: createValue,
					}).unwrap(),
					await updateDepositLimit({
						siteId,
						currencyId: currentCurrency,
						...rest,
					}).unwrap(),
				])
			} else {
				await updateDepositLimit({
					siteId,
					currencyId: currentCurrency,
					...rest,
				}).unwrap()
			}

			message.success(t('System.Label_Success'))

			await handleGetDepositLimit()
			setEditingKey(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleUpdateStatus = async ({
		record,
		status,
		depositType,
	}: {
		record: IDepositTableData
		status: boolean
		depositType: number
	}) => {
		const requestValue = DepositLimitationC2S.updateStatus({
			record,
			status,
			depositType,
		})

		try {
			await updateDepositLimit({
				siteId,
				currencyId: currentCurrency,
				...requestValue,
			}).unwrap()

			message.success(t('System.Label_Success'))

			await handleGetDepositLimit()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDeleted = async (record: IDepositTableData) => {
		const { vipLevel } = record
		try {
			await deleteDepositLimit({
				siteId,
				currencyId: currentCurrency,
				before: {
					vipLevel,
				},
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleCreateDepositLimit = async () => {
		const formData = await createForm.validateFields()
		const result = DepositLimitationC2S.create(formData)
		if (result.length === 0) {
			message.error(t('Label_EmptyError'))
		} else {
			try {
				await createDepositLimit({
					siteId,
					currencyId: currentCurrency,
					after: DepositLimitationC2S.create(formData),
				}).unwrap()
				message.success(t('System.Label_Success'))
				createForm.resetFields()
			} catch (error) {
				if ((error as any)?.errorCode === ErrorCodeEnum.DuplicatePointLevel) {
					// point Level 重複獨立檢查並顯示 message
					message.error(t('Label_PointLevelDuplicated'))
				} else {
					message.error(
						(error as Error)?.message ||
							t('System.Label_NotExpectedServerError')
					)
				}
			}
		}
	}

	useEffect(() => {
		handleGetDepositLimit()
	}, [currentCurrency])

	useEffect(() => {
		// 只要有更新資料就自動寫入 state 中 ,
		// 更新 method 包含 => providesTags , 手動 handleGet
		if (!isGetDepositLimitListLoading && depositLimitListData) {
			setDepositLimitationTableData(
				depositLimitationResponseConverter(depositLimitListData)
			)
		}
	}, [isGetDepositLimitListLoading])

	const isLoading =
		isGetDepositLimitListLoading ||
		isUpdateDepositLimitLoading ||
		isCreateDepositLimitLoading ||
		isDeleteDepositLimitLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<DepositLimitationTab
				loading={isLoading}
				currentCurrency={currentCurrency}
				form={editForm}
				setCurrentCurrency={setCurrentCurrency}
				currencyListBySite={currencyListBySite}
				editingKey={editingKey}
				setEditingKey={setEditingKey}
				onTableRowSave={handleTableRowSaved}
				editPermission={editPermission}
				tableDataSource={depositLimitationTableData}
				onTableRowDelete={handleDeleted}
				onUpdateStatus={handleUpdateStatus}
			/>
			<CreateDepositLimitModal
				form={createForm}
				loading={isCreateDepositLimitLoading}
				visible={createDepositLimitModal.visible}
				onFinish={handleCreateDepositLimit}
				onCancel={createDepositLimitModal.onCancel}
			/>
			<AffixButtons>
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					onClick={() => {
						createDepositLimitModal.onOpen()
						setEditingKey(undefined)
					}}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default DepositLimitation
