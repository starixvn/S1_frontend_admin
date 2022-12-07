import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import AppQrCodeTable from 'features/appQrCode/AppQrCodeTable'
import { Form, message } from 'antd'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import {
	useGetAppLinkListQuery,
	useGetProtocolTypeEnumQuery,
	useSetAppLinkMutation,
} from 'features/appQrCode/api'
import {
	IProtocolTypeEnumResponse,
	IGetAppLinkResponse,
	IEditForm,
} from 'features/appQrCode/type'

import { timeZoneLocalOffset } from 'common/utils'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useAuth } from 'common/hooks'

const AppQrCode = ({ pageTitle }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [editForm] = Form.useForm<IEditForm>()
	const [editingKey, setEditingKey] = useState<string | undefined>(undefined)
	const { actionPermissions: { editPermission } = {} } = useAuth()

	const { data: { data: AppTypeList = [] } = {} } = useGetEnumTypeQuery({
		enumName: 'AppTypeEnum',
	})

	const {
		data: { data: ProtocolTypeList = [] } = {} as IProtocolTypeEnumResponse,
	} = useGetProtocolTypeEnumQuery({ enumName: 'ProtocolTypeEnum' })

	const {
		data: { data: appLinkData } = {} as IGetAppLinkResponse,
		isLoading: isGetAppLinkLoading,
	} = useGetAppLinkListQuery({ siteId })

	const [setAppLink, { isLoading: isSetAppLoading }] = useSetAppLinkMutation()

	const handleRowSaved = async () => {
		const args = await editForm.validateFields()
		const { appTypeName, domain, protocolTypeName } = args
		try {
			const response = await setAppLink({
				siteId,
				appType: appTypeName,
				protocolType: protocolTypeName,
				domain,
			}).unwrap()
			message.success(response?.message || t('System.Label_Success'))
			setEditingKey(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const loading = isGetAppLinkLoading || isSetAppLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<AppQrCodeTable
				loading={loading}
				form={editForm}
				timeZoneUtcOffset={timeZoneLocalOffset}
				editPermission={editPermission}
				editingKey={editingKey}
				appLinkData={appLinkData}
				AppTypeList={AppTypeList}
				ProtocolTypeList={ProtocolTypeList}
				setEditingKey={setEditingKey}
				onRowSaved={handleRowSaved}
			/>
		</LayoutContent.Main>
	)
}

export default AppQrCode
