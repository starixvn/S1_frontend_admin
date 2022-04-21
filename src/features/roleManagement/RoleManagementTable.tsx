import { Button, List, Modal, Table, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import {
	selectRoleManagementDataList,
	selectRoleManagementStatus,
} from './slice'

const RoleManagementTable = () => {
	const { t } = useTranslation()
	const allCurrencyList = useAppSelector(state => state.allEnum.allCurrencyList)
	const roleManagementDataList = useAppSelector(selectRoleManagementDataList)
	const roleManagementStatus = useAppSelector(selectRoleManagementStatus)

	const onOpenUserListingInfo = ({
		roleName,
		iuserList,
	}: {
		roleName: string
		iuserList: string[] | null
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
							renderItem={user => (
								<List.Item>
									<Typography.Text>{user}</Typography.Text>
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
			render: () => <span>action</span>,
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
					currencyId => _.find(allCurrencyList, { currencyId })?.isoCode
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

	const loading = roleManagementStatus === 'pending'

	return (
		<LayoutContent.Card>
			<Table
				bordered
				size='small'
				scroll={{ x: 240 }}
				loading={loading}
				columns={columns}
				dataSource={roleManagementDataList}
			/>
		</LayoutContent.Card>
	)
}

export { RoleManagementTable }
