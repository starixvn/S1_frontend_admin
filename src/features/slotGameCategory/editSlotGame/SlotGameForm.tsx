import { useTranslation } from 'react-i18next'
import { head } from 'lodash'
import React from 'react'
import { MultipleSelect } from 'components/Select'
import { Currency } from 'common/enum/type'
import { CheckOutlined } from '@ant-design/icons'
import { PermissionInterface } from 'type'
import {
	Button,
	Checkbox,
	Col,
	Form,
	FormInstance,
	Input,
	Row,
	Select,
	Space,
	Spin,
	Typography,
} from 'antd'
import { LayoutContent } from 'app/pages/layout'
import {
	IGetTpListData,
	ISlotCategoryListData,
} from 'features/slotGameCategory/type'
import { InputNumber } from 'components'
import { DeviceEnum, deviceList } from 'features/slotGameCategory/constants'

interface ISlotGameFormProps {
	loading: boolean
	isEditMode: boolean
	form: FormInstance
	updated: boolean
	tpList: IGetTpListData[]
	currencyListBySite: Currency[]
	editPermission?: PermissionInterface
	slotCategoryList: ISlotCategoryListData[]
	onSetNewSlotGame: () => void
}

const { Option } = Select

const SlotGameForm = ({
	form,
	tpList,
	loading,
	isEditMode,
	updated,
	editPermission,
	slotCategoryList,
	currencyListBySite,
	onSetNewSlotGame,
}: ISlotGameFormProps) => {
	const { t } = useTranslation()

	// 這裡新增的 Category 下拉跟外面 table Set Category 共用同個 api ， 但因為後端不吃 0 這個參數
	// 所以需在這裡先濾掉 (從後端直接拔除 All (set Status ) 這個物件會影響搜尋的切換)
	const filteredSlotCategoryList = slotCategoryList.filter(({ id }) => id !== 0)
	const categorySelector = () => {
		const onChangeCategory = (newCategoryIds: Array<number | string>) => {
			if (newCategoryIds.includes('all')) {
				form.setFieldsValue({
					categoryIds: filteredSlotCategoryList?.map(item => item.id),
				})
			} else {
				form.setFieldsValue({
					categoryIds: newCategoryIds,
				})
			}
		}

		return (
			<Col lg={6} md={12} xs={12}>
				<Form.Item name='categoryIds' label={t('Label_Category')}>
					<MultipleSelect
						onChange={onChangeCategory}
						placeholder={t('Label_Select')}
					>
						{(filteredSlotCategoryList?.length as number) > 1 && (
							<Option value='all'>{t('Label_SelectAll')}</Option>
						)}

						{filteredSlotCategoryList?.map(({ id, name }) => (
							<Option key={id} value={id}>
								{name}
							</Option>
						))}
					</MultipleSelect>
				</Form.Item>
			</Col>
		)
	}

	const currencyIdsSelector = () => {
		const onChangeCurrency = (newCurrencyIds: number[]) => {
			if (newCurrencyIds.includes(0)) {
				form.setFieldsValue({
					currencyIds: currencyListBySite?.map(item => item.currencyId),
				})
			} else {
				form.setFieldsValue({
					currencyIds: newCurrencyIds,
				})
			}
		}

		return (
			<Col lg={6} md={12} xs={12}>
				<Form.Item name='currencyIds' label={t('Label_Currency')}>
					<MultipleSelect
						onChange={onChangeCurrency}
						placeholder={t('Label_Select')}
					>
						{(currencyListBySite?.length as number) > 1 && (
							<Option value={0}>{t('Label_SelectAll')}</Option>
						)}

						{currencyListBySite?.map(item => (
							<Option key={item.currencyId} value={item.currencyId}>
								{item.isoCode}
							</Option>
						))}
					</MultipleSelect>
				</Form.Item>
			</Col>
		)
	}

	return (
		<Spin spinning={loading}>
			<LayoutContent.Card>
				<Typography.Title level={5} type='warning'>
					{t('Label_AddSlotFunction_Step1')}
				</Typography.Title>
				<Form
					form={form}
					layout='vertical'
					// 上傳後即 disabled 異動框
					disabled={!editPermission?.canUse || updated}
					initialValues={{
						device: DeviceEnum.All,
						tpId: head(tpList)?.tpId,
						fun: false,
						currencyIds: [],
						categoryIds: [],
					}}
				>
					<Row align='middle' gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='tpId'
								label={t('Label_Vender')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_Vender'),
										}),
									},
								]}
							>
								<Select
									placeholder={t('Label_Select')}
									disabled={isEditMode}
									showSearch
									filterOption={(input, option) => {
										const isIncludes: boolean = (
											option!.children as unknown as string
										)
											.toLowerCase()
											.includes(input.toLowerCase())

										return isIncludes
									}}
								>
									{tpList?.map(tp => (
										<Option key={tp.tpId} value={tp.tpId}>
											{tp.tpName}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='gameId'
								label={t('Label_GameId')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_GameId'),
										}),
									},
								]}
							>
								<Input disabled={isEditMode} />
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='enName'
								label={t('Label_EnName')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_EnName'),
										}),
									},
								]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='csName'
								label={t('Label_CsName')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_CsName'),
										}),
									},
								]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item name='rtp' label={`${t('Label_RTP')} (%)`}>
								<InputNumber />
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item name='reel' label={t('Label_Reel')}>
								<Input />
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='device'
								label={
									<Space size='middle'>
										<Typography.Text>{t('Label_Device')}</Typography.Text>
										<Form.Item name='fun' valuePropName='checked' noStyle>
											<Checkbox>{t('Label_DemoSupport')}</Checkbox>
										</Form.Item>
									</Space>
								}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_Device'),
										}),
									},
								]}
							>
								<Select>
									{deviceList?.map(device => (
										<Option key={device.value} value={device.value}>
											{t(device.displayName)}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item name='payLine' label={t('Label_PayLine')}>
								<Input />
							</Form.Item>
						</Col>
						{/* 新增模式才可以做 category 與 currencyId 的選擇 */}
						{!isEditMode && (
							<>
								{currencyIdsSelector()}
								{categorySelector()}
							</>
						)}
					</Row>
				</Form>
				{!updated && (
					<Row justify='end' align='middle'>
						<Col>
							<Button
								loading={loading}
								icon={<CheckOutlined />}
								onClick={onSetNewSlotGame}
								type='primary'
							>
								{t('Label_Submit')}
							</Button>
						</Col>
					</Row>
				)}
			</LayoutContent.Card>
		</Spin>
	)
}

export { SlotGameForm }
