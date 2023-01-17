import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import {
	Col,
	Row,
	Form,
	Spin,
	Input,
	Modal,
	Select,
	Button,
	Switch,
	FormInstance,
} from 'antd'
import { Table } from 'components'
import { PermissionInterface } from 'type'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import { IEditForm, IGameTypeBetLimit } from 'features/betLimit/type'

interface IEditBetLimitModalProps {
	form: FormInstance<IEditForm>
	isAdd: boolean
	isOpen: boolean
	loading: boolean
	editPermission?: PermissionInterface
	gameTypeBetLimitList?: IGameTypeBetLimit[]
	onCancel: () => void
	onCloseModal: () => void
	onSetBetLimit: () => void
	onTableChange: ({
		categoryId,
		typeId,
		checked,
		group,
	}: {
		categoryId: number
		typeId: number
		checked?: boolean
		group?: string
	}) => void
	onSearchUserName: () => void
	onGetTpCategoryList: () => void
	onGetBetLimitByCustId: () => void
}

const EditBetLimitModal = ({
	form,
	isAdd,
	isOpen,
	loading,
	editPermission,
	gameTypeBetLimitList,
	onCancel,
	onCloseModal,
	onSetBetLimit,
	onTableChange,
	onSearchUserName,
	onGetTpCategoryList,
	onGetBetLimitByCustId,
}: IEditBetLimitModalProps) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { currencyId } = form.getFieldsValue(['currencyId'])

	const currency =
		currencyListBySite.find(
			({ currencyId: siteCurrencyId }) => currencyId === siteCurrencyId
		)?.isoCode ?? 'N/A'

	useEffect(() => {
		if (isAdd) {
			onGetTpCategoryList()
		} else {
			onGetBetLimitByCustId()
		}
	}, [isOpen])

	const columns = [
		{
			title: t('Label_Status'),
			key: 'checked',
			width: 60,
			align: 'center' as 'center',
			render: ({ categoryId, typeId, checked }: IGameTypeBetLimit) => (
				<Switch
					checked={checked}
					disabled={!editPermission?.canUse}
					onChange={() => onTableChange({ categoryId, typeId, checked })}
				/>
			),
		},
		{
			title: t('Label_Category'),
			key: 'categoryName',
			dataIndex: 'categoryName',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_Product'),
			key: 'typeName',
			dataIndex: 'typeName',
			width: 60,
			align: 'center' as 'center',
		},
		{
			title: t('Label_LimitGroup'),
			key: 'limitGroup',
			width: 200,
			align: 'center' as 'center',
			render: ({
				typeId,
				checked,
				categoryId,
				limitGroup,
				selectedValue,
			}: IGameTypeBetLimit) => {
				const selectedRange = limitGroup.find(
					({ group }) => group === selectedValue
				)?.range

				return (
					<Select
						placeholder={selectedRange}
						style={{ width: '50%' }}
						disabled={!checked || !editPermission?.canUse}
						onSelect={(group: string) =>
							onTableChange({ categoryId, typeId, group })
						}
					>
						{limitGroup?.map(({ group, range }) => (
							<Select.Option key={group} value={group}>
								{range}
							</Select.Option>
						))}
					</Select>
				)
			},
		},
	]

	return (
		<Modal
			title={t('Label_EditBetLimit')}
			open={isOpen}
			onCancel={onCancel}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			onOk={onSetBetLimit}
			width='60vw'
			confirmLoading={loading}
			afterClose={onCloseModal}
		>
			<Spin spinning={loading}>
				<Form form={form} layout='vertical' initialValues={{ currency }}>
					<Row gutter={16} align='middle'>
						<Col span={12}>
							<Form.Item
								name='userName'
								label={t('Label_MemberId')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_MemberId'),
										}),
									},
								]}
							>
								<Input disabled={!editPermission?.canUse || !isAdd} />
							</Form.Item>
						</Col>
						{isAdd && (
							<Form.Item label=' '>
								<Col>
									<Button
										loading={loading}
										type='primary'
										htmlType='submit'
										icon={<SearchOutlined />}
										onClick={onSearchUserName}
									>
										{t('Label_Search')}
									</Button>
								</Col>
							</Form.Item>
						)}
						{!isAdd && (
							<Col span={12}>
								<Form.Item name='currency' label={t('Label_Currency')}>
									<Input disabled />
								</Form.Item>
							</Col>
						)}
					</Row>
					{gameTypeBetLimitList && (
						<Table
							loading={loading}
							columns={columns}
							dataSource={gameTypeBetLimitList}
							pagination={false}
						/>
					)}
				</Form>
			</Spin>
		</Modal>
	)
}

export { EditBetLimitModal }
