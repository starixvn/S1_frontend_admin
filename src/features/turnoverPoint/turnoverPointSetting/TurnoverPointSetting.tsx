import { FC } from 'react'
import { useQueryParams } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Form, message } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { forEach, isEmpty, isNumber } from 'lodash'
import {
	IGetTurnoverPointSettingResponse,
	ISetTurnoverPointSettingInfo,
} from '../type'
import {
	useGetTurnoverPointSettingQuery,
	useSetTurnoverPointSettingMutation,
} from '../api'
import { TurnoverPointSettingForm } from './TurnoverPointSettingForm'
import { dateRangeToUtcFormatter } from '../../../common/utils'
import { useTimeZone } from '../../../components/TimeZoneSelect'

const TurnoverPointSetting: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const [queryParams] = useQueryParams()
	const { vipLevelName, currencyId } = queryParams
	const { vipLevel } = useParams()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
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
					// 小於 0 或空字串
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
			// 0001 那個時間資料是沒有選擇活動狀態,後端給的,到前端時我轉成 null , 回去時吐一樣的還他
			settingInfos.push({
				tpCategoryName,
				tpCategoryId,
				turnover: turnover >= 0 ? turnover : 0,
				pointRate,
				promotionStatus: Number(promotionStatus),
				promotionPointRate,
				promotionStartTime:
					promotionStartTime !== 'Invalid date'
						? promotionStartTime
						: '0001-01-01T00:00:00+00:00',
				promotionEndTime:
					promotionEndTime !== 'Invalid date'
						? promotionEndTime
						: '0001-01-01T00:00:00+00:00',
				vipLevel: Number(vipLevel),
			})
		})
		return !hasError ? settingInfos : false
	}
	// 因為畫面結構關係, 這裡嘗試自己寫驗證 , 並改用 Message 方式呈現錯誤 , 驗證函數若回吐 false 則直接不去 set API
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
				<AffixButtons.GoBackRoute onClick={() => form.resetFields()} />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default TurnoverPointSetting
