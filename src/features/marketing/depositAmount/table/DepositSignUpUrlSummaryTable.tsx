import { Table, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { numFormatToDigits } from 'common/utils/format'
import { IMarketingDepositSignUpUrlSummaryData } from 'features/marketing/type'

interface IDepositSignUpUrlSummaryTableProps {
	loading: boolean
	marketingDepositSignUpUrlSummaryData: IMarketingDepositSignUpUrlSummaryData
}

const { Summary } = Table
const { Text } = Typography

const DepositSignUpUrlSummaryTable = ({
	loading,
	marketingDepositSignUpUrlSummaryData,
}: IDepositSignUpUrlSummaryTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_SignupURL'),
			key: 'signUpUrl',
			dataIndex: 'signUpUrl',
			width: '25%',
			align: 'center' as 'center',
			render: (signUpUrl: string) => signUpUrl || '-',
		},
		{
			title: t('Label_FirstDepositAmount'),
			key: 'firstDepositAmount',
			dataIndex: 'firstDepositAmount',
			width: '25%',
			align: 'center' as 'center',
			render: (firstDepositAmount: number) =>
				firstDepositAmount ? numFormatToDigits(firstDepositAmount) : 0,
		},
		{
			title: t('Label_TotalDepositAmount'),
			key: 'totalDepositAmount',
			dataIndex: 'totalDepositAmount',
			width: '25%',
			align: 'center' as 'center',
			render: (totalDepositAmount: number) =>
				totalDepositAmount ? numFormatToDigits(totalDepositAmount) : 0,
		},
		{
			title: t('Label_NumberOfPlayers'),
			key: 'noOfPlayers',
			dataIndex: 'noOfPlayers',
			width: '25%',
			align: 'center' as 'center',
			render: (noOfPlayers: number) => noOfPlayers ?? 'N/A',
		},
	]

	return (
		<Table
			loading={loading}
			columns={columns}
			pagination={false}
			dataSource={marketingDepositSignUpUrlSummaryData.signUpData}
			// eslint-disable-next-line react/no-unstable-nested-components
			summary={() => {
				const { firstDepositAmount, totalDepositAmount, noOfPlayers } =
					// 解決 first render is undefined
					marketingDepositSignUpUrlSummaryData.totalSummary || {}
				return (
					<Summary fixed>
						<Summary.Row style={{ background: '#fafafa' }}>
							<Summary.Cell align='center' index={1}>
								{t('Label_Total')}
							</Summary.Cell>
							<Summary.Cell align='center' index={2}>
								<Text>
									{firstDepositAmount
										? numFormatToDigits(firstDepositAmount)
										: 0}
								</Text>
							</Summary.Cell>
							<Summary.Cell align='center' index={3}>
								<Text>
									{totalDepositAmount
										? numFormatToDigits(totalDepositAmount)
										: 0}
								</Text>
							</Summary.Cell>
							<Summary.Cell align='center' index={4}>
								{noOfPlayers ? numFormatToDigits(noOfPlayers) : 0}
							</Summary.Cell>
						</Summary.Row>
					</Summary>
				)
			}}
			expandable={{ expandRowByClick: true }}
			style={{ marginTop: 36 }}
		/>
	)
}

export default DepositSignUpUrlSummaryTable
