import GuestForm from '@/components/GuestForm'

export default function RegisterPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Guest Registration Form
        </h2>
        <GuestForm />
      </div>
    </div>
  )
}