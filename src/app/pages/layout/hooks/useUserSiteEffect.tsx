import { useAppDispatch, useAppSelector } from 'app/store'
import {
	onChangeUserSite,
	selectEnumStatus,
	selectUserSiteList,
} from 'common/enum'
import { useQueryParams } from 'common/hooks'
import {
	useChangeBrandMutation,
	useCheckBrandQuery,
} from 'common/service/homeApi/api'
import { find } from 'lodash'
import { useEffect } from 'react'

const useUserSiteEffect = () => {
	const dispatch = useAppDispatch()
	const [queryParams] = useQueryParams()
	const { data: { data: siteId } = {} } = useCheckBrandQuery()
	const [changeBrand] = useChangeBrandMutation()
	const userSiteList = useAppSelector(selectUserSiteList)
	const enumStatus = useAppSelector(selectEnumStatus)

	useEffect(() => {
		if (!Number(queryParams?.siteId)) return

		changeBrand({ siteId: Number(queryParams?.siteId) })
	}, [queryParams?.siteId])

	useEffect(() => {
		if (enumStatus === 'succeeded') {
			const newUserSite = find(userSiteList, { siteId })

			dispatch(onChangeUserSite(newUserSite))
		}
	}, [enumStatus, siteId])
}

export { useUserSiteEffect }
