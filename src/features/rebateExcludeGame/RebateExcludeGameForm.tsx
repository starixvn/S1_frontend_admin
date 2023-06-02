import { useTranslation } from 'react-i18next'
import { Divider, Form, FormInstance, Row, Spin, Typography } from 'antd'
import { LayoutContent } from 'app/pages/layout'
import { ISlotGameData, ISlotTpData } from 'common/service/allDataApi'
import { useEffect, useRef, useState } from 'react'
import { IEditForm, ITpGameData } from 'features/rebateExcludeGame/type'
import { tpGamesConverter } from 'features/rebateExcludeGame/utils'
import { GameSelector } from 'features/rebateExcludeGame/component/GameSelector'
import { TpSelector } from 'features/rebateExcludeGame/component/TpSelector'
import { ResultTable } from 'features/rebateExcludeGame/component/ResultTable'
import { includes } from 'lodash'

interface IRebateExcludeGameFormProps {
	initValueLoading: boolean
	loading: boolean
	isEdit: boolean
	form: FormInstance<IEditForm>
	slotTpList: ISlotTpData[]
	slotGameList: ISlotGameData[]
}

const RebateExcludeGameForm = ({
	initValueLoading,
	loading,
	isEdit,
	form,
	slotTpList,
	slotGameList,
}: IRebateExcludeGameFormProps) => {
	const { t } = useTranslation()
	// 儲存前次 selectedTps
	const prevTps = useRef<number[]>([])
	// 用於監聽當前的 tp
	const selectedTps = Form.useWatch<number[]>('selectedTp', form)
	// 用於儲存當前選擇的 tp games
	const [gameList, setGameList] = useState<ITpGameData[]>([])

	useEffect(() => {
		// 控制當 form 表單被異動時要同步的行為，這段不能寫在 onChange 上，因為會有初始化從 api response 填值的情境，不會觸發 onChange
		const handleAsyncSelectedTps = () => {
			// 同步 gameList
			if (selectedTps.length === 0) {
				setGameList([])
			} else {
				setGameList(tpGamesConverter({ selectedTps, slotTpList, slotGameList }))
			}
			// 同步 form value
			// 比對 prevTps 篩出移除的 id , 用以同步 form 表單
			const removeIds = prevTps.current?.filter(
				id => !includes(selectedTps, id)
			)
			prevTps.current = selectedTps
			if (removeIds?.length > 0) {
				removeIds.forEach(id => {
					form.resetFields([['selectedGames', String(id), 'games']])
				})
			}
		}

		// 靜態資料 loading 完畢才做同步
		if (selectedTps !== undefined && !initValueLoading) {
			handleAsyncSelectedTps()
		}
	}, [selectedTps, initValueLoading])

	return (
		<Spin spinning={loading}>
			<Form form={form} layout='vertical' size='middle' disabled={!isEdit}>
				<LayoutContent.Card style={{ padding: '1rem 1.5rem' }}>
					<Row align='middle' gutter={16}>
						<TpSelector form={form} slotTpList={slotTpList} />
					</Row>
					{selectedTps?.length > 0 && (
						<>
							<Divider />
							<Typography.Title level={5} type='warning'>
								{t('Label_Step2_SelectGames')}
							</Typography.Title>
							<Row align='middle' gutter={[16, 16]}>
								{gameList?.map(game => (
									<GameSelector gameData={game} key={game.tpId} />
								))}
							</Row>
						</>
					)}
				</LayoutContent.Card>
				{selectedTps?.length > 0 && (
					<ResultTable form={form} gameList={gameList} />
				)}
			</Form>
		</Spin>
	)
}

export { RebateExcludeGameForm }
