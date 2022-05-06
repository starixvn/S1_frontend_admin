export const withOutSiteIdParams = (params: { [k: string]: any }) => {
	const newQueryParams = { ...params }
	delete newQueryParams.siteId

	return newQueryParams
}
