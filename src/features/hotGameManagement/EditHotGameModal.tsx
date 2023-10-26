import { useContext, useEffect } from 'react'
import { HotGameContext } from 'features/hotGameManagement/hotGameContext'
import { Col, Form, FormInstance, Input, Modal, Row, Select, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { IEditForm, IHotGameDetailData } from 'features/hotGameManagement/type'
import {
	useGetHotGameDetailQuery,
	useGetTpGameTypeListQuery,
} from 'features/hotGameManagement/api'
import { find } from 'lodash'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import { useGetGameIdByTpIdAndCategoryIdQuery } from 'common/service/baseDataApi'

interface IEditHotGameModalProps {
	loading: boolean
	form: FormInstance<IEditForm>
	open: boolean
	onCancel: () => void
	onFinish: () => void
}

const { Option } = Select

const EditHotGameModal = ({
	loading,
	form,
	open,
	onCancel,
	onFinish,
}: IEditHotGameModalProps) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { topCategoryList, commonTpList, currencyListBySite } =
		useContext(HotGameContext)

	// 因為 id 沒有實體 FormItem , 無法用 useWatch 取得
	const currentId = form.getFieldValue(['id'])
	// id 帶 0 是新增
	const isAdd = currentId === 0
	const currentTpId = Form.useWatch('tpId', form)
	const currentCategoryId = Form.useWatch('tpCategory', form)

	// Modal 內的 api 強制每次打開 modal 時都重撈資料
	const {
		data: { data: hotGameDetail } = {} as IAxiosResponse<IHotGameDetailData>,
		isFetching: isGetHotGameDetailLoading,
	} = useGetHotGameDetailQuery(
		{
			siteId,
			id: currentId,
		},
		{ skip: !currentId || isAdd, refetchOnMountOrArgChange: true }
	)

	// 這兩隻 api 資料不會異動，可拿 cache 資料
	const {
		data: { data: tpGameTypeList = [] } = {},
		isFetching: isGetTpGameTypeListLoading,
	} = useGetTpGameTypeListQuery({ tpId: currentTpId }, { skip: !currentTpId })

	const {
		data: { data: gameList = [] } = {},
		isFetching: isGetGameListLoading,
	} = useGetGameIdByTpIdAndCategoryIdQuery(
		{ tpId: currentTpId, categoryId: currentCategoryId },
		{
			skip: !currentTpId || !currentCategoryId,
		}
	)

	useEffect(() => {
		if (!isGetHotGameDetailLoading && !isAdd) {
			const {
				currencyId,
				gameName,
				gameId,
				tpId,
				tpGameType,
				tpCategory,
				topCategory,
				tpCategoryName,
			} = hotGameDetail ?? {}

			form.setFieldsValue({
				currencyId,
				gameName,
				gameId,
				tpId,
				tpGameType,
				tpCategory,
				topCategory,
				tpName: tpCategoryName,
			})
		}
	}, [isGetHotGameDetailLoading])

	return (
		<Modal
			title={t('Label_HotGamesInfo')}
			open={open}
			onCancel={onCancel}
			okText={t('Label_Submit')}
			cancelText={t('Label_Cancel')}
			onOk={onFinish}
			width='60vw'
			confirmLoading={loading}
			afterClose={() => {
				form.resetFields()
			}}
		>
			<Spin spinning={isGetHotGameDetailLoading}>
				<Form form={form} layout='vertical'>
					<Row gutter={16} align='middle'>
						<Col span={12}>
							<Form.Item
								name='currencyId'
								label={t('Label_Currency')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_Currency'),
										}),
									},
								]}
							>
								<Select disabled={!isAdd}>
									{currencyListBySite?.map(({ currencyId, isoCode }) => (
										<Option value={currencyId} key={currencyId}>
											{isoCode}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='topCategory'
								label={t('Label_TopCategory')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_TopCategory'),
										}),
									},
								]}
							>
								<Select
									placeholder={t('Label_Select') + t('Label_TopCategory')}
									disabled={!isAdd}
								>
									{topCategoryList?.map(
										({ hotGameTopCategoryId, hotGameTopCategoryName }) => (
											<Option
												value={hotGameTopCategoryId}
												key={hotGameTopCategoryId}
											>
												{hotGameTopCategoryName}
											</Option>
										)
									)}
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='tpId'
								label={t('Label_TpName')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_TpName'),
										}),
									},
								]}
							>
								<Select
									placeholder={t('Label_Select') + t('Label_TpName')}
									onChange={() => {
										// 連動關係，切換選擇時這三項都要重選
										form.resetFields(['tpGameType', 'gameName', 'gameId'])
									}}
								>
									{commonTpList?.map(({ id, tpName }) => (
										<Option key={id} value={id}>
											{tpName}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='tpGameType'
								label={t('Label_TpGameType')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_TpGameType'),
										}),
									},
								]}
							>
								<Select
									loading={isGetTpGameTypeListLoading}
									placeholder={t('Label_Select') + t('Label_TpGameType')}
									onChange={value => {
										// 連動關係，切會選擇時 game 要重選
										form.resetFields(['gameName', 'gameId'])
										const currentGameType = find(
											tpGameTypeList,
											item => item.type === value
										)
										// 這兩個參數吃的是同一個下拉選單的內容 , 透過這裡給
										form.setFieldsValue({
											tpName: currentGameType?.categoryName,
											tpCategory: currentGameType?.categoryId,
										})
									}}
								>
									{tpGameTypeList.map(({ type, typeName }) => (
										<Option value={type} key={type}>
											{typeName}
										</Option>
									))}
								</Select>
							</Form.Item>
							{/* 這裡放這個 Form.Item 是為了讓 useWatch 可以吃到 category的 value  */}
							<Form.Item name='tpCategory' style={{ display: 'none' }} />
						</Col>

						<Col span={12}>
							<Form.Item
								name='gameName'
								label={t('Label_GameName')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_GameName'),
										}),
									},
								]}
							>
								<Select
									showSearch
									loading={isGetGameListLoading}
									filterOption={(input, option) => {
										const isIncludes: boolean = (
											option!.children as unknown as string
										)
											.toLowerCase()
											.includes(input.toLowerCase())

										return isIncludes
									}}
									onChange={value => {
										const currentGameName = find(
											gameList,
											item => item.name === value
										)
										// gameId的值透過 gameName 給
										form.setFieldsValue({
											gameId: currentGameName?.gameId,
										})
									}}
								>
									{gameList?.map(({ name }) => (
										<Option key={name} value={name}>
											{name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							{/* gameId 的值不可手動改 透過 gameName 下拉選單給  */}
							<Form.Item name='gameId' label={t('Label_GameId')}>
								<Input disabled />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Spin>
		</Modal>
	)
}

export { EditHotGameModal }
