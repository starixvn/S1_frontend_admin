import { useTranslation } from 'react-i18next'
import { FormInstance, Row, Spin, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { ILiveStreamingGameTableData } from 'features/memberProfile/type'
import LiveStreamingGameTypeSelector from 'features/memberProfile/pages/setting/AddSettingGameCard/LiveStreamingGameTypeSelector'

interface ILiveStreamingGameTypeFormProps {
	form: FormInstance
	loading: boolean
	selectedResult: ILiveStreamingGameTableData[]
}

const LiveStreamingGameTypeForm = ({
	form,
	loading,
	selectedResult,
}: ILiveStreamingGameTypeFormProps) => {
	const { t } = useTranslation()
	return (
		<Spin spinning={loading}>
			<LayoutContent.Card style={{ padding: '1rem 1.5rem' }}>
				<Typography.Title level={5} type='warning'>
					{t('Label_LiveStreamingGameType')}
				</Typography.Title>
				<Row align='middle' gutter={[16, 16]}>
					{selectedResult?.map(tpGame => (
						<LiveStreamingGameTypeSelector
							form={form}
							tpGame={tpGame}
							key={tpGame.tpId}
						/>
					))}
				</Row>
			</LayoutContent.Card>
		</Spin>
	)
}

export default LiveStreamingGameTypeForm
