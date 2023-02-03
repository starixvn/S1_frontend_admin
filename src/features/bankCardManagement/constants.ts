import { BankCardListStatusEnum } from 'features/bankCardManagement/type'

export const BANK_ACCOUNT_MANAGEMENT_STATUS_TAGS_COLOR: {
	[status: number]: string
} = {
	[BankCardListStatusEnum.Initial]: '#8B8B8B',
	[BankCardListStatusEnum.Open]: '#3EA62E',
	[BankCardListStatusEnum.Suspend]: '#C70707',
	[BankCardListStatusEnum.Closed]: '#38425B',
	[BankCardListStatusEnum.Maintenance]: '#F4B30B',
}
