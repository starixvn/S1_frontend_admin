import { message } from 'antd'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { selectUserSite } from 'common/enum'
import { useAuth } from 'common/hooks'
import { AffixButtons } from 'components/AffixButtons'
import {
	useGetDepositReferralListQuery,
	useUpdateDepositReferralStatusMutation,
} from 'features/newReferralManagement/api'
import {
	IDepositReferralResponse,
	ReferralStatusEnum,
} from 'features/newReferralManagement/type'
import NewReferralManagementTable from 'features/newReferralManagement/NewReferralManagementTable'

const NewReferralManagement = ({ pageTitle }: { pageTitle?: string }) => {
	const { actionPermissions: { editPermission, setActivePermission } = {} } =
		useAuth()
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}

	const {
		data: { data: depositReferralList } = {} as IDepositReferralResponse,
		isFetching: isDepositReferralFetching,
	} = useGetDepositReferralListQuery({ siteId })

	const [updateDepositReferralStatus] = useUpdateDepositReferralStatusMutation()

	const handleUpdateNewReferralStatus = async ({
		currencyId,
		status,
	}: {
		currencyId: number
		status: boolean
	}) => {
		try {
			await updateDepositReferralStatus({
				siteId,
				currencyId,
				// 因有可能有舊系統的狀態 1 的資料 故限制參數的輸出
				// 新推薦系統打開是 2 關是 0
				// 舊推薦系統打開是 1 關是 0
				status: status
					? ReferralStatusEnum.DepositReferralEnable
					: ReferralStatusEnum.Disable,
			}).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<NewReferralManagementTable
				loading={isDepositReferralFetching}
				editPermission={editPermission}
				setActivePermission={setActivePermission}
				depositReferralList={depositReferralList}
				onUpdateReferralStatus={handleUpdateNewReferralStatus}
			/>

			<AffixButtons>
				<AffixButtons.BackToTop />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default NewReferralManagement
