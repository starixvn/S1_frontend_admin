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
}> = [
	{
		value: BatchMemberInfoReportDownloadStatusEnums.Pending,
		displayName: 'Label_Processing',
	},
	{
		value: BatchMemberInfoReportDownloadStatusEnums.Finished,
		displayName: 'Label_DownloadStatus',
	},
	{
		value: BatchMemberInfoReportDownloadStatusEnums.Failed,
		displayName: 'System.Label_Failed',
	},
]
