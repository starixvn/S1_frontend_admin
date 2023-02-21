import {
	BatchMemberInfoReportStatusColorEnums,
	BatchMemberInfoReportDownloadStatusEnums,
} from 'features/batchMemberInfoReport/type'

export const BATCH_MEMBER_INFO_REPORT_STATUS_TAGS_COLOR: {
	[status: string]: string
} = {
	[BatchMemberInfoReportStatusColorEnums.Pending]: '#F97C08',
	[BatchMemberInfoReportStatusColorEnums.Finished]: '#3EA62E',
	[BatchMemberInfoReportStatusColorEnums.Failed]: '#C70707',
}

export const BATCH_MEMBER_INFO_DOWNLOAD_STATUS: Array<{
	value: number
	displayName: string
	isDanger: boolean
	isLoading: boolean
	isDisabled: boolean
}> = [
	{
		value: BatchMemberInfoReportDownloadStatusEnums.Pending,
		displayName: 'Label_Loading',
		isDanger: false,
		isLoading: true,
		isDisabled: false,
	},
	{
		value: BatchMemberInfoReportDownloadStatusEnums.Finished,
		displayName: 'Label_Downloaded',
		isDanger: false,
		isLoading: false,
		isDisabled: false,
	},
	{
		value: BatchMemberInfoReportDownloadStatusEnums.Failed,
		displayName: 'System.Label_Failed',
		isDanger: true,
		isLoading: false,
		isDisabled: true,
	},
]
