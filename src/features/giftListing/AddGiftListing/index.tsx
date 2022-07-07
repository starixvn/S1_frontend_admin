import paths from 'app/constants/paths'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import { LayoutContent } from 'app/pages/layout'
import { RcFile } from 'antd/es/upload'
import { useTranslation } from 'react-i18next'
import { AffixButtons } from 'components/AffixButtons'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { Form, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { IGiftForm } from '../type'
import { useCreateGiftMutation, useUploadGiftImageMutation } from '../api'
import GiftFormTabs from '../components/GiftFormTabs'

const AddGiftListing = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [form] = Form.useForm()
	const { currencyId } = useParams()

	const [uploadGiftImage, { isLoading: isUploadGiftImageLoading }] =
		useUploadGiftImageMutation()

	const [createGift, { isLoading: isCreateGiftLoading }] =
		useCreateGiftMutation()

	const handleCreateGift = async () => {
		if (!siteId || !currencyId) return
		try {
			const {
				fileList: [file],
				infos: originInfos,
				...rest
			} = (await form.validateFields()) as IGiftForm

			// * 上傳商品圖片
			const formData = new FormData()
			formData.append('File', file.originFileObj as RcFile)
			const {
				data: { pictureUrl },
			} = await uploadGiftImage(formData).unwrap()

			// * 新增商品
			const infos = Object.keys(originInfos).map(lang => ({
				lang,
				name: originInfos[lang].name,
				description: originInfos[lang].description,
				pictureUrl,
			}))
			await createGift({
				siteId,
				currencyId: Number(currencyId),
				...rest,
				infos,
			}).unwrap()
			message.success(t('System.Label_LoginSuccess'))
			navigate(
				`/${NEW_SITE_PREFIX_URL}/${paths.rewardProgram.sub.giftManagement.sub.giftListing.root}`
			)
		} catch (error: any) {
			// * 提示各元件錯誤提示
			if (error?.errorFields[0]?.errors[0]) {
				message.error(error.errorFields[0].errors[0])
				return
			}

			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading = isUploadGiftImageLoading || isCreateGiftLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title
				title={`${t('Label_GiftManagement')} > ${t('Label_AddGift')}`}
			/>
			<LayoutContent.Card>
				<GiftFormTabs form={form} currencyId={Number(currencyId)} />
			</LayoutContent.Card>
			<AffixButtons>
				<AffixButtons.Saved loading={loading} onClick={handleCreateGift} />
				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default AddGiftListing
