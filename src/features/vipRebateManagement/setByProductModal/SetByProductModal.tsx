import { FC, useEffect, useRef, useState } from 'react'
import { findIndex, assign, cloneDeep, isNumber, find } from 'lodash'
import { Form, Modal, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { percentageFormatter } from 'common/utils/format'
import { GameRebateEditData, IGameRebateTableData } from '../type'
import { SetByProductCell } from './SetByProductCell'
import { editCellValuesToEditList } from '../utils/converters'
import { useGetVipLevelNameQuery } from '../../vipUpgradeSetting/api'

interface ISetByProductModal {
	loading: boolean
	visible: boolean
	onFinish: (values: GameRebateEditData[]) => void
	onCancel: () => void
	gameTypeTableData: IGameRebateTableData[]
	siteId: number
}

const SetByProductModal: FC<ISetByProductModal> = ({
	loading,
	visible,
	onFinish,
	onCancel,
	gameTypeTableData,
	siteId,
}) => {
	const [form] = Form.useForm()
	const { t } = useTranslation()
	const [dataSource, setDataSource] = useState<IGameRebateTableData[]>([])
	// 比對 gameTypeTableData 是否有改變
	// const isDataNeedRefresh = useMemo(
	// 	() => isEqual(dataSource, gameTypeTableData),
	// 	[gameTypeTableData]
	// )

	const {
		data: { data: vipLevelNameList = [] } = {},
		isLoading: isGetVipLevelNameLoading,
	} = useGetVipLevelNameQuery({ siteId })

	// useRef store editList
	const editList = useRef<GameRebateEditData[]>([])

	const columnRender = (value: null | string | number): string => {
		// 0 會被視為 false , 改為判斷 0是否為 null
		if (value !== null && isNumber(Number(value)) && Number(value) >= 0) {
			return percentageFormatter(Number(value))
		}
		return t('Label_Default')
	}

	const columns = () => {
		return [
			{
				title: t('Label_Game'),
				key: 'gameType',
				dataIndex: 'gameTypeName',
				width: 100,
				align: 'center' as 'center',
			},
			{
				title: find(vipLevelNameList, { level: 1 })?.levelName,
				key: 'vintageClub',
				dataIndex: 'vintageClub',
				width: 100,
				align: 'center' as 'center',
				editable: true,
				render: (vintageClub: number | null | string) =>
					columnRender(vintageClub),
			},
			{
				title: find(vipLevelNameList, { level: 2 })?.levelName,
				key: 'silverClub',
				dataIndex: 'silverClub',
				width: 100,
				align: 'center' as 'center',
				editable: true,
				render: (silverClub: number | null | string) =>
					columnRender(silverClub),
			},
			{
				title: find(vipLevelNameList, { level: 3 })?.levelName,
				key: 'goldClub',
				dataIndex: 'goldClub',
				width: 100,
				align: 'center' as 'center',
				editable: true,
				render: (goldClub: number | null | string) => columnRender(goldClub),
			},
			{
				title: find(vipLevelNameList, { level: 4 })?.levelName,
				key: 'titaniumClub',
				dataIndex: 'titaniumClub',
				width: 100,
				align: 'center' as 'center',
				editable: true,
				render: (titaniumClub: number | null | string) =>
					columnRender(titaniumClub),
			},
			{
				title: find(vipLevelNameList, { level: 5 })?.levelName,
				key: 'diamondClub',
				dataIndex: 'diamondClub',
				width: 100,
				align: 'center' as 'center',
				editable: true,
				render: (diamondClub: number | null | string) =>
					columnRender(diamondClub),
			},
			{
				title: find(vipLevelNameList, { level: 6 })?.levelName,
				key: 'novaClub',
				dataIndex: 'novaClub',
				width: 100,
				align: 'center' as 'center',
				editable: true,
				render: (novaClub: number | null | string) => columnRender(novaClub),
			},
		]
	}

	const handleEndEdit = (value: IGameRebateTableData) => {
		const current = cloneDeep(dataSource)
		const currentEditList = cloneDeep(editList.current)
		assign(current[findIndex(current, { gameType: value.gameType })], value)
		currentEditList.push(editCellValuesToEditList(value))
		setDataSource(current)
		editList.current = cloneDeep(currentEditList)
	}

	const mergedColumns = columns().map(col => {
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: (record: IGameRebateTableData) => ({
				record,
				form,
				editList,
				handleEndEdit,
				title: col.title,
				editable: col.editable,
				dataIndex: col.dataIndex,
			}),
		}
	})

	useEffect(() => {
		if (gameTypeTableData) {
			setDataSource(gameTypeTableData)
		}
	}, [gameTypeTableData])

	useEffect(() => {
		if (!visible) {
			form.resetFields()
		}
	}, [visible])

	return (
		<Modal
			open={visible}
			title={t('Label_SetByProductPageTitle')}
			okText={t('Label_Save')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={() => {
				editList.current = []
				onCancel()
			}}
			width={1000}
			onOk={() => {
				onFinish(editList.current)
				editList.current = []
			}}
		>
			<Form form={form}>
				<Table
					components={{
						body: {
							cell: SetByProductCell,
						},
					}}
					loading={loading || isGetVipLevelNameLoading}
					columns={mergedColumns}
					dataSource={dataSource}
					pagination={false}
					scroll={{ y: 600 }}
				/>
			</Form>
		</Modal>
	)
}

export { SetByProductModal }
