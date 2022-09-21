import { FC, useContext } from 'react'
import {
	Button,
	Col,
	Collapse,
	Form,
	FormInstance,
	Input,
	Row,
	Select,
	Spin,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { MultipleSelect } from 'components/Select'
import { LayoutContent } from 'app/pages/layout'
import { SearchOutlined } from '@ant-design/icons'
import { FilterContext } from 'features/bankCardManagement/filterContext'

interface IBankCardManagementFilterProps {
	form: FormInstance
}

const { Option } = Select
const { Panel } = Collapse

const BankCardManagementFilterCell: FC<IBankCardManagementFilterProps> = ({
	form,
}) => {
	const { t } = useTranslation()
	const {
		loading,
		isSearchLoading,
		bankInfoList,
		pointLevelList,
		purposeList,
		agentList,
		vipLevelList,
		supportChannelList,
		statusEnumList,
		onSearch,
	} = useContext(FilterContext)
	const bankCodeSelector = () => {
		const onChangeBanks = (newBanks: Array<number | string>) => {
			if (newBanks.includes('all')) {
				form.setFieldsValue({
					sysIds: bankInfoList?.map(bank => bank.sysId),
				})
			} else {
				form.setFieldsValue({
					sysIds: newBanks,
				})
			}
		}
		return (
			<Form.Item name='sysIds' label={t('Label_BankCode')}>
				<MultipleSelect
					onChange={onChangeBanks}
					placeholder={t('Label_Select')}
				>
					{bankInfoList?.length > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}
					{bankInfoList?.map(bank => (
						<Option key={bank.sysId} value={bank.sysId}>
							{bank.bankName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const purposeSelector = () => {
		// 後端表示全選送空陣列，所以這裡給 all 在送args的時候在轉成空陣列
		// selectAll = 全選 , matchAll = 全部匹配
		const onChangePurpose = (newPurposes: Array<number | string>) => {
			if (newPurposes.includes('matchAll')) {
				// 匹配全部
				form.setFieldsValue({
					purposes: purposeList.map(purpose => purpose.value),
				})
			} else if (newPurposes.length > 1) {
				if (newPurposes[0] === 'all') {
					// 先選 selectAll 再選其他選項 , 代表不要全選 , 移除 'all'
					newPurposes.splice(0, 1)
					form.setFieldsValue({
						purposes: newPurposes,
					})
				} else if (newPurposes.includes('all')) {
					// 先選其他選項才按 selectAll = 全選 移除其他選項
					form.setFieldsValue({
						purposes: ['all'],
					})
				}
			} else {
				// firstPick , Array.length === 1
				form.setFieldsValue({
					purposes: newPurposes,
				})
			}
		}

		return (
			<Form.Item name='purposes' label={t('Label_Purposes')}>
				<MultipleSelect
					onChange={onChangePurpose}
					placeholder={t('Label_Select')}
				>
					{/* 為保留 selectAll 的選項 , 不管有沒有 > 1 都渲染出來 */}
					<Option value='all'>{t('Label_SelectAll')}</Option>
					{purposeList?.length > 1 && (
						<Option value='matchAll'>{t('Label_MatchAll')}</Option>
					)}
					{purposeList?.map(purpose => (
						<Option key={purpose.value} value={purpose.value}>
							{purpose.name}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const vipLevelSelector = () => {
		// 後端表示全選送空陣列，所以這裡給 all 在送args的時候在轉成空陣列
		const handleChangeVipLevel = (newVipLevels: Array<number | string>) => {
			if (newVipLevels.includes('matchAll')) {
				// 匹配全部
				form.setFieldsValue({
					vipLevels: vipLevelList.map(level => level.level),
				})
			} else if ((newVipLevels.length as number) > 1) {
				if (newVipLevels[0] === 'all') {
					// 先選 selectAll 再選其他選項 , 代表不要全選 , 移除 'all'
					newVipLevels.splice(0, 1)
					form.setFieldsValue({
						vipLevels: newVipLevels,
					})
				} else if (newVipLevels.includes('all')) {
					// 先選其他選項才按 selectAll = 全選 移除其他選項
					form.setFieldsValue({
						vipLevels: ['all'],
					})
				}
			} else {
				// firstPick , Array.length === 1
				form.setFieldsValue({
					vipLevels: newVipLevels,
				})
			}
		}

		return (
			<Form.Item name='vipLevels' label={t('Label_VipLevel')}>
				<MultipleSelect
					onChange={handleChangeVipLevel}
					placeholder={t('Label_Select') + t('Label_VipLevel')}
				>
					{/* 為保留 selectAll 的選項 , 不管有沒有 > 1 都渲染出來 */}
					<Option value='all'>{t('Label_SelectAll')}</Option>
					{vipLevelList?.length > 1 && (
						<Option value='matchAll'>{t('Label_MatchAll')}</Option>
					)}
					{vipLevelList?.map(item => (
						<Option key={item.level} value={item.level}>
							{item.levelName}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const statusSelector = () => {
		const handleChangeStatus = (newStatuses: Array<number | string>) => {
			if (newStatuses.includes('all')) {
				form.setFieldsValue({
					statuses: statusEnumList?.map(item => item.value),
				})
			} else {
				form.setFieldsValue({
					statuses: newStatuses,
				})
			}
		}

		return (
			<Form.Item name='statuses' label={t('Label_Status')}>
				<MultipleSelect
					onChange={handleChangeStatus}
					placeholder={t('Label_Select') + t('Label_Status')}
				>
					{(statusEnumList?.length as number) > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}

					{statusEnumList?.map(status => (
						<Option key={status.value} value={status.value}>
							{status.name}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const pointLevelSelector = () => {
		// 後端表示全選送空陣列，所以這裡給 all 在送args的時候在轉成空陣列
		const handleChangePointLevel = (newPointLevels: Array<number | string>) => {
			if (newPointLevels.includes('matchAll')) {
				// 匹配全部
				form.setFieldsValue({
					pointLevels: pointLevelList.map(pointLevel => pointLevel),
				})
			} else if ((newPointLevels.length as number) > 1) {
				if (newPointLevels[0] === 'all') {
					// 先選 selectAll 再選其他選項 , 代表不要全選 , 移除 'all'
					newPointLevels.splice(0, 1)
					form.setFieldsValue({
						pointLevels: newPointLevels,
					})
				} else if (newPointLevels.includes('all')) {
					// 先選其他選項才按 selectAll = 全選 移除其他選項
					form.setFieldsValue({
						pointLevels: ['all'],
					})
				}
			} else {
				// firstPick , Array.length === 1
				form.setFieldsValue({
					pointLevels: newPointLevels,
				})
			}
		}

		return (
			<Form.Item name='pointLevels' label={t('Label_PointLevel')}>
				<MultipleSelect
					onChange={handleChangePointLevel}
					placeholder={t('Label_Select') + t('Label_PointLevel')}
				>
					{/* 為保留 selectAll 的選項 , 不管有沒有 > 1 都渲染出來 */}
					<Option value='all'>{t('Label_SelectAll')}</Option>
					{pointLevelList?.length > 1 && (
						<Option value='matchAll'>{t('Label_MatchAll')}</Option>
					)}
					{pointLevelList?.map(pointLevel => (
						<Option key={pointLevel} value={pointLevel}>
							{pointLevel}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const supportChannelSelector = () => {
		// 後端表示全選送空陣列，所以這裡給 all 在送args的時候在轉成空陣列
		const handleChangeSupportChannel = (
			newChannels: Array<number | string>
		) => {
			if (newChannels.includes('matchAll')) {
				// 匹配全部
				form.setFieldsValue({
					supportChannels: supportChannelList.map(channel => channel.value),
				})
			} else if ((newChannels.length as number) > 1) {
				if (newChannels[0] === 'all') {
					// 先選 selectAll 再選其他選項 , 代表不要全選 , 移除 'all'
					newChannels.splice(0, 1)
					form.setFieldsValue({
						supportChannels: newChannels,
					})
				} else if (newChannels.includes('all')) {
					// 先選其他選項才按 selectAll = 全選 移除其他選項
					form.setFieldsValue({
						supportChannels: ['all'],
					})
				}
			} else {
				// firstPick , Array.length === 1
				form.setFieldsValue({
					supportChannels: newChannels,
				})
			}
		}

		return (
			<Form.Item name='supportChannels' label={t('Label_SupportChannels')}>
				<MultipleSelect
					onChange={handleChangeSupportChannel}
					placeholder={t('Label_Select') + t('Label_SupportChannels')}
				>
					{/* 為保留 selectAll 的選項 , 不管有沒有 > 1 都渲染出來 */}
					<Option value='all'>{t('Label_SelectAll')}</Option>
					{supportChannelList?.length > 1 && (
						<Option value='matchAll'>{t('Label_MatchAll')}</Option>
					)}
					{supportChannelList?.map(item => (
						<Option key={item.value} value={item.value}>
							{item.name}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	return (
		<Collapse defaultActiveKey={1}>
			<Panel header='' key='1'>
				<Spin spinning={loading}>
					<LayoutContent.Card style={{ marginTop: 0 }}>
						<Form
							layout='vertical'
							size='middle'
							form={form}
							onFinish={() => onSearch({})}
							initialValues={{
								accountNo: '',
								sysIds: [],
								purposes: [],
								agent: '',
								statuses: [],
								vipLevels: [],
								pointLevels: [],
								supportChannels: [],
							}}
						>
							<Row align='middle' gutter={16}>
								<Col lg={6} md={12} xs={12}>
									{bankCodeSelector()}
								</Col>
								<Col lg={6} md={12} xs={12}>
									<Form.Item name='accountNo' label={t('Label_AccountNo')}>
										<Input allowClear />
									</Form.Item>
								</Col>
								<Col lg={6} md={12} xs={12}>
									{purposeSelector()}
								</Col>
								<Col lg={6} md={12} xs={12}>
									<Form.Item name='agent' label={t('Label_Agent')}>
										<Select placeholder={t('Label_Select')}>
											{/* 後端表示全選帶空字串  */}
											<Option value=''>{t('Label_SelectAll')}</Option>
											{agentList?.map(agent => (
												<Option key={agent} value={agent}>
													{agent}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
							</Row>
							<Row align='middle' gutter={16}>
								<Col lg={6} md={12} xs={12}>
									{vipLevelSelector()}
								</Col>
								<Col lg={6} md={12} xs={12}>
									{statusSelector()}
								</Col>
								<Col lg={6} md={12} xs={12}>
									{pointLevelSelector()}
								</Col>
								<Col lg={6} md={12} xs={12}>
									{supportChannelSelector()}
								</Col>
							</Row>
							<br />
							<Row justify='end' align='middle'>
								<Col>
									<Button
										loading={isSearchLoading}
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
				</Spin>
			</Panel>
		</Collapse>
	)
}

export { BankCardManagementFilterCell }
