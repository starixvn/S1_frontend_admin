import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { LayoutContent } from 'app/pages/layout'
import { IpListFilter } from 'features/memberProfile/pages/customerInfo/IpList/IpListFilter'
import { Form, message } from 'antd'
import {
	useLazyGetIpLogQuery,
	useLazyGetIpUserQuery,
} from 'features/memberProfile/api'
import {
	IGetIpLogResponse,
	IGetIpUserListResponse,
} from 'features/memberProfile/type'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useEffect } from 'react'
import { IpListTable } from 'features/memberProfile/pages/customerInfo/IpList/IpListTable'
import {
	useAddBlockIpMutation,
	useDeleteBlockIpMutation,
} from 'features/blockIp/api'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { BlockIPModal } from 'features/memberProfile/pages/customerInfo/IpList/BlockIPModal'
import { useModal } from 'common/hooks'
import { IpUserListModal } from 'features/memberProfile/pages/customerInfo/components/IpUserListModal'

const IpList = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const { siteId } = useAppSelector(selectUserSite) ?? {}

	const [filterForm] = Form.useForm()
	const [blockIpForm] = Form.useForm<{
		ip: string
		memo: string
	}>()

	const blockIpModal = useModal()
	const ipUserListModal = useModal()
	const [
		getIpLog,
		{
			data: { data: ipList = [] } = {} as IGetIpLogResponse,
			isFetching: isGetIpLogLoading,
		},
	] = useLazyGetIpLogQuery()

	const [
		getIpUser,
		{
			data: { data: ipUserList = [] } = {} as IGetIpUserListResponse,
			isFetching: isGetIpUserListLoading,
		},
	] = useLazyGetIpUserQuery()

	const [deleteBlockIp, { isLoading: isDeleteBlockIpLoading }] =
		useDeleteBlockIpMutation()

	const [addBlockIp, { isLoading: isAddBlockIpLoading }] =
		useAddBlockIpMutation()

	const handleSearch = async () => {
		if (!custId) return
		const { dateRange } = filterForm.getFieldsValue()
		const [startDate, endDate] = dateRangeToUtcFormatter(
			[dateRange[0].startOf('day'), dateRange[1].endOf('day')],
			timeZoneUtcOffset
		)
		try {
			await getIpLog({ custId: Number(custId), startDate, endDate }).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleBlockClicked = (ip: string) => {
		blockIpForm.setFieldsValue({
			ip,
		})
		blockIpModal.onOpen()
	}

	const handleBlockIpSubmit = async () => {
		// ip 沒有顯示在畫面上 故要使用 true 才取得到
		const { ip, memo } = blockIpForm.getFieldsValue(true)
		try {
			await addBlockIp({
				siteId,
				after: { ip, memo },
			}).unwrap()
			blockIpModal.onCancel()
			// 確保 close modal 動畫跑完才做 clean up
			setTimeout(() => blockIpForm.resetFields(), 200)

			// 因為 block 與 unblock 來自於其他隻現有的 api 所以這裡手動 trigger refetch
			await handleSearch()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleUnBlockIp = async (ip: string) => {
		try {
			await deleteBlockIp({ siteId, before: { ip } }).unwrap()
			// 因為 block 與 unblock 來自於其他隻現有的 api 所以這裡手動 trigger refetch
			await handleSearch()

			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleGetIpUser = async (ip: string) => {
		try {
			await getIpUser({ ip }).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleAccountClick = (ip: string) => {
		handleGetIpUser(ip)
		ipUserListModal.onOpen()
	}

	useEffect(() => {
		if (custId) {
			handleSearch()
		}
	}, [custId])

	const loading =
		isGetIpLogLoading ||
		isDeleteBlockIpLoading ||
		isAddBlockIpLoading ||
		isGetIpUserListLoading

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.CustomerInfo.Label_IPList')}
			/>
			<LayoutContent.Card>
				<IpListFilter
					loading={loading}
					form={filterForm}
					onSearch={handleSearch}
					onTimeZoneChange={onTimeZoneChange}
					timeZoneUtcOffset={timeZoneUtcOffset}
				/>
				<IpListTable
					ipList={ipList}
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					onUnblockClicked={handleUnBlockIp}
					onBlockClicked={handleBlockClicked}
					onAccountClick={handleAccountClick}
				/>
				<BlockIPModal
					loading={isAddBlockIpLoading}
					visible={blockIpModal.visible}
					onCancel={() => {
						blockIpModal.onCancel()
						setTimeout(() => blockIpForm.resetFields(), 200)
					}}
					onFinish={handleBlockIpSubmit}
					form={blockIpForm}
				/>
				<IpUserListModal
					loading={isGetIpUserListLoading}
					ipUserList={ipUserList}
					visible={ipUserListModal.visible}
					onCancel={ipUserListModal.onCancel}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default IpList
