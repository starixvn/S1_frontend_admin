import { FC, useEffect, useState } from 'react'
import {
	Checkbox,
	Col,
	DatePicker,
	Form,
	FormInstance,
	Input,
	message,
	Row,
	Select,
	Spin,
} from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { LayoutContent } from 'app/pages/layout'
import {
	IGetSportLeaguesData,
	IGetSportLeaguesTitleData,
	IGetSportTeamsData,
} from 'features/hotEventManagement/type'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { useLazyGetSportTeamsQuery } from 'features/hotEventManagement/api'
import { MultipleSelect } from 'components/Select'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite } from 'common/enum'
import { CurrencyEnum } from 'type'
import { gameIdTypes } from '../constants'

interface IEditFormProps {
	loading: boolean
	form: FormInstance
	sportLeagueTitleList: IGetSportLeaguesTitleData[]
	sportLeaguesList: IGetSportLeaguesData[]
	timeZoneUtcOffset: number
	onTimeZoneChange: (newUtcOffset: number) => void
	isEditing: boolean
}

const { Option } = Select

const EditForm: FC<IEditFormProps> = ({
	loading,
	form,
	sportLeaguesList,
	sportLeagueTitleList,
	timeZoneUtcOffset,
	onTimeZoneChange,
	isEditing,
}) => {
	const { t } = useTranslation()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	// teamList 在 form 頁根據當下的 League 做處理
	const [homeTeamList, setHomeTeamList] = useState<IGetSportTeamsData[]>([])
	const [awayTeamList, setAwayTeamList] = useState<IGetSportTeamsData[]>([])

	const homeLeague = Form.useWatch('homeSportLeaguesId', form)
	const awayLeague = Form.useWatch('awaySportLeaguesId', form)
	const currentIsLiveStreaming = Form.useWatch('isLiveStreaming', form)

	const liveStreamingCurrency = [
		CurrencyEnum.THB,
		CurrencyEnum.VND,
		CurrencyEnum.MYR,
	]
	const filteredCurrencyListBySite = currencyListBySite.filter(
		({ currencyId }) => liveStreamingCurrency.includes(currencyId)
	)

	const [getSportTeams, { isFetching: isGetSportTeamsLoading }] =
		useLazyGetSportTeamsQuery()

	const getHomeTeamList = async () => {
		try {
			const { data: homeTeamData } = await getSportTeams({
				sportLeaguesId: homeLeague,
			}).unwrap()
			setHomeTeamList(homeTeamData)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const getAwayTeamList = async () => {
		try {
			const { data: awayTeamData } = await getSportTeams({
				sportLeaguesId: awayLeague,
			}).unwrap()
			setAwayTeamList(awayTeamData)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const currencySelector = () => {
		const handleChangeCurrency = (newCurrencyId: Array<number | string>) => {
			if (newCurrencyId.includes('all')) {
				form.setFieldsValue({
					currency: filteredCurrencyListBySite?.map(
						({ currencyId }) => currencyId
					),
				})
			} else {
				form.setFieldsValue({
					currency: newCurrencyId,
				})
			}
		}

		return (
			<Form.Item name='currency' label={t('Label_Currency')}>
				<MultipleSelect
					placeholder={t('Label_Select') + t('Label_Currency')}
					onChange={handleChangeCurrency}
				>
					{filteredCurrencyListBySite?.length > 1 && (
						<Option value='all'>{t('Label_SelectAll')}</Option>
					)}
					{filteredCurrencyListBySite?.map(({ currencyId, isoCode }) => (
						<Option key={currencyId} value={currencyId}>
							{isoCode}
						</Option>
					))}
				</MultipleSelect>
			</Form.Item>
		)
	}

	const handleLiveStreamingChange = (e: CheckboxChangeEvent) => {
		if (e.target.checked) {
			form.setFieldsValue({
				currency: filteredCurrencyListBySite?.map(
					({ currencyId }) => currencyId
				),
			})
		}
	}

	//  分開寫才不會彼此受影響
	useEffect(() => {
		if (homeLeague) {
			getHomeTeamList()
		}
	}, [homeLeague])

	useEffect(() => {
		if (awayLeague) {
			getAwayTeamList()
		}
	}, [awayLeague])

	return (
		<Spin spinning={loading || isGetSportTeamsLoading}>
			<LayoutContent.Card style={{ marginTop: 0 }}>
				<Form
					layout='vertical'
					size='middle'
					form={form}
					initialValues={{
						gameId: 1,
						tpId: 41,
					}}
				>
					<Row align='middle' gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='sportLeaguesTitleId'
								label={t('Label_SportLeaguesTitle')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_SportLeaguesTitle'),
										}),
									},
								]}
							>
								<Select placeholder={t('Label_Select')}>
									{sportLeagueTitleList?.map(title => (
										<Option
											key={title.sportLeaguesTitleId}
											value={title.sportLeaguesTitleId}
										>
											{title.sportLeaguesTitle}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='matchId'
								label={t('Label_MatchId')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_MatchId'),
										}),
									},
								]}
							>
								<Input allowClear />
							</Form.Item>
						</Col>
						{/* gameID , tpID 目前固定帶 1 ,但之後可能有其廠商需要使用故保留欄位但是設為禁用 */}
						{!isEditing && (
							<>
								<Col lg={6} md={12} xs={12}>
									<Form.Item
										name='tpId'
										label={t('Label_TpID')}
										rules={[
											{
												required: true,
												message: t('Label_Required', {
													key: t('Label_TpID'),
												}),
											},
										]}
									>
										<Input disabled />
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
										<Select>
											{gameIdTypes.map(item => (
												<Option key={item.id} value={item.id}>
													{item.displayName}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
							</>
						)}
					</Row>
					<Row align='middle' gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item label={t('Label_StartTime')}>
								<Input.Group compact style={{ width: '100%', display: 'flex' }}>
									<Form.Item
										noStyle
										name='startTime'
										rules={[
											{
												required: true,
												message: t('Label_Required', {
													key: t('Label_StartTime'),
												}),
											},
										]}
										initialValue={dayjs()}
									>
										<DatePicker showTime style={{ width: '100%' }} />
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
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='battleTime'
								label={t('Label_BattleTime')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_BattleTime'),
										}),
									},
								]}
							>
								<DatePicker
									showTime
									style={{ width: '100%' }}
									onChange={newDate =>
										form.setFieldsValue({
											endTime: dayjs(newDate).add(2, 'hours'),
										})
									}
								/>
							</Form.Item>
						</Col>
						{/* endTime 由 battleTime 選取後自動延後兩小時產生 */}
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='endTime'
								label={t('Label_EndTime')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_EndTime'),
										}),
									},
								]}
							>
								<DatePicker showTime disabled style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						{currentIsLiveStreaming && (
							<Col lg={6} md={12} xs={12}>
								{currencySelector()}
							</Col>
						)}
					</Row>
					<Row align='middle' gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='homeSportLeaguesId'
								label={t('Label_HomeSportLeagues')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_HomeSportLeagues'),
										}),
									},
								]}
							>
								<Select
									showSearch
									placeholder={t('Label_SelectGroup')}
									onChange={() => form.resetFields(['homeTeamNameId'])}
									filterOption={(input, option) =>
										(option!.children as unknown as string)
											.toLowerCase()
											.includes(input.toLowerCase())
									}
								>
									{sportLeaguesList?.map(league => (
										<Option
											key={league.sportLeaguesId}
											value={league.sportLeaguesId}
										>
											{league.sportLeaguesName}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='awaySportLeaguesId'
								label={t('Label_AwaySportLeagues')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_AwaySportLeagues'),
										}),
									},
								]}
							>
								<Select
									showSearch
									placeholder={t('Label_SelectGroup')}
									onChange={() => form.resetFields(['awayTeamNameId'])}
									filterOption={(input, option) =>
										(option!.children as unknown as string)
											.toLowerCase()
											.includes(input.toLowerCase())
									}
								>
									{sportLeaguesList?.map(league => (
										<Option
											key={league.sportLeaguesId}
											value={league.sportLeaguesId}
										>
											{league.sportLeaguesName}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item name='isLiveStreaming' valuePropName='checked' noStyle>
								<Checkbox onChange={handleLiveStreamingChange}>
									{t('Label_LiveBroadCaster')}
								</Checkbox>
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item name='isPrediction' valuePropName='checked' noStyle>
								<Checkbox>{t('Label_PredictionChallenge')}</Checkbox>
							</Form.Item>
						</Col>
					</Row>
					<Row align='middle' gutter={16}>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='homeTeamNameId'
								label={t('Label_HomeTeam')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_HomeTeam'),
										}),
									},
								]}
							>
								<Select
									showSearch
									placeholder={t('Label_SelectTeam')}
									disabled={!homeLeague}
									filterOption={(input, option) =>
										(option!.children as unknown as string)
											.toLowerCase()
											.includes(input.toLowerCase())
									}
								>
									{homeTeamList?.map(team => (
										<Option key={team.teamId} value={team.teamId}>
											{team.teamName}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={6} md={12} xs={12}>
							<Form.Item
								name='awayTeamNameId'
								label={t('Label_AwayTeam')}
								rules={[
									{
										required: true,
										message: t('Label_Required', {
											key: t('Label_AwayTeam'),
										}),
									},
								]}
							>
								<Select
									showSearch
									placeholder={t('Label_SelectTeam')}
									disabled={!awayLeague}
									filterOption={(input, option) =>
										(option!.children as unknown as string)
											.toLowerCase()
											.includes(input.toLowerCase())
									}
								>
									{awayTeamList?.map(team => (
										<Option key={team.teamId} value={team.teamId}>
											{team.teamName}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</LayoutContent.Card>
		</Spin>
	)
}

export { EditForm }
