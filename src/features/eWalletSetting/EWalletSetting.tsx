import { FC, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useAuth } from 'common/hooks'
import { Form, message } from 'antd'
import {
	IGetEWalletListData,
	IGetEWalletListResponse,
	IWithdrawalValue,
} from 'features/eWalletSetting/type'
import {
	useGetEWalletListQuery,
	useSetStatusMutation,
	useUpdateEWalletListMutation,
} from 'features/eWalletSetting/api'
import { EWalletSettingTable } from 'features/eWalletSetting/EWalletSettingTable'

const EWalletSetting: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [form] = Form.useForm()
	const [editingCurrencyId, setEditingCurrencyId] = useState<
		number | undefined
	>()

	const {
		data: { data: eWalletList } = {} as IGetEWalletListResponse,
		isFetching: isGetEWalletListLoading,
	} = useGetEWalletListQuery({ siteId })

	const [setStatus, { isLoading: isSetStatusLoading }] = useSetStatusMutation()

	const [updateEWalletList, { isLoading: isUpdateEWalletListLoading }] =
		useUpdateEWalletListMutation()

	const handleSaved = async (record: IGetEWalletListData) => {
		const { withdrawalMin, withdrawalMax } = await form.validateFields()
		const {
			currencyId,
			withdrawalMin: withdrawalMinBefore,
			withdrawalMax: withdrawalMaxBefore,
		} = record

		const after: IWithdrawalValue = {
			withdrawalMin: Number(withdrawalMin),
			withdrawalMax: Number(withdrawalMax),
		}
		const before: IWithdrawalValue = {
			withdrawalMin: withdrawalMinBefore,
			withdrawalMax: withdrawalMaxBefore,
		}

		try {
			await updateEWalletList({
				siteId,
				currencyId,
				before,
				after,
			}).unwrap()
			setEditingCurrencyId(undefined)
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSwitchStatus = async (
		currencyId: number,
		before: number,
		after: number
	) => {
		try {
			await setStatus({
				siteId,
				currencyId,
				before: { status: before },
				after: { status: after },
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading =
		isGetEWalletListLoading || isSetStatusLoading || isUpdateEWalletListLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<EWalletSettingTable
				form={form}
				loading={loading}
				eWalletList={eWalletList}
				editPermission={editPermission}
				onSaved={handleSaved}
				editingKey={editingCurrencyId}
				setEditingKey={setEditingCurrencyId}
				onSwitchStatus={handleSwitchStatus}
			/>
		</LayoutContent.Main>
	)
}

export default EWalletSetting
