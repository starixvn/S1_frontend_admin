import { FC, useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { assign, mapKeys } from 'lodash'
import { Form, message, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'common/hooks'
import { AffixButtons } from 'components/AffixButtons'
import CupEventSettingImage from 'features/cupEventSetting/CupEventSettingImage'
import CupEventSettingTable from 'features/cupEventSetting/CupEventSettingTable'
import {
	useGetCupEventPredictionSettingQuery,
	useSetCupEventPredictionSettingMutation,
} from './api'
import { ISortedCupEventTeamResponse, ISetCupEventPredictionInfo } from './type'

const CupEventSetting: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [form] = Form.useForm()
	const {
		data: { data: sortedCupEventTeam } = {} as ISortedCupEventTeamResponse,
		isFetching: isGetCupEventPredictionSettingFetching,
	} = useGetCupEventPredictionSettingQuery(null)

	const [imageVisible, setImageVisible] = useState<boolean>(false)

	const [
		setCupEventPredictionSetting,
		{ isLoading: isSetCupEventPredictionSettingLoading },
	] = useSetCupEventPredictionSettingMutation()

	const handleCupEventPredictionSetting = async () => {
		try {
			// * 格式化成 setting 需要的格式
			const settingForm: any = {
				top24Team: [],
				roundOf16: [],
				quarterFinals: [],
				semiFinals: [],
				'3rdPlace': [],
				final: [],
			}
			const formValues = await form.getFieldsValue()
			Object.keys(formValues).forEach(sort => {
				mapKeys(formValues[sort], (value, key) => {
					if (value?.countryId) {
						const predictionInfo: ISetCupEventPredictionInfo = assign(value, {
							sort: Number(sort),
						})
						settingForm[key] = [...settingForm[key], predictionInfo]
					}
				})
			})
			await setCupEventPredictionSetting({
				data: settingForm,
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const { selectOptions = [], sortedCupEventTeamData = [] } =
		sortedCupEventTeam ?? {}

	useEffect(() => {
		if (isGetCupEventPredictionSettingFetching) return

		// * 初始化 Form 表單
		const formValues = sortedCupEventTeamData.reduce((acc, cur) => {
			const newAcc: any = { ...acc }

			newAcc[cur.sort] = cur
			return { ...newAcc }
		}, {})

		form.setFieldsValue(formValues)
	}, [isGetCupEventPredictionSettingFetching])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<Row justify='end'>
				<CupEventSettingImage
					imageVisible={imageVisible}
					setImageVisible={setImageVisible}
				/>
			</Row>

			<LayoutContent.Card>
				<CupEventSettingTable
					form={form}
					loading={isGetCupEventPredictionSettingFetching}
					selectOptions={selectOptions}
					sortedCupEventTeamData={sortedCupEventTeamData}
				/>
			</LayoutContent.Card>

			<AffixButtons>
				<AffixButtons.BackToTop />

				<AffixButtons.Saved
					disabled={!editPermission?.canUse}
					loading={isSetCupEventPredictionSettingLoading}
					onClick={handleCupEventPredictionSetting}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default CupEventSetting
