import { isUndefined, filter } from 'lodash'
import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { Form, FormInstance, Typography } from 'antd'
import {
	IAddLiveStreamingGameForm,
	IAddLiveStreamingGameTableData,
} from 'features/memberProfile/type'

interface ILiveStreamingGameResultTableProps {
	form: FormInstance<IAddLiveStreamingGameForm>
	filterResult: IAddLiveStreamingGameTableData[]
}

const LiveStreamingGameResultTable = ({
	form,
	filterResult,
}: ILiveStreamingGameResultTableProps) => {
	const { t } = useTranslation()

	const gameTypeListForm = Form.useWatch('tpGameTypes', form)
	// 渲染選取 gameTypes 的陣列
	const tableResults = !isUndefined(gameTypeListForm)
		? gameTypeListForm.map(
				newGameTypeItem => filter(filterResult, ['type', newGameTypeItem])[0]
		  )
		: []

	const columns = [
		{
			title: t('Label_TpName'),
			key: 'tpName',
			dataIndex: 'tpName',
			width: '20%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_TpCategory'),
			key: 'typeName',
			dataIndex: 'typeName',
			width: '80%',
			align: 'center' as 'center',
			render: (typeName: string) => {
				return typeName || '-'
			},
		},
	]

	return tableResults.length > 0 ? (
		<LayoutContent.Card style={{ padding: '1rem 1.5rem' }}>
			<Typography.Title level={5} type='success'>
				{t('Label_Result')}
			</Typography.Title>

			<Table pagination={false} dataSource={tableResults} columns={columns} />
		</LayoutContent.Card>
	) : null
}

export default LiveStreamingGameResultTable
