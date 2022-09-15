import React, { FC } from 'react'
import { PaginationInterface } from 'common/hooks'
import {
	Popconfirm,
	Space,
	Switch,
	TablePaginationConfig,
	Typography,
} from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import {
	IGetBonusListData,
	IGetPromotionTypeData,
} from 'features/bonusManagement/type'
import { useTranslation } from 'react-i18next'
import moment from 'moment/moment'
import { devicesList, walletTypeList } from 'features/bonusManagement/constants'
import { find } from 'lodash'
import { PermissionInterface } from 'type'
import { CopyOutlined, EditFilled } from '@ant-design/icons'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { useNavigate } from 'react-router-dom'

interface IBonusManagementTableProps {
	loading: boolean
	pagination: PaginationInterface
	onTableChange: (newPagination: TablePaginationConfig) => void
	bonusList: IGetBonusListData[]
	timeZoneUtcOffset: number
	promotionList: IGetPromotionTypeData[]
	editPermission?: PermissionInterface
	onUpdateStatus: ({
		bonusCode,
		status,
	}: {
		bonusCode: string
		status: boolean
	}) => void
	onCopiedClicked: (record: IGetBonusListData) => void
}

const BonusManagementTable: FC<IBonusManagementTableProps> = ({
	loading,
	pagination,
	onTableChange,
	bonusList,
	timeZoneUtcOffset,
	promotionList,
	editPermission,
	onUpdateStatus,
	onCopiedClicked,
}) => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const columns = [
		{
			title: t('Label_Status'),
			key: 'status',
			width: 80,
			align: 'center' as 'center',
			render: (record: IGetBonusListData) => {
				const { status: rawStatus, bonusCode } = record
				const status = rawStatus === 1
				return (
					<Space>
						<Popconfirm
							disabled={!editPermission?.canUse}
							title={t('Label_AreYouSure')}
							onConfirm={() => {
								onUpdateStatus({ bonusCode, status: !status })
							}}
						>
							<Switch
								checked={status}
								size='small'
								disabled={!editPermission?.canUse}
							/>
						</Popconfirm>
					</Space>
				)
			},
		},
		{
			title: t('Label_Edit'),
			key: 'edit',
			width: 150,
			align: 'center' as 'center',
			render: (record: IGetBonusListData) => {
				const { bonusCode } = record
				return (
					<Space style={{ padding: '10px' }} size='middle'>
						<Typography.Link
							disabled={!editPermission?.canUse}
							onClick={() => {
								navigate(
									`/${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.bonusManagement.root}/${bonusCode}`
								)
							}}
						>
							<EditFilled />
						</Typography.Link>
						<Typography.Link
							disabled={!editPermission?.canUse}
							onClick={() => {
								onCopiedClicked(record)
							}}
						>
							<CopyOutlined />
						</Typography.Link>
					</Space>
				)
			},
		},
		{
			title: t('Label_ScratchCard'),
			key: 'scratchCard',
			width: 100,
			align: 'center' as 'center',
			render: (record: IGetBonusListData) => {
				const { isSpecial, specialCode } = record
				return (
					<Space style={{ padding: '5px' }} size='middle'>
						<Typography.Link
							disabled={!editPermission?.canUse || !isSpecial}
							onClick={() => {
								navigate(
									`/${NEW_SITE_PREFIX_URL}/${paths.marketing.sub.bonusManagement.root}/scratchCard/${specialCode}`
								)
							}}
						>
							<EditFilled />
						</Typography.Link>
					</Space>
				)
			},
		},
		{
			title: t('Label_BonusCode'),
			key: 'bonusCode',
			dataIndex: 'bonusCode',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Currency'),
			key: 'currencyList',
			dataIndex: 'currencyList',
			width: 80,
			align: 'center' as 'center',
			render: (currencys: string[]) => {
				return currencys.length > 0 ? (
					<Space style={{ padding: '5px' }}>
						{currencys?.map((currency, index) => {
							return index === currencys.length - 1 ? (
								<Typography.Text>{currency}</Typography.Text>
							) : (
								<>
									<Typography.Text>{currency}</Typography.Text>
									<Typography.Text>,</Typography.Text>
								</>
							)
						})}
					</Space>
				) : (
					'N/A'
				)
			},
		},
		{
			title: t('Label_PromotionType'),
			key: 'promotionType',
			dataIndex: 'promotionType',
			width: 80,
			align: 'center' as 'center',
			render: (type: number) => {
				const promotionType = find(
					promotionList,
					promotion => promotion.type === type
				)?.promotionTypeName

				return (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
						{promotionType ?? 'N/A'}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_DeviceType'),
			key: 'promotionDeviceType',
			dataIndex: 'promotionDeviceType',
			width: 80,
			align: 'center' as 'center',
			render: (deviceType: number) => {
				const typeName = find(
					devicesList,
					device => device.value === deviceType
				)?.displayName
				return (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
						{typeName ? t(typeName) : '-'}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_Description'),
			key: 'description',
			dataIndex: 'description',
			width: 100,
			align: 'center' as 'center',
		},
		{
			title: t('Label_WalletType'),
			key: 'walletType',
			dataIndex: 'walletType',
			width: 100,
			align: 'center' as 'center',
			render: (walletType: number) => {
				const displayName = find(
					walletTypeList,
					type => type.value === walletType
				)?.displayName

				return (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
						{displayName ? t(displayName) : '-'}
					</Typography.Text>
				)
			},
		},
		{
			title: t('Label_ProductCategory'),
			key: 'categoryName',
			dataIndex: 'categoryName',
			width: 80,
			align: 'center' as 'center',
			render: (categoryName: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{categoryName || '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_Sort'),
			key: 'sort',
			dataIndex: 'sort',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_ScratchCode'),
			key: 'bonusCode',
			dataIndex: 'bonusCode',
			width: 80,
			align: 'center' as 'center',
		},
		{
			title: t('Label_ActiveFrom'),
			key: 'periodFrom',
			dataIndex: 'periodFrom',
			width: 80,
			align: 'center' as 'center',
			render: (activeFrom: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{activeFrom
						? moment(activeFrom).utcOffset(0).format('YYYY-MM-DD  HH:mm:ss')
						: 'N/A'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_ActiveTo'),
			key: 'periodTo',
			dataIndex: 'periodTo',
			width: 80,
			align: 'center' as 'center',
			render: (activeTo: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{activeTo
						? moment(activeTo).utcOffset(0).format('YYYY-MM-DD  HH:mm:ss')
						: 'N/A'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_LastUpdateUser'),
			key: 'lastUpdateUser',
			dataIndex: 'lastUpdateUser',
			width: 80,
			align: 'center' as 'center',
			render: (updateUser: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{updateUser ?? '-'}
				</Typography.Text>
			),
		},
		{
			title: t('Label_LastUpdateTime'),
			key: 'lastUpdateTime',
			dataIndex: 'lastUpdateTime',
			width: 120,
			align: 'center' as 'center',
			render: (lastUpdateTime: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '10px' }}>
					{lastUpdateTime
						? moment(lastUpdateTime)
								.utcOffset(timeZoneUtcOffset)
								.format('YYYY-MM-DD  HH:mm:ss')
						: '-'}
				</Typography.Text>
			),
		},
	]
	return (
		<LayoutContent.Card>
			<Table
				loading={loading}
				columns={columns}
				dataSource={bonusList ?? []}
				pagination={pagination as TablePaginationConfig}
				onChange={onTableChange}
			/>
		</LayoutContent.Card>
	)
}

export { BonusManagementTable }
