import { find, head, trim } from 'lodash'
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
	useEditSlotGameMutation,
	useGetSlotCategoryListQuery,
	useGetSlotGamesTpListQuery,
	useLazyGetSlotGameByIdQuery,
	useSetNewSlotGameMutation,
	useUpdateSlotGameImageMutation,
} from 'features/slotGameCategory/api'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'

import { SlotGameForm } from './SlotGameForm'
import { SlotImageForm } from './SlotImageForm'

const { confirm } = Modal

const EditSlotGame = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { id: slotIdFromParams } = useParams()
	const { siteId = 0 } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const [slotGameForm] = Form.useForm<ISlotGameForm>()
	const navigate = useNavigate()

	// 有帶 id params 代表為編輯模式
	const isEditMode = slotIdFromParams !== undefined

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
	} = useGetSlotCategoryListQuery(null, {
		// 編輯模式顯示不到，skip
		skip: isEditMode,
	})

	const [getSlotGameById, { isLoading: isGetSlotGameByIdLoading }] =
		useLazyGetSlotGameByIdQuery()

	// 設定新的 slotGame
	const [setNewSlotGame, { isLoading: isSetNewSlotGameLoading }] =
		useSetNewSlotGameMutation()

	// 編輯已存在的 slotGame
	const [editSlotGame, { isLoading: isEditSlotGameLoading }] =
		useEditSlotGameMutation()

	const [updateSlotGameImage] = useUpdateSlotGameImageMutation()

	// 新增 slotGame
	const handleSetNewSlotGame = async () => {
		const {
			fun,
			reel = '',
			rtp = 0,
			payline = '',
			gameId,
			...restValue
		} = await slotGameForm.validateFields()
		try {
			await setNewSlotGame({
				fun: fun ? 1 : 2,
				reel,
				rtp,
				payline,
				gameId: trim(gameId),
				...restValue,
			}).unwrap()
			setUpdatedStep1(true)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// 編輯已存在的 slotGame
	const handleEditSlotGame = async () => {
		const {
			fun,
			reel = '',
			rtp = 0,
			payline = '',
			gameId,
			// 這個值在這裡取不到
			rawSlotData: _,
			...restValue
		} = await slotGameForm.validateFields()
		// 因為 rawSlotData 不存在於 dom 上面，所以需要使用這種方式取，validateFields 只會讀到 mount 在畫面上的值。
		const { rawSlotData } = slotGameForm.getFieldsValue(true)
		const result = {
			fun: fun ? 1 : 2,
			reel,
			rtp,
			payline,
			gameId: trim(gameId),
			...restValue,
		}

		try {
			await editSlotGame({
				id: Number(slotIdFromParams),
				before: rawSlotData,
				after: result,
			}).unwrap()
			confirm({
				title: t('Label_Confirm'),
				icon: <ExclamationCircleOutlined />,
				content: t('Label_EditSlotFunctionConfirm'),
				onOk: () => setUpdatedStep1(true),
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
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
		// 初始化 tpId 下拉首選項，異步資料無法使用 form.initialValues 寫入
		if (!isGetTpListLoading) {
			slotGameForm.setFieldsValue({
				tpId: head(tpList)?.tpId,
			})
		}
	}, [isGetTpListLoading])

	useEffect(() => {
		const init = async () => {
			try {
				const {
					data: { fun, id, ...restValue },
				} = await getSlotGameById({
					id: Number(slotIdFromParams),
				}).unwrap()
				slotGameForm.setFieldsValue({
					fun: Boolean(fun),
					// slotGameData 原始資料，編輯送出時需要帶回去給後端紀錄 log
					rawSlotData: { fun, ...restValue },
					...restValue,
				})
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}
		if (isEditMode) {
			init()
		}
	}, [isEditMode])

	const loading =
		isGetSlotCategoryListLoading ||
		isGetTpListLoading ||
		isSetNewSlotGameLoading ||
		isGetSlotGameByIdLoading ||
		isEditSlotGameLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title
				title={`${pageTitle} > ${
					isEditMode
						? `${t('Label_Edit')} : ${slotIdFromParams}`
						: t('Label_AddNewSlotGame')
				}`}
			/>
			<SlotGameForm
				loading={loading}
				form={slotGameForm}
				isEditMode={isEditMode}
				tpList={tpList}
				updated={updatedStep1}
				currencyListBySite={currencyListBySite}
				slotCategoryList={slotCategoryList}
				editPermission={editPermission}
				onSetNewSlotGame={() => {
					if (isEditMode) {
						// 更新
						handleEditSlotGame()
					} else {
						// 新增
						handleSetNewSlotGame()
					}
				}}
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

export default EditSlotGame
