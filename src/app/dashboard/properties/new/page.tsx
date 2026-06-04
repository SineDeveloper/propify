import { PropertyForm } from '@/components/dashboard/PropertyForm'

export default function NewPropertyPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">เพิ่มทรัพย์สินใหม่</h1>
        <p className="text-sm text-gray-500 mt-1">กรอกข้อมูลให้ครบเพื่อให้ผู้ซื้อค้นหาเจอง่ายขึ้น</p>
      </div>
      <PropertyForm />
    </div>
  )
}