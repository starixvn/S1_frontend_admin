import { find, head } from 'lodash'
import { CurrencyEnum } from 'type'
import { useAuth } from 'common/hooks'
import { Form, message, Modal } from 'antd'
import { useAppSelector } from 'app/store'
import { useEffect, useState } from 'react'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import {
	IGetSlotCategoryListResponse,
	IGetTpListResponse,
	ISlotGameForm,
} from 'features/slotGameCategory/type'
import {
	useGetSlotCategoryListQuery,
	useGetSlotGamesTpListQuery,
	useSetNewSlotGameMutation,
	useUpdateSlotGameImageMutation,
} from 'features/slotGameCategory/api'
import { SlotGameForm } from 'features/slotGameCategory/addSlotGame/SlotGameForm'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { SlotImageForm } from 'features/slotGameCategory/addSlotGame/SlotImageForm'
import { useNavigate } from 'react-router-dom'

const { confirm } = Modal
const AddSlotGame = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId = 0 } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [slotGameForm] = Form.useForm<ISlotGameForm>()
	const navigate = useNavigate()

	// 用來控制是否顯示 Step2 的上傳介面與 disable 階段 1 資料
	const [updatedStep1, setUpdatedStep1] = useState(false)

	const {
		data: { data: tpList } = {} as IGetTpListResponse,
		isLoading: isGetTpListLoading,
	} = useGetSlotGamesTpListQuery({
		siteIds: [siteId],
		currencyId: CurrencyEnum.All,
	})

	const {
		data: { data: slotCategoryList = [] } = {} as IGetSlotCategoryListResponse,
		isLoading: isGetSlotCategoryListLoading,
	} = useGetSlotCategoryListQuery(null)

	const [setNewSlotGame, { isLoading: isSetNewSlotGameLoading }] =
		useSetNewSlotGameMutation()

	const [updateSlotGameImage] = useUpdateSlotGameImageMutation()

	const handleSetNewSlotGame = async () => {
		const { fun, ...restValue } = await slotGameForm.validateFields()
		confirm({
			title: t('Label_Confirm'),
			icon: <ExclamationCircleOutlined />,
			content: t('Label_AddSlotFunctionConfirm'),
			onOk: async () => {
				try {
					await setNewSlotGame({
						fun: fun ? 1 : 0,
						...restValue,
					}).unwrap()
					setUpdatedStep1(true)
				} catch (error) {
					message.error(
						(error as Error)?.message ||
							t('System.Label_NotExpectedServerError')
					)
				}
			},
		})
	}

	const handleUploadSlotGameImage = async ({
		file,
		lang,
	}: {
		file: Blob
		lang: 'en' | 'cs'
	}) => {
		const { tpId: formId, enName } = slotGameForm.getFieldsValue()
		const tpName = find(tpList, ({ tpId }) => tpId === formId)?.tpName
		let imageUrl = ''
		const formData = new FormData()

		formData.append('ReturnFullPath', 'true')
		formData.append('SiteId', siteId.toString())
		formData.append('Size', '300')
		formData.append('Lang', lang)
		formData.append('TpName', tpName ?? '')
		formData.append('ENname', enName)
		formData.append('File', file)

		try {
			const {
				data: { returnImagePath },
			} = await updateSlotGameImage(formData).unwrap()
			imageUrl = returnImagePath
			message.success(t('Label_ImageUploaded'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
		return imageUrl
	}

	useEffect(() => {
		if (!isGetTpListLoading) {
			slotGameForm.setFieldsValue({
				tpId: head(tpList)?.tpId,
			})
		}
	}, [isGetTpListLoading])

	const loading =
		isGetSlotCategoryListLoading ||
		isGetTpListLoading ||
		isSetNewSlotGameLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title
				title={`${pageTitle} > ${t('Label_AddNewSlotGame')}`}
			/>
			<SlotGameForm
				loading={loading}
				form={slotGameForm}
				tpList={tpList}
				updated={updatedStep1}
				currencyListBySite={currencyListBySite}
				slotCategoryList={slotCategoryList}
				editPermission={editPermission}
				onSetNewSlotGame={handleSetNewSlotGame}
			/>
			{updatedStep1 && (
				<SlotImageForm onUploadImage={handleUploadSlotGameImage} />
			)}
			<AffixButtons>
				<AffixButtons.GoBackRoute
					onClick={() => {
						confirm({
							title: t('Label_Confirm'),
							icon: <ExclamationCircleOutlined />,
							content: t('Label_LeavingSlotFunctionConfirm'),
							onOk: () => navigate(-1),
						})
					}}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default AddSlotGame
