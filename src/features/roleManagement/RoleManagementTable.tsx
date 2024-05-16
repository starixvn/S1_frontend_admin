import {
	Space,
	Button,
	List,
	Modal,
	Popconfirm,
	Table,
	Typography,
	TablePaginationConfig,
} from 'antd'
import { NEW_SITE_PREFIX_URL } from 'app/config'
import paths from 'app/constants/paths'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { PAGINATION } from 'common/hooks'
import { find } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { PermissionInterface } from 'type'
import { CloseOutlined } from '@ant-design/icons'
import { selectRoleManagementDataList } from './slice'

interface RoleManagementTableInterface {
	loading: boolean
	onDelete: (role: number) => void
	deletePermission?: PermissionInterface
	editPermission?: PermissionInterface
}

const RoleManagementTable = ({
	loading,
	onDelete,
	deletePermission,
	editPermission,
}: RoleManagementTableInterface) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const allCurrencyList = useAppSelector(state => state.allEnum.allCurrencyList)
	const roleManagementDataList = useAppSelector(selectRoleManagementDataList)

	const onOpenUserListingInfo = ({
		roleName,
		iuserList,
	}: {
		roleName: string
		iuserList: { userName: string; status: number }[] | null
	}) => {
		Modal.info({
			title: 'User Listing',
			content: (
				<>
					<h5>Role Name : {roleName}</h5>

					<div
						id='scrollableDiv'
						style={{
							maxHeight: 400,
							overflow: 'auto',
						}}
					>
						<List
							size='small'
							itemLayout='horizontal'
							bordered
							dataSource={iuserList ?? []}
							renderItem={({ userName, status }) => (
								<List.Item
									style={{
										display: 'flex',
										justifyContent: 'start',
										marginLeft: status !== 0 ? '14px' : 0,
									}}
								>
									<Typography.Text type='danger'>
										{status === 0 && <CloseOutlined />}
									</Typography.Text>
									<Typography.Text>{userName}</Typography.Text>
								</List.Item>
							)}
						/>
					</div>
				</>
			),
		})
	}

	const columns = [
		{
			title: t('Label_Action'),
			key: 'operation',
			width: 80,
			align: 'center' as 'center',
			render: (values: any) => (
				<Space>
					<Popconfirm
						disabled={!deletePermission?.canUse}
						title={t('Label_SureToDelete')}
						onConfirm={() => onDelete(values.role)}
					>
						<Typography.Link disabled={!deletePermission?.canUse}>
							{t('Label_Delete')}
						</Typography.Link>
					</Popconfirm>

					<Typography.Link
						disabled={!editPermission?.canUse}
						onClick={() =>
							navigate(
								`/${NEW_SITE_PREFIX_URL}/${paths.administration.sub.editRoleManagement.root}/${values.role}`
							)
						}
					>
						{t('Label_Edit')}
					</Typography.Link>
				</Space>
			),
		},
		{
			title: t('Label_RoleName'),
			dataIndex: 'roleName',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Remark'),
			dataIndex: 'remark',
			width: 120,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Currency'),
			key: 'currency',
			dataIndex: 'icurrencyList',
			width: 120,
			align: 'center' as 'center',
			render: (icurrencyList: number[]) => {
				const currency = icurrencyList.map(
					currencyId => find(allCurrencyList, { currencyId })?.isoCode
				)

				return currency.filter(Boolean).join('/')
			},
		},
		{
			title: t('Label_CheckUserListing'),
			key: 'iuserList',
			width: 120,
			align: 'center' as 'center',
			render: (values: any) => {
				const { roleName, iuserList } = values

				return (
					<Button
						type='link'
						onClick={() => {
							onOpenUserListingInfo({ roleName, iuserList })
						}}
					>
						{t('Label_UserListing', { count: iuserList?.length ?? 0 })}
					</Button>
				)
			},
		},
	]

	return (
		<LayoutContent.Card>
			<Table
				bordered
				size='small'
				scroll={{ x: 240 }}
				loading={loading}
				columns={columns}
				dataSource={roleManagementDataList}
				pagination={PAGINATION as TablePaginationConfig}
			/>
		</LayoutContent.Card>
	)
}

export { RoleManagementTable }
