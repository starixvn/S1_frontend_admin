import { IDetailByCustIdResponse } from 'features/newReferralReport/type'
import { useLazyGetDetailByCustIdQuery } from 'features/newReferralReport/api'
import { useTranslation } from 'react-i18next'
import { useQueryParams } from 'common/hooks'
import { useParams } from 'react-router-dom'
import { message } from 'antd'
import NewReferralCustReportTable from 'features/newReferralReport/NewReferralCustReportTable'
import { LayoutContent } from 'app/pages/layout'
import { useEffect } from 'react'
import { AffixButtons } from 'components/AffixButtons'

const NewReferralCustReport = () => {
	const { t } = useTranslation()
	const [queryParams] = useQueryParams()
	const { userName, startDate, endDate } = queryParams
	const { custId } = useParams()

	const [
		getDetailByCustId,
		{
			data: { data: detailByCustIdList } = {} as IDetailByCustIdResponse,
			isFetching: isGetDetailByCustIdFetching,
		},
	] = useLazyGetDetailByCustIdQuery()

	const handleFetching = async () => {
		try {
			await getDetailByCustId({
				custId: Number(custId),
				startDate,
				endDate,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (!custId) return
		handleFetching()
	}, [custId])

	return (
		<LayoutContent.Main>
			<LayoutContent.Title
				title={`${t('Label_NewReferralLog')} > ${userName}`}
			/>

			<NewReferralCustReportTable
				loading={isGetDetailByCustIdFetching}
				detailByCustIdList={detailByCustIdList}
			/>

			<AffixButtons>
				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default NewReferralCustReport
