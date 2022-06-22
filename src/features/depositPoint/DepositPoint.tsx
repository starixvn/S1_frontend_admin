import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { Form, message } from 'antd'
import { selectUserSite } from 'common/enum'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	useGetDepositPointSettingQuery,
	useSetDepositPointSettingMutation,
} from './api'
import DepositPointTable from './DepositPointTable'
import { IDepositPointSettingData, ISetDepositPointSettingArgs } from './type'

const DepositPoint: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { timeZoneUtcOffset } = useTimeZone()
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
			const [promotionStartTime, promotionEndTime] = dateRangeToUtcFormatter(
				promotionDateRange,
				timeZoneUtcOffset
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
