import styled from 'styled-components'
import { Descriptions, Space, Spin, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { numberFormatter } from 'common/utils/format'
import { useTranslation } from 'react-i18next'
import { ICurrencyAmountRecord } from './type'

interface IBonusReportSumTableProps {
	loading: boolean
	currencyAmountRecord: ICurrencyAmountRecord[]
}

const { Text } = Typography

export const CustomDivider = styled.div`
	height: 0.5px;
	width: 100%;
	background-color: rgba(192, 192, 192, 0.29);
`

const itemRenderer = (label: string, values: (string | number)[]) => {
	const isLastElement = (idx: number) => idx + 1 !== values.length
	return (
		<Descriptions.Item
			label={label}
			style={{
				textAlign: 'center',
				paddingLeft: 0,
				paddingRight: 0,
				minWidth: '100px',
			}}
			span={1}
		>
			<Space direction='vertical' style={{ width: '100%' }}>
				{values.map((value, idx) => (
					<>
						<Text>{value}</Text>
						{isLastElement(idx) && <CustomDivider />}
					</>
				))}
			</Space>
		</Descriptions.Item>
	)
}

const BonusReportSumTable = ({
	loading,
	currencyAmountRecord = [],
}: IBonusReportSumTableProps) => {
	const { t } = useTranslation()

	return (
		<LayoutContent.Card>
			<Spin spinning={loading}>
				<Descriptions
					layout='vertical'
					bordered
					size='small'
					// 根據資料長度動態 + 1
					column={currencyAmountRecord.length + 1}
					style={{
						marginTop: '10px',
						marginBottom: '10px',
						overflowX: 'auto',
					}}
				>
					{itemRenderer('', [t('Label_Record'), t('Label_Bonus')])}

					{currencyAmountRecord.map(
						({ currency, record, amount, siteName = '' }) =>
							itemRenderer(
								currency === 'Total' ? currency : `${currency}-${siteName}`,
								[numberFormatter.format(record), numberFormatter.format(amount)]
							)
					)}
				</Descriptions>
			</Spin>
		</LayoutContent.Card>
	)
}

export default BonusReportSumTable
