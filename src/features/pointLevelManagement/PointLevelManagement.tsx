import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import PointLevelManagementTabs from 'features/pointLevelManagement/PointLevelManagementTabs'
import { Form, message } from 'antd'
import { head, last, isNumber } from 'lodash'
import AddPointLevelFormModal from 'features/pointLevelManagement/AddPointLevelFormModal'
import { IEditForm } from 'features/pointLevelManagement/type'
import {
	useUpdatePointLevelMutation,
	useCreatePointLevelMutation,
	useDeletePointLevelMutation,
	useGetPointLevelListQuery,
} from 'features/pointLevelManagement/api'

import { useAuth, useModal } from 'common/hooks'
import { AffixButtons } from 'components/AffixButtons'

const PointLevelManagement = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [editForm] = Form.useForm<IEditForm>()
	const [addForm] = Form.useForm()
	const [editingKey, setEditingKey] = useState<number | undefined>(undefined)
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [tabActiveKey, setActiveKey] = useState<number | undefined>(
		head(currencyListBySite)?.currencyId
	)
	const addPointLevelModal = useModal()

	const {
		data: { data: pointLevelData = [] } = {},
		isFetching: isGetPointLevelLoading,
	} = useGetPointLevelListQuery(
		{ siteId, currencyId: Number(tabActiveKey) },
		{ skip: !tabActiveKey }
	)

	const [createPointLevel, { isLoading: isCreatePointLevelLoading }] =
		useCreatePointLevelMutation()
	const [updatePointLevel, { isLoading: isUpdatePointLevelLoading }] =
		useUpdatePointLevelMutation()
	const [deletePointLevel, { isLoading: isDeletePointLevelLoading }] =
		useDeletePointLevelMutation()

	const handleTabsChange = async (key: string) => {
		if (!key) return
		setActiveKey(Number(key))
	}

	const handleCreatePointLevel = async () => {
		if (!siteId || !isNumber(tabActiveKey)) return
		const args = await addForm.validateFields()

		try {
			await createPointLevel({
				siteId,
				currencyId: tabActiveKey,
				...args,
			}).unwrap()

			addPointLevelModal.onCancel()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleRowSaved = async () => {
		if (!isNumber(tabActiveKey) || !isNumber(editingKey)) return
		const args = await editForm.validateFields()
		try {
			await updatePointLevel({
				siteId,
				currencyId: tabActiveKey,
				pointLevel: editingKey,
				...args,
			}).unwrap()

			message.success(t('System.Label_Success'))
			setEditingKey(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleDeletePointLevel = async (pointLevel: number) => {
		if (!tabActiveKey) return
		try {
			await deletePointLevel({
				siteId,
				currencyId: tabActiveKey,
				pointLevel,
			}).unwrap()

			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (isGetPointLevelLoading) return
		const { pointLevel: lastPointLevel = 0 } = last(pointLevelData) ?? {}
		const newPointLevel = lastPointLevel + 1
		addForm.setFieldValue('pointLevel', newPointLevel)
	}, [isGetPointLevelLoading, tabActiveKey])

	const loading =
		isGetPointLevelLoading ||
		isCreatePointLevelLoading ||
		isUpdatePointLevelLoading ||
		isDeletePointLevelLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<PointLevelManagementTabs
				loading={loading}
				form={editForm}
				pointLevelData={pointLevelData}
				editPermission={editPermission}
				editingKey={editingKey}
				setEditingKey={setEditingKey}
				onTabsChange={handleTabsChange}
				onDeletePointLevel={handleDeletePointLevel}
				onRowSaved={handleRowSaved}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					loading={loading}
					onClick={addPointLevelModal.onOpen}
				/>
			</AffixButtons>

			<AddPointLevelFormModal
				loading={isCreatePointLevelLoading}
				form={addForm}
				visible={addPointLevelModal.visible}
				onCancel={addPointLevelModal.onCancel}
				onFinish={handleCreatePointLevel}
			/>
		</LayoutContent.Main>
	)
}

export default PointLevelManagement
