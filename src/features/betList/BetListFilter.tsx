import React, { FC, useState } from 'react'
import dayjs from 'dayjs'
import { reject } from 'lodash'
import { useTranslation } from 'react-i18next'
import { SearchOutlined } from '@ant-design/icons'
import {
	Col,
	Collapse,
	Form,
	Input,
	Row,
	DatePicker,
	FormInstance,
	Button,
	Select,
} from 'antd'
import type { RangePickerProps } from 'antd/es/date-picker'
import { DATE_RANGES, RANGE_PICKER_RANGES } from 'app/constants/ranges'
import { LayoutContent } from 'app/pages/layout'
import { SiteIds } from 'app/constants/siteIds'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { MultipleSelect } from 'components/Select'
import { Currency, UserSite } from 'common/enum/type'
import { IMemberTypeData } from 'features/memberAdministrationList/type'
import { UserTypeEnum } from 'features/memberAdministrationList/constants'
import {
	IGetCategoryData,
	IGetGameListData,
	IGetProductsData,
	IGetProvidersData,
	IGetTagsData,
	IGetVipLevels,
} from './type'

interface BetListFilterInterface {
	form: FormInstance
	loading: boolean
	timeZoneUtcOffset?: number
	onSearch: ({
		current,
		pageSize,
		currentTimeZoneUtcOffset,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
		currentTimeZoneUtcOffset?: number
	}) => void
	onTimeZoneChange: (newUtcOffset: number) => void
	onChangeCurrency: (newCurrencyIds: number[]) => void
	currencyList: Currency[]
	providers: IGetProvidersData[]
	products: IGetProductsData[]
	categories: IGetCategoryData[]
	vipLevels: IGetVipLevels[]
	tagList: IGetTagsData[]
	memberTypeEnums: IMemberTypeData[]
	siteId?: number
	userSiteList: UserSite[]
	gameList: IGetGameListData[]
}
const { Panel } = Collapse
const { RangePicker } = DatePicker
const { Option } = Select

const BetListFilter: FC<BetListFilterInterface> = ({
	form,
	loading,
	timeZoneUtcOffset,
	onSearch,
	onTimeZoneChange,
	onChangeCurrency,
	currencyList,
	providers,
	products,
	categories,
	siteId,
	vipLevels,
	tagList,
	memberTypeEnums,
	userSiteList,
	gameList,
}) => {
	const { t } = useTranslation()
	const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
		''
	)
	// * IvorySport 為測試網站，不開放部分過濾條件，但保持默認參數，因此只隱藏元件
	const isHidePartOfFilter = siteId === SiteIds.IvorySport

	const handleCategoryChange = (e: string | undefined) => {
		if (e !== 'Sports') form.setFieldValue('game', '')
		setSelectedCategory(e)
	}
	const sportGamesSelect = () => (
		<Form.Item name='game' label={t('Label_Game')} hidden={isHidePartOfFilter}>
			<Select placeholder={t('Label_Select')} allowClear>
				{gameList?.map(({ name }) => (
					<Option key={name} value={name}>
						{name}
					</Option>
				))}
			</Select>
		</Form.Item>
	)

	const vipLevelSelect = () => (
		<Form.Item
			name='vipLevel'
			label={t('Label_VipLevel')}
			hidden={isHidePartOfFilter}
		>
			<Select placeholder={t('Label_Select')} allowClear>
				{vipLevels
					?.filter(item => item.siteId === siteId)
					.map(item => (
						<Option key={item.level} value={item.level}>
							{item.levelName}
						</Option>
					))}
			</Select>
		</Form.Item>
	)

	const tagListSelect = () => {
		const onChangeTags = (newTags: number[]) => {
			if (newTags.includes(0)) {
				form.setFieldsValue({
					tags: tagList?.map(tag => tag.id),
				})
			} else {
				form.setFieldsValue({
					tags: newTags,
				})
			}
		}
		return (
			<Form.Item name='tags' label={t('Label_Tag')} hidden={isHidePartOfFilter}>
				<MultipleSelect onChange={onChangeTags} placeholder={t('Label_Select')}>
					{tagList?.length > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}
					{tagList?.map(tag => (
						<Option key={tag.id} value={tag.id}>
							{tag.tagName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const memberTypeSelector = () => {
		const handleChangeMemberType = (newMemberTypes: UserTypeEnum[]) => {
			if (newMemberTypes.includes(0)) {
				form.setFieldsValue({
					memberTypes: memberTypeEnums?.map(({ value }) => value),
				})
			} else {
				form.setFieldsValue({
					memberTypes: newMemberTypes,
				})
			}
		}

		return (
			<Form.Item
				name='memberTypes'
				label={t('Label_MemberType')}
				hidden={isHidePartOfFilter}
			>
				<MultipleSelect
					onChange={handleChangeMemberType}
					placeholder={t('Label_Select') + t('Label_MemberType')}
				>
					{(memberTypeEnums?.length as number) > 1 && (
						<Option value={0}>{t('Label_SelectAll')}</Option>
					)}

					{memberTypeEnums?.map(({ value, name }) => (
						<Option key={value} value={value}>
							{name}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const disabledDate: RangePickerProps['disabledDate'] = current => {
		return (
			current > dayjs().endOf('day') || current < dayjs().subtract(14, 'day')
		)
	}

	// * siteIds 多選
	const siteIdsSelector = () => {
		const onChangeSite = (newSiteIds: ('all' | number)[]) => {
			if (newSiteIds.includes('all')) {
				form.setFieldsValue({
					siteIds: userSiteList?.map(value => value.siteId),
				})
			} else {
				form.setFieldsValue({
					siteIds: newSiteIds as number[],
				})
			}
		}

		return (
			<Form.Item
				name='siteIds'
				label={t('Label_Site')}
				rules={[
					{
						required: true,
						message: t('Label_Required', {
							key: t('Label_Site'),
						}),
					},
				]}
			>
				<MultipleSelect onChange={onChangeSite} placeholder={t('Label_Select')}>
					{(userSiteList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{userSiteList?.map(item => (
						<Option key={item.siteId} value={item.siteId}>
							{item.siteName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<LayoutContent.Card style={{ marginTop: 0 }}>
					<Form
						layout='vertical'
						size='middle'
						form={form}
						onFinish={() => onSearch({})}
						initialValues={{
							currencyIds: currencyList?.map(item => item.currencyId),
							// 預設排除直播主
							memberTypes: reject(memberTypeEnums, [
								'value',
								UserTypeEnum.LiveStreaming,
							]).map(({ value }) => Number(value)),
						}}
					>
						<Row align='middle' gutter={16}>
							<Col lg={8} md={24} xs={24}>
								<Form.Item label={t('Label_DateRange')}>
									<Input.Group
										compact
										style={{ width: '100%', display: 'flex' }}
									>
										<Form.Item
											noStyle
											name='dateRange'
											initialValue={DATE_RANGES.Today}
											rules={[
												{
													required: true,
													message: t('Label_DateRangeRequire'),
												},
											]}
										>
											<RangePicker
												style={{ width: '100%' }}
												showTime
												disabledDate={disabledDate}
												ranges={RANGE_PICKER_RANGES([
													'Today',
													'Yesterday',
													'Last Week',
												])}
											/>
										</Form.Item>
										<div>
											<TimeZoneSelect
												value={timeZoneUtcOffset}
												onChange={onTimeZoneChange}
											/>
										</div>
									</Input.Group>
								</Form.Item>
							</Col>

							<Col lg={4} md={12} xs={12}>
								<Form.Item name='currencyIds' label={t('Label_Currency')}>
									<MultipleSelect
										onChange={onChangeCurrency}
										placeholder={t('Label_Select')}
									>
										{(currencyList?.length as number) > 1 && (
											<Option value={0}>{t('Label_SelectAll')}</Option>
										)}

										{currencyList?.map(item => (
											<Option key={item.currencyId} value={item.currencyId}>
												{item.isoCode}
											</Option>
										))}
									</MultipleSelect>
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear />
								</Form.Item>
							</Col>

							<Col lg={4} md={12} xs={12}>
								<Form.Item
									name='tpId'
									label={t('Label_Provider')}
									hidden={isHidePartOfFilter}
								>
									<Select
										showSearch
										placeholder={t('Label_Select')}
										allowClear
										filterOption={(input, option) =>
											(option!.children as unknown as string)
												.toLowerCase()
												.includes(input.toLowerCase())
										}
									>
										{providers?.map(item => (
											<Option key={item.tpName} value={item.id}>
												{item.tpName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item
									name='gameType'
									label={t('Label_Product')}
									hidden={isHidePartOfFilter}
								>
									<Select
										showSearch
										placeholder={t('Label_Select')}
										allowClear
										filterOption={(input, option) =>
											(option!.children as unknown as string)
												.toLowerCase()
												.includes(input.toLowerCase())
										}
									>
										{products?.map(item => (
											<Option key={item.typeName} value={item.type}>
												{item.typeName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item
									name='category'
									label={t('Label_Category')}
									hidden={isHidePartOfFilter}
								>
									<Select
										showSearch
										placeholder={t('Label_Select')}
										allowClear
										filterOption={(input, option) =>
											(option!.children as unknown as string)
												.toLowerCase()
												.includes(input.toLowerCase())
										}
										onChange={e => {
											handleCategoryChange(e)
										}}
									>
										{categories?.map(item => (
											<Option key={item.categoryName} value={item.categoryName}>
												{item.categoryName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								{selectedCategory === 'Sports' ? (
									sportGamesSelect()
								) : (
									<Form.Item
										name='game'
										label={t('Label_Game')}
										hidden={isHidePartOfFilter}
									>
										<Input allowClear />
									</Form.Item>
								)}
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item
									name='title'
									label={t('Label_Title')}
									hidden={isHidePartOfFilter}
								>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item
									name='matchID'
									label={t('Label_MatchId')}
									hidden={isHidePartOfFilter}
								>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item
									name='betType'
									label={t('Label_BetType')}
									hidden={isHidePartOfFilter}
								>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item
									name='stake'
									label={t('Label_StakeRange')}
									hidden={isHidePartOfFilter}
								>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item
									name='winLostAmount'
									label={t('Label_WinLoseRange')}
									hidden={isHidePartOfFilter}
								>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item
									name='transId'
									label={t('Label_TransId')}
									hidden={isHidePartOfFilter}
								>
									<Input allowClear />
								</Form.Item>
							</Col>

							<Col lg={4} md={12} xs={12}>
								<Form.Item
									name='tpUserName'
									label={t('Label_TpUserName')}
									hidden={isHidePartOfFilter}
								>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								<Form.Item
									name='refNo'
									label={t('Label_RefNo')}
									hidden={isHidePartOfFilter}
								>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col lg={4} md={12} xs={12}>
								{vipLevelSelect()}
							</Col>
							<Col lg={4} md={12} xs={12}>
								{tagListSelect()}
							</Col>
							<Col lg={4} md={12} xs={12}>
								{memberTypeSelector()}
							</Col>
							<Col lg={4} md={12} xs={12}>
								{siteIdsSelector()}
							</Col>
						</Row>
						<br />
						<Row justify='end' align='middle'>
							<Col>
								<Button
									loading={loading}
									icon={<SearchOutlined />}
									htmlType='submit'
									type='primary'
								>
									{t('Label_Search')}
								</Button>
							</Col>
						</Row>
					</Form>
				</LayoutContent.Card>
			</Panel>
		</Collapse>
	)
}

export { BetListFilter }
