import { head, filter } from 'lodash'
import { Table } from 'components'
import { PermissionInterface } from 'type'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { Col, Form, Modal, Row, Select, Switch } from 'antd'
import {
	IHeaderSettingData,
	ILobbyCategoryData,
	IFilterProductStatusModalForm,
	IHeaderSettingEnum,
} from 'features/headerManagement/type'
import { useGetHeaderSettingListQuery } from 'features/headerManagement/api'

interface IProductStatusModalProps {
	loading: boolean
	visible: boolean
	onCancel: () => void
	lobbyCategoryList: ILobbyCategoryData[]
	formCurrencyId: number | undefined
	editPermission?: PermissionInterface
	onSetStatus: (id: number, status: boolean) => void
}

const { Option } = Select

const ProductStatusModal = ({
	loading,
	visible,
	onCancel,
	lobbyCategoryList,
	formCurrencyId,
	editPermission,
	onSetStatus,
}: IProductStatusModalProps) => {
	const { t } = useTranslation()
	const [filterModalForm] = Form.useForm<IFilterProductStatusModalForm>()
	const formLobbyCategoryId = Form.useWatch('lobbyCategoryId', filterModalForm)
	const { siteId } = useAppSelector(selectUserSite) ?? {}

	const { data: { data: headerManagementModalList = [] } = {} } =
		useGetHeaderSettingListQuery(
			{
				siteId,
				currencyId: formCurrencyId,
				lobbyCategoryId: formLobbyCategoryId,
			},
			{ skip: !siteId || !formCurrencyId || !formLobbyCategoryId }
		)

	// 單向開關 status 是 1 才會顯示在 Modal
	const headerManagementWithStatusList = filter(headerManagementModalList, {
		status: IHeaderSettingEnum.True,
	})

	const columns = [
		{
			title: t('Label_Category'),
			key: 'lobbyCategory',
			dataIndex: 'lobbyCategory',
			width: '40%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Product'),
			key: 'productName',
			dataIndex: 'productName',
			width: '40%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_Status'),
			key: 'status',
			width: '20%',
			align: 'center' as 'center',
			render: (record: IHeaderSettingData) => {
				const { id, status } = record
				return (
					<Switch
						disabled={!editPermission?.canUse}
						checked={Boolean(status)}
						onClick={value => {
							onSetStatus(id, value)
						}}
					/>
				)
			},
		},
	]

	return (
		<Modal
			open={visible}
			title={
				<div style={{ textAlign: 'center' }}>{t('Label_ProductStatus')}</div>
			}
			onCancel={onCancel}
			footer={false}
		>
			<Row align='middle' justify='center'>
				<Col span={12}>
					<Form
						layout='vertical'
						size='middle'
						form={filterModalForm}
						initialValues={{
							lobbyCategoryId: Number(head(lobbyCategoryList)?.id),
						}}
					>
						<Form.Item label={t('Label_LobbyCategory')} name='lobbyCategoryId'>
							<Select placeholder='select'>
								{lobbyCategoryList.map(({ id, name }) => (
									<Option key={Number(id)} value={Number(id)}>
										{name}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Form>
				</Col>
			</Row>
			<Table
				loading={loading}
				columns={columns}
				dataSource={headerManagementWithStatusList}
				pagination={false}
				scroll={{ y: 400 }}
			/>
		</Modal>
	)
}

export default ProductStatusModal
