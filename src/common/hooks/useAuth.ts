import { useContext } from 'react'
import { AuthContextType, AuthContext } from 'common/auth'

const useAuth = (): AuthContextType => {
	return useContext(AuthContext)
}

export { useAuth }
