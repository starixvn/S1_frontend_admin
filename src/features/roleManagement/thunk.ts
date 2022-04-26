import { createAsyncThunk } from '@reduxjs/toolkit'

import {
	fetchPermissionAddRolePermission,
	fetchPermissionDeleteRolePermission,
	fetchPermissionGetAllRolePermission,
	fetchPermissionGetRoleList,
	fetchPermissionGetRolePermission,
} from './api'
import { AddRolePermissionInterface } from './type'

export const fetchPermissionGetRoleListAsync = createAsyncThunk(
	'roleManagement/fetchPermissionGetRoleList',
	async (roleName: string = '') => {
		const data = await fetchPermissionGetRoleList(roleName)

		return data
	}
)

export const fetchPermissionGetAllRolePermissionAsync = createAsyncThunk(
	'roleManagement/fetchPermissionGetAllRolePermission',
	async () => {
		const data = await fetchPermissionGetAllRolePermission()

		return data
	}
)

export const fetchPermissionAddRolePermissionAsync = createAsyncThunk(
	'roleManagement/fetchPermissionAddRolePermission',
	async (body: AddRolePermissionInterface) => {
		await fetchPermissionAddRolePermission(body)
	}
)

export const fetchPermissionDeleteRolePermissionAsync = createAsyncThunk(
	'roleManagement/fetchPermissionDeleteRolePermission',
	async (role: number) => {
		const deleteRole = await fetchPermissionDeleteRolePermission(role)

		return deleteRole
	}
)

export const fetchPermissionGetRolePermissionAsync = createAsyncThunk(
	'roleManagement/fetchPermissionGetRolePermissionAsync',
	async (role: number) => {
		const data = await fetchPermissionGetRolePermission(role)

		return data
	}
)
