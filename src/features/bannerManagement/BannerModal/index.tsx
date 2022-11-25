import moment from 'moment'
import { FormInstance, message, Modal } from 'antd'
import { Currency } from 'common/enum/type'
import { IEnumTypeData } from 'common/service/enumApi'
import { selectUserSite } from 'common/enum'
import { IAddForm, IGetBannerData } from 'features/bannerManagement/type'
import BannerModalForm from 'features/bannerManagement/BannerModal/BannerModalForm'
import { useSetBannerMutation } from 'features/bannerManagement/api'
import { useAppSelector } from 'app/store'
import { useEffect } from 'react'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useTranslation } from 'react-i18next'
import { dateRangeToUtcFormatter } from 'common/utils'
import { coverSpecificToObjString } from 'features/bannerManagement/utils'
import { isEmpty, trim } from 'lodash'

interface IAddBannerModalProps {
	form: FormInstance<IAddForm>
	loading: boolean
	visible: boolean
	currencyListBySite: Currency[]
	bannerTypeList: IEnumTypeData[]
	showStatusList: IEnumTypeData[]
	bannerActionModeList: IEnumTypeData[]
	currencyId: number
	editBannerData?: IGetBannerData
	isEditing: boolean
	onCancel: () => void
}

const AddBannerModal = ({
	form,
	loading,
	visible,
	currencyListBySite,
	bannerTypeList,
	showStatusList,
	bannerActionModeList,
	currencyId,
	editBannerData,
	isEditing,
	onCancel,
}: IAddBannerModalProps) => {
	const { t } = useTranslation()
	const { timeZoneUtcOffset } = useTimeZone()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [setBanner, { isLoading: isSetBannerLoading }] = useSetBannerMutation()

	useEffect(() => {
		form.resetFields()
		if (visible && isEditing && editBannerData) {
			const {
				bannerName,
				bannerType,
				showStatus,
				actionMode,
				startTime,
				endTime,
				bonusCode,
				urlRouter,
				gameId,
				tpId,
				specific,
			} = editBannerData

			const targetDetails = specific?.find(
				({ currencyId: specificCurrencyId }) =>
					specificCurrencyId === currencyId
			)?.details

			form.setFieldsValue({
				currencyId,
				bannerName,
				bannerType,
				showStatus,
				actionMode,
				dateRange: [moment(startTime), moment(endTime)],
				bonusCode,
				urlRouter,
				gameId,
				tpId,
				specific: JSON.parse(targetDetails ?? ''),
			})
		}
	}, [visible])

	const handleCreate = async () => {
		try {
			await form.validateFields()

			if (!siteId) return
			const {
				bannerName,
				bannerType,
				actionMode,
				showStatus,
				dateRange,
				bonusCode,
				tpId,
				urlRouter,
				gameId,
				currencyId: formCurrencyId,
				specific: formSpecific,
			} = form.getFieldsValue(true)
			const [startTime, endTime] = dateRangeToUtcFormatter(
				[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
				timeZoneUtcOffset
			)
			const detailStr = coverSpecificToObjString(formSpecific)
			const { matchId, specific, sort } = editBannerData ?? {}
			const args = {
				isAdd: Boolean(!isEditing),
				siteId,
				bannerName,
				bannerType,
				actionMode,
				showStatus,
				startTime,
				endTime,
				bonusCode,
				matchId: isEditing ? Number(matchId) : 0,
				tpId,
				urlRouter,
				gameId,
				sportBattleDateTime: null,
				sportCategoryId: null,
				sportLeaguesId: null,
				sportTeamsId: null,
				specific: [
					{
						currencyId: Number(formCurrencyId),
						details: detailStr,
						status: isEditing ? Number(specific?.[0]?.status) : 0,
					},
				],
				sort: isEditing ? Number(sort) : 1,
			}
			try {
				await setBanner(args).unwrap()
				onCancel()
				message.success(t('System.Label_Success'))
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		} catch (error) {
			const { errorFields } = error
			const { name, errors } = errorFields[0]
			if ((name.length as number) > 1) {
				if (isEmpty(trim(errors[0]))) {
					// winOver 和 rollOver 的message 沒有秀在 form 上面 , 僅展示紅匡 , 透過 message.error 推播
					message.error(
						t('Label_FieldsOneTime', {
							FieldA: t('Label_WinOver'),
							FieldB: t('Label_Rollover'),
						})
					)
				} else {
					const errorMessage = `Lang : ${name[1].toUpperCase()}'s ${errors[0]}`
					message.error(errorMessage)
				}
			}
		}
	}

	return (
		<Modal
			open={visible}
			title={t('Label_BannerInfo')}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			width={1000}
			onOk={handleCreate}
		>
			<BannerModalForm
				form={form}
				loading={loading || isSetBannerLoading}
				currencyListBySite={currencyListBySite}
				bannerTypeList={bannerTypeList}
				showStatusList={showStatusList}
				bannerActionModeList={bannerActionModeList}
				currencyId={currencyId}
				siteId={siteId}
			/>
		</Modal>
	)
}

export default AddBannerModal
