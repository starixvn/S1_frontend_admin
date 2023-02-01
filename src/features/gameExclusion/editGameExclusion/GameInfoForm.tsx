import { ITpGame } from 'features/gameExclusion/type'
import { LayoutContent } from 'app/pages/layout'
import { FormInstance, Row, Spin, Typography } from 'antd'
import { GameSelector } from 'features/gameExclusion/editGameExclusion/GameSelector'
import { useTranslation } from 'react-i18next'

interface IInfoFormProps {
	form: FormInstance
	loading: boolean
	selectedTpGames: ITpGame[]
}

const GameInfoForm = ({ form, loading, selectedTpGames }: IInfoFormProps) => {
	const { t } = useTranslation()
	return (
		<Spin spinning={loading}>
			<LayoutContent.Card style={{ padding: '1rem 1.5rem' }}>
				<Typography.Title level={5} type='warning'>
					{t('Label_DisableGames')}
				</Typography.Title>
				<Row align='middle' gutter={[16, 16]}>
					{selectedTpGames?.map(tpGame => (
						<GameSelector tpGame={tpGame} form={form} key={tpGame.tpId} />
					))}
				</Row>
			</LayoutContent.Card>
		</Spin>
	)
}

export { GameInfoForm }
