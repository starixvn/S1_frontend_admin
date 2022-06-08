import { FC } from 'react'
import moment from 'moment'
import { find } from 'lodash'
import { useNavigate } from 'react-router-dom'
import {
	Popconfirm,
	Space,
	Table,
	Typography,
	TablePaginationConfig,
	FormInstance,
} from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { GoKey } from 'react-icons/go'
import { timeFormat } from 'common/utils/format'

import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { selectAllCurrencyList } from 'common/enum'
import { ModalState, PAGINATION } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { PermissionInterface } from 'type'
import { UserAdminState } from './type'

interface UserSettingsTableProps {
	form: FormInstance
	loading: boolean
	userAdminList: UserAdminState[]
	timeZoneUtcOffset: number
	updatePasswordModal: ModalState
	changePasswordPermission?: PermissionInterface
	editPermission?: PermissionInterface
	setActivePermission?: PermissionInterface
	onSetAdminUserStatus: (userId: number, status: number) => void
}

const UserSettingsTable: FC<UserSettingsTableProps> = ({
	form,
	loading,
	userAdminList,
	timeZoneUtcOffset,
	changePasswordPermission,
	editPermission,
	setActivePermission,
	updatePasswordModal,
	onSetAdminUserStatus,
}) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const allCurrencyList = useAppSelector(selectAllCurrencyList)

	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: 80,
			align: 'center' as 'center',
			render: (values: any) => (
				<Space>
					<Popconfirm
						disabled={!setActivePermission?.canUse}
						title={t('Label_AreYouSure')}
						onConfirm={() => onSetAdminUserStatus(values.userId, values.status)}
					>
						<Typography.Link
							disabled={!setActivePermission?.canUse}
							type={values.status === 1 ? 'success' : 'danger'}
						>
							{values.status === 1 ? <CheckOutlined /> : <CloseOutlined />}
						</Typography.Link>
					</Popconfirm>

					<Typography.Link
						disabled={!changePasswordPermission?.canUse}
						type='secondary'
						onClick={() => {
							form.setFieldsValue({
								userId: values.userId,
							})

							updatePasswordModal.onOpen()
						}}
					>
						<GoKey style={{ marginTop: '8px' }} />
					</Typography.Link>

					<Typography.Link
						disabled={!editPermission?.canUse}
						onClick={() =>
							navigate(
								`/${NEW_SITE_PREFIX_URL}/${paths.administration.sub.editUserSetting.root}/${values.userId}`
							)
						}
					>
						{t('Label_Edit')}
					</Typography.Link>
				</Space>
			),
		},
		{
			title: t('Label_UserName'),
			key: 'userName',
			dataIndex: 'userName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_RoleName'),
			key: 'roleName',
			dataIndex: 'roleName',
			width: 120,
			align: 'center' as 'center',
			render: (roleName: string | null) => roleName || 'N/A',
		},
		{
			title: t('Label_Brand'),
			key: 'siteName',
			dataIndex: 'siteName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'icurrencyList',
			width: 120,
			align: 'center' as 'center',
			render: (icurrencyList: number[] | null) => {
				const currency = icurrencyList?.map(
					currencyId => find(allCurrencyList, { currencyId })?.isoCode
				)

				return currency?.filter(Boolean).join('/')
			},
		},
		{
			title: t('Label_LoginTime'),
			key: 'loginTime',
			dataIndex: 'loginTime',
			width: 120,
			align: 'center' as 'center',
			render: (loginTime: string) =>
				loginTime
					? moment(loginTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: 120,
			align: 'center' as 'center',
			render: (updateTime: string) =>
				updateTime
					? moment(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)
					: '',
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				bordered
				rowKey={record => record.userId}
				size='small'
				scroll={{ x: 240 }}
				loading={loading}
				columns={columns}
				dataSource={userAdminList}
				pagination={PAGINATION as TablePaginationConfig}
			/>
		</LayoutContent.Card>
	)
}

export { UserSettingsTable }
