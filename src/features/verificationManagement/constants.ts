import { VerificationTypeEnum } from 'features/verificationManagement/type'

export const verificationTypeList: Array<{
	value: number
	displayKey: string
}> = [
	{ value: VerificationTypeEnum.eitherOf, displayKey: 'Label_EitherOf' },
	{ value: VerificationTypeEnum.bothOf, displayKey: 'Label_BothOf' },
]
