// getCurrentUser.js
import axios from 'axios'
import { setUserData, clearUserData, setLoading } from '../redux/userSlice'

 const getCurrentUser = () => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    
    const token = localStorage.getItem('token')
    if (!token) {
      dispatch(clearUserData())
      return
    }

    const response = await axios.get('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.data && response.data.user) {
      dispatch(setUserData(response.data))
    } else {
      dispatch(clearUserData())
    }
    
  } catch (error) {
    console.error('Error fetching user:', error)
    
    // Handle 401 specifically
    if (error.response?.status === 401) {
      console.log('User not authenticated - clearing user data')
      localStorage.removeItem('token') // Clear invalid token
      dispatch(clearUserData())
    } else {
      dispatch(clearUserData())
    }
  }
}

export default 