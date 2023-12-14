import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Form, message } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import paths from 'app/constants/paths'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { selectUserSite } from 'common/enum'
import { useAuth, useModal } from 'common/hooks'
import { useGetCategoryQuery } from 'common/service/allDataApi'
import {
	useGetBigWinSettingQuery,
	useSetBigWinSettingMutation,
} from 'features/bigWinPopUpSetting/api'
import { IEditForm } from 'features/bigWinPopUpSetting/type'
import BigWinPopUpSettingTable from 'features/bigWinPopUpSetting/BigWinPopUpSettingTable'
import BigWinPopUpSettingModal from 'features/bigWinPopUpSetting/modal/BigWinPopUpSettingModal'

const BigWinPopUpSetting = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const { siteId: uerSiteId } = useAppSelector(selectUserSite) ?? {}
	const navigate = useNavigate()
	const [form] = Form.useForm<IEditForm>()
	const bigWinPopUpSettingModal = useModal()
	const [activeSetting, setActiveSetting] = useState<{
		siteId: number
		currencyId: number
		multipleOfWinning: number
		minOfWinning: number
		iTpCategoryList: number[]
		status: number
	} | null>(null)

	const {
		data: { data: bigWinSettingList = [] } = {},
		isLoading: isGetBigWinSettingLoading,
	} = useGetBigWinSettingQuery({ siteId: uerSiteId })

	const {
		data: { data: categoryList = [] } = {},
		isLoading: isGetCategoryListLoading,
	} = useGetCategoryQuery(null)

	const [setBigWinSetting, { isLoading: isSetBigWinSettingLoading }] =
		useSetBigWinSettingMutation()

	const onToggle = async (
		targetStatus: boolean,
		targetSiteId: number,
		targetCurrencyId: number
	) => {
		const foundBigWinSettingItem = bigWinSettingList.find(
			({ siteId, currencyId }) =>
				siteId === targetSiteId && currencyId === targetCurrencyId
		)
		if (foundBigWinSettingItem) {
			const {
				siteId,
				currencyId,
				multipleOfWinning,
				status,
				minOfWinning,
				tpCategory,
			} = foundBigWinSettingItem
			try {
				await setBigWinSetting({
					siteId,
					currencyId,
					before: {
						siteId,
						currencyId,
						multipleOfWinning,
						status,
						minOfWinning,
						tpCategory,
					},
					after: {
						siteId,
						currencyId,
						multipleOfWinning,
						status: targetStatus ? 1 : 0,
						minOfWinning,
						tpCategory,
					},
				}).unwrap()
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}
	}

	const onEdit = ({
		siteId,
		currencyId,
		iTpCategoryList,
		multipleOfWinning,
		minOfWinning,
		status,
	}: {
		siteId: number
		currencyId: number
		iTpCategoryList: number[]
		multipleOfWinning: number
		minOfWinning: number
		status: number
	}) => {
		bigWinPopUpSettingModal.onOpen()
		form.setFieldsValue({
			iTpCategoryList,
			multipleOfWinning,
			minOfWinning,
		})
		setActiveSetting({
			siteId,
			currencyId,
			iTpCategoryList,
			multipleOfWinning,
			minOfWinning,
			status,
		})
	}

	const onCancel = () => {
		bigWinPopUpSettingModal.onCancel()
		navigate(`/${NEW_SITE_PREFIX_URL}/${paths.cms.sub.bigWinPopUpSetting.root}`)
	}

	const onSubmit = async () => {
		const { multipleOfWinning, minOfWinning, iTpCategoryList } =
			form.getFieldsValue()

		if (activeSetting) {
			try {
				const {
					siteId,
					currencyId,
					multipleOfWinning: activeMultipleOfWinning,
					status,
					minOfWinning: activeOfWinning,
					iTpCategoryList: activeITpCategoryList,
				} = activeSetting
				await setBigWinSetting({
					siteId,
					currencyId,
					before: {
						siteId,
						currencyId,
						multipleOfWinning: activeMultipleOfWinning,
						status,
						minOfWinning: activeOfWinning,
						tpCategory: JSON.stringify(activeITpCategoryList),
					},
					after: {
						siteId,
						currencyId,
						multipleOfWinning,
						status,
						minOfWinning,
						tpCategory: JSON.stringify(iTpCategoryList),
					},
				}).unwrap()
				bigWinPopUpSettingModal.onCancel()
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}
	}

	const loading =
		isGetBigWinSettingLoading ||
		isSetBigWinSettingLoading ||
		isGetCategoryListLoading
	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<BigWinPopUpSettingTable
				loading={loading}
				editPermission={editPermission}
				bigWinSettingList={bigWinSettingList}
				categoryList={categoryList}
				onToggle={onToggle}
				onEdit={onEdit}
			/>
			<BigWinPopUpSettingModal
				form={form}
				visible={bigWinPopUpSettingModal.visible}
				loading={loading}
				onCancel={onCancel}
				onSubmit={onSubmit}
			/>
		</LayoutContent.Main>
	)
}

export default BigWinPopUpSetting
