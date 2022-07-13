import { FC } from 'react'
import { useQueryParams } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, message } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { forEach, isEmpty, isNumber } from 'lodash'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	IGetTurnoverPointSettingResponse,
	ISetTurnoverPointSettingInfo,
} from '../type'
import {
	useGetTurnoverPointSettingQuery,
	useSetTurnoverPointSettingMutation,
} from '../api'
import { TurnoverPointSettingForm } from './TurnoverPointSettingForm'

const TurnoverPointSetting: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const [queryParams] = useQueryParams()
	const { vipLevelName, currencyId } = queryParams
	const { vipLevel } = useParams()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const navigate = useNavigate()
	const [form] = Form.useForm()
	const {
		data: {
			data: turnoverPointDetail,
		} = {} as IGetTurnoverPointSettingResponse,
		isFetching: isGetTurnoverPointSettingLoading,
	} = useGetTurnoverPointSettingQuery({
		siteId,
		currencyId,
		vipLevel: Number(vipLevel),
	})
	const { timeZoneUtcOffset } = useTimeZone()
	const [
		setTurnoverPointSetting,
		{ isLoading: isSetTurnoverPointSettingLoading },
	] = useSetTurnoverPointSettingMutation()

	const getApiInfosAndValidate = () => {
		const formValues = form.getFieldsValue(true)
		const settingInfos: ISetTurnoverPointSettingInfo[] = []
		let hasError = false
		forEach(formValues, item => {
			const {
				promotionPointRate,
				turnover,
				tpCategoryName,
				tpCategoryId,
				pointRate,
				promotionStatus,
				promotionDateRange,
			} = item
			const [promotionStartTime, promotionEndTime] = dateRangeToUtcFormatter(
				promotionDateRange,
				timeZoneUtcOffset
			)

			if (promotionStatus) {
				if (promotionStartTime === 'Invalid date') {
					message.error(t('Label_DateRangeRequire'))
					hasError = true
					return
				}
				if (
					promotionPointRate < 0 ||
					(!isNumber(promotionPointRate) && isEmpty(promotionPointRate))
				) {
					message.error(
						t('Label_Required', { key: t('Label_PromotionPointRate') })
					)
					hasError = true
					return
				}
			}
			// 若沒設定時間送出 null
			settingInfos.push({
				tpCategoryName,
				tpCategoryId,
				turnover: turnover >= 0 ? turnover : 0,
				pointRate,
				promotionStatus: Number(promotionStatus),
				promotionPointRate,
				promotionStartTime:
					promotionStartTime !== 'Invalid date' ? promotionStartTime : null,
				promotionEndTime:
					promotionEndTime !== 'Invalid date' ? promotionEndTime : null,
				vipLevel: Number(vipLevel),
			})
		})
		return !hasError ? settingInfos : false
	}
	const handleSetTurnoverPointSetting = async () => {
		const settingInfos = getApiInfosAndValidate()
		if (!settingInfos) return
		try {
			await setTurnoverPointSetting({
				siteId,
				currencyId,
				infos: settingInfos,
			}).unwrap()
			message.success(t('System.Label_SaveSuccess'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={`${pageTitle ?? ' '} > ${vipLevelName}`} />
			<TurnoverPointSettingForm
				loading={isGetTurnoverPointSettingLoading}
				turnoverSettingData={turnoverPointDetail}
				form={form}
			/>
			<AffixButtons>
				<AffixButtons.Saved
					onClick={handleSetTurnoverPointSetting}
					loading={isSetTurnoverPointSettingLoading}
				/>
				<AffixButtons.GoBackRoute
					onClick={() => {
						navigate(-1)
						form.resetFields()
					}}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default TurnoverPointSetting
