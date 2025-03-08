import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import UserProfile from '../components/UserProfile'
import SearchForm from '../components/SearchForm'

// Custom debounce implementation
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const UserProfilePage = () => {
  const navigate = useNavigate()
  const { username: urlUsername } = useParams()
  
  const [username, setUsername] = useState(urlUsername || '')
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  
  // Use our custom debounce hook
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Effect for search loading indicator
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setSearchLoading(true);
    } else {
      setSearchLoading(false);
    }
  }, [searchTerm, debouncedSearchTerm]);
  
  const fetchUserData = async (username) => {
    if (!username.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const [userResponse, reposResponse] = await Promise.all([
        axios.get(`https://api.github.com/users/${username}`),
        axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
      ])
      
      setUser(userResponse.data)
      setRepos(reposResponse.data)
      
      // Update URL without reloading the page
      navigate(`/user/${username}`, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching data')
      setUser(null)
      setRepos([])
    } finally {
      setLoading(false)
    }
  }
  
  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
  }
  
  // Filter repositories based on debounced search term
  const filteredRepos = repos.filter(repo => {
    if (!debouncedSearchTerm) return true
    
    const searchLower = debouncedSearchTerm.toLowerCase()
    return (
      repo.name.toLowerCase().includes(searchLower) ||
      (repo.description && repo.description.toLowerCase().includes(searchLower)) ||
      (repo.language && repo.language.toLowerCase().includes(searchLower))
    )
  })
  
  const handleUserSearch = (newUsername) => {
    setUsername(newUsername)
    if (newUsername.trim()) {
      fetchUserData(newUsername)
    }
  }
  
  const handleRepoClick = (repo) => {
    navigate(`/repo/${repo.owner.login}/${repo.name}`)
  }
  
  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  // Initial data fetch when component mounts or username changes
  useEffect(() => {
    if (urlUsername) {
      setUsername(urlUsername)
      fetchUserData(urlUsername)
    } else if (username) {
      fetchUserData(username)
    } else {
      // Load default user
      fetchUserData('github')
    }
  }, [urlUsername])
  
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">GitHub Profile Viewer</h1>
        
        <SearchForm onSearch={handleUserSearch} initialValue={username} />
        
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
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Repositories ({repos.length})</h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search repositories..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-2 top-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    {searchLoading && (
                      <div className="absolute right-2 top-2.5">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                  </div>
                </div>
                
                {filteredRepos.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    {searchTerm ? 'No repositories match your search.' : 'No repositories found.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {filteredRepos.map(repo => (
                      <div 
                        key={repo.id} 
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200 cursor-pointer"
                        onClick={() => handleRepoClick(repo)}
                      >
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-blue-600 hover:underline">
                            {repo.name}
                          </h3>
                          {repo.fork && (
                            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">Fork</span>
                          )}
                        </div>
                        
                        {repo.description && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {repo.description}
                          </p>
                        )}
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          {repo.language && (
                            <div className="flex items-center text-xs text-gray-600">
                              <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                              {repo.language}
                            </div>
                          )}
                          
                          <div className="flex items-center text-xs text-gray-600 ml-3">
                            <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                            </svg>
                            {repo.stargazers_count}
                          </div>
                          
                          <div className="flex items-center text-xs text-gray-600 ml-3">
                            <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                            </svg>
                            {repo.forks_count}
                          </div>
                          
                          <div className="flex-grow text-right">
                            <span className="text-xs text-gray-500">
                              Updated {formatDate(repo.updated_at)}
                            </span>
                          </div>
                        </div>
                        
                        {repo.topics && repo.topics.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {repo.topics.slice(0, 3).map(topic => (
                              <span 
                                key={topic} 
                                className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {topic}
                              </span>
                            ))}
                            {repo.topics.length > 3 && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                                +{repo.topics.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfilePage