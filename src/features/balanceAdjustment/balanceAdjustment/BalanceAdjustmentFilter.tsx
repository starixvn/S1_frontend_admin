import { FC } from 'react'
import { Button, Col, Form, FormInstance, Input, Row, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons'
import { PermissionInterface } from 'type'
import { MethodTypeEnum } from 'features/balanceAdjustment/constants'
import { Link } from 'react-router-dom'
import { IMethodType } from '../type'

const { Option } = Select

interface IBalanceAdjustmentFilterProps {
	loading: boolean
	form: FormInstance
	methodType: MethodTypeEnum
	filteredMethodTypes: IMethodType[]
	onMethodTypeChange: (type: MethodTypeEnum) => void
	onGetBalance: () => void
	addBatchPermission?: PermissionInterface
}

const BalanceAdjustmentFilter: FC<IBalanceAdjustmentFilterProps> = ({
	loading,
	form,
	methodType,
	filteredMethodTypes,
	onMethodTypeChange,
	onGetBalance,
	addBatchPermission,
}) => {
	const { t } = useTranslation()

	return (
		<LayoutContent.Card>
			<Form layout='vertical' size='middle' form={form}>
				<Row align='middle' gutter={16}>
					{addBatchPermission?.canUse && (
						<Col lg={6} md={24} xs={24}>
							<Form.Item label={t('Label_MethodType')}>
								<Select value={methodType} onChange={onMethodTypeChange}>
									{filteredMethodTypes.map(type => (
										<Option key={type.value} value={type.value}>
											{t(type.displayKey)}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					)}
					{/* 選擇 single add 或 沒得選擇時顯示 */}
					{(methodType === MethodTypeEnum.mainWallet || !methodType) && (
						<>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='userName' label={t('Label_MemberId')}>
									<Input allowClear placeholder={t('Label_MemberId')} />
								</Form.Item>
							</Col>
							<Col lg={6} md={12} xs={12}>
								<Form.Item name='sabaId' label={t('Label_SabaId')}>
									<Input allowClear placeholder={t('Label_SabaId')} />
								</Form.Item>
							</Col>
						</>
					)}
				</Row>

				<br />
				<Row justify='end' align='middle'>
					{(methodType === MethodTypeEnum.mainWallet || !methodType) && (
						<Col>
							<Button
								loading={loading}
								icon={<SearchOutlined />}
								onClick={onGetBalance}
								type='primary'
							>
								{t('Label_GetBalance')}
							</Button>
						</Col>
					)}
					{methodType === MethodTypeEnum.mainWalletBatch && (
						<Link
							to='/exampleFile/BalanceAdjustmentTemplateFile.xlsx'
							download='BalanceAdjustmentBatch.xlsx'
							target='_blank'
							style={{ color: 'white' }}
						>
							<Button type='primary' icon={<DownloadOutlined />}>
								{t('Label_TemplateFile')}
							</Button>
						</Link>
					)}
				</Row>
			</Form>
		</LayoutContent.Card>
	)
}

export { BalanceAdjustmentFilter }
