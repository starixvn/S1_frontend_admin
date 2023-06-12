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
	IGetVipUpgradeSupportCurrencyResponse,
	ISetUpgradeSetting,
	IUpgradeSettingTableData,
	VipLevelsEnum,
} from 'features/vipUpgradeSetting/type'
import { vipUpgradeSettingConverter } from 'features/vipUpgradeSetting/utils'
import VipUpgradeSettingTable from 'features/vipUpgradeSetting/VipUpgradeSettingTable'

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
			data: VipUpgradeSupportCurrencyList = [],
		} = {} as IGetVipUpgradeSupportCurrencyResponse,
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
		// typeName,type 沒有出現在編輯框中
		const {
			currencyId,
			typeName,
			type,
			silverClub,
			goldClub,
			titaniumClub,
			diamondClub,
		}: IUpgradeSettingTableData = await editForm.getFieldsValue(true)

		const payload: ISetUpgradeSetting = {
			siteId,
			currencyId,
			before: {
				siteId,
				currencyId,
				type,
				typeName,
				detail: [
					{
						level: VipLevelsEnum.SilverClub,
						// tableData 只在拿取資料時做 set 故從 tableData 拿原值
						levelValue: String(find(tableData, { type })?.silverClub),
					},
					{
						level: VipLevelsEnum.GoldClub,
						levelValue: String(find(tableData, { type })?.goldClub),
					},
					{
						level: VipLevelsEnum.TitaniumClub,
						levelValue: String(find(tableData, { type })?.titaniumClub),
					},
					{
						level: VipLevelsEnum.DiamondClub,
						levelValue: String(find(tableData, { type })?.diamondClub),
					},
				],
			},
			after: {
				siteId,
				currencyId,
				type,
				typeName,
				detail: [
					{
						level: VipLevelsEnum.SilverClub,
						levelValue: String(silverClub),
					},
					{
						level: VipLevelsEnum.GoldClub,
						levelValue: String(goldClub),
					},
					{
						level: VipLevelsEnum.TitaniumClub,
						levelValue: String(titaniumClub),
					},
					{
						level: VipLevelsEnum.DiamondClub,
						levelValue: String(diamondClub),
					},
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
		if (!VipUpgradeSupportCurrencyList) return
		// queryParams 若是空的 則 setQueryParams 並拿第一筆 currencyId 打 api
		if (isEmpty(queryParams)) {
			setQueryParams({
				currencyId: head(VipUpgradeSupportCurrencyList),
			})
			handleGetUpgradeSetting(head(VipUpgradeSupportCurrencyList)!)
		} else {
			const { currencyId } = queryParams
			setTabActiveKey(currencyId)
			handleGetUpgradeSetting(Number(currencyId))
		}
	}, [isVipUpgradeSupportCurrencyFetching])

	// 目前只有支援 MYR THB IDR
	const items = filter(currencyListBySite, currency =>
		includes(VipUpgradeSupportCurrencyList, currency.currencyId)
	).map(item => {
		return {
			label: item.isoCode,
			key: String(item.currencyId),
			forceRender: true,
			children: (
				<VipUpgradeSettingTable
					loading={loading}
					form={editForm}
					editPermission={editPermission}
					editingKey={editingKey}
					setEditingKey={setEditingKey}
					tableData={tableData}
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
