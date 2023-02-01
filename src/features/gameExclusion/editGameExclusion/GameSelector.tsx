import { ITpGame } from 'features/gameExclusion/type'
import { Card, Col, Form, FormInstance, Select } from 'antd'
import { MultipleSelect } from 'components/Select'
import { useTranslation } from 'react-i18next'

const { Option } = Select

const GameSelector = ({
	tpGame,
	form,
}: {
	tpGame: ITpGame
	form: FormInstance
}) => {
	const { t } = useTranslation()
	const { tpGames, tpId, tpName } = tpGame
	const onChangeGame = (newGame: string[]) => {
		form.setFieldsValue({
			selectedGames: {
				[String(tpId)]: {
					games: newGame,
				},
			},
		})
	}

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
						onChange={onChangeGame}
						placeholder={`${t('Label_Search')} & ${t('Label_Select')}`}
						showSearch
						filterOption={(input, option) => {
							const isIncludes: boolean = (
								option!.children as unknown as string
							)
								.toLowerCase()
								.includes(input.toLowerCase())

							return isIncludes
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
