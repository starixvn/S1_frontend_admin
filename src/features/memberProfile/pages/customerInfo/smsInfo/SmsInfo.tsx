import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import {
	useDeletePersonalMsgMutation,
	useLazyGetSmsInfoQuery,
	useSendPersonalMsgMutation,
} from 'features/memberProfile/api'
import {
	IGetSMSInfoData,
	IGetSmsInfoResponse,
} from 'features/memberProfile/type'
import { PAGINATION, useAuth, useModal, usePagination } from 'common/hooks'
import { Form, message, TablePaginationConfig } from 'antd'
import { useEffect, useState } from 'react'
import { SmsInfoTable } from 'features/memberProfile/pages/customerInfo/smsInfo/SmsInfoTable'
import { SmsInfoDetailModal } from 'features/memberProfile/pages/customerInfo/smsInfo/SmsInfoDetailModal'
import { SendMsgModal } from 'features/memberProfile/pages/customerInfo/smsInfo/SendMsgModal'
import { head } from 'lodash'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'

const SmsInfo = () => {
	const { t } = useTranslation()
	const {
		actionPermissions: {
			smsInfoDeletePermission,
			personalMessageEditPermission,
		} = {},
	} = useAuth()
	const { custId } = useParams()
	const { timeZoneUtcOffset } = useTimeZone()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [modalRecord, setModalRecord] = useState<IGetSMSInfoData | undefined>(
		undefined
	)
	const detailModal = useModal()
	const sendMsgModal = useModal()

	const [msgForm] = Form.useForm<{
		title: string
		content: string
	}>()

	const [
		getSmsInfo,
		{
			data: {
				data: smsInfo = [],
				rowCount: smsInfoTotal = 0,
			} = {} as IGetSmsInfoResponse,
			isFetching: isGetSmsInfoLoading,
		},
	] = useLazyGetSmsInfoQuery()

	const [pagination, setPagination] = usePagination({
		paginationTotal: smsInfoTotal,
	})

	const [sendPersonalMsg, { isLoading: isSendPersonalMsgLoading }] =
		useSendPersonalMsgMutation()

	const [deletePersonalMsg, { isLoading: isDeletePersonalMsgLoading }] =
		useDeletePersonalMsgMutation()

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!custId) return
		try {
			await getSmsInfo({
				custId: Number(custId),
				pageNumber: current,
				pageSize,
			}).unwrap()
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const {
			current = PAGINATION.defaultCurrent,
			pageSize = PAGINATION.defaultPageSize,
		} = newPagination
		await handleSearch({
			current,
			pageSize,
		})
	}

	const handleDeleteMsg = async (id: number) => {
		try {
			// 個人頁用不到 isBatch 固定都送 false
			await deletePersonalMsg({ id, isBatch: false }).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleViewClick = (record: IGetSMSInfoData) => {
		setModalRecord(record)
		detailModal.onOpen()
	}

	const handleSendMsg = async () => {
		if (!custId) return
		const { title, content } = await msgForm.validateFields()
		try {
			await sendPersonalMsg({
				siteId,
				custId: Number(custId),
				title,
				content,
			}).unwrap()
			sendMsgModal.onCancel()
			// set timeout 200 ms 使資料在 Modal Close 動畫跑完後才做清除動作
			setTimeout(() => {
				msgForm.resetFields()
			}, 200)
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}
	useEffect(() => {
		if (custId) {
			handleSearch({})
		}
	}, [custId])

	const loading =
		isGetSmsInfoLoading ||
		isSendPersonalMsgLoading ||
		isDeletePersonalMsgLoading

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.CustomerInfo.Label_SMSInfo')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<SmsInfoTable
					smsInfoDeletePermission={smsInfoDeletePermission}
					loading={loading}
					pagination={pagination}
					onTableChange={handleTableChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
					smsInfo={smsInfo}
					onDeleteMsg={handleDeleteMsg}
					onViewClick={handleViewClick}
				/>
			</LayoutContent.Card>
			<SmsInfoDetailModal
				record={modalRecord}
				visible={detailModal.visible}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onCancel={() => {
					detailModal.onCancel()
					setModalRecord(undefined)
				}}
			/>

			<SendMsgModal
				loading={isSendPersonalMsgLoading}
				visible={sendMsgModal.visible}
				onCancel={() => {
					// set timeout 200 ms 使資料在 Modal Close 動畫跑完後才做清除動作
					sendMsgModal.onCancel()
					setTimeout(() => {
						msgForm.resetFields()
					}, 200)
				}}
				onFinish={handleSendMsg}
				form={msgForm}
				langCode={head(smsInfo)?.langId ?? ''}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.Create
					disabled={!personalMessageEditPermission?.canUse}
					onClick={sendMsgModal.onOpen}
				/>
			</AffixButtons>
		</>
	)
}

export default SmsInfo
