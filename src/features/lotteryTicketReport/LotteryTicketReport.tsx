import { FC, useEffect } from 'react'
import { Form, message } from 'antd'
import { isEmpty } from 'lodash'
import dayjs from 'dayjs'
import { AffixButtons } from 'components/AffixButtons'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import download from 'downloadjs'
import { useQueryParams, useAuth } from 'common/hooks'
import { LotteryTicketReportFilter } from './LotteryTicketReportFilter'
import { LotteryTicketReportTable } from './LotteryTicketReportTable'
import {
	useLazyGetCustLotteryTicketQuery,
	useExportCustLotteryTicketMutation,
} from './api'
import type { TCustLotteryTicketResponse, TFilterForm } from './type'

const LotteryTicketReport: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	/**  ======= api ======= */

	const [
		getCustLotteryTicket,
		{
			data: {
				data: custLotteryTicketsData = [],
			} = {} as TCustLotteryTicketResponse,
			isLoading: isLotteryTicketReportLoading,
		},
	] = useLazyGetCustLotteryTicketQuery()

	/** 匯出 StickerReport api */
	const [
		exportCustLotteryTicket,
		{ isLoading: isExportCustLotteryTicketLoading },
	] = useExportCustLotteryTicketMutation()

	/**  ======= hook ======= */

	const { t } = useTranslation()
	const [form] = Form.useForm<TFilterForm>()
	const { actionPermissions: { exportExcelPermission } = {} } = useAuth()
	const [queryParams, setQueryParams] = useQueryParams()

	/**  ======= 函數 ======= */

	const handleSearch = async () => {
		const { siteId, currencyIds, roundId, userName, ticketNo } =
			form.getFieldsValue()

		const args = {
			siteId,
			currencyIds,
			roundId,
			userName: userName || null,
			ticketNo: ticketNo || null,
		}

		try {
			await getCustLotteryTicket(args)
			setQueryParams(args)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleExport = async () => {
		const {
			siteId = 0,
			currencyIds = [],
			roundId = 0,
			userName = null,
			ticketNo = null,
		} = queryParams
		try {
			const blob = await exportCustLotteryTicket({
				siteId: Number(siteId),
				currencyIds: currencyIds.map((id: string) => Number(id)),
				roundId: Number(roundId),
				userName,
				ticketNo,
			}).unwrap()

			download(
				blob,
				`ExportLotteryTicketReport${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
			)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	/**  ======= useEffect ======= */

	useEffect(() => {
		const init = async () => {
			if (isEmpty(queryParams)) return
			const { siteId, currencyIds, roundId, userName, ticketNo } = queryParams

			form.setFieldsValue({
				siteId: Number(siteId),
				currencyIds: currencyIds.map((id: string) => Number(id)),
				roundId: Number(roundId),
				userName,
				ticketNo,
			})
			handleSearch()
		}
		init()
	}, [])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<LotteryTicketReportFilter
				form={form}
				loading={isLotteryTicketReportLoading}
				onSearch={handleSearch}
			/>
			{!isEmpty(queryParams) && (
				<LotteryTicketReportTable
					loading={isLotteryTicketReportLoading}
					custLotteryTicketData={custLotteryTicketsData}
				/>
			)}

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.FileExport
					disabled={!exportExcelPermission?.canUse || isEmpty(queryParams)}
					onClick={handleExport}
					loading={isExportCustLotteryTicketLoading}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default LotteryTicketReport
