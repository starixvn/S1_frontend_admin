import { FC, useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { assign, mapKeys } from 'lodash'
import { Form, message, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'common/hooks'
import { AffixButtons } from 'components/AffixButtons'
import {
	useGetWorldCupPredictionSettingQuery,
	useSetWorldCupPredictionSettingMutation,
} from './api'
import WorldCupSettingTable from './WorldCupSettingTable'
import { ISortedWorldCupTeamResponse, ISetWorldCupPredictionInfo } from './type'
import WorldCupSettingImage from './WorldCupSettingImage'

const WorldCupSetting: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [form] = Form.useForm()
	const {
		data: { data: sortedWorldCupTeam } = {} as ISortedWorldCupTeamResponse,
		isFetching: isGetWorldCupPredictionSettingFetching,
	} = useGetWorldCupPredictionSettingQuery(null)

	const [imageVisible, setImageVisible] = useState<boolean>(false)

	const [
		setWorldCupPredictionSetting,
		{ isLoading: isSetWorldCupPredictionSettingLoading },
	] = useSetWorldCupPredictionSettingMutation()

	const handleWorldCupPredictionSetting = async () => {
		try {
			// * 格式化成 setting 需要的格式
			const settingForm: any = {
				top32Team: [],
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
						const predictionInfo: ISetWorldCupPredictionInfo = assign(value, {
							sort: Number(sort),
						})

						settingForm[key] = [...settingForm[key], predictionInfo]
					}
				})
			})

			await setWorldCupPredictionSetting({
				data: settingForm,
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const { selectOptions = [], sortedWorldCupTeamData = [] } =
		sortedWorldCupTeam ?? {}

	useEffect(() => {
		if (isGetWorldCupPredictionSettingFetching) return

		// * 初始化 Form 表單
		const formValues = sortedWorldCupTeamData.reduce((acc, cur) => {
			const newAcc: any = { ...acc }

			newAcc[cur.sort] = cur
			return { ...newAcc }
		}, {})

		form.setFieldsValue(formValues)
	}, [isGetWorldCupPredictionSettingFetching])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<Row justify='end'>
				<WorldCupSettingImage
					imageVisible={imageVisible}
					setImageVisible={setImageVisible}
				/>
			</Row>

			<LayoutContent.Card>
				<WorldCupSettingTable
					form={form}
					loading={isGetWorldCupPredictionSettingFetching}
					selectOptions={selectOptions}
					sortedWorldCupTeamData={sortedWorldCupTeamData}
				/>
			</LayoutContent.Card>

			<AffixButtons>
				<AffixButtons.BackToTop />

				<AffixButtons.Saved
					disabled={!editPermission?.canUse}
					loading={isSetWorldCupPredictionSettingLoading}
					onClick={handleWorldCupPredictionSetting}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default WorldCupSetting
