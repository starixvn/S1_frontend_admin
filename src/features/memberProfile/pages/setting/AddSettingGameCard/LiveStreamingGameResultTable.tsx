import { Table } from 'components'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { Typography } from 'antd'
import {
	ILiveStreamingGameTableData,
	// ILiveStreamingInfo,
} from 'features/memberProfile/type'

interface ILiveStreamingGameResultTableProps {
	selectedResult: ILiveStreamingGameTableData[]
}

const LiveStreamingGameResultTable = ({
	selectedResult,
}: ILiveStreamingGameResultTableProps) => {
	const { t } = useTranslation()
	const columns = [
		{
			title: t('Label_TpName'),
			key: 'tpName',
			dataIndex: 'tpName',
			width: '20%',
			align: 'center' as 'center',
			render: (tpName: string) => {
				return tpName || ''
			},
		},
		{
			title: t('Label_TpCategory'),
			key: 'typeName',
			width: '80%',
			align: 'center' as 'center',
			render: ({ tpGames }: ILiveStreamingGameTableData) => {
				return (
					<>
						{tpGames.map(({ typeName }) => (
							<>
								{typeName || '-'}
								<br />
							</>
						))}
					</>
				)
			},
		},
	]
	// console.log(Object.entries(selectedGameTypes))
	// useEffect(() => {
	// 	if (selectedGameTypes !== undefined) {
	// 		const currentIds = Object.keys(selectedGameTypes).map(id => Number(id))
	// 		if (currentIds.length < result.length) {
	// 			setResult(prev => prev.filter(({ tpId }) => includes(currentIds, tpId)))
	// 		} else {
	// 			Object.entries(selectedGameTypes).forEach(([key, value]) => {
	// 				const currentTp = find(
	// 					selectedResult,
	// 					({ tpId }) => tpId === Number(key)
	// 				)
	// 				console.log(value)
	// 				// const { gameTypes: gameIds = [] } = value as { gameTypes: number[] }
	// 				console.log(currentTp)
	// 				// console.log(gameIds)
	// 				if (currentTp) {
	// 					// const { tpGames, tpName, tpId } = currentTp
	// 					// // 將 gameId 轉換成 Name 顯示
	// 					// const selectedGameTypeNames = gameIds.map(id =>
	// 					// 	find(tpGames, ({ type }) => id === type)
	// 					// )
	// 					// console.log(selectedGameTypeNames)
	// 					// if (selectedGameTypeNames.length > 0) {
	// 					// 	setResult(prev => {
	// 					// 		const clonePrev = cloneDeep(prev)
	// 					// 		// 先檢查是否存在舊值
	// 					// 		const existedData = find(
	// 					// 			clonePrev,
	// 					// 			({ tpName: targetName }) => targetName === tpName
	// 					// 		)
	// 					// 		// 有舊值改舊值
	// 					// 		if (existedData) {
	// 					// 			existedData.selectedGameTypeNames = selectedGameTypeNames
	// 					// 			return clonePrev
	// 					// 		}
	// 					// 		return [...clonePrev, { tpName, selectedGameTypeNames, tpId }]
	// 					// 	})
	// 					// } else {
	// 					// 	// 如果內容長度 = 0 則移除該筆資料
	// 					// 	setResult(prev =>
	// 					// 		prev.filter(({ tpName: targetName }) => targetName !== tpName)
	// 					// 	)
	// 					// }
	// 				}
	// 			})
	// 		}
	// 	}
	// }, [selectedGameTypes])

	return selectedResult.length > 0 ? (
		<LayoutContent.Card style={{ padding: '1rem 1.5rem' }}>
			<Typography.Title level={5} type='success'>
				{t('Label_Result')}
			</Typography.Title>

			<Table pagination={false} dataSource={selectedResult} columns={columns} />
		</LayoutContent.Card>
	) : null
}

export default LiveStreamingGameResultTable
