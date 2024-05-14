export const filterOptionByChildren = (input: string, option: any) =>
	String(option?.children).toLowerCase().includes(input?.toLowerCase())
