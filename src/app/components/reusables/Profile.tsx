import React from 'react'

const Profile = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
    <div className="w-80 bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
      <div className="flex justify-end w-full">
        <button className="text-gray-500">
          <span className="text-xl">⚙️</span> SETTINGS
        </button>
      </div>
      <div className="mt-4 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-green-200 rounded-full flex items-center justify-center mx-auto">
          <span className="text-4xl text-green-700">👤</span>
        </div>
        <h1 className="text-2xl font-bold mt-4">Amani Jr</h1>
        
        <p className="text-gray-700 mt-1">+254712345678</p>
        <p className="text-gray-700 mt-1">amani.jr@example.com</p>
        <button className="mt-4 w-full flex items-center justify-center bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full">
          <span className="text-xl">😄</span> Make money
        </button>
        <div className="w-full mt-6 space-y-4">
          <button className="w-full flex items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-xl mr-2">🏪</span> vendor
          </button>
          <button className="w-full flex items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-xl mr-2">👤</span> view account
          </button>
          <button className="w-full flex items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-xl mr-2">🛒</span> My cart
          </button>
          <button className="w-full flex items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-xl mr-2">✏️</span> edit details
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Profile