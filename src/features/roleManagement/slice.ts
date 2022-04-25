import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import { RequestStatusType } from 'type'
import {
	fetchPermissionAddRolePermissionAsync,
	fetchPermissionGetAllRolePermissionAsync,
	fetchPermissionGetRoleListAsync,
} from './thunk'
import { roleManagementInterface } from './type'

interface allRolePermissionInterface {
	currencyList: number[]
	permission: any[]
}

interface RoleManagementState {
	allRolePermission: allRolePermissionInterface
	roleManagementDataList: roleManagementInterface[]
	status: RequestStatusType
}

const initialState: RoleManagementState = {
	allRolePermission: {
		currencyList: [],
		permission: [],
	},
	roleManagementDataList: [],
	status: 'idle',
}

const roleManagementSlice = createSlice({
	name: 'roleManagement',
	initialState,
	reducers: {},
	extraReducers: build =>
		build
			.addCase(fetchPermissionGetRoleListAsync.pending, state => {
				state.status = 'pending'
			})
			.addCase(fetchPermissionGetRoleListAsync.fulfilled, (state, action) => {
				const data = action.payload

				state.roleManagementDataList = data
				state.status = 'succeeded'
			})
			.addCase(fetchPermissionGetRoleListAsync.rejected, state => {
				state.status = 'failed'
			})

			.addCase(
				fetchPermissionGetAllRolePermissionAsync.fulfilled,
				(state, action) => {
					state.allRolePermission = action.payload
				}
			)
			.addCase(fetchPermissionAddRolePermissionAsync.fulfilled, state => {
				state.roleManagementDataList = []
			}),
})

export const selectRoleManagementDataList = (state: RootState) =>
	state.roleManagement.roleManagementDataList

export const selectRoleManagementStatus = (state: RootState) =>
	state.roleManagement.status

export const selectAllRolePermission = (state: RootState) =>
	state.roleManagement.allRolePermission

export default roleManagementSlice.reducer
