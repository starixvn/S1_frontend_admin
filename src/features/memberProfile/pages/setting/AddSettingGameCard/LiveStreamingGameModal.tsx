import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, FormInstance, Modal, message } from 'antd'
import { filter, reject, includes, head, isEmpty } from 'lodash'
import {
	useGetTpListQuery,
	useGetProductsQuery,
} from 'common/service/allDataApi'
import { ILiveStreamingGameTableData } from 'features/memberProfile/type'
import { CustTpGameTypeSettingEnum } from 'features/memberProfile/constants'
import { useLazyGetCustTpGameTypeSettingQuery } from 'features/memberProfile/api'
import { LiveStreamingGameResConverter } from 'features/memberProfile/pages/setting/AddSettingGameCard/utils'
import BasicLiveStreamingForm from 'features/memberProfile/pages/setting/AddSettingGameCard/BasicLiveStreamingForm'
import LiveStreamingGameTypeForm from 'features/memberProfile/pages/setting/AddSettingGameCard/LiveStreamingGameTypeForm'
import LiveStreamingGameResultTable from 'features/memberProfile/pages/setting/AddSettingGameCard/LiveStreamingGameResultTable'

interface ILiveStreamingGameModalProps {
	custId: number
	loading: boolean
	form: FormInstance
	visible: boolean
	onCancel: () => void
	onFinish: () => void
}

const LiveStreamingGameModal = ({
	custId,
	loading,
	form,
	visible,
	onCancel,
	onFinish,
}: ILiveStreamingGameModalProps) => {
	const { t } = useTranslation()
	const [selectedResult, setSelectedResult] = useState<
		ILiveStreamingGameTableData[]
	>([])

	const selectedTps = Form.useWatch<number[]>('tpId', form)

	const { data: { data: tpList = [] } = {} } = useGetTpListQuery(null)

	const { data: { data: gameTypeList = [] } = {} } = useGetProductsQuery(null, {
		selectFromResult: ({ data: { data: newGameTypeList = [] } = {} }) => {
			// 單一錢包 tpId =1 已被移除 故請後端補個參數篩掉
			const newData = reject(newGameTypeList, { tpIdStatus: 0 })
			return { data: { data: newData } }
		},
	})

	const [
		getCustTpGameTypeSetting,
		{ isFetching: isGetCustTpGameTypeSettingFetching },
	] = useLazyGetCustTpGameTypeSettingQuery()

	// 編輯模式初始化
	const handleGetCustTpGameTypeSetting = async () => {
		if (!custId) return
		try {
			const { data: { data: liveStreamingGameList = [] } = {} } =
				await getCustTpGameTypeSetting({
					custId,
					getDataTypes: [CustTpGameTypeSettingEnum.IsPlay],
				})
			const { initTp, initGameTypes } = LiveStreamingGameResConverter(
				liveStreamingGameList
			)

			form.setFieldsValue({
				tpId: initTp.sort((a, b) => a - b),
				selectedGameTypes: initGameTypes,
			})

			if (!isEmpty(initTp)) {
				// 取得 Tp 底下的所有 gameType
				const selectedVender = filter(gameTypeList, gameTypeItem => {
					return includes(initTp, gameTypeItem.tpId)
				})

				if (selectedVender.length > 0) {
					initTp.forEach(value => {
						setSelectedResult(prev => {
							const selectedGameTypeList = filter(selectedVender, [
								'tpId',
								value,
							])

							const selectedTpNames = head(filter(tpList, ['id', value]))
								?.tpName!

							return [
								...prev,
								{
									tpId: value,
									tpName: selectedTpNames,
									tpGames: selectedGameTypeList,
								},
							].sort((a, b) => a.tpId - b.tpId)
						})
					})
				}
			}
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}
	// 第一層 tpId
	const handleTpId = (originNewTpIds: number[]) => {
		const newTpIds = originNewTpIds.sort((a, b) => a - b)
		// 點選 vender 清除全部動作
		if (isEmpty(newTpIds)) {
			form.resetFields(['selectedGameTypes'])
			setSelectedResult([])
		}

		// 篩出新增的 id
		const newId = newTpIds.filter(id => !includes(selectedTps, id))
		// 篩出移除的 id
		const removeId = selectedTps.filter(id => !includes(newTpIds, id))

		if (newId.length > 0) {
			// 新增 TP 選項

			// 取得 Tp 底下的所有 gameType
			const selectedVender = filter(gameTypeList, gameTypeItem => {
				return includes(newId, gameTypeItem.tpId)
			})

			if (selectedVender.length > 0) {
				// 已經是在同個 gameType底下 故取 tpId 與 tpName 時抓第一個取值就行
				const selectedTpId = head(selectedVender)?.tpId
				const selectedTpName = head(
					filter(tpList, ['id', selectedTpId])
				)?.tpName

				setSelectedResult(prev => {
					return [
						...prev,
						{
							tpId: selectedTpId!,
							tpName: selectedTpName!,
							tpGames: selectedVender!,
						},
					].sort((a, b) => a.tpId - b.tpId)
				})

				form.setFieldsValue({
					selectedGameTypes: {
						[String(selectedTpId)]: {
							gameTypes: selectedVender.map(({ type }) => type),
						},
					},
				})
			}
		} else if (removeId.length > 0) {
			// 移除取消選取的部分 , 移除該 tp 底下所有已選擇的 gameTypes
			// 這裡的 removeId 只會有一個 全關已被上面 113行 isEmpty(newTpIds) 排除
			form.resetFields([
				['selectedGameTypes', String(removeId[0]), 'gameTypes'],
			])
			setSelectedResult(prev => prev.filter(({ tpId }) => tpId !== removeId[0]))
		}
	}

	// 第二層 GameType
	const handleDeleteGameType = (deletedTpId: number) => {
		setSelectedResult(prev => {
			return [...filter(prev, item => item.tpId !== deletedTpId)]
		})
		form.setFieldsValue({
			tpId: filter(selectedTps, tpId => tpId !== deletedTpId),
		})
	}

	useEffect(() => {
		// 初始化表單資料
		if (visible) {
			handleGetCustTpGameTypeSetting()
		}
	}, [visible])

	return (
		<Modal
			confirmLoading={loading}
			width='80vw'
			title={
				<div style={{ textAlign: 'center' }}>
					{t('Label_LiveStreamingGame')}
				</div>
			}
			open={visible}
			onCancel={onCancel}
			afterClose={() => {
				form.resetFields()
				// 清空舊資料避免重複初始化
				setSelectedResult([])
			}}
			onOk={onFinish}
		>
			<BasicLiveStreamingForm
				form={form}
				tpList={tpList}
				onTpIdChange={handleTpId}
			/>

			{!isEmpty(selectedTps) && (
				<Form form={form} component={false}>
					<LiveStreamingGameTypeForm
						loading={isGetCustTpGameTypeSettingFetching}
						form={form}
						selectedResult={selectedResult}
						onDelete={handleDeleteGameType}
					/>
				</Form>
			)}

			<LiveStreamingGameResultTable
				form={form}
				selectedResult={selectedResult}
			/>
		</Modal>
	)
}

export default LiveStreamingGameModal
