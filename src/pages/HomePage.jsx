import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RepoUrlInput from '../components/RepoUrlInput'

const HomePage = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  
  const handleUserSearch = (e) => {
    e.preventDefault()
    if (username.trim()) {
      navigate(`/user/${username}`)
    }
  }
  
  const handleRepoExplore = (owner, repo) => {
    navigate(`/repo/${owner}/${repo}`)
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">GitHub Explorer</h1>
        <p className="text-center text-gray-600 mb-8">
          Explore GitHub users and repositories with a beautiful interface
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Find a User</h2>
            <p className="text-gray-600 mb-4">
              Search for a GitHub user to view their profile and repositories.
            </p>
            
            <form onSubmit={handleUserSearch}>
              <div className="flex">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter GitHub username"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r-md transition duration-200"
                >
                  Search
                </button>
              </div>
            </form>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Popular Users</h3>
              <div className="grid grid-cols-2 gap-2">
                {['github', 'microsoft', 'google', 'facebook'].map(user => (
                  <button
                    key={user}
                    onClick={() => navigate(`/user/${user}`)}
                    className="text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded text-blue-600 hover:text-blue-800"
                  >
                    {user}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Explore Repository</h2>
            <p className="text-gray-600 mb-4">
              Enter a GitHub repository URL to explore its file structure.
            </p>
            
            <RepoUrlInput onRepoSelect={handleRepoExplore} />
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Popular Repositories</h3>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { owner: 'facebook', repo: 'react' }, 
                  { owner: 'vuejs', repo: 'vue' },
                  { owner: 'tensorflow', repo: 'tensorflow' },
                  { owner: 'microsoft', repo: 'vscode' }
                ].map(({ owner, repo }) => (
                  <button
                    key={`${owner}/${repo}`}
                    onClick={() => navigate(`/repo/${owner}/${repo}`)}
                    className="text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded text-blue-600 hover:text-blue-800"
                  >
                    {owner}/{repo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Features section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-center mb-6">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Search Users</h3>
              <p className="text-gray-500">
                Find GitHub users and explore their profiles and repositories easily.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Browse Repositories</h3>
              <p className="text-gray-500">
                View repository files with an interactive tree structure explorer.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Copy File Trees</h3>
              <p className="text-gray-500">
                Copy repository structure in a clean, formatted way for documentation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage