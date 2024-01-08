import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseUrl } from 'common/service/Api'
import { axiosBaseQuery } from 'common/service/axiosBaseQuery'

/*
 * 配置初始定義的 createApi，減少初始 bundle 的大小，定義後調用 injectEndpoints 來定義額外的 api
 * https://redux-toolkit.js.org/rtk-query/usage/code-splitting
 */

export const rootApi = createApi({
	reducerPath: 'rootApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	// POST2 用於處理對應單一 api 有一對以上 標籤對照時使用的通用 Tag
	tagTypes: ['POST', 'POST2', 'NOTE_POST', 'UPDATE_PIC', 'UPDATE_MODAL'],
	endpoints: () => ({}),
})
