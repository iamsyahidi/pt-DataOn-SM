'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getGuests } from '@/lib/api'
import { Button } from './ui/button'

type Guest = {
  id: string
  name: string
  email: string
  phone: string
  idCard: string
  remark: string
  createdAt: string
}

export default function GuestList() {
  const router = useRouter()
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const data = await getGuests()
        setGuests(data)
      } catch (err) {
        setError('Failed to fetch guests')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchGuests()
  }, [])

  if (loading) return <div className="text-center py-8">Loading guests...</div>
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Registered Guests
        </h2>
        <Button onClick={() => router.push('/register')}>
          Add New Guest
        </Button>
      </div>
      
      {guests.length === 0 ? (
        <p className="text-gray-500">No guests registered yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remark
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {guest.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {guest.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {guest.remark}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(guest.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => router.push(`/guests/${guest.id}`)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}