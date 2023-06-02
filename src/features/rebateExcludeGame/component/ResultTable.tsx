import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Form, FormInstance, Typography } from 'antd'
import {
	IEditForm,
	IResultData,
	ITpGameData,
} from 'features/rebateExcludeGame/type'
import { LayoutContent } from 'app/pages/layout'
import { Table } from 'components'
import { cloneDeep, find, includes } from 'lodash'

interface IResultTableProps {
	form: FormInstance<IEditForm>
	gameList: ITpGameData[]
}

// 用來顯示已經選擇的遊戲，純渲染當前表單內容，故渲染邏輯全部寫在此處
const ResultTable = ({ form, gameList }: IResultTableProps) => {
	const { t } = useTranslation()
	const selectedGames = Form.useWatch('selectedGames', form)
	const [result, setResult] = useState<IResultData[]>([])

	useEffect(() => {
		if (selectedGames !== undefined) {
			// 表單長度 < result 長度，代表從頂層 TpName處直接把這個 Tp移除了，故把他從 result 也移除
			const currentIds = Object.keys(selectedGames).map(id => Number(id))
			if (currentIds.length < result.length) {
				setResult(prev => prev.filter(({ tpId }) => includes(currentIds, tpId)))
			} else {
				Object.entries(selectedGames).forEach(([key, value]) => {
					// 取當前 tp 資訊
					const currentTp = find(gameList, ({ tpId }) => tpId === Number(key))
					const { games: gameIds = [] } = value as { games: string[] }
					if (currentTp) {
						const { tpGames, tpName, tpId } = currentTp
						// 把 gameId 轉成 gameName 顯示
						const selectedGameNames = gameIds.map(
							id => find(tpGames, ({ gameId }) => id === gameId)?.name || ''
						)
						if (selectedGameNames.length > 0) {
							setResult(prev => {
								const clonePrev = cloneDeep(prev)
								// 先檢查是否存在舊值
								const existedData = find(
									clonePrev,
									({ tpName: targetName }) => targetName === tpName
								)
								// 有舊值改舊值
								if (existedData) {
									existedData.selectedGameNames = selectedGameNames
									return clonePrev
								}
								return [
									...clonePrev,
									{ tpName, selectedGameNames, tpId, key: `${tpName}_${tpId}` },
								]
							})
						} else {
							// 如果內容長度 = 0 則移除該筆資料
							setResult(prev =>
								prev.filter(({ tpName: targetName }) => targetName !== tpName)
							)
						}
					}
				})
			}
		}
	}, [selectedGames])

	const columns = [
		{
			title: t('Label_TpName'),
			key: 'tpName',
			dataIndex: 'tpName',
			width: '20%',
			align: 'center' as 'center',
		},
		{
			title: t('Label_SelectedGames'),
			key: 'selectedGameNames',
			dataIndex: 'selectedGameNames',
			width: '80%',
			align: 'center' as 'center',
			render: (names: string[]) => {
				return (
					<>
						{names.map(name => (
							<Typography key={name}>
								{name}
								<br />
							</Typography>
						))}
					</>
				)
			},
		},
	]

	return result.length > 0 ? (
		<LayoutContent.Card style={{ padding: '1rem 1.5rem' }}>
			<Typography.Title level={5} type='success'>
				{t('Label_Result')}
			</Typography.Title>
			<Table pagination={false} dataSource={result} columns={columns} />
		</LayoutContent.Card>
	) : null
}

export { ResultTable }
