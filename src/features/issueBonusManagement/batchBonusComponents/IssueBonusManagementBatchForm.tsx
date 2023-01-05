import {
	Button,
	Col,
	Divider,
	Form,
	FormInstance,
	Input,
	Row,
	Select,
} from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { useTranslation } from 'react-i18next'
import {
	PayoutTypeEnum,
	payoutTypeList,
	PromotionTypeEnum,
} from 'features/issueBonusManagement/constants'
import { Currency } from 'common/enum/type'
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons'
import { ICheckBonusCodeData } from 'features/issueBonusManagement/type'
import { Link } from 'react-router-dom'
import React from 'react'
import { BatchBonusUploader } from 'features/issueBonusManagement/batchBonusComponents/BatchBonusUploader'
import { RcFile } from 'antd/es/upload'
import { PermissionInterface } from 'type'

interface IIssueBonusManagementBatchFormProps {
	loading: boolean
	form: FormInstance<{
		payoutType: number
		bonusCode: string
		currencyId: number
	}>
	currencyListBySite: Currency[]
	batchBonusCodeInfo: ICheckBonusCodeData | undefined
	addBatchPermission?: PermissionInterface
	addPermission?: PermissionInterface
	onUploadBonus: (file: RcFile) => void
	onCheckBatchBonusCode: () => void
}

const { Option } = Select

const IssueBonusManagementBatchForm = ({
	loading,
	form,
	currencyListBySite,
	batchBonusCodeInfo,
	addBatchPermission,
	addPermission,
	onUploadBonus,
	onCheckBatchBonusCode,
}: IIssueBonusManagementBatchFormProps) => {
	const { t } = useTranslation()
	const formPayoutType = Form.useWatch('payoutType', form)
	const formCurrencyId = Form.useWatch('currencyId', form)
	const formBonusCode = Form.useWatch('bonusCode', form)

	const isSearchButtonDisabled = !formCurrencyId || !formBonusCode
	const { promotionType, hasBonusCode } = batchBonusCodeInfo ?? {}

	const downloadLink = () => {
		let link = ''
		let name = ''
		if (promotionType === PromotionTypeEnum.ReDeposit) {
			link = '/exampleFile/RedepositFile.xlsx'
			name = 'RedepositFile.xlsx'
		} else if (promotionType === PromotionTypeEnum.ManualBonus) {
			link = '/exampleFile/SpecialBonusFile.xlsx'
			name = 'SpecialBonusFile.xlsx'
		} else if (promotionType === PromotionTypeEnum.RetentionFreeBet) {
			link = '/exampleFile/RetentionFreebetFile.xlsx'
			name = 'RetentionFreebetFile.xlsx'
		}

		return { link, name }
	}

	return (
		<LayoutContent.Card>
			<Form
				layout='vertical'
				size='middle'
				form={form}
				initialValues={{
					payoutType: addPermission?.canUse ? PayoutTypeEnum.BonusPayout : null,
				}}
				style={{ paddingTop: '20px' }}
				onFinish={onCheckBatchBonusCode}
			>
				<Row align='middle' gutter={16}>
					<Col lg={6} md={24} xs={24}>
						<Form.Item name='payoutType' label={t('Label_PayoutType')}>
							<Select>
								{addPermission?.canUse && (
									<Option
										key={PayoutTypeEnum.BonusPayout}
										value={PayoutTypeEnum.BonusPayout}
									>
										{t(payoutTypeList[PayoutTypeEnum.BonusPayout])}
									</Option>
								)}
								{addBatchPermission?.canUse && (
									<Option
										key={PayoutTypeEnum.BatchBonusPayout}
										value={PayoutTypeEnum.BatchBonusPayout}
									>
										{t(payoutTypeList[PayoutTypeEnum.BatchBonusPayout])}
									</Option>
								)}
							</Select>
						</Form.Item>
					</Col>
					{formPayoutType === PayoutTypeEnum.BatchBonusPayout && (
						<>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='currencyId' label={t('Label_Currency')}>
									<Select
										allowClear
										placeholder={t('Label_Select') + t('Label_Currency')}
									>
										{currencyListBySite?.map(({ currencyId, isoCode }) => (
											<Option value={currencyId} key={currencyId}>
												{isoCode}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='bonusCode' label={t('Label_BonusCode')}>
									<Input />
								</Form.Item>
							</Col>
							<Col
								lg={{ span: 6, offset: 0 }}
								md={{ span: 12, offset: 12 }}
								xs={{ span: 12, offset: 12 }}
							>
								<Button
									disabled={isSearchButtonDisabled}
									icon={<SearchOutlined />}
									loading={loading}
									htmlType='submit'
									type='primary'
									block
								>
									{t('Label_CheckBonusCode')}
								</Button>
							</Col>
						</>
					)}
				</Row>
				{formPayoutType === PayoutTypeEnum.BatchBonusPayout && hasBonusCode && (
					<>
						<Divider />
						<Row
							align='top'
							justify='end'
							gutter={16}
							style={{ marginBottom: '20px' }}
						>
							<Col lg={6} md={12} xs={12}>
								<Link
									to={downloadLink().link}
									download={downloadLink().name}
									target='_blank'
									style={{ color: 'white' }}
								>
									<Button type='primary' icon={<DownloadOutlined />} block>
										{t('Label_TemplateFile')}
									</Button>
								</Link>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<BatchBonusUploader onUploadBonus={onUploadBonus} />
							</Col>
						</Row>
					</>
				)}
			</Form>
		</LayoutContent.Card>
	)
}

export { IssueBonusManagementBatchForm }
