import { FC, useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { isEqual } from 'lodash'
import { Form, message } from 'antd'
import { useAuth } from 'common/hooks'
import { useAppSelector } from 'app/store'
import { useTranslation } from 'react-i18next'
import { selectUserSite } from 'common/enum'
import RedemptionLimitForm from './RedemptionLimitForm'
import {
	useGetRedemptionLimitQuery,
	useSetRedemptionLimitMutation,
} from './api'
import { IGetRedemptionLimitResponse } from './type'

const RedemptionLimit: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [form] = Form.useForm()
	const [componentDisabled, setComponentDisabled] = useState<boolean>(true)
	const toggleDisabled = () => setComponentDisabled(prev => !prev)
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [formLoaded, setFormLoaded] = useState(false)
	const {
		data: { data: redemptionLimitSetting } = {} as IGetRedemptionLimitResponse,
		isFetching: isGetRedemptionLimitSettingFetching,
	} = useGetRedemptionLimitQuery({
		siteId,
	})

	const [setRedemptionLimit, { isLoading: isSetRedemptionLimitLoading }] =
		useSetRedemptionLimitMutation()

	const handleSetRedemptionLimitSetting = async () => {
		const isValidate = await form.validateFields()
		if (!isValidate) {
			return
		}
		const { limit, status }: { limit: number; status: number } =
			form.getFieldsValue()
		const isFormEqual = isEqual(
			{ limit, status },
			{
				days: redemptionLimitSetting?.limit,
				status: Boolean(redemptionLimitSetting?.status),
			}
		)
		try {
			if (!isFormEqual) {
				await setRedemptionLimit({
					siteId,
					limit: limit >= 0 ? limit : 0,
					status,
				}).unwrap()
			}

			toggleDisabled()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (isGetRedemptionLimitSettingFetching === false) {
			const { limit, status } = redemptionLimitSetting ?? {}
			form.setFieldsValue({
				limit,
				status: Boolean(status),
			})
			setFormLoaded(true)
		}
	}, [isGetRedemptionLimitSettingFetching])

	const loading =
		isGetRedemptionLimitSettingFetching || isSetRedemptionLimitLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			{formLoaded && (
				<RedemptionLimitForm
					form={form}
					componentDisabled={componentDisabled}
					onSetRedemptionLimitSetting={handleSetRedemptionLimitSetting}
				/>
			)}
			<AffixButtons>
				{componentDisabled ? (
					<AffixButtons.Edit
						disabled={!editPermission?.canUse}
						loading={loading}
						onClick={toggleDisabled}
					/>
				) : (
					<AffixButtons.Saved
						loading={loading}
						onClick={handleSetRedemptionLimitSetting}
					/>
				)}
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default RedemptionLimit
