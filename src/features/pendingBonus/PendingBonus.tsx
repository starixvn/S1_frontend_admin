import { message, Modal } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import {
	useGetPendingBonusListQuery,
	useTransferMultiMutation,
} from 'features/pendingBonus/api'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useGetPromotionListQuery } from 'features/bonusManagement/api'
import { IGetPromotionTypeResponse } from 'features/bonusManagement/type'
import { IAxiosError } from 'common/service/axiosBaseQuery'
import PendingBonusTable from 'features/pendingBonus/PendingBonusTable'
import PendingBonusTransferLog from 'features/pendingBonus/PendingBonusTransferLog'
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
		data: { data: promotionTypeList = [] } = {} as IGetPromotionTypeResponse,
		isLoading: isGetPromotionTypeListLoading,
	} = useGetPromotionListQuery(null)

	const handleSingleTransfer = async (siteIds: number[]) => {
		try {
			await transferMulti({
				bonusIdList: siteIds,
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			const {
				result: { message: msgError = '' },
			} = (error as IAxiosError).data[0]
			message.error(msgError || t('System.Label_NotExpectedServerError'))
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
			const transferLogs = (error as IAxiosError).data
			Modal.error({
				title: '',
				content: <PendingBonusTransferLog transferLogs={transferLogs} />,
				width: '45%',
				icon: false,
			})
		}
	}

	const loading =
		isGetPendingBonusListLoading ||
		isTransferMultiLoading ||
		isGetPromotionTypeListLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<PendingBonusTable
				loading={loading}
				pendingBonusList={pendingBonusList}
				promotionList={promotionTypeList}
				transferPermission={transferPermission}
				timeZoneUtcOffset={timeZoneUtcOffset}
				handleTransfer={handleSingleTransfer}
				handleAllTransfer={handleAllTransfer}
			/>
		</LayoutContent.Main>
	)
}

export default PendingBonus
