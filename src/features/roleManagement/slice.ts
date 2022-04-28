import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import { RequestStatusType } from 'type'
import {
	fetchPermissionAddRolePermissionAsync,
	fetchPermissionDeleteRolePermissionAsync,
	fetchPermissionGetAddRolePermissionAsync,
	fetchPermissionGetRoleListAsync,
	fetchPermissionGetUpdateRolePermissionAsync,
} from './thunk'
import { RoleManagementInterface, RolePermissionInterface } from './type'

interface RoleManagementState {
	rolePermission: RolePermissionInterface
	roleManagementDataList: RoleManagementInterface[]
	status: RequestStatusType | undefined
}

const initialState: RoleManagementState = {
	rolePermission: {
		currencyList: [],
		permission: [],
	},
	roleManagementDataList: [],
	status: undefined,
}

const roleManagementSlice = createSlice({
	name: 'roleManagement',
	initialState,
	reducers: {
		setRoleManagementStatus: (
			state,
			action: PayloadAction<RequestStatusType>
		) => {
			state.status = action.payload
		},
	},
	extraReducers: build =>
		build
			.addCase(fetchPermissionGetRoleListAsync.fulfilled, (state, action) => {
				const data = action.payload

				state.roleManagementDataList = data
			})
			.addCase(
				fetchPermissionGetAddRolePermissionAsync.fulfilled,
				(state, action) => {
					state.rolePermission = action.payload
				}
			)
			.addCase(fetchPermissionAddRolePermissionAsync.fulfilled, state => {
				state.roleManagementDataList = []
			})
			.addCase(
				fetchPermissionDeleteRolePermissionAsync.fulfilled,
				(state, action) => {
					const deleteRole = action.payload

					if (!deleteRole) {
						return
					}
					const roleManagementDataList = state.roleManagementDataList.filter(
						roleManagementData => roleManagementData.role !== deleteRole
					)
					state.roleManagementDataList = roleManagementDataList
				}
			)
			.addCase(
				fetchPermissionGetUpdateRolePermissionAsync.fulfilled,
				(state, action) => {
					state.rolePermission = action.payload
				}
			),
})

export const selectRoleManagementDataList = (state: RootState) =>
	state.roleManagement.roleManagementDataList

export const selectRoleManagementStatus = (state: RootState) =>
	state.roleManagement.status

export const selectRolePermission = (state: RootState) =>
	state.roleManagement.rolePermission

export const { setRoleManagementStatus } = roleManagementSlice.actions

const roleManagementReducer = roleManagementSlice.reducer

export default roleManagementReducer
