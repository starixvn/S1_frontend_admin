import moment from 'moment'
import { FormInstance, message, Modal } from 'antd'
import { Currency } from 'common/enum/type'
import { IEnumTypeData } from 'common/service/enumApi'
import { selectUserSite } from 'common/enum'
import { IAddForm, IGetBannerData } from 'features/bannerManagement/type'
import BannerModalForm from 'features/bannerManagement/BannerModal/BannerModalForm'
import {
	useLazyGetLanguageListQuery,
	useSetBannerMutation,
} from 'features/bannerManagement/api'
import { useAppSelector } from 'app/store'
import { useEffect } from 'react'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useTranslation } from 'react-i18next'
import { dateRangeToUtcFormatter } from 'common/utils'
import { coverSpecificToObjString } from 'features/bannerManagement/utils'
import { isEmpty, trim } from 'lodash'
import {
	ActionModeEnum,
	UrlRouterEnum,
} from 'features/bannerManagement/constants'

interface IAddBannerModalProps {
	form: FormInstance<IAddForm>
	loading: boolean
	visible: boolean
	currencyListBySite: Currency[]
	bannerTypeList: IEnumTypeData[]
	showStatusList: IEnumTypeData[]
	bannerActionModeList: IEnumTypeData[]
	currencyId: number
	editBannerData: IGetBannerData
	isEditing: boolean
	onCancel: () => void
	onDelete: (bannerName: string) => void
}

const BannerModal = ({
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
	onDelete,
}: IAddBannerModalProps) => {
	const { t } = useTranslation()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [setBanner, { isLoading: isSetBannerLoading }] = useSetBannerMutation()

	const [
		getLanguageList,
		{
			data: { data: languageList = [] } = {},
			isFetching: isGetLanguageListFetching,
		},
	] = useLazyGetLanguageListQuery()

	const onChangeTab = async (currencyNum: number) => {
		if (!siteId) return
		try {
			await getLanguageList({ siteId, currencyId: currencyNum }).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		form.resetFields()
		if (visible && isEditing && editBannerData) {
			const {
				bannerName,
				bannerType,
				categoryId,
				showStatus,
				actionMode,
				startTime,
				endTime,
				bonusCode,
				urlRouter,
				gameId,
				tpId,
				specific,
				sort,
			} = editBannerData
			const targetDetails = specific?.find(
				({ currencyId: specificCurrencyId }) =>
					specificCurrencyId === currencyId
			)?.details
			form.setFieldsValue({
				currencyId,
				bannerName,
				bannerType,
				categoryId,
				showStatus,
				actionMode,
				dateRange: [moment(startTime), moment(endTime)],
				bonusCode,
				urlRouter: Number(UrlRouterEnum[urlRouter]),
				gameId,
				tpId,
				sort,
				specific: JSON.parse(targetDetails ?? ''),
				filterTpId: tpId,
			})
		}
		onChangeTab(currencyId)
	}, [visible])

	const handleCreate = async () => {
		try {
			await form.validateFields()

			if (!siteId) return
			const {
				bannerName: formBannerName,
				bannerType: formBannerType,
				categoryId: formCategoryId,
				actionMode: formActionMode,
				showStatus: formShowStatus,
				dateRange,
				bonusCode: formBonusCode,
				tpId: formTpId,
				sort: formSort,
				urlRouter: formUrlRouter,
				gameId: formGameId,
				filterTpId: formFilterTpId,
				currencyId: formCurrencyId,
				specific: formSpecific,
			} = form.getFieldsValue(true)
			const [formStartTime, formEndTime] = dateRangeToUtcFormatter(
				[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
				timeZoneUtcOffset
			)
			const detailStr = coverSpecificToObjString(formSpecific)

			try {
				let args
				if (isEditing) {
					const {
						specific,
						bannerName,
						bannerType,
						categoryId,
						showStatus,
						actionMode,
						startTime,
						endTime,
						bonusCode,
						urlRouter,
						gameId,
						tpId,
						sort,
					} = editBannerData
					args = {
						siteId,
						currencyId: Number(currencyId),
						before: {
							actionMode,
							bannerName,
							bannerType,
							endTime,
							showStatus,
							siteId,
							sort,
							specific: [
								{
									currencyId: Number(currencyId),
									details: coverSpecificToObjString(specific),
									status: Number(specific?.[0]?.status),
								},
							],
							startTime,
							tpId,
							urlRouter: Number(UrlRouterEnum[urlRouter]),
							bonusCode,
							categoryId,
							gameId,
						},
						after: {
							actionMode: formActionMode,
							bannerName: formBannerName,
							bannerType: formBannerType,
							endTime: formEndTime,
							showStatus: formShowStatus,
							siteId,
							sort: formSort,
							specific: [
								{
									currencyId: Number(formCurrencyId),
									details: detailStr,
									status: Number(specific?.[0]?.status),
								},
							],
							startTime: formStartTime,
							tpId:
								actionMode === ActionModeEnum.GoToLobby
									? formFilterTpId
									: formTpId ?? null,
							urlRouter: formUrlRouter,
							bonusCode: formBonusCode,
							categoryId: formCategoryId,
							gameId: formGameId,
						},
					}
				} else {
					args = {
						siteId,
						currencyId: Number(currencyId),
						before: {},
						after: {
							actionMode: formActionMode,
							bannerName: formBannerName,
							bannerType: formBannerType,
							endTime: formEndTime,
							showStatus: formShowStatus,
							siteId,
							sort: formSort,
							specific: [
								{
									currencyId: Number(formCurrencyId),
									details: detailStr,
									status: 0,
								},
							],
							startTime: formStartTime,
							tpId:
								formActionMode === ActionModeEnum.GoToLobby
									? formFilterTpId
									: formTpId ?? null,
							urlRouter: formUrlRouter,
							bonusCode: formBonusCode,
							categoryId: formCategoryId,
							gameId: formGameId,
						},
					}
				}

				await setBanner(args).unwrap()
				onCancel()
				message.success(t('System.Label_Success'))
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
			if (isEditing) {
				const {
					specific: specificList = [],
					bannerName: bannerNameStr = '',
					bannerName,
				} = editBannerData ?? {}
				if (
					specificList[0].currencyId !== formCurrencyId ||
					bannerName !== formBannerName
				) {
					onDelete(bannerNameStr)
				}
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
				loading={loading || isSetBannerLoading || isGetLanguageListFetching}
				currencyListBySite={currencyListBySite}
				bannerTypeList={bannerTypeList}
				showStatusList={showStatusList}
				bannerActionModeList={bannerActionModeList}
				languageList={languageList}
				siteId={siteId}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTimeZoneChange={onTimeZoneChange}
				onChangeTab={onChangeTab}
			/>
		</Modal>
	)
}

export default BannerModal
