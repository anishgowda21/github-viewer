import { useState } from 'react'
import RepoTree from './RepoTree'

const RepoUrlInput = () => {
  const [url, setUrl] = useState('')
  const [repoInfo, setRepoInfo] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Reset
    setError(null)
    setRepoInfo(null)
    
    try {
      // Parse GitHub URL to extract owner and repo
      const githubRegex = /github\.com\/([^\/]+)\/([^\/]+)/
      const matches = url.match(githubRegex)
      
      if (!matches || matches.length < 3) {
        setError('Invalid GitHub repository URL. Please enter a URL like: https://github.com/username/repository')
        return
      }
      
      const owner = matches[1]
      let repo = matches[2]
      
      // Remove any trailing parts from the repo name (like /issues, /pulls, etc.)
      repo = repo.split('/')[0]
      repo = repo.split('#')[0]
      repo = repo.split('?')[0]
      
      setRepoInfo({ owner, repo })
    } catch (err) {
      setError('Failed to parse GitHub URL. Please enter a valid repository URL.')
    }
  }

  const closeRepoTree = () => {
    setRepoInfo(null)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">View Repository Files</h3>
          <p className="text-sm text-gray-600 mb-4">
            Enter a GitHub repository URL to view its file structure.
          </p>
          
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md transition duration-200"
            >
              View Files
            </button>
          </form>
          
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
      
      {repoInfo && (
        <RepoTree 
          owner={repoInfo.owner} 
          repo={repoInfo.repo} 
          onClose={closeRepoTree} 
        />
      )}
    </div>
  )
}

export default RepoUrlInput