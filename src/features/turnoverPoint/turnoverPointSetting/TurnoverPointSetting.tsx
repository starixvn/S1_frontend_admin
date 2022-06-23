import { FC, useEffect } from 'react'
import { usePagination, PAGINATION, useQueryParams } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { TablePaginationConfig, message, Form } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { IGetTurnoverPointSettingResponse } from '../type'
import { useGetTurnoverPointSettingQuery } from '../api'
import { TurnoverPointSettingForm } from './TurnoverPointSettingForm'

const TurnoverPointSetting: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const [queryParams] = useQueryParams()
	const { vipLevelName, currencyId } = queryParams
	const { vipLevel } = useParams()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [form] = Form.useForm()
	const {
		data: {
			data: turnoverPointDetail,
		} = {} as IGetTurnoverPointSettingResponse,
		isLoading: isGetTurnoverPointSettingLoading,
	} = useGetTurnoverPointSettingQuery({
		siteId,
		currencyId,
		vipLevel: Number(vipLevel),
	})

	useEffect(() => {
		if (!loading) {
			console.log(turnoverPointDetail)
		}
	}, [isGetTurnoverPointSettingLoading])
	const loading = isGetTurnoverPointSettingLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={`${pageTitle ?? ' '} > ${vipLevelName}`} />
			<TurnoverPointSettingForm
				loading={loading}
				turnoverSettingData={turnoverPointDetail}
				form={form}
			/>
			<AffixButtons>
				<AffixButtons.GoBackRoute />
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default TurnoverPointSetting
