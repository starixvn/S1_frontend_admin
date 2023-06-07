import { useTranslation } from 'react-i18next'
import { IMarketingNruReportData } from 'features/marketing/type'
import { numberFormatter, numFormatToDigits } from 'common/utils/format'
import { Typography, Table } from 'antd'

interface INruReportTableProps {
	loading: boolean
	marketingNruReportData: IMarketingNruReportData
}

const { Summary } = Table
const { Text } = Typography

const NruReportTable = ({
	loading,
	marketingNruReportData,
}: INruReportTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('LabelSignupURL'),
			key: 'signUpSource',
			dataIndex: 'signUpSource',
			width: '25%',
			align: 'center' as 'center',
			render: (signUpSource: string) => signUpSource || '-',
		},
		{
			title: t('Label_NRU'),
			key: 'newlyRegisterUsers',
			dataIndex: 'newlyRegisterUsers',
			width: '25%',
			align: 'center' as 'center',
			render: (newlyRegisterUsers: number) =>
				newlyRegisterUsers ? numberFormatter.format(newlyRegisterUsers) : 0,
		},
		{
			title: t('Label_Deposit'),
			key: 'depositUsers',
			dataIndex: 'depositUsers',
			width: '25%',
			align: 'center' as 'center',
			render: (depositUsers: number) =>
				depositUsers ? numberFormatter.format(depositUsers) : 0,
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
	]

	return (
		<Table
			loading={loading}
			pagination={false}
			columns={columns}
			dataSource={marketingNruReportData.signUpDataSum}
			// eslint-disable-next-line react/no-unstable-nested-components
			summary={() => {
				const {
					firstDepositAmount,
					totalDepositAmount,
					depositUsers,
					newlyRegisterUsers,
				} =
					// 解決 first render is undefined
					marketingNruReportData.totalSignUpData || {}
				return (
					<Summary fixed>
						<Summary.Row style={{ background: '#fafafa' }}>
							<Summary.Cell align='center' index={1}>
								{t('Label_Total')}
							</Summary.Cell>
							<Summary.Cell align='center' index={2}>
								<Text>
									{newlyRegisterUsers
										? numberFormatter.format(newlyRegisterUsers)
										: 0}
								</Text>
							</Summary.Cell>
							<Summary.Cell align='center' index={3}>
								<Text>
									{depositUsers ? numberFormatter.format(depositUsers) : 0}
								</Text>
							</Summary.Cell>
							<Summary.Cell align='center' index={4}>
								<Text>
									{firstDepositAmount
										? numFormatToDigits(firstDepositAmount)
										: 0}
								</Text>
							</Summary.Cell>
							<Summary.Cell align='center' index={5}>
								<Text>
									{totalDepositAmount
										? numFormatToDigits(totalDepositAmount)
										: 0}
								</Text>
							</Summary.Cell>
						</Summary.Row>
					</Summary>
				)
			}}
			style={{ marginTop: 36 }}
		/>
	)
}

export default NruReportTable
