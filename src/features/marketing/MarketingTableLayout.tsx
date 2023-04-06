import { ReactNode } from 'react'
import { Collapse } from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { PermissionInterface } from 'type'
import { ExcelExportButton } from 'features/marketing/components/ExcelExportButton'

interface IMpaMarketingLayoutTableProps {
	children?: ReactNode
}

interface ISummaryTableProps {
	children?: ReactNode
	onExportClick?: () => void
	exportExcelPermission?: PermissionInterface
	hasQueryParams?: boolean
}

interface IDetailTableProps {
	children?: ReactNode
}

const { Panel } = Collapse

const SummaryTable = ({
	children,
	onExportClick,
	exportExcelPermission,
	hasQueryParams = false,
}: ISummaryTableProps) => {
	const { t } = useTranslation()
	return (
		<Collapse defaultActiveKey={1} expandIconPosition='start'>
			<Panel
				extra={
					hasQueryParams ? (
						<ExcelExportButton
							onClick={onExportClick}
							disabled={!exportExcelPermission?.canUse}
						/>
					) : null
				}
				header={t('Label_Summary')}
				key='1'
			>
				<LayoutContent.Card>{children}</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}
const DetailTable = ({ children }: IDetailTableProps) => {
	const { t } = useTranslation()
	return (
		<Collapse style={{ marginTop: 36, marginBottom: 36 }} defaultActiveKey={1}>
			<Panel header={t('Label_Detail')} key='2'>
				<LayoutContent.Card>{children}</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

const MarketingTableLayout = ({ children }: IMpaMarketingLayoutTableProps) => {
	return <div>{children}</div>
}

export default MarketingTableLayout

MarketingTableLayout.Summary = SummaryTable
MarketingTableLayout.Detail = DetailTable
