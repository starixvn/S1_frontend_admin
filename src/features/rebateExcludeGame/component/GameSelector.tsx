import { useTranslation } from 'react-i18next'
import { Card, Col, Form, Select } from 'antd'
import { MultipleSelect } from 'components/Select'
import { ITpGameData } from 'features/rebateExcludeGame/type'

interface IGameSelectorProps {
	gameData: ITpGameData
}

const { Option } = Select
const GameSelector = ({ gameData }: IGameSelectorProps) => {
	const { t } = useTranslation()
	const { tpGames, tpName, tpId } = gameData
	return (
		<Col lg={6} md={12} xs={12}>
			<Card title={tpName}>
				{/* key 要是字串  */}
				<Form.Item
					name={['selectedGames', String(tpId), 'games']}
					rules={[
						{
							required: true,
							message: t('Label_RequiredText'),
						},
					]}
				>
					<MultipleSelect
						placeholder={`${t('Label_Search')} & ${t('Label_Select')}`}
						showSearch
						filterOption={(input, option) => {
							return (option!.children as unknown as string)
								.toLowerCase()
								.includes(input.toLowerCase())
						}}
					>
						{tpGames?.map(({ gameId, name }) => (
							<Option key={gameId} value={gameId}>
								{name}
							</Option>
						))}
					</MultipleSelect>
				</Form.Item>
			</Card>
		</Col>
	)
}

export { GameSelector }
