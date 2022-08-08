import { createContext, Dispatch, SetStateAction } from 'react'
import { PermissionInterface } from 'type'
import { ISNSData } from 'features/snsManagement/type'

interface ITableContextProps {
	loading: boolean
	timeZoneUtcOffset: number
	editingKey: number | undefined
	handleRowSaved: (record: ISNSData) => void
	isSortMode: boolean
	disabled: boolean
	sortModeCanceled: boolean
	tableSource: ISNSData[]
	editPermission?: PermissionInterface | undefined
	setTableSource?: Dispatch<SetStateAction<ISNSData[]>>
	setEditingKey?: Dispatch<SetStateAction<number | undefined>>
	setEditMode?: Dispatch<SetStateAction<boolean>>
}

const handleRowSaved = () => {}

const initValue = {
	loading: false,
	timeZoneUtcOffset: 0,
	editingKey: 0,
	isSortMode: false,
	disabled: false,
	tableSource: [],
	sortModeCanceled: false,
	handleRowSaved,
}

export const tableContext = createContext<ITableContextProps>(initValue)
