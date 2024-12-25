import { useEffect, useState } from 'react'
import { Form, message, Tabs } from 'antd'
import { useAppSelector } from 'app/store'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { filter, head, includes, isEmpty, find } from 'lodash'
import { useAuth, useQueryParams } from 'common/hooks'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import {
	useGetVipUpgradeSupportCurrencyQuery,
	useLazyGetUpgradeSettingQuery,
	useSetUpgradeSettingMutation,
} from 'features/vipUpgradeSetting/api'
import {
	IEditForm,
	IVipUpgradeSupportCurrencyResponse,
	ISetUpgradeSettingArgs,
	IUpgradeSettingTableData,
	VipLevelsEnum,
} from 'features/vipUpgradeSetting/type'
import { vipUpgradeSettingConverter } from 'features/vipUpgradeSetting/utils'
import VipUpgradeSettingTable from 'features/vipUpgradeSetting/VipUpgradeSettingTable'
import { SiteIds } from '../../app/constants/siteIds'

const VipUpgradeSetting = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const [editForm] = Form.useForm<IEditForm>()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [tableData, setTableData] = useState<IUpgradeSettingTableData[]>([])
	const [editingKey, setEditingKey] = useState<number | undefined>()
	const [tabActiveKey, setTabActiveKey] = useState<string | undefined>()

	const {
		data: {
			data: vipUpgradeSupportCurrencyList = [],
		} = {} as IVipUpgradeSupportCurrencyResponse,
		isFetching: isVipUpgradeSupportCurrencyFetching,
	} = useGetVipUpgradeSupportCurrencyQuery({ siteId })

	const [getUpgradeSetting, { isFetching: isUpgradeSettingFetching }] =
		useLazyGetUpgradeSettingQuery()

	const [setUpgradeSetting, { isLoading: isSetUpgradeSettingLoading }] =
		useSetUpgradeSettingMutation()

	const handleGetUpgradeSetting = async (currencyId: number) => {
		try {
			const { data } = await getUpgradeSetting({
				siteId,
				currencyId,
			}).unwrap()
			vipUpgradeSettingConverter(data)
			setTableData(vipUpgradeSettingConverter(data))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTabsChange = async (key: string) => {
		if (!key) return
		await handleGetUpgradeSetting(Number(key))
		setTabActiveKey(key)
		setEditingKey(undefined)
		setQueryParams({
			currencyId: key,
		})
	}

	const handleRowSaved = async () => {
		const { silverClub, goldClub, titaniumClub, diamondClub, novaClub } =
			await editForm.validateFields()
		// typeName,type 沒有出現在編輯框中
		const { currencyId, typeName, type }: IUpgradeSettingTableData =
			await editForm.getFieldsValue(true)

		const payload: ISetUpgradeSettingArgs = {
			siteId,
			currencyId,
			before: {
				siteId,
				currencyId,
				type,
				typeName,
				detail: [
					...(siteId !== SiteIds.OneTwoBet
						? [
								{
									level: VipLevelsEnum.SilverClub,
									levelValue: String(find(tableData, { type })?.silverClub),
								},
						  ]
						: []),
					...(siteId !== SiteIds.OneTwoBet
						? [
								{
									level: VipLevelsEnum.GoldClub,
									levelValue: String(find(tableData, { type })?.goldClub),
								},
						  ]
						: []),
					{
						level: VipLevelsEnum.TitaniumClub,
						levelValue: String(find(tableData, { type })?.titaniumClub),
					},
					{
						level: VipLevelsEnum.DiamondClub,
						levelValue: String(find(tableData, { type })?.diamondClub),
					},
					...(siteId === SiteIds.OneTwoBet
						? [
								{
									level: VipLevelsEnum.NovaClub,
									levelValue: String(find(tableData, { type })?.novaClub),
								},
						  ]
						: []),
				],
			},
			after: {
				siteId,
				currencyId,
				type,
				typeName,
				detail: [
					...(siteId !== SiteIds.OneTwoBet
						? [
								{
									level: VipLevelsEnum.SilverClub,
									levelValue: String(silverClub),
								},
						  ]
						: []),
					...(siteId !== SiteIds.OneTwoBet
						? [
								{
									level: VipLevelsEnum.GoldClub,
									levelValue: String(goldClub),
								},
						  ]
						: []),
					{
						level: VipLevelsEnum.TitaniumClub,
						levelValue: String(titaniumClub),
					},
					{
						level: VipLevelsEnum.DiamondClub,
						levelValue: String(diamondClub),
					},
					...(siteId === SiteIds.OneTwoBet
						? [
								{
									level: VipLevelsEnum.NovaClub,
									levelValue: String(novaClub),
								},
						  ]
						: []),
				],
			},
		}

		try {
			const response = await setUpgradeSetting(payload).unwrap()
			message.success(response?.message || t('System.Label_Success'))
			setEditingKey(undefined)
			handleGetUpgradeSetting(Number(currencyId))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading =
		isUpgradeSettingFetching ||
		isSetUpgradeSettingLoading ||
		isVipUpgradeSupportCurrencyFetching

	useEffect(() => {
		if (isEmpty(queryParams)) {
			if (!isVipUpgradeSupportCurrencyFetching)
				setQueryParams({
					currencyId: head(vipUpgradeSupportCurrencyList),
				})
			handleGetUpgradeSetting(head(vipUpgradeSupportCurrencyList)!)
		} else {
			const { currencyId } = queryParams
			setTabActiveKey(currencyId)
			handleGetUpgradeSetting(Number(currencyId))
		}
	}, [isVipUpgradeSupportCurrencyFetching])

	// 目前只有支援 MYR THB IDR
	const items = filter(currencyListBySite, currency =>
		includes(vipUpgradeSupportCurrencyList, currency.currencyId)
	).map(item => {
		return {
			label: item.isoCode,
			key: String(item.currencyId),
			forceRender: true,
			children: (
				<VipUpgradeSettingTable
					loading={loading}
					form={editForm}
					siteId={siteId ?? 0}
					editPermission={editPermission}
					editingKey={editingKey}
					tableData={tableData}
					setEditingKey={setEditingKey}
					onRowSaved={handleRowSaved}
				/>
			),
		}
	})

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<LayoutContent.Card>
				<Tabs
					defaultActiveKey='1'
					type='card'
					items={items}
					onChange={handleTabsChange}
					activeKey={tabActiveKey}
				/>
			</LayoutContent.Card>
		</LayoutContent.Main>
	)
}

export default VipUpgradeSetting
