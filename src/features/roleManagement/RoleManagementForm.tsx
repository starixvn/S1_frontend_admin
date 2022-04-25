import _ from 'lodash'
import {
	Divider,
	Checkbox,
	Col,
	Form,
	FormInstance,
	Input,
	Row,
	Select,
	Typography,
} from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useAppDispatch } from 'app/store'
import { selectAllCurrencyList } from 'common/enum'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectAllRolePermission } from './slice'
import { fetchPermissionGetAllRolePermissionAsync } from './thunk'
import { FormPermissionInterface } from './AddRoleManagement'

const { Option } = Select

interface RoleManagementFormInterface {
	form: FormInstance
	permissionList: FormPermissionInterface[]
	onPermissionChange: ({
		displayKey,
		permissionId,
	}: {
		displayKey: number
		permissionId: number
	}) => void
}

const RoleManagementForm = ({
	form,
	permissionList,
	onPermissionChange,
}: RoleManagementFormInterface) => {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()

	const allRolePermission = useSelector(selectAllRolePermission)
	const allCurrencyList = useSelector(selectAllCurrencyList)

	const filteredAllCurrencyListByRole = allCurrencyList.filter(currency =>
		_.some(
			allRolePermission.currencyList,
			roleCurrency => roleCurrency === currency.currencyId
		)
	)

	const onChangeCurrency = (newCurrencyList: number[]) => {
		if (newCurrencyList.includes(0)) {
			form.setFieldsValue({
				currencyList: filteredAllCurrencyListByRole.map(
					item => item.currencyId
				),
			})
		} else {
			form.setFieldsValue({ currencyList: newCurrencyList })
		}
	}

	const renderPermissionGroupCheckBox = (rolePermission: any) => {
		return (
			<Col span={24} style={{ marginLeft: 48 }}>
				{rolePermission?.functionDatas?.map((functionData: any) =>
					renderPermissionCheckBoxItem(functionData)
				)}

				{rolePermission?.subLayerDatas?.map((subLayerData: any) =>
					renderPermissionCheckBoxItem(subLayerData)
				)}
			</Col>
		)
	}

	const renderPermissionCheckBoxItem = (rolePermission: any) => {
		const { moduleId, disPlayKey, settings } = rolePermission

		const isGroup = Boolean(moduleId)

		const findPermissionByDisplayKey = _.find(permissionList, {
			displayKey: disPlayKey,
		})

		return (
			<Row gutter={4}>
				<Col span={24} style={{ marginBottom: 4 }}>
					<Typography.Text strong>{rolePermission.name}：</Typography.Text>
				</Col>

				{isGroup
					? renderPermissionGroupCheckBox(rolePermission)
					: settings.map((setting: any) => {
							const isChecked = _.some(
								findPermissionByDisplayKey?.permissionIdList,
								permission => permission === setting.permissionId
							)

							return (
								<Col lg={6} md={6} xs={12}>
									<Checkbox
										checked={isChecked}
										value={setting.permissionId}
										style={{ lineHeight: '12px' }}
										onChange={() =>
											onPermissionChange({
												displayKey: disPlayKey,
												permissionId: setting.permissionId,
											})
										}
									>
										{setting.name}
									</Checkbox>
								</Col>
							)
					  })}
			</Row>
		)
	}

	useEffect(() => {
		dispatch(fetchPermissionGetAllRolePermissionAsync())
	}, [])

	return (
		<LayoutContent.Card>
			<Form form={form} size='small' layout='vertical'>
				<Row align='middle' gutter={8}>
					<Col lg={6} md={6} xs={12}>
						<Form.Item
							name='roleName'
							label={t('Label_RoleName')}
							rules={[
								{
									required: true,
									message: t('Label_RoleNameRequire'),
								},
							]}
						>
							<Input />
						</Form.Item>
					</Col>

					<Col lg={6} md={6} xs={12}>
						<Form.Item name='remark' label={t('Label_Remark')}>
							<Input />
						</Form.Item>
					</Col>

					<Col lg={6} md={6} xs={12}>
						<Form.Item
							name='currencyList'
							label={t('Label_Currency')}
							rules={[
								{
									required: true,
									message: t('Label_CurrencyRequire'),
								},
							]}
						>
							<Select
								allowClear
								mode='multiple'
								onChange={onChangeCurrency}
								style={{ width: '100%' }}
							>
								<Option value={0}>{t('Label_SelectAll')}</Option>

								{filteredAllCurrencyListByRole.map(item => (
									<Option key={item.currencyId} value={item.currencyId}>
										{item.isoCode}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Divider />

				{allRolePermission.permission.map((rolePermission: any) => (
					<>
						{renderPermissionCheckBoxItem(rolePermission)}
						<Divider />
					</>
				))}
			</Form>
		</LayoutContent.Card>
	)
}

export { RoleManagementForm }
