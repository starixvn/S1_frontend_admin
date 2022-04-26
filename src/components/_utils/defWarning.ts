import warning from 'rc-util/lib/warning'

const devWarning = (valid: boolean, component: string, message: string) => {
	warning(valid, `[${component}]: ${message}`)
}

export default devWarning
