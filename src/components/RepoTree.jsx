import { useState, useEffect } from 'react'
import axios from 'axios'

const RepoTree = ({ owner, repo, onClose }) => {
  const [treeData, setTreeData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedFolders, setExpandedFolders] = useState({})
  const [copySuccess, setCopySuccess] = useState(false)
  const [expandAllFolders, setExpandAllFolders] = useState(false)

  useEffect(() => {
    const fetchRepoTree = async () => {
      setLoading(true)
      try {
        // Get the repository's default branch
        const repoInfoResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}`)
        const defaultBranch = repoInfoResponse.data.default_branch

        // Get the tree data
        const treeResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`)
        
        // Process tree structure
        const processedTree = processTreeData(treeResponse.data.tree)
        setTreeData(processedTree)
        setError(null)
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching repository tree')
        setTreeData([])
      } finally {
        setLoading(false)
      }
    }

    if (owner && repo) {
      fetchRepoTree()
    }
  }, [owner, repo])

  // Handle expandAllFolders change
  useEffect(() => {
    if (treeData.length > 0) {
      // Find all folders in the tree recursively
      const findAllFolders = (items, result = {}) => {
        items.forEach(item => {
          if (item.type === 'tree') {
            result[item.path] = expandAllFolders // Set to true or false based on expandAllFolders toggle
            if (item.children && item.children.length > 0) {
              findAllFolders(item.children, result)
            }
          }
        })
        return result
      }
      
      setExpandedFolders(findAllFolders(treeData, {}))
    }
  }, [expandAllFolders, treeData])

  const processTreeData = (treeItems) => {
    // Create a nested tree structure from flat GitHub API response
    const root = { path: '', type: 'tree', children: [] }
    const map = { '': root }

    treeItems.forEach(item => {
      // Get path parts
      const parts = item.path.split('/')
      const name = parts.pop()
      const parentPath = parts.join('/')
      
      // Create the current item
      const currentItem = {
        ...item,
        name,
        children: item.type === 'tree' ? [] : undefined
      }
      
      // Add to map
      map[item.path] = currentItem
      
      // Add to parent's children
      const parent = map[parentPath] || root
      parent.children = parent.children || []
      parent.children.push(currentItem)
    })

    return root.children
  }

  const toggleFolder = (path) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }))
  }

  const toggleExpandAll = () => {
    setExpandAllFolders(!expandAllFolders)
  }

  const generateTreeLineText = (items, prefix = "", isLast = true, isRoot = true) => {
    let result = ""
    
    if (!isRoot) {
      // Add the current item's prefix
      result = prefix + (isLast ? "└── " : "├── ")
    } else {
      // Root level just adds the "." character
      result = ".\n"
    }
    
    // Sort items: folders first, then files, both alphabetically
    const sortedItems = [...items].sort((a, b) => {
      if (a.type === 'tree' && b.type !== 'tree') return -1
      if (a.type !== 'tree' && b.type === 'tree') return 1
      return a.name.localeCompare(b.name)
    })
    
    // Process each item
    sortedItems.forEach((item, index) => {
      // Check if this is the last item of its siblings
      const itemIsLast = index === sortedItems.length - 1
      
      if (!isRoot) {
        // Add this item
        result += `📁 ${item.name}\n` 
      }
      
      // Prepare the prefix for children
      const childPrefix = prefix + (isLast ? "    " : "│   ")
      
      // If it's a folder with children, process them
      if (item.type === 'tree' && item.children?.length > 0) {
        const childResult = generateTreeLineText(
          item.children,
          isRoot ? "" : childPrefix,
          false,
          false
        )
        result += childResult
      } else if (item.type !== 'tree') {
        // It's a file
        result += `${prefix}${itemIsLast ? "└── " : "├── "}📄 ${item.name}\n`
      }
    })
    
    return result
  }

  const copyTreeToClipboard = () => {
    // Generate tree structure with connecting lines
    const sortedTreeData = [...treeData].sort((a, b) => {
      if (a.type === 'tree' && b.type !== 'tree') return -1
      if (a.type !== 'tree' && b.type === 'tree') return 1
      return a.name.localeCompare(b.name)
    })
    
    const repoTitle = `# ${owner}/${repo}\n\n`
    const treeText = generateTreeLineText(sortedTreeData)
    const fullText = repoTitle + treeText

    // Copy to clipboard
    navigator.clipboard.writeText(fullText)
      .then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err)
      })
  }

  const renderTreeItem = (item, indent = 0) => {
    const isFolder = item.type === 'tree'
    const isExpanded = expandedFolders[item.path]
    
    return (
      <div key={item.path}>
        <div 
          className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer`}
          style={{ paddingLeft: `${indent * 16 + 8}px` }}
          onClick={() => isFolder && toggleFolder(item.path)}
        >
          {isFolder ? (
            <svg 
              className="w-4 h-4 mr-1 text-gray-600" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              {isExpanded ? (
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              )}
            </svg>
          ) : (
            <svg className="w-4 h-4 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          )}
          <span className={isFolder ? 'font-medium' : 'text-sm'}>{item.name}</span>
        </div>
        
        {isFolder && isExpanded && item.children?.length > 0 && (
          <div className="tree-children">
            {item.children.sort((a, b) => {
              // Folders first, then files, both alphabetically
              if (a.type === 'tree' && b.type !== 'tree') return -1
              if (a.type !== 'tree' && b.type === 'tree') return 1
              return a.name.localeCompare(b.name)
            }).map(child => renderTreeItem(child, indent + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h3 className="text-lg font-semibold">{owner}/{repo} File Structure</h3>
        <div className="flex items-center space-x-2">
          <div className={`transition-opacity duration-300 ${copySuccess ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-green-600 text-sm">Copied to clipboard!</span>
          </div>
          <button 
            onClick={toggleExpandAll}
            className="text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded px-3 py-1 text-sm flex items-center"
            title={expandAllFolders ? "Collapse all folders" : "Expand all folders"}
          >
            {expandAllFolders ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Collapse
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Expand
              </>
            )}
          </button>
          <button 
            onClick={copyTreeToClipboard}
            className="text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded px-3 py-1 text-sm flex items-center"
            title="Copy tree to clipboard"
            disabled={loading || error || treeData.length === 0}
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            Copy
          </button>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            title="Close"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-2 h-96 overflow-y-auto">
        {loading && (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && treeData.length === 0 && (
          <p className="text-gray-500 text-center py-8">No files found in this repository.</p>
        )}
        
        {!loading && !error && treeData.length > 0 && (
          <div className="tree-container font-mono text-sm">
            {treeData
              .sort((a, b) => {
                // Folders first, then files, both alphabetically
                if (a.type === 'tree' && b.type !== 'tree') return -1
                if (a.type !== 'tree' && b.type === 'tree') return 1
                return a.name.localeCompare(b.name)
              })
              .map(item => renderTreeItem(item))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RepoTree