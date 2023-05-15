import { useTranslation } from 'react-i18next'
import { MultipleSelect } from 'components/Select'
import { CloseCircleOutlined } from '@ant-design/icons'
import { Card, Col, Form, FormInstance, Select } from 'antd'
import { ILiveStreamingGameTableData } from 'features/memberProfile/type'

interface ILiveStreamingGameTypeSelectorProps {
	tpGame: ILiveStreamingGameTableData
	form: FormInstance
	onDelete: (deletedTpId: number) => void
}

const { Option } = Select

const LiveStreamingGameTypeSelector = ({
	tpGame,
	form,
	onDelete,
}: ILiveStreamingGameTypeSelectorProps) => {
	const { t } = useTranslation()
	const { tpGames, tpId, tpName } = tpGame

	const onChangeGame = (newGameTypes: string[]) => {
		form.setFieldsValue({
			selectedGameTypes: {
				[String(tpId)]: {
					gameTypes: newGameTypes,
				},
			},
		})
	}

	return (
		<Col lg={6} md={12} xs={12}>
			<Card
				title={tpName}
				extra={<CloseCircleOutlined onClick={() => onDelete(tpId)} />}
			>
				{/* key 要是字串  */}
				<Form.Item name={['selectedGameTypes', String(tpId), 'gameTypes']}>
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
						{tpGames.map(({ typeName, type }) => (
							<Option key={type} value={type}>
								{typeName}
							</Option>
						))}
					</MultipleSelect>
				</Form.Item>
			</Card>
		</Col>
	)
}

export default LiveStreamingGameTypeSelector
