import { FC, useEffect } from 'react'
import moment from 'moment'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { Form, message } from 'antd'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useAuth } from 'common/hooks'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useGetMaintenanceQuery, useSetMaintenanceMutation } from './api'
import { IGetMaintenanceResponse } from './type'
import { AffixButtons } from '../../components/AffixButtons'
import { SiteMaintenanceForm } from './SiteMaintenanceForm'
import { dateRangeToUtcFormatter } from '../../common/utils'

const SiteMaintenance: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [form] = Form.useForm()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()

	const {
		data: { data: maintenanceData } = {} as IGetMaintenanceResponse,
		isFetching: isGetMaintenanceLoading,
	} = useGetMaintenanceQuery({ siteId })

	const [setMaintenance, { isLoading: isSetMaintenanceLoading }] =
		useSetMaintenanceMutation()

	const handleSetMaintenance = async () => {
		const { maintain, dateRange } = form.getFieldsValue()
		const [beginTime, endTime] = dateRangeToUtcFormatter(
			dateRange,
			timeZoneUtcOffset
		)
		try {
			await setMaintenance({
				siteId,
				beginTime,
				endTime,
				maintain,
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (!isGetMaintenanceLoading && maintenanceData) {
			const { maintain, dateTimeStart, dateTimeEnd } = maintenanceData
			form.setFieldsValue({
				maintain,
				dateRange: [moment(dateTimeStart), moment(dateTimeEnd)],
			})
		}
	}, [isGetMaintenanceLoading])

	const loading = isGetMaintenanceLoading || isSetMaintenanceLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<SiteMaintenanceForm
				form={form}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTimeZoneChange={onTimeZoneChange}
				editPermission={editPermission}
				loading={loading}
			/>
			<AffixButtons>
				<AffixButtons.Saved
					disabled={!editPermission?.canUse}
					loading={loading}
					onClick={handleSetMaintenance}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default SiteMaintenance
