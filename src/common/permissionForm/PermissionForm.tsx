import { FC } from 'react'
import { find, some } from 'lodash'
import { Checkbox, Col, Divider, Row, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { FormPermissionInterface, PermissionInterface } from 'type'

interface PermissionFormProps {
	permissionList: FormPermissionInterface[]
	originAdminPermissionList: undefined | any[]
	onCheckAllPermission: (displayKey: number, settings: any[]) => void
	onPermissionChange: ({
		displayKey,
		permissionId,
	}: {
		displayKey: number
		permissionId: number
	}) => void
}

const PermissionForm: FC<PermissionFormProps> = ({
	permissionList,
	originAdminPermissionList,
	onPermissionChange,
	onCheckAllPermission,
}) => {
	const { t } = useTranslation()

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

		const findPermissionByDisplayKey = find(permissionList, {
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
					: settings.map((setting: PermissionInterface) => {
							const isChecked = some(
								findPermissionByDisplayKey?.permissionIdList,
								permissionId => permissionId === setting.permissionId
							)

							return (
								<Col lg={6} md={6} xs={12} key={setting.permissionId}>
									<Checkbox
										checked={isChecked}
										disabled={!setting.enable}
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

	const renderPermissionForm = () => {
		const el: any = []

		originAdminPermissionList?.forEach((permission: any) => {
			el.push(
				<div key={permission.name}>
					{renderPermissionCheckBoxItem(permission)}
					<Divider />
				</div>
			)
		})

		return el
	}

	return renderPermissionForm()
}

export { PermissionForm }
