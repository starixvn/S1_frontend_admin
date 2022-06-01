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
	Spin,
} from 'antd'
import { useAppDispatch, useAppSelector } from 'app/store'
import { selectRoleManagementDataList } from 'features/roleManagement/slice'
import { fetchPermissionGetRoleListAsync } from 'features/roleManagement/thunk'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { MultipleSelect } from 'components/Select'
import { selectAllCurrencyList, selectUserSite } from 'common/enum'
import { LockOutlined } from '@ant-design/icons'
import PermissionForm from 'common/permissionForm'
import { FormPermissionInterface } from 'type'
import { useLocation } from 'react-router-dom'
import paths from 'app/constants/paths'

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
	const location = useLocation()
	const dispatch = useAppDispatch()
	const userSite = useAppSelector(selectUserSite)
	const allCurrencyList = useAppSelector(selectAllCurrencyList)

	const selectedCurrencyList: number[] =
		form.getFieldValue('currencyList') ?? []

	const userAllCurrencyList = _.uniq([
		...selectedCurrencyList,
		...roleCurrencyList,
	])

	const userAllCurrencyWithoutRoleCurrency = _.filter(
		selectedCurrencyList,
		currency => !_.includes(roleCurrencyList, currency)
	)

	const filteredAllCurrencyListByUser = allCurrencyList.filter(currency =>
		_.some(
			userAllCurrencyList,
			userCurrency => userCurrency === currency.currencyId
		)
	)

	const roleManagementDataList = useAppSelector(selectRoleManagementDataList)

	const filteredRoleBySelectedCurrencyList = roleManagementDataList.filter(
		roleManagementData => {
			return _.intersection(
				roleManagementData.icurrencyList,
				selectedCurrencyList
			).length
		}
	)

	const onChangeCurrency = (newCurrencyList: number[]) => {
		let result = []

		if (newCurrencyList.length === 0) {
			result = userAllCurrencyWithoutRoleCurrency
		} else {
			result = newCurrencyList.includes(0)
				? userAllCurrencyList
				: newCurrencyList
		}

		form.setFieldsValue({
			currencyList: result,
			role: null,
		})
		onRoleChange(null)
	}

	useEffect(() => {
		dispatch(
			fetchPermissionGetRoleListAsync({
				roleName: '',
				siteId: userSite?.siteId,
			})
		)
	}, [])

	const isPasswordEnable = form.getFieldValue('password') === null

	const isEdit = Boolean(
		location.pathname.match(paths.administration.sub.editUserSetting.root)
	)

	return (
		<Spin spinning={loading}>
			<LayoutContent.Card>
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
								<Input allowClear disabled={isEdit} />
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
										<Option
											key={item.currencyId}
											disabled={!_.includes(roleCurrencyList, item.currencyId)}
											value={item.currencyId}
										>
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
									{filteredRoleBySelectedCurrencyList?.map(item => (
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
			</LayoutContent.Card>
		</Spin>
	)
}

export default UserSettingsForm
