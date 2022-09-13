import { FC, useEffect, useState } from 'react'
import {
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
import { LayoutContent } from 'app/pages/layout'
import {
	IGetSportLeaguesData,
	IGetSportLeaguesTitleData,
	IGetSportTeamsData,
} from 'features/hotEventManagement/type'
import { useTranslation } from 'react-i18next'
import moment from 'moment/moment'
import TimeZoneSelect from 'components/TimeZoneSelect'
import { useLazyGetSportTeamsQuery } from 'features/hotEventManagement/api'

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

	// teamList 在 form 頁根據當下的 League 做處理
	const [homeTeamList, setHomeTeamList] = useState<IGetSportTeamsData[]>([])
	const [awayTeamList, setAwayTeamList] = useState<IGetSportTeamsData[]>([])

	const homeLeague = Form.useWatch('homeSportLeaguesId', form)
	const awayLeague = Form.useWatch('awaySportLeaguesId', form)

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
						tpId: 1,
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
										<Input disabled />
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
										initialValue={moment()}
									>
										<DatePicker
											showTime
											style={{ width: '100%' }}
											onChange={newDate =>
												form.setFieldsValue({
													startTime: moment(newDate),
												})
											}
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
											endTime: moment(newDate).add(2, 'hours'),
											battleTime: moment(newDate),
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
								<DatePicker
									showTime
									disabled
									style={{ width: '100%' }}
									onChange={newDate =>
										form.setFieldsValue({
											endTime: moment(newDate),
										})
									}
								/>
							</Form.Item>
						</Col>
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
									placeholder={t('Label_SelectGroup')}
									onChange={() => form.resetFields(['homeTeamNameId'])}
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
									placeholder={t('Label_SelectGroup')}
									onChange={() => form.resetFields(['awayTeamNameId'])}
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
									placeholder={t('Label_SelectTeam')}
									disabled={!homeLeague}
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
									placeholder={t('Label_SelectTeam')}
									disabled={!awayLeague}
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
