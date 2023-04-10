import { find } from 'lodash'
import moment from 'moment'
import { ReactNode } from 'react'
import { Collapse, Card } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { PermissionInterface } from 'type'
import { selectAllSiteEnableCurrencyList } from 'common/enum'
import { ExcelExportButton } from 'features/marketing/components/ExcelExportButton'

interface IMpaMarketingLayoutTableProps {
	children?: ReactNode
}

interface ISummaryTableProps {
	children: ReactNode
	exportExcelPermission: PermissionInterface
	hasQueryParams: boolean
	onExportClick: () => void
	// title 需要參數
	title: string
	baseCurrencyId: number
	startDate: string
	endDate: string
}

interface IDetailTableProps {
	children?: ReactNode
}

const { Panel } = Collapse

const SummaryTable = ({
	children,
	exportExcelPermission,
	hasQueryParams = false,
	onExportClick,
	// title 需要參數
	title,
	baseCurrencyId,
	startDate,
	endDate,
}: ISummaryTableProps) => {
	const { t } = useTranslation()
	const currencyListByAllSite = useAppSelector(selectAllSiteEnableCurrencyList)
	const baseCurrency = find(currencyListByAllSite, [
		'currencyId',
		baseCurrencyId,
	])?.isoCode

	return (
		<Card
			title={`${title}, ${moment(startDate).format('YYYY-MM-DD')}-${moment(
				endDate
			).format('YYYY-MM-DD')}, ${t('Label_ViewIn')} ${
				!baseCurrencyId ? '' : baseCurrency
			}`}
			bodyStyle={{ padding: 0 }}
		>
			<Collapse defaultActiveKey={1}>
				<Panel header={t('Label_Summary')} key='1'>
					{hasQueryParams ? (
						<ExcelExportButton
							style={{ marginTop: 60 }}
							onClick={onExportClick}
							disabled={!exportExcelPermission?.canUse}
						/>
					) : null}
					<LayoutContent.Card style={{ margin: 0 }}>
						{children}
					</LayoutContent.Card>
				</Panel>
			</Collapse>
		</Card>
	)
}
const DetailTable = ({ children }: IDetailTableProps) => {
	const { t } = useTranslation()

	return (
		<Collapse style={{ marginTop: 36, marginBottom: 36 }} defaultActiveKey={1}>
			<Panel header={t('Label_Detail')} key='2'>
				<LayoutContent.Card style={{ margin: 0 }}>
					{children}
				</LayoutContent.Card>
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
