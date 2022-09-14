import React, { FC, useContext, useEffect } from 'react'
import {
	Checkbox,
	Col,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Row,
	Select,
	Space,
	Spin,
	Typography,
} from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { IGetPromotionTypeData } from 'features/bonusManagement/type'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import moment from 'moment/moment'
import {
	BonusTypeEnum,
	DevicesEnum,
	devicesList,
	PeriodTypeEnum,
	periodTypeList,
	PromotionActionEnum,
	promotionActionList,
	WalletTypeEnum,
	walletTypeList,
} from 'features/bonusManagement/constants'
import { MultipleSelect } from 'components/Select'
import { IVipLevelsData } from 'common/service/allDataApi'
import { head } from 'lodash'
import { multiEqual } from 'features/bonusManagement/utils'
import { EditBonusContext } from 'features/bonusManagement/editBonusDetail/editBonusContext'

interface IBonusDetailMainForm {
	loading: boolean
	bonusTypeList: IGetPromotionTypeData[]
	vipLevelList: IVipLevelsData[]
	isEdit: boolean
}

const { Option } = Select
const { RangePicker } = DatePicker

const BonusDetailMainForm: FC<IBonusDetailMainForm> = ({
	loading,
	bonusTypeList,
	vipLevelList,
	isEdit,
}) => {
	const { t } = useTranslation()
	const { form, categoryList, editPermission, currentActiveCurrency } =
		useContext(EditBonusContext)
	const currentBonusType = Form.useWatch('bonusType', form)
	const sameByActive = Form.useWatch('sameByActive', form)
	const displayDate = Form.useWatch('displayDate', form)
	// 是否有勾選 special code
	const isSpecialCode = Form.useWatch('isSpecial', form)

	const vipLevelSelect = () => {
		const onChangeVipLevel = (newLevel: Array<number | string>) => {
			if (newLevel.length > 1) {
				if (newLevel[0] === 'all') {
					// 先選 selectAll 再選其他選項 , 代表不要全選 , 移除 'all'
					newLevel.splice(0, 1)
					form?.setFieldsValue({
						selectedVipLevel: newLevel,
					})
				} else if (newLevel.includes('all')) {
					// 先選其他選項才按 selectAll = 全選 移除其他選項
					form?.setFieldsValue({
						selectedVipLevel: ['all'],
					})
				}
			} else {
				// firstPick , Array.length === 1
				form?.setFieldsValue({
					selectedVipLevel: newLevel,
				})
			}
		}
		return (
			<Form.Item name='selectedVipLevel' label={t('Label_VipLevel')}>
				<MultipleSelect
					onChange={onChangeVipLevel}
					placeholder={t('Label_Select')}
				>
					{vipLevelList?.length > 1 && (
						<Option value='all'>{t('Label_All')}</Option>
					)}
					{vipLevelList?.map(vipLevel => (
						<Option key={vipLevel.level} value={vipLevel.level}>
							{vipLevel.levelName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	useEffect(() => {
		// 如果有勾選 sameByActive , 則兩個欄位 value 都一樣
		if (sameByActive) {
			form?.setFieldsValue({
				activeDate: displayDate,
			})
		}
	}, [sameByActive, displayDate])

	useEffect(() => {
		// create 模式才賦予初始值
		if (!loading && categoryList.length > 0 && !isEdit) {
			form?.setFieldsValue({
				categoryId: head(categoryList)?.id,
			})
		}
	}, [loading])

	return (
		<Spin spinning={loading}>
			<LayoutContent.Card>
				<Form
					form={form}
					layout='vertical'
					initialValues={{
						bonusType: BonusTypeEnum.Null,
						sameByActive: false,
						mainFormActive: true,
						promotionDeviceType: DevicesEnum.All,
						walletType: WalletTypeEnum?.Transfer,
						selectedVipLevel: ['all'],
						periodType: PeriodTypeEnum.Daily,
						promotionAction: PromotionActionEnum.Detail,
						autoExtend: false,
					}}
				>
					<Row>
						<Form.Item
							name='mainFormActive'
							valuePropName='checked'
							style={{ marginBottom: '10px' }}
						>
							<Checkbox disabled={!editPermission?.canUse}>
								{t('Label_Active')}
							</Checkbox>
						</Form.Item>
					</Row>
					<Row gutter={16}>
						<Col lg={8} md={8} sm={12}>
							<Form.Item
								name='bonusCode'
								label={t('Label_BonusCode')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_BonusCode'),
										}),
									},
								]}
							>
								<Input disabled={isEdit} />
							</Form.Item>
						</Col>
						<Col lg={16} md={16} sm={12}>
							<Form.Item
								name='description'
								label={t('Label_Description')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_Description'),
										}),
									},
								]}
							>
								<Input />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col lg={8} md={8} sm={10}>
							<Form.Item name='bonusType' label={t('Label_BonusType')}>
								<Select
									placeholder={t('Label_Select')}
									disabled={isEdit}
									onChange={() => {
										// 只有 Manual 可以設定 promotionAction 其餘預設都是 detail
										form?.setFieldsValue({
											promotionAction: PromotionActionEnum.Detail,
										})
									}}
								>
									{/* 預設為null */}
									<Option value={0}>{t('Label_Null')}</Option>
									{bonusTypeList?.map(bonusType => (
										<Option key={bonusType.type} value={bonusType.type}>
											{bonusType.promotionTypeName}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						{multiEqual(currentBonusType as number, [
							BonusTypeEnum.FirstDeposit as number,
							BonusTypeEnum.ReDeposit as number,
							BonusTypeEnum.FreeBet as number,
						]) && (
							<Col lg={14} md={14} sm={14}>
								<Form.Item
									name='specialCode'
									label={
										<Space>
											<Form.Item
												name='isSpecial'
												valuePropName='checked'
												noStyle
											>
												<Checkbox disabled={isEdit}>
													{t('Label_ScratchCode')}
												</Checkbox>
											</Form.Item>
											{/* 是 freeBet 然後 有勾specialCode 才可以設定 newMember  */}
											{currentBonusType === BonusTypeEnum.FreeBet &&
												isSpecialCode && (
													<Form.Item
														name='onlyRegistered'
														valuePropName='checked'
														noStyle
													>
														<Checkbox disabled={isEdit}>
															{t('Label_NewMember')}
														</Checkbox>
													</Form.Item>
												)}
										</Space>
									}
								>
									<Input disabled={!isSpecialCode || isEdit} />
								</Form.Item>
							</Col>
						)}
					</Row>
					<Row gutter={16}>
						<Col lg={16} md={12} xs={12}>
							<Form.Item
								label={
									<Space size='middle'>
										<Typography.Text>{t('Label_DisplayDate')}</Typography.Text>
										<Form.Item
											name='sameByActive'
											valuePropName='checked'
											noStyle
										>
											<Checkbox>{t('Label_SameByActive')}</Checkbox>
										</Form.Item>
										<Form.Item
											name='autoExtend'
											valuePropName='checked'
											noStyle
										>
											<Checkbox>{t('Label_AutoExtend')}</Checkbox>
										</Form.Item>
									</Space>
								}
							>
								<Input.Group compact style={{ width: '100%', display: 'flex' }}>
									<Form.Item
										noStyle
										name='displayDate'
										initialValue={MOMENT_DATE_RANGES.Today}
										rules={[
											{
												required: true,
												message: t('Label_DateRangeRequire'),
											},
										]}
									>
										<RangePicker
											style={{ width: '100%' }}
											ranges={MOMENT_RANGE_PICKER_RANGES([
												'Today',
												'Last 7 Day',
												'This Month',
											])}
											showTime
											onChange={newDateRange =>
												form?.setFieldsValue({
													startDate: moment(newDateRange?.[0]),
													endDate: moment(newDateRange?.[1]),
												})
											}
										/>
									</Form.Item>
								</Input.Group>
							</Form.Item>
						</Col>
						{multiEqual(currentBonusType as number, [
							BonusTypeEnum.ReDeposit as number,
						]) && (
							<Col lg={6} md={6} sm={6}>
								<Form.Item name='periodType' label={t('Label_PeriodType')}>
									<Select
										placeholder={t('Label_Select')}
										disabled={
											// 此欄位只有 當BonusType = ReDeposit 時在 edit 狀態不可修改
											currentBonusType === BonusTypeEnum.ReDeposit && isEdit
										}
									>
										{periodTypeList?.map(type => (
											<Option key={type.value} value={type.value}>
												{t(type.displayName)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						)}
					</Row>
					<Row gutter={16}>
						<Col lg={16} md={12} xs={12}>
							<Form.Item label={t('Label_ActiveDate')}>
								<Input.Group compact style={{ width: '100%', display: 'flex' }}>
									<Form.Item
										noStyle
										name='activeDate'
										initialValue={MOMENT_DATE_RANGES.Today}
										rules={[
											{
												required: true,
												message: t('Label_DateRangeRequire'),
											},
										]}
									>
										<RangePicker
											disabled={sameByActive}
											style={{ width: '100%' }}
											ranges={MOMENT_RANGE_PICKER_RANGES([
												'Today',
												'Last 7 Day',
												'This Month',
											])}
											showTime
											onChange={newDateRange =>
												form?.setFieldsValue({
													startDate: moment(newDateRange?.[0]),
													endDate: moment(newDateRange?.[1]),
												})
											}
										/>
									</Form.Item>
								</Input.Group>
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='expiryDays'
								label={t('Label_ExpiryDays')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_ExpiryDays'),
										}),
									},
									{
										type: 'number',
										min: 0,
									},
								]}
							>
								<InputNumber
									type='number'
									controls={false}
									style={{ width: '100%' }}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16} align='middle'>
						<Col lg={8} md={12} xs={12}>
							<Form.Item name='promotionDeviceType' label={t('Label_Device')}>
								<Select>
									{devicesList?.map(device => (
										<Option key={device.value} value={device.value}>
											{t(device.displayName)}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={8} md={12} xs={12}>
							<Form.Item
								name='sort'
								label={t('Label_Sort')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_Sort'),
										}),
									},
									{
										type: 'number',
										min: 0,
									},
								]}
							>
								<InputNumber
									type='number'
									controls={false}
									style={{ width: '100%' }}
								/>
							</Form.Item>
						</Col>
					</Row>
					{/* Rebate type 不可選以下三者  */}
					{currentBonusType !== BonusTypeEnum.Rebate && (
						<Row>
							<Col lg={16} md={16} sm={16}>
								{vipLevelSelect()}
							</Col>
						</Row>
					)}
					{currentBonusType !== BonusTypeEnum.Rebate && (
						<Row gutter={16}>
							<Col lg={8} md={8} xs={12}>
								<Form.Item name='walletType' label={t('Label_WalletType')}>
									<Select
										placeholder={t('Label_Select')}
										onChange={() => {
											form?.resetFields(['categoryId'])
										}}
									>
										{walletTypeList?.map(type => (
											<Option key={type.value} value={type.value}>
												{t(type.displayName)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={8} md={8} xs={12}>
								<Form.Item
									name='categoryId'
									label={t('Label_Category')}
									rules={[
										{
											required: true,
											message: t('Label_Required', {
												key: t('Label_Category'),
											}),
										},
									]}
								>
									<Select
										onChange={() =>
											// 切換category 後重置
											form?.setFieldsValue({
												specific: {
													[currentActiveCurrency.isoCode]: {
														products: [],
													},
												},
											})
										}
									>
										{categoryList?.map(category => {
											return (
												<Option key={category.id} value={category.id}>
													{category.name}
												</Option>
											)
										})}
									</Select>
								</Form.Item>
							</Col>
						</Row>
					)}
					{currentBonusType === BonusTypeEnum.ManualBonus && (
						<Row>
							<Col span={8}>
								<Form.Item
									name='promotionAction'
									label={t('Label_PromotionAction')}
								>
									<Select>
										{promotionActionList.map(action => (
											<Option key={action.value} value={action.value}>
												{t(action.displayName)}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
					)}
				</Form>
			</LayoutContent.Card>
		</Spin>
	)
}

export { BonusDetailMainForm }
