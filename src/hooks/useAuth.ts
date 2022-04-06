import { useContext } from 'react'
import { AuthContext } from 'common/config-provider'
import { AuthContextType } from 'common/config-provider/AuthContext'

const useAuth = (): AuthContextType => {
	return useContext(AuthContext)
}

export { useAuth }
