import React, { useEffect, useState } from 'react'
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
	Popconfirm,
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
	useSetVipLevelDefaultMutation,
} from 'features/memberProfile/api'
import type { VIPLevelInfoByCustIdResponse } from 'features/memberProfile/type'
import { find } from 'lodash'
import { useTranslation } from 'react-i18next'
import { SiteIds } from '../../../../app/constants/siteIds'
import { VIP_LEVEL_SETTING_LIST } from '../../sites/onetwobet/constants'

const { Title, Text } = Typography
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

	// level
	const [tempLevel, setTempLevel] = useState<number | undefined>(undefined)
	const [openLevelPopConfirm, setOpenLevelPopConfirm] = useState(false)

	// default level
	const [tempDefaultLevel, setDefaultTempLevel] = useState<number | undefined>(
		undefined
	)
	const [openDefaultLevelPopConfirm, setDefaultOpenLevelPopConfirm] =
		useState(false)

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

	const [setVipLevelDefault, { isLoading: isSetVipLevelDefaultLoading }] =
		useSetVipLevelDefaultMutation()

	const handleSetVipLevel = async ({
		vipLevel,
		isDefault = false,
	}: {
		vipLevel: number | undefined
		isDefault: boolean
	}) => {
		try {
			if (!isDefault) {
				await setVipLevel({ custId, vipLevel }).unwrap
			}
			await setVipLevelDefault({ custId, vipLevel }).unwrap
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

	const {
		manually,
		vipLevel: levelName,
		qualifiedTime,
		defaultLevel: defaultLevelNumber,
	} = vipLevelInfo ?? {}

	const vipLevel =
		find(vipLevelSettingEnum, {
			levelName,
		})?.level ?? null

	const vipDefaultLevel =
		find(VIP_LEVEL_SETTING_LIST, {
			level: defaultLevelNumber,
		})?.level ?? null // undefined 綁在 Select 元件時會自動填入

	// level 顯示在 popConfirm 上
	const selectedTemptLevel = find(vipLevelSettingEnum, {
		level: tempLevel,
	})
	// defaultLevel 顯示在 popConfirm 上
	const selectedTemptDefaultLevel = find(VIP_LEVEL_SETTING_LIST, {
		level: tempDefaultLevel,
	})

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

	useEffect(() => {
		if (visible) {
			getVipLevelSettingEnum({ siteId })
			getVipLevelInfoByCustId({ custId }).unwrap()
			getVipLevelLogByCustId({ custId }).unwrap()
		}
	}, [visible])

	return (
		<Modal
			open={visible}
			onCancel={onCancel}
			width={700}
			title='VIP Level'
			footer={[
				<Button key='back' onClick={onCancel}>
					{t('Label_Close')}
				</Button>,
			]}
		>
			<Title level={5}>{t('Label_Level')}</Title>
			<Spin
				spinning={
					isSetVipLevelLoading ||
					isSetVipLevelManuallyLoading ||
					isSetVipLevelDefaultLoading
				}
			>
				<Descriptions layout='vertical' bordered column={4}>
					<Descriptions.Item label={t('Label_Manually')}>
						<Popconfirm
							title={t('Label_AreYouSure')}
							onConfirm={() => handleSetVipLevelManually(!manually)}
						>
							<Switch checked={Boolean(manually)} />
						</Popconfirm>
					</Descriptions.Item>
					<Descriptions.Item label={t('Label_Level')}>
						<Popconfirm
							title={
								<>
									{t('Label_UpdateVipLevelNotification')}{' '}
									<Text strong style={{ color: 'red' }}>
										{selectedTemptLevel?.levelName}
									</Text>{' '}
									{t('Label_UpdateVipLevelWarning')}
								</>
							}
							open={openLevelPopConfirm}
							onConfirm={() => {
								handleSetVipLevel({ vipLevel: tempLevel, isDefault: false })
								setOpenLevelPopConfirm(false)
							}}
							onCancel={() => {
								setOpenLevelPopConfirm(false)
							}}
						>
							<Select
								value={vipLevel}
								style={{ width: '150px' }}
								onSelect={level => {
									setTempLevel(level)
									setOpenLevelPopConfirm(true)
								}}
							>
								{vipLevelSettingEnum.map(level => (
									<Option key={level.level} value={level.level}>
										{level.levelName}
									</Option>
								))}
							</Select>
						</Popconfirm>
					</Descriptions.Item>
					{siteId === SiteIds.OneTwoBet && (
						<Descriptions.Item label={t('Label_DefaultLevel')}>
							<Popconfirm
								title={
									<>
										{t('Label_UpdateVipLevelNotification')}{' '}
										<Text strong style={{ color: 'red' }}>
											{t(selectedTemptDefaultLevel?.defaultLevel || '')}
										</Text>{' '}
										{t('Label_UpdateVipLevelWarning')}
									</>
								}
								open={openDefaultLevelPopConfirm}
								onConfirm={() => {
									handleSetVipLevel({
										vipLevel: tempDefaultLevel,
										isDefault: true,
									})
									setDefaultOpenLevelPopConfirm(false)
								}}
								onCancel={() => {
									setDefaultOpenLevelPopConfirm(false)
								}}
							>
								<Select
									value={vipDefaultLevel}
									style={{ width: '150px' }}
									onSelect={defaultLevel => {
										setDefaultTempLevel(defaultLevel)
										setDefaultOpenLevelPopConfirm(true)
									}}
								>
									{VIP_LEVEL_SETTING_LIST.map(({ level, defaultLevel }) => (
										<Option key={level} value={level}>
											{t(defaultLevel)}
										</Option>
									))}
								</Select>
							</Popconfirm>
						</Descriptions.Item>
					)}
					<Descriptions.Item label={t('Label_AuQualifiedTime')}>
						{dayjs(qualifiedTime)
							.utcOffset(timeZoneUtcOffset)
							.format(timeFormat)}
					</Descriptions.Item>
				</Descriptions>
			</Spin>

			<br />

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
