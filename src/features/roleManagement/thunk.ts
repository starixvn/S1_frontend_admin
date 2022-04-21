import { createAsyncThunk } from '@reduxjs/toolkit'

import { fetchPermissionGetRoleList } from './api'

export const fetchPermissionGetRoleListAsync = createAsyncThunk(
	'roleManagement/fetchPermissionGetRoleList',
	async (roleName: string = '') => {
		const data = await fetchPermissionGetRoleList(roleName)

		return data
	}
)
