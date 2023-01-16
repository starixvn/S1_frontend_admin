import { Button, message } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import {
	useGetPendingBonusListQuery,
	useTransferMultiMutation,
} from 'features/pendingBonus/api'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useGetPromotionListQuery } from 'features/bonusManagement/api'
import { IGetPromotionTypeResponse } from 'features/bonusManagement/type'
import PendingBonusTable from 'features/pendingBonus/PendingBonusTable'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'

const PendingBonus = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { actionPermissions: { transferPermission } = {} } = useAuth()
	const { timeZoneUtcOffset } = useTimeZone()
	const { siteId } = useAppSelector(selectUserSite) ?? {}

	const {
		data: { data: pendingBonusList = [] } = {},
		isLoading: isGetPendingBonusListLoading,
	} = useGetPendingBonusListQuery({
		siteIds: siteId ? [siteId] : [],
	})

	const [transferMulti, { isLoading: isTransferMultiLoading }] =
		useTransferMultiMutation()

	const {
		data: { data: promotionListData } = {} as IGetPromotionTypeResponse,
		isLoading: isGetPromotionListDataLoading,
	} = useGetPromotionListQuery(null)

	const handleSingleTransfer = async (siteIds: number[]) => {
		try {
			await transferMulti({
				bonusIdList: siteIds,
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleAllTransfer = async () => {
		const bonusIdList = pendingBonusList.map(({ bonusId }) => bonusId) ?? []
		try {
			await transferMulti({
				bonusIdList,
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading =
		isGetPendingBonusListLoading ||
		isTransferMultiLoading ||
		isGetPromotionListDataLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<Button onClick={handleAllTransfer} type='primary'>
				{t('Label_TransferAll')}
			</Button>
			<PendingBonusTable
				loading={loading}
				pendingBonusList={pendingBonusList}
				promotionList={promotionListData}
				transferPermission={transferPermission}
				timeZoneUtcOffset={timeZoneUtcOffset}
				handleTransfer={handleSingleTransfer}
			/>
		</LayoutContent.Main>
	)
}

export default PendingBonus
