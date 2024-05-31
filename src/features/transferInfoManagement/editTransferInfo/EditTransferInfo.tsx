import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import {
	TransactionTypeEnum,
	TransferChannelEnum,
	TransferInfoMethodEnum,
} from 'features/transferInfoManagement/constants'
import { Form, message } from 'antd'
import { AffixButtons } from 'components/AffixButtons'
import { EditTransferInfoHeadForm } from 'features/transferInfoManagement/editTransferInfo/EditTransferInfoHeadForm'
import {
	IGetBankInfoResponse,
	IGetReasonListResponse,
	IGetTransactionTypeResponse,
	IGetTransferAccountListResponse,
	IGetTransferTypeResponse,
} from 'features/transferInfoManagement/type'
import {
	useGetBankCodeInfoQuery,
	useGetTransactionTypeListQuery,
	useGetTransferAccountListQuery,
	useGetTransferReasonListQuery,
	useGetTransferTypeListQuery,
	useLazyGetByTransferIdQuery,
	useSetBankTransferMutation,
} from 'features/transferInfoManagement/api'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import { EditTransferInfoBody } from 'features/transferInfoManagement/editTransferInfo/EditTransferInfoBody'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { IEnumTypeResponse, useGetEnumTypeQuery } from 'common/service/enumApi'
import { useTimeZone } from 'components/TimeZoneSelect'
import { RcFile } from 'antd/es/upload/interface'
import { utcFormatter } from 'common/utils'

const EditTransferInfo = () => {
	const { t } = useTranslation()
	const { transferId } = useParams()
	const isEditing = transferId !== TransferInfoMethodEnum.Create
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const pageTitle = isEditing
		? t('Label_TransferInfo')
		: `${t('Label_Create')} ${t('Label_TransferInfo')}`
	const { timeZoneUtcOffset } = useTimeZone()
	const [form] = Form.useForm()
	const navigate = useNavigate()

	const [getByTransferId, { isFetching: isGetTransferDataLoading }] =
		useLazyGetByTransferIdQuery()

	const {
		data: { data: transferChannelList = [] } = {} as IEnumTypeResponse,
		isLoading: isGetTransferChannelLoading,
	} = useGetEnumTypeQuery({ enumName: 'TransferChannelEnum' })

	const {
		data: { data: reasonList = [] } = {} as IGetReasonListResponse,
		isLoading: isGetReasonListLoading,
	} = useGetTransferReasonListQuery(null)

	const {
		data: { data: transferTypeList = [] } = {} as IGetTransferTypeResponse,
		isLoading: isTransferTypeLoading,
	} = useGetTransferTypeListQuery(null)

	const {
		data: { data: accountList = [] } = {} as IGetTransferAccountListResponse,
		isLoading: isGetTransferAccountListLoading,
	} = useGetTransferAccountListQuery({ siteId })

	const { data: { data: bankCodeInfo = [] } = {} as IGetBankInfoResponse } =
		useGetBankCodeInfoQuery(null)

	const {
		data: {
			data: transactionTypeList = [],
		} = {} as IGetTransactionTypeResponse,
		isLoading: isGetTransactionLoading,
	} = useGetTransactionTypeListQuery(null)

	const [setBankTransfer, { isLoading: isSetBankTransferLoading }] =
		useSetBankTransferMutation()

	const handleGetTransferData = async () => {
		if (!transferId) return
		try {
			const { data: transferData } = await getByTransferId({
				transferId,
			}).unwrap()

			const { transDate, ...restValue } = transferData

			form.setFieldsValue({
				transDate: dayjs(transDate),
				...restValue,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSaved = async () => {
		if (!siteId || !transferId) return
		const editData = await form.validateFields()
		const {
			transferType,
			transactionType,
			transDate,
			reason,
			remark,
			fromChannel,
			// channel 選 PSP 或 CryptoWallet 時帶default 值 0
			fromSysId = 0,
			fromCurrencyId,
			fromAccountDisplayName = '',
			fromAccountNo,
			fromAmount,
			fromFee = 0,
			toChannel,
			// channel 選 PSP 或 CryptoWallet 時帶default 值 0
			toSysId = 0,
			toCurrencyId,
			toAccountDisplayName = '',
			toAccountNo,
			toAmount,
			toFee = 0,
		} = editData

		// 因為這些參數不會出現在畫面上 , 故使用全取把資料取出
		const { fromAgent, fromPayId, toAgent, toPayId } = form.getFieldsValue(true)

		const { fileList } = form.getFieldsValue(true)

		const formData = new FormData()
		// 假如 fileList 有 url 代表是編輯時帶入的已存在資源 , 則不做新增 , 沒有才做
		if (fileList.length !== 0 && !fileList[0].url) {
			formData.append('UploadReceipt', fileList[0] as RcFile)
		}
		formData.append('SiteId', siteId.toString())
		formData.append('TransferType', transferType)
		formData.append('Reason', reason)
		formData.append('TransactionType', transactionType)
		formData.append('Remark', remark ?? '')
		formData.append(
			'TransDate',
			utcFormatter({ date: transDate, utcOffset: timeZoneUtcOffset })
		)
		// 如果是編輯模式 填入 transferId
		formData.append('TransferId', isEditing ? transferId : '')

		// 僅有特定行為會有 payId or Agent 的選填 , 故若有值才送出
		if (fromChannel) {
			if (fromChannel === TransferChannelEnum.PSP) {
				formData.append('FromPayId', fromPayId)
			} else {
				formData.append('FromAgent', fromAgent)
			}
		}

		if (toChannel) {
			if (toChannel === TransferChannelEnum.PSP) {
				formData.append('ToPayId', toPayId)
			} else {
				formData.append('ToAgent', toAgent)
			}
		}

		// Minus 只有 From Data
		if (transactionType === TransactionTypeEnum.Minus) {
			formData.append('FromChannel', fromChannel)
			formData.append('FromCurrencyId', fromCurrencyId)
			formData.append('FromAccountDisplayName', fromAccountDisplayName)
			formData.append('FromAccountNo', fromAccountNo ?? '')
			formData.append('FromFee', fromFee)
			formData.append('FromAmount', fromAmount)
			formData.append('FromSysId', fromSysId)
		}
		// Plus 只有 To Data
		if (transactionType === TransactionTypeEnum.Plus) {
			formData.append('ToChannel', toChannel)
			formData.append('ToCurrencyId', toCurrencyId)
			formData.append('ToAccountDisplayName', toAccountDisplayName)
			formData.append('ToAccountNo', toAccountNo ?? '')
			formData.append('ToAmount', toAmount)
			formData.append('ToFee', toFee)
			formData.append('ToSysId', toSysId)
		}
		// FromTo 兩者都有
		if (transactionType === TransactionTypeEnum.FromTo) {
			formData.append('FromChannel', fromChannel)
			formData.append('FromCurrencyId', fromCurrencyId)
			formData.append('FromAccountDisplayName', fromAccountDisplayName)
			formData.append('FromAccountNo', fromAccountNo ?? '')
			formData.append('FromFee', fromFee)
			formData.append('FromAmount', fromAmount)
			formData.append('FromSysId', fromSysId)
			formData.append('ToChannel', toChannel)
			formData.append('ToSysId', toSysId)
			formData.append('ToCurrencyId', toCurrencyId)
			formData.append('ToAccountDisplayName', toAccountDisplayName)
			formData.append('ToAccountNo', toAccountNo ?? '')
			formData.append('ToAmount', toAmount)
			formData.append('ToFee', toFee)
		}
		try {
			await setBankTransfer(formData).unwrap()
			message.success(t('System.Label_Success'))
			// 成功後回到前頁
			navigate(-1)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (isEditing) {
			handleGetTransferData()
		}
	}, [transferId])

	const loading =
		isTransferTypeLoading ||
		isGetReasonListLoading ||
		isGetTransferDataLoading ||
		isGetTransactionLoading ||
		isGetTransferChannelLoading ||
		isGetTransferAccountListLoading ||
		isSetBankTransferLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<EditTransferInfoHeadForm
				loading={loading}
				form={form}
				reasonList={reasonList}
				transferTypeList={transferTypeList}
				transactionTypeList={transactionTypeList}
			/>
			<EditTransferInfoBody
				loading={loading}
				form={form}
				currencyListBySite={currencyListBySite}
				transferChannelList={transferChannelList}
				accountList={accountList}
				isEditing={isEditing}
				timeZoneUtcOffset={timeZoneUtcOffset}
				bankCodeList={bankCodeInfo}
			/>
			<AffixButtons>
				<AffixButtons.GoBackRoute />
				<AffixButtons.Saved onClick={handleSaved} />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default EditTransferInfo
