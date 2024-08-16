import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Collapse } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { numberFormatter } from 'common/utils/format'
import {
	OverviewDescriptions,
	renderOverviewDescriptionsItems,
} from 'components'
import { IStickerReportCurrencyTotalData } from './type'

interface ILotteryStickerOverviewTableProps {
	loading: boolean
	stickerReportCurrencyTotal: IStickerReportCurrencyTotalData[]
}

const { Panel } = Collapse

const LotteryStickerOverviewTable: FC<ILotteryStickerOverviewTableProps> = ({
	loading,
	stickerReportCurrencyTotal,
}) => {
	const { t } = useTranslation()

	return (
		<Collapse defaultActiveKey={0}>
			<Panel header={t('Label_Summary')} key='1'>
				<LayoutContent.Card style={{ margin: 0 }}>
					<OverviewDescriptions loading={loading}>
						{renderOverviewDescriptionsItems('', [
							t('Label_Count'),
							t('Label_Amount'),
						])}
						{stickerReportCurrencyTotal.map(
							({ currencyAmount, currencyCount, isoCode }) =>
								renderOverviewDescriptionsItems(isoCode, [
									numberFormatter.format(currencyCount),
									numberFormatter.format(currencyAmount),
								])
						)}
					</OverviewDescriptions>
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export { LotteryStickerOverviewTable }
