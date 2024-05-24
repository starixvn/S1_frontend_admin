import React, { useEffect } from 'react'
import dayjs from 'dayjs'
import {
	Button,
	Descriptions,
	message,
	Modal,
	Select,
	Spin,
	Switch,
	Table,
	TablePaginationConfig,
	Typography,
} from 'antd'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { ModalState, PAGINATION } from 'common/hooks'
import { timeFormat } from 'common/utils/format'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	useLazyGetVipLevelSettingEnumQuery,
	useLazyGetVipLevelInfoByCustIdQuery,
	useLazyGetVipLevelLogByCustIdQuery,
	useSetVipLevelMutation,
	useSetVipLevelManuallyMutation,
} from 'features/memberProfile/api'
import { VIPLevelInfoByCustIdResponse } from 'features/memberProfile/type'
import { find } from 'lodash'
import { useTranslation } from 'react-i18next'

const { Title } = Typography
const { Option } = Select

interface ISettingVipLevelModalProps {
	custId: number
	vipLevelModal: ModalState
}
const SettingVipLevelModal = ({
	custId,
	vipLevelModal,
}: ISettingVipLevelModalProps) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { visible, onCancel } = vipLevelModal
	const { timeZoneUtcOffset } = useTimeZone()

	const [
		getVipLevelSettingEnum,
		{ data: { data: vipLevelSettingEnum = [] } = {} },
	] = useLazyGetVipLevelSettingEnumQuery()

	const [
		getVipLevelInfoByCustId,
		{ data: { data: vipLevelInfo } = {} as VIPLevelInfoByCustIdResponse },
	] = useLazyGetVipLevelInfoByCustIdQuery()

	const [getVipLevelLogByCustId, { data: { data: vipLevelLog = [] } = {} }] =
		useLazyGetVipLevelLogByCustIdQuery()

	const [setVipLevel, { isLoading: isSetVipLevelLoading }] =
		useSetVipLevelMutation()

	const [setVipLevelManually, { isLoading: isSetVipLevelManuallyLoading }] =
		useSetVipLevelManuallyMutation()

	const handleSetVipLevel = async (vipLevel: number) => {
		try {
			await setVipLevel({ custId, vipLevel }).unwrap
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetVipLevelManually = async (manually: boolean) => {
		try {
			await setVipLevelManually({ custId, manually: manually ? 1 : 0 }).unwrap
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const { manually, vipLevel: levelName, qualifiedTime } = vipLevelInfo ?? {}

	useEffect(() => {
		if (visible) {
			getVipLevelSettingEnum({ siteId })
			getVipLevelInfoByCustId({ custId }).unwrap()
			getVipLevelLogByCustId({ custId }).unwrap()
		}
	}, [visible])

	const vipLevel: number | undefined = find(vipLevelSettingEnum, {
		levelName,
	})?.level

	const columns: any[] = [
		{
			title: t('Label_OldLevel'),
			key: 'oldLevel',
			dataIndex: 'oldLevel',
			align: 'center' as 'center',
		},
		{
			title: t('Label_NewLevel'),
			key: 'newLevel',
			dataIndex: 'newLevel',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Memo'),
			key: 'memo',
			dataIndex: 'memo',
			align: 'center' as 'center',
		},
		{
			title: t('Label_OperationTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			align: 'center' as 'center',
			render: (updateTime: string) =>
				updateTime
					? dayjs(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
	]

	return (
		<Modal
			open={visible}
			onCancel={onCancel}
			width={600}
			title='VIP Level'
			footer={[
				<Button key='back' onClick={onCancel}>
					{t('Label_Close')}
				</Button>,
			]}
		>
			<Title level={5}>{t('Label_Level')}</Title>
			<Spin spinning={isSetVipLevelLoading || isSetVipLevelManuallyLoading}>
				<Descriptions layout='vertical' bordered>
					<Descriptions.Item label={t('Label_Manually')}>
						<Switch
							checked={Boolean(manually)}
							onChange={value => handleSetVipLevelManually(value)}
						/>
					</Descriptions.Item>
					<Descriptions.Item label={t('Label_Level')}>
						<Select
							value={vipLevel}
							style={{ width: '200px' }}
							onChange={level => handleSetVipLevel(level)}
						>
							{vipLevelSettingEnum.map(level => (
								<Option key={level.level} value={level.level}>
									{level.levelName}
								</Option>
							))}
						</Select>
					</Descriptions.Item>
					<Descriptions.Item label={t('Label_AuQualifiedTime')}>
						{dayjs(qualifiedTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Descriptions.Item>
				</Descriptions>
			</Spin>

			<Title level={5}>{t('Label_City')}</Title>
			<Table
				size='small'
				columns={columns}
				dataSource={vipLevelLog}
				pagination={PAGINATION as TablePaginationConfig}
			/>
		</Modal>
	)
}

export default SettingVipLevelModal
