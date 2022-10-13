import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { useParams } from 'react-router-dom'
import {
	useGetDeviceListQuery,
	useLazyGetDeviceUserListQuery,
} from 'features/memberProfile/api'
import { useTimeZone } from 'components/TimeZoneSelect'
import { DeviceListTable } from 'features/memberProfile/pages/customerInfo/deviceList/DeviceListTable'
import { useModal } from 'common/hooks'
import { UserListModal } from 'features/memberProfile/pages/customerInfo/components/UserListModal'
import { message } from 'antd'

const DeviceList = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset } = useTimeZone()
	const deviceUserModal = useModal()

	const {
		data: { data: deviceList = [] } = {},
		isLoading: isDeviceListLoading,
	} = useGetDeviceListQuery({
		custId: Number(custId),
	})

	const [
		getDeviceUserList,
		{
			data: { data: deviceUserList = [] } = {},
			isFetching: isGetDeviceUserLoading,
		},
	] = useLazyGetDeviceUserListQuery()

	const handleGetDeviceUserList = async (deviceId: string) => {
		if (!custId) return
		try {
			await getDeviceUserList({ custId: Number(custId), deviceId }).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleAccountClick = (deviceId: string) => {
		handleGetDeviceUserList(deviceId)
		deviceUserModal.onOpen()
	}

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.CustomerInfo.Label_DeviceList')}
			/>
			<LayoutContent.Card>
				<DeviceListTable
					loading={isDeviceListLoading}
					deviceList={deviceList}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onAccountClick={handleAccountClick}
				/>
				<UserListModal
					loading={isGetDeviceUserLoading}
					userList={deviceUserList}
					visible={deviceUserModal.visible}
					onCancel={deviceUserModal.onCancel}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default DeviceList
