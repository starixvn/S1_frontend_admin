import { endsWith, replace } from 'lodash'
import { useSearchParams } from 'react-router-dom'

export const buildParams = (values: object) => {
	const params = new URLSearchParams()

	Object.entries(values).forEach(
		([key, value]: [string, string | string[] | number[]]) => {
			if (!value || value?.length === 0) return

			if (Array.isArray(value)) {
				params.append(key, `${value.join(',')}[]`)
			} else {
				params.append(key, value)
			}
		}
	)

	const queryParams = Object.fromEntries(params)

	return queryParams
}

const readParams = (searchParams: URLSearchParams) => {
	const params: any = {}
	const originParams = Object.fromEntries(searchParams)

	Object.keys(originParams).forEach((key: string) => {
		const value = originParams[key]

		if (endsWith(value, '[]')) {
			params[key] = replace(value, '[]', '').split(',').filter(Boolean)
		} else {
			params[key] = value ?? ''
		}
	})

	return params
}

const useQueryParams = (): [
	{
		[k: string]: any
	},
	(values: object) => void
] => {
	const [searchParams, setSearchParams] = useSearchParams()
	// * 後台開始支援多品牌操作，在 setSearchParams 時取消記住 cookieSiteId，如有無預期bug再行修復
	// const { siteId: cookieSiteId } = useAppSelector(selectUserSite) ?? {}
	const queryParams = readParams(searchParams)

	const setQueryParams = (values: object) => {
		if (values) {
			setSearchParams(buildParams({ ...values }))
		}
	}
	return [queryParams, setQueryParams]
}

export { useQueryParams }
