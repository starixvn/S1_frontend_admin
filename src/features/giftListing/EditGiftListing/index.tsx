import { useEffect } from 'react'
import { Form, FormInstance, message } from 'antd'
import { RcFile } from 'antd/es/upload'
import { LayoutContent } from 'app/pages/layout'
import { cloneDeep, find } from 'lodash'
import { AffixButtons } from 'components/AffixButtons'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'common/hooks'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
	useGetGiftInfoQuery,
	useUpdateGiftMutation,
	useUploadGiftImageMutation,
} from '../api'
import { GiftTypeEnum, IEditGiftForm } from '../type'
import GiftFormTabs from '../components/GiftFormTabs'

const EditGiftListing = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const { editGiftId, currencyId } = useParams()

	const [form]: [FormInstance<IEditGiftForm>] = Form.useForm()

	const { data: { data: giftInfo } = {}, isFetching: isGetGiftInfoFetching } =
		useGetGiftInfoQuery(
			{
				giftId: Number(editGiftId),
			},
			{
				selectFromResult: ({ data: { data } = {}, isFetching }) => {
					const cloneData = cloneDeep(data)
					if (cloneData && cloneData.giftType === GiftTypeEnum.Common) {
						cloneData.giftType = undefined
					}
					return { data: { data: cloneData }, isFetching }
				},
			}
		)

	const { status, infos = {} } = giftInfo ?? {}

	const [uploadGiftImage, { isLoading: isUploadGiftImageLoading }] =
		useUploadGiftImageMutation()

	const [updateGift, { isLoading: isUpdateGiftLoading }] =
		useUpdateGiftMutation()

	const handleUpdateGift = async () => {
		try {
			const {
				infos: originInfos,
				stock,

				...values
			} = await form.validateFields()
			const pictureUrls = await Promise.all(
				Object.keys(originInfos).map(async lang => {
					const { fileList } = originInfos[lang]
					const originPictureUrl = infos[lang]?.pictureUrl ?? ''
					if (fileList) {
						const formData = new FormData()
						formData.append('File', fileList[0].originFileObj as RcFile)
						const {
							data: { pictureUrl: newPictureUrl },
						} = await uploadGiftImage(formData).unwrap()

						return { lang, pictureUrl: newPictureUrl }
					}

					return { lang, pictureUrl: originPictureUrl }
				})
			)

			// * 修改商品
			const newInfos = Object.keys(originInfos).map(lang => ({
				lang,
				name: originInfos[lang].name,
				description: originInfos[lang].description,
				pictureUrl: find(pictureUrls, { lang })?.pictureUrl ?? '',
			}))

			await updateGift({
				...values,
				infos: newInfos,
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
					infos={giftInfo?.infos ?? {}}
					currencyId={Number(currencyId)}
				/>
			</LayoutContent.Card>
			<AffixButtons>
				<AffixButtons.Saved loading={loading} onClick={handleUpdateGift} />
				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default EditGiftListing
