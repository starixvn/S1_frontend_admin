import { createSlice } from '@reduxjs/toolkit'
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
	status: RequestStatusType
}

const initialState: RoleManagementState = {
	rolePermission: {
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

			.addCase(fetchPermissionGetAddRolePermissionAsync.pending, state => {
				state.status = 'pending'
			})
			.addCase(
				fetchPermissionGetAddRolePermissionAsync.fulfilled,
				(state, action) => {
					state.rolePermission = action.payload
					state.status = 'succeeded'
				}
			)
			.addCase(fetchPermissionGetAddRolePermissionAsync.rejected, state => {
				state.status = 'failed'
			})

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
			.addCase(fetchPermissionGetUpdateRolePermissionAsync.pending, state => {
				state.status = 'pending'
			})
			.addCase(
				fetchPermissionGetUpdateRolePermissionAsync.fulfilled,
				(state, action) => {
					state.rolePermission = action.payload
					state.status = 'succeeded'
				}
			)
			.addCase(fetchPermissionGetUpdateRolePermissionAsync.rejected, state => {
				state.status = 'failed'
			}),
})

export const selectRoleManagementDataList = (state: RootState) =>
	state.roleManagement.roleManagementDataList

export const selectRoleManagementStatus = (state: RootState) =>
	state.roleManagement.status

export const selectRolePermission = (state: RootState) =>
	state.roleManagement.rolePermission

export default roleManagementSlice.reducer
