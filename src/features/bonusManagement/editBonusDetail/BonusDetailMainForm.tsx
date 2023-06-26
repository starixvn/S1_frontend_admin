import React, { FC, useContext, useEffect } from 'react'
import { head } from 'lodash'
import {
	Button,
	Checkbox,
	Col,
	DatePicker,
	Form,
	Input,
	Row,
	Select,
	Space,
	Spin,
	Typography,
} from 'antd'
import { InputNumber } from 'components'
import { RcFile } from 'antd/es/upload'
import {
	DownloadOutlined,
	UploadOutlined,
	ProfileOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import { IGetPromotionTypeData } from 'features/bonusManagement/type'
import {
	MOMENT_DATE_RANGES,
	MOMENT_RANGE_PICKER_RANGES,
} from 'app/constants/moment'
import moment, { Moment } from 'moment/moment'
import {
	BonusTypeEnum,
	devicesDetailList,
	DevicesDetailEnum,
	PeriodTypeEnum,
	periodTypeList,
	PromotionActionEnum,
	promotionActionList,
	WalletTypeEnum,
	walletTypeList,
} from 'features/bonusManagement/constants'
import { MultipleSelect } from 'components/Select'
import { IVipLevelsData } from 'common/service/allDataApi'
import { multiEqual } from 'features/bonusManagement/utils'
import { EditBonusContext } from 'features/bonusManagement/editBonusDetail/editBonusContext'
import { ITagData } from 'features/memberAdministrationList/type'
import { StyleUpload } from 'features/bankCardManagement/StyleUpload'
import { UploadProps } from 'antd/es/upload/interface'
import { xlsxMimeType } from 'features/balanceAdjustment/balanceAdjustment/BalanceAdjustmentForm'

interface IBonusDetailMainForm {
	loading: boolean
	uploadUsingListLoading: boolean
	bonusTypeList: IGetPromotionTypeData[]
	vipLevelList: IVipLevelsData[]
	tagList: ITagData[]
	isEdit: boolean
	onUploadUsingList: (file: RcFile) => void
	onClickMemberList: () => void
}

const { Option } = Select
const { RangePicker } = DatePicker

const BonusDetailMainForm: FC<IBonusDetailMainForm> = ({
	loading,
	uploadUsingListLoading,
	isEdit,
	bonusTypeList,
	vipLevelList,
	tagList,
	onUploadUsingList,
	onClickMemberList,
}) => {
	const { t } = useTranslation()
	const { form, categoryList, editPermission, currentActiveCurrency } =
		useContext(EditBonusContext)
	const currentBonusType = Form.useWatch('bonusType', form)
	const sameByActive = Form.useWatch('sameByActive', form)
	// * displayDate => 後端有情境會回傳 [null,null]
	const displayDate: [Moment | null, Moment | null] = Form.useWatch(
		'displayDate',
		form
	)

	// 是否有勾選 special code
	const isSpecialCode = Form.useWatch('isSpecial', form)
	// * isDisplayDate 可以決定前台是否顯示該 Bonus, 當沒有打勾時前台的 Bonus 會被隱藏
	const isDisplayDate = Form.useWatch('isDisplayDate', form)

	// 監聽三個 checkbox , 供 count input disable 設定
	const isSameIPRestrict = Form.useWatch('sameIPRestrict', form)
	const isSameDeviceIDRestrict = Form.useWatch('sameDeviceIDRestrict', form)
	const isSameRealNameRestrict = Form.useWatch('sameRealNameRestrict', form)

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

	const tagsSelect = () => {
		const handleChangeTags = (newTags: number[]) => {
			if (newTags.includes(0)) {
				form?.setFieldsValue({
					blockTagList: tagList?.map(({ id }) => id),
				})
			} else {
				form?.setFieldsValue({
					blockTagList: newTags,
				})
			}
		}
		return (
			<Form.Item
				name='blockTagList'
				label={t('Label_TaggingRestrict')}
				style={{ width: '100%' }}
			>
				<MultipleSelect onChange={handleChangeTags}>
					{(tagList?.length as number) > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}

					{tagList?.map(({ id, tagName }) => (
						<Option key={id} value={id}>
							{tagName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	// userList 的 excel 上傳功能
	const uploadProps: UploadProps = {
		accept: xlsxMimeType,
		maxCount: 1,
		beforeUpload: file => {
			onUploadUsingList(file)
			return false
		},
		fileList: [],
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
						mainFormActive: false,
						promotionDeviceType: DevicesDetailEnum.All,
						walletType: WalletTypeEnum?.Transfer,
						selectedVipLevel: ['all'],
						periodType: PeriodTypeEnum.Daily,
						promotionAction: PromotionActionEnum.Detail,
						autoExtend: false,
						isDisplayDate: true,
						blockTagList: [],
						sameIPRestrict: false,
						sameDeviceIDRestrict: false,
						sameRealNameRestrict: false,
					}}
					disabled={!editPermission?.canUse}
				>
					<Row>
						<Space>
							<Form.Item
								name='mainFormActive'
								valuePropName='checked'
								style={{ marginBottom: '10px' }}
							>
								<Checkbox disabled={!editPermission?.canUse}>
									{t('Label_Active')}
								</Checkbox>
							</Form.Item>
							<Form.Item
								name='hideForUnlogin'
								valuePropName='checked'
								style={{ marginBottom: '10px' }}
							>
								<Checkbox disabled={!editPermission?.canUse}>
									{t('Label_hideForUnLogin')}
								</Checkbox>
							</Form.Item>
						</Space>
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
									onChange={value => {
										if (
											value === BonusTypeEnum.FreeBet ||
											value === BonusTypeEnum.DeviceBonus
										) {
											form?.setFieldsValue({
												sameIPRestrict: true,
												sameIPRestrictAvailableCount: 1,
											})
										} else {
											form?.resetFields([
												'sameIPRestrict',
												'sameIPRestrictAvailableCount',
											])
										}
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
							BonusTypeEnum.DeviceBonus as number,
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
											{(currentBonusType === BonusTypeEnum.FreeBet ||
												currentBonusType === BonusTypeEnum.DeviceBonus) &&
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
										<Form.Item
											name='isDisplayDate'
											valuePropName='checked'
											noStyle
										>
											<Checkbox>{t('Label_isDisplayDate')}</Checkbox>
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
											disabled={!isDisplayDate}
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
							BonusTypeEnum.DeviceBonus as number,
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
								<InputNumber />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16} align='middle'>
						<Col lg={8} md={12} xs={12}>
							<Form.Item name='promotionDeviceType' label={t('Label_Device')}>
								<Select>
									{devicesDetailList?.map(device => (
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
								<InputNumber />
							</Form.Item>
						</Col>
					</Row>

					{currentBonusType === BonusTypeEnum.RetentionFreeBet && (
						// bonus using list
						<Row gutter={16} align='middle'>
							<Col span={8}>
								<Form.Item label={t('Label_MemberListUpload')}>
									<Link
										to='/exampleFile/SendBonusUsingList.xlsx'
										download='SendBonusUsingList.xlsx'
										target='_blank'
										style={{ color: 'white' }}
									>
										<Button type='primary' icon={<DownloadOutlined />} block>
											{t('Label_TemplateFile')}
										</Button>
									</Link>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label={` `}>
									<StyleUpload {...uploadProps} disabled={!isEdit}>
										<Button
											icon={<UploadOutlined />}
											loading={uploadUsingListLoading}
											disabled={!isEdit}
										>
											{t('Label_Upload', { key: t('Label_File') })}
										</Button>
									</StyleUpload>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label={` `}>
									<Button
										icon={<ProfileOutlined />}
										block
										type='primary'
										onClick={onClickMemberList}
										disabled={!isEdit}
									>
										{t('Label_MemberList')}
									</Button>
								</Form.Item>
							</Col>
						</Row>
					)}
					{multiEqual(currentBonusType as number, [
						BonusTypeEnum.FirstDeposit as number,
						BonusTypeEnum.FreeBet as number,
						BonusTypeEnum.DeviceBonus as number,
					]) && (
						<>
							<Row gutter={16} align='middle'>
								<Col lg={8} md={12} xs={12}>
									<Form.Item
										name='sameDeviceIDAvailableCount'
										label={
											<Form.Item
												name='sameDeviceIDRestrict'
												valuePropName='checked'
												noStyle
											>
												<Checkbox
													onChange={e => {
														const value = e.target.checked
														if (value) {
															form?.setFieldsValue({
																sameDeviceIDAvailableCount: 1,
															})
														} else {
															form?.setFieldsValue({
																sameDeviceIDAvailableCount: null,
															})
														}
													}}
												>
													{t('Label_SameDeviceIDRestrictCount')}
												</Checkbox>
											</Form.Item>
										}
									>
										<InputNumber disabled={!isSameDeviceIDRestrict} />
									</Form.Item>
								</Col>
								<Col lg={8} md={12} xs={12}>
									<Form.Item
										name='sameRealNameRestrictAvailableCount'
										label={
											<Form.Item
												name='sameRealNameRestrict'
												valuePropName='checked'
												noStyle
											>
												<Checkbox
													onChange={e => {
														const value = e.target.checked
														if (value) {
															form?.setFieldsValue({
																sameRealNameRestrictAvailableCount: 1,
															})
														} else {
															form?.setFieldsValue({
																sameRealNameRestrictAvailableCount: null,
															})
														}
													}}
												>
													{t('Label_SameRealNameRestrictCount')}
												</Checkbox>
											</Form.Item>
										}
									>
										<InputNumber disabled={!isSameRealNameRestrict} />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={16} align='middle'>
								<Col lg={8} md={12} xs={12}>
									<Form.Item
										name='sameIPRestrictAvailableCount'
										label={
											<Form.Item
												name='sameIPRestrict'
												valuePropName='checked'
												noStyle
											>
												<Checkbox
													onChange={e => {
														const value = e.target.checked
														if (value) {
															form?.setFieldsValue({
																sameIPRestrictAvailableCount: 1,
															})
														} else {
															form?.setFieldsValue({
																sameIPRestrictAvailableCount: null,
															})
														}
													}}
												>
													{t('Label_SameIPRestrictCount')}
												</Checkbox>
											</Form.Item>
										}
									>
										<InputNumber disabled={!isSameIPRestrict} />
									</Form.Item>
								</Col>
							</Row>
						</>
					)}
					{/* Rebate type 不可選以下三者  */}
					{currentBonusType !== BonusTypeEnum.Rebate && (
						<>
							<Row>
								<Col lg={16} md={16} sm={16}>
									{vipLevelSelect()}
								</Col>
							</Row>
							<Row>
								<Col lg={16} md={16} xs={16}>
									{tagsSelect()}
								</Col>
							</Row>
						</>
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
