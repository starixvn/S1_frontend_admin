import paths from 'app/constants/paths'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { useEffect } from 'react'
import { Form, FormInstance, message } from 'antd'
import { RcFile } from 'antd/es/upload'
import { LayoutContent } from 'app/pages/layout'
import { assign } from 'lodash'
import { AffixButtons } from 'components/AffixButtons'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'common/hooks'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
	useGetGiftInfoQuery,
	useUpdateGiftMutation,
	useUploadGiftImageMutation,
} from '../api'
import { IEditGiftForm } from '../type'
import GiftFormTabs from '../components/GiftFormTabs'

const backPath = `/${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.giftManagement.sub.giftListing.root}`

const EditGiftListing = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const { editGiftId, currencyId } = useParams()

	const [form]: [FormInstance<IEditGiftForm>] = Form.useForm()

	const { data: { data: giftInfo } = {}, isFetching: isGetGiftInfoFetching } =
		useGetGiftInfoQuery({
			giftId: Number(editGiftId),
		})

	const { pictureUrl, status } = giftInfo ?? {}

	const [uploadGiftImage, { isLoading: isUploadGiftImageLoading }] =
		useUploadGiftImageMutation()

	const [updateGift, { isLoading: isUpdateGiftLoading }] =
		useUpdateGiftMutation()

	const handleUpdateGift = async () => {
		try {
			const {
				fileList: [file],
				infos: originInfos,
				stock,
				...values
			} = await form.validateFields()

			// * 這邊需要使用 `assign`的原因是
			// * Tabs 只會回傳 mounted 的 `Form.Item` 的語系，編輯 Infos 需要上傳所有語系的資料
			const newInfos = assign({ ...giftInfo?.infos }, originInfos)

			// * 上傳商品圖片
			let newPictureUrl: string
			if (file) {
				const formData = new FormData()
				formData.append('File', file.originFileObj as RcFile)
				const { data } = await uploadGiftImage(formData).unwrap()
				newPictureUrl = data.pictureUrl
			}

			// * 修改商品
			const infos = Object.keys(newInfos).map(lang => ({
				lang,
				name: newInfos[lang].name,
				description: newInfos[lang].description,
				pictureUrl: newPictureUrl ?? pictureUrl,
			}))

			await updateGift({
				...values,
				infos,
				status: Boolean(status),
				giftId: Number(editGiftId),
				stock: stock || undefined,
			}).unwrap()
			message.success(t('System.Label_LoginSuccess'))
			navigate(-1)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (!isGetGiftInfoFetching && giftInfo) {
			form.setFieldsValue(giftInfo)
		}
	}, [isGetGiftInfoFetching])

	const loading = isUpdateGiftLoading || isUploadGiftImageLoading

	if (!editPermission?.canUse) return <Navigate to='/403' />

	return (
		<LayoutContent.Main>
			<LayoutContent.Title
				title={`${t('Label_GiftManagement')} > ${t('Label_Edit')}`}
			/>
			<LayoutContent.Card>
				<GiftFormTabs
					form={form}
					currencyId={Number(currencyId)}
					pictureUrl={pictureUrl}
				/>
			</LayoutContent.Card>
			<AffixButtons>
				<AffixButtons.Saved loading={loading} onClick={handleUpdateGift} />
				<AffixButtons.GoBackRoute onClick={() => navigate(backPath)} />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default EditGiftListing
