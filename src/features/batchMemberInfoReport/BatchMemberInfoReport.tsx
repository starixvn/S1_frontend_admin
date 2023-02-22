import { useTranslation } from 'react-i18next'
import { selectUserSite } from 'common/enum'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { useAuth, useModal } from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import { AffixButtons } from 'components/AffixButtons'
import { message, Form } from 'antd'
import { RcFile, UploadFile } from 'antd/es/upload/interface'
import {
	IBatchMemberInfoReportResponse,
	IForm,
} from 'features/batchMemberInfoReport/type'
import {
	useGetBatchMemberInfoReportListQuery,
	useImportBatchMemberInfoReportMutation,
} from 'features/batchMemberInfoReport/api'
import BatchMemberInfoReportTable from 'features/batchMemberInfoReport/BatchMemberInfoReportTable'
import BatchMemberInfoReportModal from 'features/batchMemberInfoReport/BatchMemberInfoReportModal'

const BatchMemberInfoReport = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { timeZoneUtcOffset } = useTimeZone()
	const { actionPermissions: { addBatchPermission } = {} } = useAuth()
	const [form] = Form.useForm<IForm>()
	const batchMemberInfoReportModal = useModal()

	const {
		data: {
			data: batchMemberInfoReportList = [],
		} = {} as IBatchMemberInfoReportResponse,
		isFetching: isBatchMemberInfoReportFetching,
	} = useGetBatchMemberInfoReportListQuery(
		{ siteId },
		{ skip: !siteId, pollingInterval: 180000 }
	)

	const [
		importBatchMemberInfoReport,
		{ isLoading: importBatchMemberInfoReportLoading },
	] = useImportBatchMemberInfoReportMutation()

	const handleBatchMemberInfoReportFinished = async (file: UploadFile[]) => {
		if (!siteId) return
		const { memo, fileList } = await form.validateFields()
		// 因為 fileList 沒有渲染在畫面上 所以用 message.error show error

		if (!fileList) {
			message.error(t('Label_Required', { key: t('Label_File') }))
		} else {
			const formData = new FormData()
			formData.append('SiteId', siteId.toString())
			formData.append('File', file[0] as RcFile)
			formData.append('Memo', memo)
			try {
				await importBatchMemberInfoReport(formData).unwrap()
				batchMemberInfoReportModal.onCancel()
				message.success(t('System.Label_Success'))
			} catch (error) {
				message.error(
					(error as Error)?.message || t('System.Label_NotExpectedServerError')
				)
			}
		}
	}

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<BatchMemberInfoReportTable
				loading={isBatchMemberInfoReportFetching}
				timeZoneUtcOffset={timeZoneUtcOffset}
				batchMemberInfoReportList={batchMemberInfoReportList}
			/>

			<BatchMemberInfoReportModal
				form={form}
				loading={importBatchMemberInfoReportLoading}
				visible={batchMemberInfoReportModal.visible}
				onFinish={handleBatchMemberInfoReportFinished}
				onCancel={() => {
					batchMemberInfoReportModal.onCancel()
				}}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />
				<AffixButtons.AddBatch
					onClick={batchMemberInfoReportModal.onOpen}
					disabled={!addBatchPermission?.canUse}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default BatchMemberInfoReport
