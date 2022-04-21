import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import { fetchPermissionGetRoleListAsync } from './thunk'
import { roleManagementInterface } from './type'

interface RoleManagementState {
	roleManagementDataList: roleManagementInterface[]
	status: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: RoleManagementState = {
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
			}),
})

export const selectRoleManagementDataList = (state: RootState) =>
	state.roleManagement.roleManagementDataList

export const selectRoleManagementStatus = (state: RootState) =>
	state.roleManagement.status

export default roleManagementSlice.reducer
