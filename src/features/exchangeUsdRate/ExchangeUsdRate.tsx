import { LayoutContent } from 'app/pages/layout'
import { Form, message } from 'antd'
import {
	IGetUsdData,
	IGetUsdRateListResponse,
} from 'features/exchangeUsdRate/type'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	useGetUsdRateListQuery,
	useSetUsdMutation,
} from 'features/exchangeUsdRate/api'
import ExchangeUsdRateTable from 'features/exchangeUsdRate/ExchangeUsdRateTable'

interface IExchangeUsdRateProps {
	pageTitle?: string
}

const ExchangeUsdRate = ({ pageTitle }: IExchangeUsdRateProps) => {
	const { t } = useTranslation()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const { timeZoneUtcOffset } = useTimeZone()
	const [form] = Form.useForm<{ usdRate: number }>()
	const [editingKey, setEditingKey] = useState<{
		currencyId: number | undefined
		usdRate: number | undefined
	}>({ currencyId: undefined, usdRate: undefined })

	const {
		data: { data: usdRateList = [] } = {} as IGetUsdRateListResponse,
		isLoading: isGetUsdRateListLoading,
	} = useGetUsdRateListQuery(null)

	const [setUsdRate, { isLoading: isSetUsdRateLoading }] = useSetUsdMutation()

	const handleSaved = async (record: IGetUsdData) => {
		const { usdRate } = await form.validateFields()
		const { currencyId } = record
		try {
			await setUsdRate({ currencyId, usdRate }).unwrap()
			message.success(t('System.Label_Success'))
			setEditingKey({ currencyId: undefined, usdRate: undefined })
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading = isGetUsdRateListLoading || isSetUsdRateLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<ExchangeUsdRateTable
				form={form}
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				usdRateList={usdRateList}
				editingKey={editingKey}
				editPermission={editPermission}
				setEditingKey={setEditingKey}
				onSaved={handleSaved}
			/>
		</LayoutContent.Main>
	)
}

export default ExchangeUsdRate
