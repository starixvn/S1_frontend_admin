import { useState } from 'react'
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
	Skeleton,
} from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useAppSelector } from 'app/store'
import { selectAllCurrencyList } from 'common/enum'
import { MultipleSelect } from 'components/Select'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectRolePermission } from './slice'
import { FormPermissionInterface } from './AddRoleManagement'

const { Option } = Select

export const useRoleManagementForm = () => {
	const [form] = Form.useForm()

	const [permissionList, setPermissionList] = useState<
		FormPermissionInterface[]
	>([])

	const handlePermissionChange = ({
		displayKey,
		permissionId,
	}: {
		displayKey: number
		permissionId: number
	}) => {
		const newPermissionList = _.cloneDeep(permissionList)
		const currentIndex = newPermissionList?.findIndex(
			permission => permission.displayKey === displayKey
		)

		if (currentIndex === -1) {
			setPermissionList([
				...newPermissionList,
				{
					displayKey,
					permissionIdList: [permissionId],
				},
			])
		} else {
			const originPermissionIdList =
				newPermissionList[currentIndex].permissionIdList
			let newPermissionIdList = []

			if (_.includes(originPermissionIdList, permissionId)) {
				newPermissionIdList = _.filter(
					originPermissionIdList,
					mapPermissionId => mapPermissionId !== permissionId
				)
			} else {
				newPermissionIdList = [...originPermissionIdList, permissionId]
			}

			newPermissionList[currentIndex] = {
				displayKey,
				permissionIdList: newPermissionIdList,
			}

			setPermissionList(newPermissionList)
		}
	}

	const handleCheckAllPermission = (displayKey: number, settings: any[]) => {
		const newPermissionList = _.cloneDeep(permissionList)
		const currentIndex = newPermissionList?.findIndex(
			permission => permission.displayKey === displayKey
		)

		const allPermissionIds: number[] = settings.map(
			(setting: any) => setting.permissionId
		)

		if (currentIndex === -1) {
			setPermissionList([
				...newPermissionList,
				{
					displayKey,
					permissionIdList: allPermissionIds,
				},
			])
		} else {
			const originPermissionIdList =
				newPermissionList[currentIndex].permissionIdList

			newPermissionList[currentIndex] = {
				displayKey,
				permissionIdList:
					originPermissionIdList.length === 0 ? allPermissionIds : [],
			}

			setPermissionList(newPermissionList)
		}
	}

	return {
		form,
		permissionList,
		setPermissionList,
		handlePermissionChange,
		handleCheckAllPermission,
	}
}

interface RoleManagementFormInterface {
	form: FormInstance
	loading: boolean
	permissionList: FormPermissionInterface[]
	onPermissionChange: ({
		displayKey,
		permissionId,
	}: {
		displayKey: number
		permissionId: number
	}) => void
	onCheckAllPermission: (displayKey: number, settings: any[]) => void
}

const RoleManagementForm = ({
	form,
	loading,
	permissionList,
	onPermissionChange,
	onCheckAllPermission,
}: RoleManagementFormInterface) => {
	const { t } = useTranslation()

	const allCurrencyList = useSelector(selectAllCurrencyList)
	const rolePermission = useAppSelector(selectRolePermission)
	const filteredAllCurrencyListByRole = allCurrencyList.filter(currency =>
		_.some(
			rolePermission?.currencyList,
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

	const renderPermissionGroupCheckBox = (permission: any) => {
		return (
			<Col span={24} style={{ marginLeft: 48 }}>
				{permission?.functionDatas?.map((functionData: any) =>
					renderPermissionCheckBoxItem(functionData)
				)}

				{permission?.subLayerDatas?.map((subLayerData: any) =>
					renderPermissionCheckBoxItem(subLayerData)
				)}
			</Col>
		)
	}

	const renderPermissionCheckBoxItem = (permission: any) => {
		const { moduleId, disPlayKey, settings } = permission

		const isGroup = Boolean(moduleId)

		const findPermissionByDisplayKey = _.find(permissionList, {
			displayKey: disPlayKey,
		})

		const permissionIdList = findPermissionByDisplayKey?.permissionIdList ?? []

		const checkAll = permissionIdList.length === settings?.length
		const indeterminate =
			!!permissionIdList.length && permissionIdList.length < settings?.length

		return (
			<Row gutter={4} key={permission.name}>
				<Col span={24} style={{ marginBottom: 4 }}>
					<Typography.Text strong>{permission.name}：</Typography.Text>
					{!isGroup && (
						<Checkbox
							checked={checkAll}
							indeterminate={indeterminate}
							onChange={() => onCheckAllPermission(disPlayKey, settings)}
						>
							{t('Label_CheckAll')}
						</Checkbox>
					)}
				</Col>

				{isGroup
					? renderPermissionGroupCheckBox(permission)
					: settings.map((setting: any) => {
							const isChecked = _.some(
								findPermissionByDisplayKey?.permissionIdList,
								permissionId => permissionId === setting.permissionId
							)

							return (
								<Col lg={6} md={6} xs={12} key={setting.permissionId}>
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

	return (
		<LayoutContent.Card>
			{loading ? (
				<Skeleton />
			) : (
				<Form form={form} layout='vertical'>
					<Row align='middle' gutter={16}>
						<Col lg={6} md={12} xs={12}>
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
								<Input allowClear />
							</Form.Item>
						</Col>

						<Col lg={6} md={12} xs={12}>
							<Form.Item name='remark' label={t('Label_Remark')}>
								<Input allowClear />
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
								<MultipleSelect onChange={onChangeCurrency}>
									{(filteredAllCurrencyListByRole?.length as number) > 1 && (
										<Option value={0}>{t('Label_SelectAll')}</Option>
									)}

									{filteredAllCurrencyListByRole.map(item => (
										<Option key={item.currencyId} value={item.currencyId}>
											{item.isoCode}
										</Option>
									))}
								</MultipleSelect>
							</Form.Item>
						</Col>
					</Row>

					<Divider />

					{rolePermission.permission.map((permission: any) => (
						<div key={permission.name}>
							{renderPermissionCheckBoxItem(permission)}
							<Divider />
						</div>
					))}
				</Form>
			)}
		</LayoutContent.Card>
	)
}

export { RoleManagementForm }
