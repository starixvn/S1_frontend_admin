import React, { FC, useContext, useEffect } from 'react'
import {
	Button,
	Checkbox,
	Col,
	Form,
	Input,
	InputNumber,
	Row,
	Select,
	Spin,
	Typography,
} from 'antd'
import { useTranslation } from 'react-i18next'
import {
	AmountTypeEnum,
	amountTypeList,
	BonusTypeEnum,
} from 'features/bonusManagement/constants'
import { multiEqual } from 'features/bonusManagement/utils'
import { Currency } from 'common/enum/type'
import { MultipleSelect } from 'components/Select'
import { find, isNumber } from 'lodash'
import { EditBonusContext } from 'features/bonusManagement/editBonusDetail/editBonusContext'
import { useLazyGetCashBackGameListQuery } from 'features/bonusManagement/api'
import { IGetCashBackGameListResponse } from 'features/bonusManagement/type'
import { EditOutlined } from '@ant-design/icons'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'

interface IBonusDetailSubFormProps {
	loading: boolean
	currency: Currency
}

const { Option } = Select

const BonusDetailSubForm: FC<IBonusDetailSubFormProps> = ({
	loading,
	currency,
}) => {
	const { t } = useTranslation()
	const { isoCode, currencyId } = currency
	const {
		form,
		categoryList,
		editPermission,
		setCurrentTabActive,
		onSetGroupBonusClick,
	} = useContext(EditBonusContext)
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const active = Form.useWatch(['specific', isoCode, 'active'], form)
	// amount type , percentage 或 amount
	const bonusType = Form.useWatch(['specific', isoCode, 'bonusType'], form)
	const minLoss = Form.useWatch(['specific', isoCode, 'minLoss'], form)
	const bonus = Form.useWatch(['specific', isoCode, 'bonus'], form)
	// Main Form 的 bonusType , 活動類型
	const currentBonusType = Form.useWatch('bonusType', form)
	const currentCategory = Form.useWatch('categoryId', form)

	// 因為這個 productList 只有在這裡用到 , 故直接從這裡撈資料
	const [
		getCashBackGameList,
		{
			data: { data: productList } = {} as IGetCashBackGameListResponse,
			isLoading: isGetCashBackListLoading,
		},
	] = useLazyGetCashBackGameListQuery()

	const handleGetCashBackGameList = async () => {
		const tpId = find(
			categoryList,
			category => category.id === currentCategory
		)?.tpId
		if (tpId === undefined) return
		form?.setFieldsValue({
			tpId,
		})
		await getCashBackGameList({ tpId, categoryId: currentCategory })
	}

	const productsSelect = () => {
		const onChangeProducts = (newProducts: Array<number | string>) => {
			if (newProducts.includes('all')) {
				form?.setFieldsValue({
					specific: {
						[isoCode]: {
							products: productList?.map(product => product.key),
						},
					},
				})
			} else {
				form?.setFieldsValue({
					specific: {
						[isoCode]: {
							products: newProducts,
						},
					},
				})
			}
		}
		return (
			<Form.Item
				name={['specific', isoCode, 'products']}
				label={t('Label_Product')}
				rules={[
					{
						required: active,
						message: t('Label_Required', {
							key: t('Label_Product'),
						}),
					},
				]}
			>
				<MultipleSelect
					onChange={onChangeProducts}
					placeholder={t('Label_Select')}
					disabled={!active}
				>
					{productList?.length > 1 && (
						<Option value='all'>{t('Label_All')}</Option>
					)}
					{productList?.map(product => (
						<Option key={product.key} value={product.key}>
							{product.gameName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	useEffect(() => {
		// 紀錄當前 currencyId 供 detail card 獲取語系資料
		if (!loading) {
			form?.setFieldsValue({
				specific: {
					[isoCode]: {
						currencyId,
					},
				},
			})
		}
	}, [loading])

	useEffect(() => {
		// 切換 Active 狀態後 , 更新控制 detail 區域是否顯示
		// 當前 tab 渲染時才會觸發此機制
		if (setCurrentTabActive) {
			setCurrentTabActive(active)
		}
	}, [active])

	useEffect(() => {
		if (currentCategory && !loading) {
			handleGetCashBackGameList()
		}
	}, [currentCategory, loading])

	useEffect(() => {
		// cashBack 才需要計算 minLoss
		if (currentBonusType !== BonusTypeEnum.CashBack) return
		let minPayout: number
		// 都有值才計算
		if (isNumber(bonus) && isNumber(minLoss)) {
			minPayout = Math.floor(minLoss * (bonus / 100))
		} else {
			minPayout = 0
		}
		form?.setFieldsValue({
			specific: {
				[isoCode]: {
					minPayout,
				},
			},
		})
	}, [minLoss, bonus])

	useEffect(() => {
		// 這兩個 type 沒有 winOver
		if (
			currentBonusType === BonusTypeEnum.RetentionFreeBet ||
			currentBonusType === BonusTypeEnum.ManualBonus
		) {
			form?.setFieldsValue({
				specific: {
					[isoCode]: {
						winOver: 0,
					},
				},
			})
		}

		if (
			currentBonusType === BonusTypeEnum.FreeBet ||
			currentBonusType === BonusTypeEnum.RetentionFreeBet
		) {
			form?.setFieldsValue({
				specific: {
					[isoCode]: {
						bonusType: AmountTypeEnum.Amount,
					},
				},
			})
		}
	}, [currentBonusType])

	return (
		<Spin spinning={loading || isGetCashBackListLoading}>
			{currentBonusType === BonusTypeEnum.Null ? (
				<Row justify='center' align='middle' style={{ minHeight: '200px' }}>
					{/* 垂直水平居中,高度200px  */}
					<Typography.Title level={4} type='secondary'>
						{t('Label_SelectType')}
					</Typography.Title>
				</Row>
			) : (
				<Form
					form={form}
					initialValues={{
						specific: {
							[isoCode]: {
								bonusType: AmountTypeEnum.Percentage,
								rollOver: 0,
								winOver: 0,
								usage: 0,
								totalUsageLimit: 0,
								// 固定帶1
								lockedType: 1,
								vN_AffCodes: '',
								siteId,
								minPayout: 0,
								tierAmountList: [],
							},
						},
					}}
					layout='vertical'
				>
					<Row>
						<Form.Item
							name={['specific', isoCode, 'active']}
							valuePropName='checked'
							style={{ marginBottom: '10px' }}
						>
							<Checkbox disabled={!editPermission?.canUse}>
								{t('Label_Active')}
							</Checkbox>
						</Form.Item>
					</Row>

					{multiEqual(currentBonusType as number, [
						BonusTypeEnum.FirstDeposit as number,
						BonusTypeEnum.FreeBet as number,
					]) && (
						<>
							<Row gutter={16}>
								<Col span={8}>
									<Form.Item
										name={['specific', isoCode, 'vN_AffCodes']}
										label={t('Label_AffiliateCode')}
									>
										<Input disabled={!active} />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item
										name={['specific', isoCode, 'requiredAmount']}
										label={t('Label_RequiredAmount')}
										rules={[
											{
												required: active,
												message: t('Label_Required', {
													key: t('Label_RequiredAmount'),
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
											disabled={!active}
										/>
									</Form.Item>
								</Col>
							</Row>
							{currentBonusType === BonusTypeEnum.FreeBet ? (
								<Row>
									<Col span={8}>
										<Form.Item
											name={['specific', isoCode, 'bonus']}
											label={t('Label_BonusAmount')}
											rules={[
												{
													required: active,
													message: t('Label_Required', {
														key: t('Label_BonusAmount'),
													}),
												},
												{
													required: active,
													type: 'number',
													min: 0,
												},
											]}
										>
											<InputNumber
												style={{ width: '100%' }}
												type='number'
												controls={false}
												disabled={!active}
											/>
										</Form.Item>
									</Col>
								</Row>
							) : (
								<Row gutter={16}>
									<Col span={8}>
										<Form.Item
											name={['specific', isoCode, 'bonusType']}
											label={t('Label_AmountType')}
										>
											<Select disabled={!active}>
												{amountTypeList?.map(type => (
													<Option key={type.value} value={type.value}>
														{t(type.displayName)}
													</Option>
												))}
											</Select>
										</Form.Item>
									</Col>
									{bonusType === AmountTypeEnum.Percentage && (
										<>
											<Col span={8}>
												<Form.Item
													name={['specific', isoCode, 'bonus']}
													label={t('Label_Percentage')}
													rules={[
														{
															required: active,
															message: t('Label_Required', {
																key: t('Label_Percentage'),
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
														disabled={!active}
													/>
												</Form.Item>
											</Col>
											<Col span={6}>
												<Form.Item
													name={['specific', isoCode, 'maxBonus']}
													label={t('Label_MaxBonus')}
													rules={[
														{
															required: active,
															message: t('Label_Required', {
																key: t('Label_MaxBonus'),
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
														disabled={!active}
													/>
												</Form.Item>
											</Col>
										</>
									)}
									{bonusType === AmountTypeEnum.Amount && (
										<Col span={8}>
											<Form.Item
												name={['specific', isoCode, 'bonus']}
												label={t('Label_Bonus')}
												rules={[
													{
														required: active,
														message: t('Label_Required', {
															key: t('Label_Bonus'),
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
													disabled={!active}
												/>
											</Form.Item>
										</Col>
									)}
								</Row>
							)}

							<Row gutter={16}>
								<Col span={6}>
									<Form.Item
										name={['specific', isoCode, 'rollOver']}
										label={t('Label_Rollover')}
										help={t('Label_Default')}
										rules={[
											{
												validator: (_, value) => {
													const winOver = form?.getFieldValue([
														'specific',
														isoCode,
														'winOver',
													])
													return value > 0 && winOver > 0
														? Promise.reject()
														: Promise.resolve()
												},
												message: '',
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
											disabled={!active}
										/>
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item
										name={['specific', isoCode, 'winOver']}
										label={t('Label_WinOver')}
										rules={[
											{
												validator: (_, value) => {
													const rollOver = form?.getFieldValue([
														'specific',
														isoCode,
														'rollOver',
													])
													return value > 0 && rollOver > 0
														? Promise.reject()
														: Promise.resolve()
												},
											},
											{ type: 'number', min: 0 },
										]}
									>
										<InputNumber
											type='number'
											controls={false}
											style={{ width: '100%' }}
											disabled={!active}
										/>
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item
										name={['specific', isoCode, 'usage']}
										label={t('Label_DailyLimit')}
										rules={[
											{
												required: active,
												message: t('Label_Required', {
													key: t('Label_DailyLimit'),
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
											disabled={!active}
										/>
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item
										name={['specific', isoCode, 'totalUsageLimit']}
										label={t('Label_TotalLimit')}
										rules={[
											{
												required: active,
												message: t('Label_Required', {
													key: t('Label_TotalLimit'),
												}),
											},
											{ type: 'number', min: 0 },
										]}
									>
										<InputNumber
											type='number'
											controls={false}
											style={{ width: '100%' }}
											disabled={!active}
										/>
									</Form.Item>
								</Col>
							</Row>
						</>
					)}

					{currentBonusType === BonusTypeEnum.ReDeposit && (
						// TierRedepositBonus
						<>
							<Row gutter={16}>
								<Col span={8}>
									<Form.Item
										name={['specific', isoCode, 'vN_AffCodes']}
										label={t('Label_AffiliateCode')}
									>
										<Input disabled={!active} />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item
										name={['specific', isoCode, 'requiredAmount']}
										label={t('Label_RequiredAmount')}
										rules={[
											{
												required: active,
												message: t('Label_Required', {
													key: t('Label_RequiredAmount'),
												}),
											},
										]}
									>
										<Input disabled={!active} />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={16}>
								<Col span={8}>
									<Form.Item
										name={['specific', isoCode, 'bonusType']}
										label={t('Label_AmountType')}
									>
										<Select
											disabled={!active}
											onChange={() => {
												// 重置 tierAmountList
												form?.setFieldsValue({
													specific: {
														[isoCode]: {
															tierAmountList: undefined,
														},
													},
												})
											}}
										>
											{amountTypeList?.map(type => (
												<Option key={type.value} value={type.value}>
													{t(type.displayName)}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								{bonusType === AmountTypeEnum.Percentage && (
									<Col span={8}>
										<Form.Item label=' '>
											<Button
												type='primary'
												icon={<EditOutlined />}
												onClick={onSetGroupBonusClick}
												disabled={!active}
											>
												{t('Label_SetPercentageGroup')}
											</Button>
										</Form.Item>
									</Col>
								)}
								{bonusType === AmountTypeEnum.Amount && (
									<Col span={8}>
										<Form.Item label=' '>
											<Button
												type='primary'
												icon={<EditOutlined />}
												onClick={onSetGroupBonusClick}
												disabled={!active}
											>
												{t('Label_SetAmountGroup')}
											</Button>
										</Form.Item>
									</Col>
								)}
							</Row>
							<Row gutter={16}>
								<Col span={6}>
									<Form.Item
										name={['specific', isoCode, 'usage']}
										label={t('Label_DailyLimit')}
										rules={[
											{
												required: active,
												message: t('Label_Required', {
													key: t('Label_DailyLimit'),
												}),
											},
											{ type: 'number', min: 0 },
										]}
									>
										<InputNumber
											type='number'
											controls={false}
											style={{ width: '100%' }}
											disabled={!active}
										/>
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item
										name={['specific', isoCode, 'totalUsageLimit']}
										label={t('Label_TotalLimit')}
										rules={[
											{
												required: active,
												message: t('Label_Required', {
													key: t('Label_TotalLimit'),
												}),
											},
											{ type: 'number', min: 0 },
										]}
									>
										<InputNumber
											type='number'
											controls={false}
											style={{ width: '100%' }}
											disabled={!active}
										/>
									</Form.Item>
								</Col>
							</Row>
						</>
					)}
					{currentBonusType === BonusTypeEnum.CashBack && (
						// cashBack
						<>
							<Row>
								<Col span={24}>{productsSelect()}</Col>
							</Row>
							<Row gutter={16}>
								<Col span={6}>
									<Form.Item
										name={['specific', isoCode, 'bonus']}
										label={t('Label_Percentage')}
										rules={[
											{
												required: active,
												message: t('Label_Required', {
													key: t('Label_Percentage'),
												}),
											},
											{ type: 'number', min: 0 },
										]}
									>
										<InputNumber
											type='number'
											controls={false}
											style={{ width: '100%' }}
											disabled={!active}
										/>
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item
										name={['specific', isoCode, 'minLoss']}
										label={t('Label_MinLoss')}
										rules={[
											{
												required: active,
												message: t('Label_Required', {
													key: t('Label_MinLoss'),
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
											disabled={!active}
										/>
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item
										name={['specific', isoCode, 'minPayout']}
										label={t('Label_MinPayout')}
										rules={[
											{
												required: active,
												message: t('Label_Required', {
													key: t('Label_MinPayout'),
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
											disabled
										/>
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item
										name={['specific', isoCode, 'maxBonus']}
										label={t('Label_MaxBonus')}
										rules={[
											{
												required: active,
												message: t('Label_Required', {
													key: t('Label_MaxBonus'),
												}),
											},
											{ type: 'number', min: 0 },
										]}
									>
										<InputNumber
											type='number'
											controls={false}
											style={{ width: '100%' }}
											disabled={!active}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={16}>
								<Col span={6}>
									<Form.Item
										name={['specific', isoCode, 'rollOver']}
										label={t('Label_Rollover')}
										help={t('Label_Default')}
										rules={[
											{
												validator: (_, value) => {
													const winOver = form?.getFieldValue([
														'specific',
														isoCode,
														'winOver',
													])
													return value > 0 && winOver > 0
														? Promise.reject()
														: Promise.resolve()
												},
												message: '',
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
											disabled={!active}
										/>
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item
										name={['specific', isoCode, 'winOver']}
										label={t('Label_WinOver')}
										rules={[
											{
												validator: (_, value) => {
													const rollOver = form?.getFieldValue([
														'specific',
														isoCode,
														'rollOver',
													])
													return value > 0 && rollOver > 0
														? Promise.reject()
														: Promise.resolve()
												},
											},
											{ type: 'number', min: 0 },
										]}
									>
										<InputNumber
											type='number'
											controls={false}
											style={{ width: '100%' }}
											disabled={!active}
										/>
									</Form.Item>
								</Col>
							</Row>
						</>
					)}

					{currentBonusType === BonusTypeEnum.ManualBonus && (
						// Manual
						<>
							<Row gutter={16}>
								<Col lg={8} md={12} xs={24}>
									<Form.Item
										name={['specific', isoCode, 'vN_AffCodes']}
										label={t('Label_AffiliateCode')}
									>
										<Input disabled={!active} />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={16}>
								<Col lg={8} md={12} xs={24}>
									<Form.Item
										name={['specific', isoCode, 'maxBonus']}
										label={t('Label_MaxBonus')}
										rules={[
											{
												required: active,
												message: t('Label_Required', {
													key: t('Label_MaxBonus'),
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
											disabled={!active}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={16}>
								<Col lg={6} md={12} xs={12}>
									<Form.Item
										name={['specific', isoCode, 'rollOver']}
										label={t('Label_Rollover')}
										help={t('Label_Default')}
										rules={[
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
											disabled={!active}
										/>
									</Form.Item>
								</Col>
							</Row>
						</>
					)}

					{currentBonusType === BonusTypeEnum.RetentionFreeBet && (
						// free bet
						<>
							<Row>
								<Col lg={8} md={12} xs={24}>
									<Form.Item
										name={['specific', isoCode, 'bonus']}
										label={t('Label_BonusAmount')}
										rules={[
											{
												required: active,
												message: t('Label_Required', {
													key: t('Label_BonusAmount'),
												}),
											},
										]}
									>
										<Input disabled={!active} />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={16}>
								<Col lg={6} md={12} xs={12}>
									<Form.Item
										name={['specific', isoCode, 'rollOver']}
										label={t('Label_Rollover')}
										rules={[{ type: 'number', min: 0 }]}
									>
										<InputNumber
											type='number'
											controls={false}
											style={{ width: '100%' }}
											disabled={!active}
										/>
									</Form.Item>
								</Col>
							</Row>
						</>
					)}
					{currentBonusType === BonusTypeEnum.Rebate && (
						<Row justify='center' align='middle' style={{ minHeight: '150px' }}>
							{/* 垂直水平居中,高度200px  */}
							<Typography.Title level={5} type='secondary'>
								{t('Label_RebateTypeMessage')}
							</Typography.Title>
						</Row>
					)}
				</Form>
			)}
		</Spin>
	)
}

export { BonusDetailSubForm }
