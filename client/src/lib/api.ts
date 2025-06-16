const API_URL = 'http://localhost:3000/api/v1/guests'

export async function submitGuest(data: any) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to submit guest')
  }

  return response.json()
}

export async function getGuests() {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch guests')
  }

  const data = await response.json()
  return data.data || []
}

export async function getGuestById(id: string) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch guest')
  }

  return response.json()
}