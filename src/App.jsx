import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import UserProfile from './components/UserProfile'
import RepoList from './components/RepoList'
import SearchForm from './components/SearchForm'
import RepoUrlInput from './components/RepoUrlInput'

function App() {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('profile') // 'profile' or 'repo-url'

  const fetchUserData = async (username) => {
    setLoading(true)
    setError(null)
    
    try {
      const [userResponse, reposResponse] = await Promise.all([
        axios.get(`https://api.github.com/users/${username}`),
        axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
      ])
      
      setUser(userResponse.data)
      setRepos(reposResponse.data)
      setActiveTab('profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching data')
      setUser(null)
      setRepos([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (newUsername) => {
    setUsername(newUsername)
    if (newUsername.trim()) {
      fetchUserData(newUsername)
    }
  }

  // Example initial user when component loads
  useEffect(() => {
    handleSearch('github')
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">GitHub Explorer</h1>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            User Profile
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === 'repo-url'
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('repo-url')}
          >
            Repository Explorer
          </button>
        </div>
        
        {activeTab === 'profile' && (
          <>
            <SearchForm onSearch={handleSearch} />
            
            {loading && (
              <div className="flex justify-center my-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            {user && !loading && (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <UserProfile user={user} />
                </div>
                <div className="md:col-span-2">
                  <RepoList repos={repos} username={username} />
                </div>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'repo-url' && (
          <RepoUrlInput />
        )}
      </div>
    </div>
  )
}

export default App