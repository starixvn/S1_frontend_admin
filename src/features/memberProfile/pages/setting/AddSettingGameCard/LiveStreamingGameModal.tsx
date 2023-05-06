import { useEffect, useRef, useState } from 'react'
import { filter, reject, includes, first, isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import {
	useGetTpListQuery,
	useGetProductsQuery,
} from 'common/service/allDataApi'
import { Form, FormInstance, Modal, message } from 'antd'
import { ILiveStreamingGameTableData } from 'features/memberProfile/type'
import LiveStreamingGameResultTable from 'features/memberProfile/pages/setting/AddSettingGameCard/LiveStreamingGameResultTable'
import { useLazyGetCustTpGameTypeSettingQuery } from 'features/memberProfile/api'
import { CustTpGameTypeSettingEnum } from 'features/memberProfile/constants'
import LiveStreamingGameTypeForm from 'features/memberProfile/pages/setting/AddSettingGameCard/LiveStreamingGameTypeForm'
import BasicLiveStreamingForm from 'features/memberProfile/pages/setting/AddSettingGameCard/BasicLiveStreamingForm'
import { LiveStreamingGameResConverter } from 'features/memberProfile/pages/setting/AddSettingGameCard/utils'

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
	// 前次資料
	const prevTps = useRef<number[]>([])
	// 當前資料
	const onChangeTpId = useRef<number[]>([])
	const selectedTps = Form.useWatch<number[]>('tpId', form)

	const { data: { data: tpList = [] } = {} } = useGetTpListQuery(null)

	const { data: { data: gameTypeList = [] } = {} } = useGetProductsQuery(null, {
		selectFromResult: ({ data: { data: newGameTypeList = [] } = {} }) => {
			// 單一錢包 tpId =1 已被移除 故請後端補個參數篩掉
			const newData = reject(newGameTypeList, { tpIdStatus: 0 })
			return { data: { data: newData } }
		},
	})

	const [getCustTpGameTypeSetting] = useLazyGetCustTpGameTypeSettingQuery()

	// 編輯模式初始化
	const handleGetCustTpGameTypeSetting = async () => {
		if (!custId) return
		try {
			const { data: { data: liveStreamingGameList = [] } = {} } =
				await getCustTpGameTypeSetting({
					custId,
					getDataTypes: [
						CustTpGameTypeSettingEnum.IsPlay,
						CustTpGameTypeSettingEnum.IsShow,
					],
				})

			const { selectedTp, selectedGameTypes } = LiveStreamingGameResConverter(
				liveStreamingGameList
			)

			form.setFieldsValue({
				tpId: selectedTp,
				selectedGameTypes,
			})
		} catch (error) {
			message.error(t((error as Error).message))
		}
	}

	const handleVender = (newTpIds: number[]) => {
		onChangeTpId.current = newTpIds
		// 篩出新增的 id
		const newId = newTpIds?.filter(id => !includes(selectedTps, id))
		// 篩出移除的 id
		const removeId = selectedTps?.filter(id => !includes(newTpIds, id))

		if (newId.length > 0) {
			// 新增 TP 選項

			// 取得 Tp 底下的所有 gameType
			const selectedVender = filter(gameTypeList, gameTypeItem => {
				return includes(newId, gameTypeItem.tpId)
			})

			if (selectedVender.length > 0) {
				const selectedTpId = selectedVender[0].tpId
				const selectedTpName = first(
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
					]
				})
			}
		} else if (removeId.length > 0) {
			// 移除取消選取的部分 , 移除該 tp 底下所有已選擇的 gameTypes
			form.resetFields([
				['selectedGameTypes', String(removeId[0]), 'gameTypes'],
			])
			setSelectedResult(prev => prev.filter(({ tpId }) => tpId !== removeId[0]))
		}
	}

	useEffect(() => {
		// 初始化表單資料
		if (visible) {
			handleGetCustTpGameTypeSetting()
		}
	}, [visible])

	useEffect(() => {
		const handleSyncSelectedTps = () => {
			prevTps.current = selectedTps

			if (prevTps.current.length > 0) {
				// 取得 Tp 底下的所有 gameType
				const selectedVender = filter(gameTypeList, gameTypeItem => {
					return includes(prevTps.current, gameTypeItem.tpId)
				})

				if (selectedVender.length > 0) {
					prevTps.current.forEach(value => {
						setSelectedResult(prev => {
							const selectedGameTypeList = filter(selectedVender, [
								'tpId',
								value,
							])

							const selectedTpNames = first(
								filter(tpList, ['id', value])
							)?.tpName

							return [
								...prev,
								{
									tpId: value!,
									tpName: selectedTpNames!,
									tpGames: selectedGameTypeList!,
								},
							]
						})
					})
				}
			}
		}

		if (selectedTps !== undefined && isEmpty(onChangeTpId.current)) {
			handleSyncSelectedTps()
		}
	}, [selectedTps])

	return (
		<Modal
			confirmLoading={loading}
			width='70vw'
			title={
				<div style={{ textAlign: 'center' }}>
					{t('Label_LiveStreamingGame')}
				</div>
			}
			open={visible}
			onCancel={onCancel}
			afterClose={() => {
				form.resetFields()
				setSelectedResult([])
			}}
			onOk={onFinish}
		>
			<BasicLiveStreamingForm
				form={form}
				tpList={tpList}
				onVenderChange={handleVender}
			/>

			{(selectedTps?.length || prevTps.current.length) > 0 && (
				<Form form={form} component={false}>
					<LiveStreamingGameTypeForm
						loading={loading}
						form={form}
						selectedResult={selectedResult}
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
