import { FC, useContext } from 'react'
import { Button, Col, Form, Input, Row, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { EditOutlined } from '@ant-design/icons'
import { EditBonusContext } from 'features/bonusManagement/editBonusDetail/editBonusContext'
import { PromotionActionEnum } from 'features/bonusManagement/constants'

interface IBonusInfoEditForm {
	loading: boolean
	langCode: string
	currentTabActive: boolean
}

const BonusInfoEditForm: FC<IBonusInfoEditForm> = ({
	loading,
	langCode,
	currentTabActive,
}) => {
	const { t } = useTranslation()
	const {
		form,
		onEditDetailClick,
		currentActiveCurrency,
		setInfoTabsKey,
		editPermission,
	} = useContext(EditBonusContext)
	const { currencyId } = currentActiveCurrency
	// 因為巢狀結構太複雜 , form 只允許一層巢狀 , 只好用 currencyId + langCode 轉成字串的方式
	const tabsKey = JSON.stringify({ currencyId, langCode })
	const promotionAction = Form.useWatch('promotionAction', form)

	// * 當未勾選代表該 bonus 未顯示，bannerUrl、title description 改為非必填
	const isDisplayDate = Form.useWatch('isDisplayDate', form)

	return (
		<Spin spinning={loading}>
			<Form
				form={form}
				layout='vertical'
				disabled={!editPermission?.canUse}
				initialValues={{
					details: {
						[tabsKey]: {
							bannerUrl: '',
							title: '',
							description: '',
							detail: '',
						},
					},
				}}
			>
				<Row>
					{promotionAction === PromotionActionEnum.Link && (
						<Col span={24}>
							<Form.Item
								name={['details', tabsKey, 'promotionLink']}
								label={t('Label_PromotionLink')}
								rules={[
									{
										required: currentTabActive,
										message: t('Label_Required', {
											key: t('Label_PromotionLink'),
										}),
									},
								]}
							>
								<Input allowClear />
							</Form.Item>
						</Col>
					)}
					<Col span={24}>
						<Form.Item
							name={['details', tabsKey, 'bannerUrl']}
							label={t('Label_BannerUrl')}
							rules={[
								{
									required: currentTabActive && isDisplayDate,
									message: t('Label_Required', {
										key: t('Label_BannerUrl'),
									}),
								},
							]}
						>
							<Input allowClear />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name={['details', tabsKey, 'title']}
							label={t('Label_Title')}
							rules={[
								{
									required: currentTabActive && isDisplayDate,
									message: t('Label_Required', {
										key: t('Label_Title'),
									}),
								},
							]}
						>
							<Input allowClear />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name={['details', tabsKey, 'description']}
							label={t('Label_Description')}
							rules={[
								{
									required: currentTabActive && isDisplayDate,
									message: t('Label_Required', {
										key: t('Label_Description'),
									}),
								},
							]}
						>
							<Input allowClear />
						</Form.Item>
					</Col>
				</Row>
				{/* 若沒有定義 promotionAction 一律顯示 編輯器彈窗按鈕 */}
				{promotionAction !== PromotionActionEnum.Link && (
					<Row justify='center' align='middle' style={{ marginBottom: '10px' }}>
						<Col>
							<Button
								loading={loading}
								icon={<EditOutlined />}
								type='primary'
								onClick={() => {
									onEditDetailClick()
									// 打開編輯器時要寫入當前的tabsKey value 給 編輯器 Form Item 寫入
									if (setInfoTabsKey) {
										setInfoTabsKey(tabsKey)
									}
								}}
							>
								{t('Label_EditFrontendDetail')}
							</Button>
						</Col>
					</Row>
				)}
			</Form>
		</Spin>
	)
}

export { BonusInfoEditForm }
