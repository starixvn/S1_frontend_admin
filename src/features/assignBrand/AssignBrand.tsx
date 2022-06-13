import { FC, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { LayoutContent } from 'app/pages/layout'
import { useAuth, useModal, useQueryParams } from 'common/hooks'
import { Form, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useAppSelector } from 'app/store'
import { selectEnumStatus, selectUserSiteList } from 'common/enum'
import { useGetUserBrandQuery, useLazyGetAssignBrandQuery } from './api'
import { AssignBrandResponse } from './type'
import AssignBrandTable from './AssignBrandTable'
import AssignBrandFilter from './AssignBrandFilter'
import EditAssignBrandModal from './EditAssignBrandModal'

const AssignBrand: FC = () => {
	const { t } = useTranslation()
	const { userData } = useAuth()
	const [form] = Form.useForm()
	const [queryParams, setQueryParams] = useQueryParams()
	const { timeZoneUtcOffset } = useTimeZone()
	const userSiteList = useAppSelector(selectUserSiteList)
	const enumStatus = useAppSelector(selectEnumStatus)
	const editAssignBrandModal = useModal()
	const [editUserId, setEditUserId] = useState<number>()

	const [
		getAssignBrand,
		{
			data: { data: assignBrands } = {} as AssignBrandResponse,
			isFetching: isAssignBrandsFetching,
		},
	] = useLazyGetAssignBrandQuery()

	const { data: { data: userBrands = [] } = {} } = useGetUserBrandQuery()

	const onOpenEditBrandModal = ({ userId }: { userId: number }) => {
		setEditUserId(userId)

		editAssignBrandModal.onOpen()
	}

	const onChangeSites = (newSites: number[]) => {
		if (newSites.includes(0)) {
			form.setFieldsValue({
				selectSites: userSiteList.map(userSite => userSite.siteId),
			})
		} else {
			form.setFieldsValue({
				selectSites: newSites,
			})
		}
	}

	const handleSearch = async ({
		userName,
		selectSites,
	}: {
		userName: string
		selectSites: number[]
	}) => {
		try {
			await getAssignBrand({ userName, selectSites }).unwrap()

			setQueryParams({
				userName,
				selectSites,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (enumStatus === 'succeeded') {
			const newSelectSites: number[] =
				queryParams?.selectSites?.length > 0
					? queryParams?.selectSites?.map((site: string) => Number(site))
					: userSiteList.map(userSite => userSite.siteId)

			form.setFieldsValue({
				selectSites: newSelectSites ?? [],
				userName: queryParams?.userName ?? '',
			})

			const { userName, selectSites } = form.getFieldsValue()

			getAssignBrand({ userName, selectSites })
		}
	}, [enumStatus])

	const editBrands = assignBrands?.find(
		({ userId }) => userId === editUserId
	)?.brand

	if (userData?.isSuper !== undefined && !userData.isSuper) {
		return <Navigate to='/403' replace />
	}

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={t('Label_AssignBrand')} />

			<AssignBrandFilter
				loading={isAssignBrandsFetching}
				form={form}
				onSearch={handleSearch}
				onChangeSites={onChangeSites}
			/>

			<AssignBrandTable
				loading={isAssignBrandsFetching}
				assignBrands={assignBrands ?? []}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onOpenEditBrandModal={onOpenEditBrandModal}
			/>

			<EditAssignBrandModal
				modal={editAssignBrandModal}
				editUserId={editUserId}
				editBrands={editBrands ?? []}
				userBrands={userBrands ?? []}
			/>
		</LayoutContent.Main>
	)
}

export default AssignBrand
