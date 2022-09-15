import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useAuth } from 'common/hooks'
import { Form, message } from 'antd'
import { useEffect, useState } from 'react'
import {
	useLazyGetAdjustmentLimitListQuery,
	useUpdateAdjustmentLimitMutation,
} from 'features/adjustmentLimitation/api'
import {
	IGetAdjustmentListData,
	IGetAdjustmentListResponse,
	IUpdateAdjustmentLimitData,
} from 'features/adjustmentLimitation/type'
import { AdjustmentLimitationTable } from 'features/adjustmentLimitation/AdjustmentLimitationTable'

const AdjustmentLimitation = ({
	pageTitle,
}: {
	pageTitle?: string
}): JSX.Element => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [form] = Form.useForm<{ adjustmentMax: number }>()
	const [editingCurrencyId, setEditingCurrencyId] = useState<
		number | undefined
	>(undefined)

	const [
		getAdjustmentLimitList,
		{
			data: { data: adjustmentLimitData } = {} as IGetAdjustmentListResponse,
			isFetching: isGetAdjustmentLimitLoading,
		},
	] = useLazyGetAdjustmentLimitListQuery()

	const [updateAdjustmentLimit, { isLoading: isUpdateAdjustmentLoading }] =
		useUpdateAdjustmentLimitMutation()

	const handleGetAdjustmentLimit = async () => {
		await getAdjustmentLimitList({ siteId })
	}

	const handleSaved = async (record: IGetAdjustmentListData) => {
		const { adjustmentMax } = await form.validateFields()
		const { currencyId, adjustmentMax: adjustmentMaxBefore } = record
		const before: IUpdateAdjustmentLimitData = {
			adjustmentMax: adjustmentMaxBefore,
		}
		const after: IUpdateAdjustmentLimitData = {
			adjustmentMax,
		}
		try {
			await updateAdjustmentLimit({
				siteId,
				currencyId,
				before,
				after,
			}).unwrap()
			await handleGetAdjustmentLimit()
			message.success(t('System.Label_Success'))
			setEditingCurrencyId(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		handleGetAdjustmentLimit()
	}, [siteId])

	const loading = isGetAdjustmentLimitLoading || isUpdateAdjustmentLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<AdjustmentLimitationTable
				loading={loading}
				form={form}
				onSaved={handleSaved}
				setEditingKey={setEditingCurrencyId}
				editingKey={editingCurrencyId}
				adjustmentLimitListData={adjustmentLimitData}
				editPermission={editPermission}
			/>
		</LayoutContent.Main>
	)
}

export default AdjustmentLimitation
