import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import UserProfilePage from './pages/UserProfilePage'
import RepositoryExplorer from './pages/RepositoryExplorer'
import './App.css'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <nav className="bg-gray-800 text-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  <span className="ml-2 text-xl font-bold">GitHub Explorer</span>
                </Link>
              </div>
              <div className="flex items-center">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700">
                  Home
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/user/:username" element={<UserProfilePage />} />
            <Route path="/repo/:owner/:repoName" element={<RepositoryExplorer />} />
          </Routes>
        </main>
        
        <footer className="bg-gray-800 text-gray-400 py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p>&copy; {new Date().getFullYear()} GitHub Explorer</p>
              </div>
              <div className="flex space-x-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  GitHub
                </a>
                <a href="https://developer.github.com/v3/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  GitHub API
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App