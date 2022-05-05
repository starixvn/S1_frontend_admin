import { FC, useEffect } from 'react'
import _ from 'lodash'
import {
	Col,
	Divider,
	Form,
	FormInstance,
	Input,
	Row,
	Select,
	Skeleton,
} from 'antd'
import { useAppDispatch, useAppSelector } from 'app/store'
import { selectRoleManagementDataList } from 'features/roleManagement/slice'
import { fetchPermissionGetRoleListAsync } from 'features/roleManagement/thunk'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { MultipleSelect } from 'components/Select'
import { selectAllCurrencyList } from 'common/enum'
import { LockOutlined } from '@ant-design/icons'
import PermissionForm from 'common/permissionForm'
import { FormPermissionInterface } from 'type'

const { Option } = Select

interface UserSettingsFormInterface {
	loading: boolean
	form: FormInstance
	permissionList: FormPermissionInterface[]
	roleCurrencyList: number[]
	originAdminPermissionList: any[]
	onRoleChange?: (role: number | null) => void
	onPermissionChange: ({
		displayKey,
		permissionId,
	}: {
		displayKey: number
		permissionId: number
	}) => void
	onCheckAllPermission: (displayKey: number, settings: any[]) => void
}

const UserSettingsForm: FC<UserSettingsFormInterface> = ({
	loading,
	form,
	permissionList,
	originAdminPermissionList,
	roleCurrencyList,
	onRoleChange = () => null,
	onPermissionChange,
	onCheckAllPermission,
}) => {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()
	const allCurrencyList = useAppSelector(selectAllCurrencyList)
	const filteredAllCurrencyListByUser = allCurrencyList.filter(currency =>
		_.some(
			roleCurrencyList,
			userCurrency => userCurrency === currency.currencyId
		)
	)

	const roleManagementDataList = useAppSelector(selectRoleManagementDataList)

	const onChangeCurrency = (newCurrencyList: number[]) => {
		const currencyList = newCurrencyList.includes(0)
			? filteredAllCurrencyListByUser.map(item => item.currencyId)
			: newCurrencyList

		form.setFieldsValue({ currencyList, role: null })
		onRoleChange(null)
	}

	useEffect(() => {
		dispatch(fetchPermissionGetRoleListAsync(''))
	}, [])

	const isPasswordEnable = form.getFieldValue('password') === null

	return (
		<LayoutContent.Card>
			{loading ? (
				<Skeleton />
			) : (
				<Form form={form} layout='vertical'>
					<Row align='middle' gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='userName'
								label={t('Label_UserName')}
								rules={[
									{
										required: true,
										message: t('Label_UserNameRequire'),
									},
								]}
							>
								<Input allowClear />
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='password'
								label={t('Label_Password')}
								rules={[
									{
										required: !isPasswordEnable,
										message: t('Label_PasswordRequire'),
									},
								]}
							>
								<Input.Password
									allowClear
									disabled={isPasswordEnable}
									prefix={<LockOutlined />}
									type='password'
								/>
							</Form.Item>
						</Col>

						<Col lg={6} md={12} xs={12}>
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
								<MultipleSelect
									onChange={onChangeCurrency}
									placeholder='select'
								>
									{(filteredAllCurrencyListByUser?.length as number) > 1 && (
										<Option value={0}>{t('Label_SelectAll')}</Option>
									)}

									{filteredAllCurrencyListByUser.map(item => (
										<Option key={item.currencyId} value={item.currencyId}>
											{item.isoCode}
										</Option>
									))}
								</MultipleSelect>
							</Form.Item>
						</Col>

						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='role'
								label='Role'
								rules={[
									{
										required: true,
										message: t('Label_RoleRequire'),
									},
								]}
							>
								<Select
									placeholder='select'
									onChange={role => onRoleChange(role)}
								>
									{roleManagementDataList?.map(item => (
										<Option key={item.role} value={item.role}>
											{item.roleName}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Divider />

					<PermissionForm
						originAdminPermissionList={originAdminPermissionList}
						permissionList={permissionList}
						onPermissionChange={onPermissionChange}
						onCheckAllPermission={onCheckAllPermission}
					/>
				</Form>
			)}
		</LayoutContent.Card>
	)
}

export default UserSettingsForm
