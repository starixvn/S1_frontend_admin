import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { Form, message } from 'antd'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useAuth } from 'common/hooks'
import { find } from 'lodash'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	useGetDepositPointSettingQuery,
	useSetDepositPointSettingMutation,
} from './api'
import { IDepositPointSettingData, ISetDepositPointSettingArgs } from './type'
import DepositPointTable from './DepositPointTable'

const DepositPoint: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { editPermission } = {} } = useAuth()

	const { timeZoneUtcOffset } = useTimeZone()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [form] = Form.useForm()
	const [recordDepositPointSettings, setRecordDepositPointSettings] = useState<
		IDepositPointSettingData[]
	>([])
	const [editingKey, setEditingKey] = useState('')

	const {
		isLoading: isInitialDepositPointSettingsLoading,
		isFetching: isDepositPointSettingsFetching,
		data: { data: depositPointSettings = [] } = {},
	} = useGetDepositPointSettingQuery({
		siteId,
	})

	const [
		setDepositPointSetting,
		{ isLoading: isSetDepositPointSettingLoading },
	] = useSetDepositPointSettingMutation()

	const handleSetDepositPointSetting = async (
		args: ISetDepositPointSettingArgs
	) => {
		try {
			await setDepositPointSetting(args).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableRowSave = async () => {
		try {
			const {
				depositAmount,
				promotionStatus,
				promotionDateRange,
				promotionPointRate,
			} = (await form.validateFields()) as IDepositPointSettingData

			const currency = find(currencyListBySite, { isoCode: editingKey })

			if (!currency?.timeZone) return
			// * 轉成幣別所預設的時區，且結束時間需為 23:59:59
			const [promotionStartTime, promotionEndTime] = dateRangeToUtcFormatter(
				[
					promotionDateRange[0].startOf('day'),
					promotionDateRange[1].endOf('day'),
				],
				currency?.timeZone
			)

			const newData = [...recordDepositPointSettings]
			const index = newData.findIndex(item => editingKey === item.isoCode)
			const item = {
				...newData[index],
				depositAmount: Number(depositAmount) >= 0 ? depositAmount : 0,
				promotionStatus,
				promotionPointRate:
					Number(promotionPointRate) >= 0 ? promotionPointRate : 0,
				promotionStartTime,
				promotionEndTime,
			}
			newData.splice(index, 1, item)
			setRecordDepositPointSettings(newData)
			setEditingKey('')
			handleSetDepositPointSetting({ siteId, ...item })
		} catch (error) {
			if ((error as Error)?.message) {
				message.error(
					(error as Error).message || t('System.Label_NotExpectedServerError')
				)
			}
		}
	}

	useEffect(() => {
		if (!isDepositPointSettingsFetching) {
			setRecordDepositPointSettings(depositPointSettings)
		}
	}, [isDepositPointSettingsFetching])

	const loading =
		isDepositPointSettingsFetching || isSetDepositPointSettingLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			{!isInitialDepositPointSettingsLoading && (
				<LayoutContent.Card>
					<DepositPointTable
						form={form}
						loading={loading}
						editPermission={editPermission}
						editingKey={editingKey}
						depositPointSettings={recordDepositPointSettings}
						timeZoneUtcOffset={timeZoneUtcOffset}
						setEditingKey={setEditingKey}
						onTableRowSave={handleTableRowSave}
					/>
				</LayoutContent.Card>
			)}
		</LayoutContent.Main>
	)
}

export default DepositPoint
