import { FC, useEffect, useRef, useState } from 'react'
import { findIndex, assign, cloneDeep, isNumber } from 'lodash'
import { Form, Modal, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { percentageFormatter } from 'common/utils/format'
import { SiteIds } from 'app/constants/siteIds'
import { GameRebateEditData, IGameRebateTableData } from '../type'
import { SetByProductCell } from './SetByProductCell'
import { editCellValuesToEditList } from '../utils/converters'

interface ISetByProductModal {
	loading: boolean
	visible: boolean
	onFinish: (values: GameRebateEditData[]) => void
	onCancel: () => void
	gameTypeTableData: IGameRebateTableData[]
	siteId?: number
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

	// useRef store editList
	const editList = useRef<GameRebateEditData[]>([])

	const columnRender = (value: null | string | number): string => {
		// 0 會被視為 false , 改為判斷 0是否為 null
		if (value !== null && isNumber(Number(value)) && value >= 0) {
			return percentageFormatter(Number(value))
		}
		return t('Label_Default')
	}

	const columns = () => {
		const novaClubTitle = () => {
			if (siteId === SiteIds.Goal123) {
				return t('GameLevel.Label_Goal123Club')
			}
			if (siteId === SiteIds.Bwing) {
				return t('GameLevel.Label_BwingVVIP')
			}
			return t('GameLevel.Label_NovaClub')
		}
		const vintageClubTitle = () => {
			if (siteId === SiteIds.Goal123 || siteId === SiteIds.Bwing) {
				return t('GameLevel.Label_BronzeClub')
			}
			return t('GameLevel.Label_VintageClub')
		}
		return [
			{
				title: t('Label_Game'),
				key: 'gameType',
				dataIndex: 'gameTypeName',
				width: 100,
				align: 'center' as 'center',
			},
			{
				title: vintageClubTitle(),
				key: 'vintageClub',
				dataIndex: 'vintageClub',
				width: 100,
				align: 'center' as 'center',
				editable: true,
				render: (vintageClub: number | null | string) =>
					columnRender(vintageClub),
			},
			{
				title: t('GameLevel.Label_SilverClub'),
				key: 'silverClub',
				dataIndex: 'silverClub',
				width: 100,
				align: 'center' as 'center',
				editable: true,
				render: (silverClub: number | null | string) =>
					columnRender(silverClub),
			},
			{
				title: t('GameLevel.Label_GoldClub'),
				key: 'goldClub',
				dataIndex: 'goldClub',
				width: 100,
				align: 'center' as 'center',
				editable: true,
				render: (goldClub: number | null | string) => columnRender(goldClub),
			},
			{
				title: t('GameLevel.Label_TitaniumClub'),
				key: 'titaniumClub',
				dataIndex: 'titaniumClub',
				width: 100,
				align: 'center' as 'center',
				editable: true,
				render: (titaniumClub: number | null | string) =>
					columnRender(titaniumClub),
			},
			{
				title: t('GameLevel.Label_DiamondClub'),
				key: 'diamondClub',
				dataIndex: 'diamondClub',
				width: 100,
				align: 'center' as 'center',
				editable: true,
				render: (diamondClub: number | null | string) =>
					columnRender(diamondClub),
			},
			{
				title: novaClubTitle(),
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
			visible={visible}
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
					loading={loading}
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
