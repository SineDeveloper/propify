'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { propertySchema, PropertyFormData } from '@/lib/schemas/property'
import { upsertProperty } from '@/app/actions/property'
import { uploadPropertyImages } from '@/lib/upload'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface PropertyFormProps {
  propertyId?: string
  defaultValues?: Partial<PropertyFormData & { images?: string[] }>
}

const PROVINCES = [
  'กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ',
  'สมุทรสาคร', 'นครปฐม', 'เชียงใหม่', 'ภูเก็ต', 'ชลบุรี', 'ระยอง',
  'ขอนแก่น', 'อุดรธานี', 'นครราชสีมา', 'สุราษฎร์ธานี',
]

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'
const errorClass = 'text-xs text-red-500 mt-1'

export function PropertyForm({ propertyId, defaultValues }: PropertyFormProps) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>(defaultValues?.images ?? [])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      bedrooms: 0,
      bathrooms: 0,
      status: 'for_sale',
      type: 'condo',
      address: '',
      ...defaultValues,
    },
  })

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    try {
      const id = propertyId ?? `temp-${Date.now()}`
      const urls = await uploadPropertyImages(files, id)
      setImages((prev) => [...prev, ...urls])
    } catch {
      alert('อัพโหลดรูปไม่สำเร็จ กรุณาลองใหม่')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function onSubmit(data: PropertyFormData) {
    setSubmitError(null)
    try {
      await upsertProperty({ ...data, images }, propertyId)
      router.push('/dashboard/properties')
      router.refresh()
    } catch (err: any) {
      setSubmitError(err.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* ข้อมูลหลัก */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-5">ข้อมูลทรัพย์สิน</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>ชื่อประกาศ *</label>
            <input
              {...register('title')}
              placeholder="เช่น คอนโด ใจกลางเมือง วิวสวย ใกล้ BTS"
              className={inputClass}
            />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
          </div>
          <div>
            <label className={labelClass}>คำอธิบาย *</label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="อธิบายรายละเอียด จุดเด่น สภาพแวดล้อม..."
              className={inputClass}
            />
            {errors.description && <p className={errorClass}>{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>ประเภท *</label>
              <select {...register('type')} className={inputClass}>
                <option value="condo">คอนโดมิเนียม</option>
                <option value="house">บ้านเดี่ยว</option>
                <option value="townhouse">ทาวน์เฮาส์</option>
                <option value="land">ที่ดิน</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>สถานะ *</label>
              <select {...register('status')} className={inputClass}>
                <option value="for_sale">ขาย</option>
                <option value="for_rent">เช่า</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ราคาและขนาด */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-5">ราคาและขนาด</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>ราคา (บาท) *</label>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number" placeholder="3500000"
              className={inputClass}
            />
            {errors.price && <p className={errorClass}>{errors.price.message}</p>}
          </div>
          <div>
            <label className={labelClass}>พื้นที่ (ตร.ม.) *</label>
            <input
              {...register('area', { valueAsNumber: true })}
              type="number" placeholder="35"
              className={inputClass}
            />
            {errors.area && <p className={errorClass}>{errors.area.message}</p>}
          </div>
          <div>
            <label className={labelClass}>ห้องนอน</label>
            <input
              {...register('bedrooms', { valueAsNumber: true })}
              type="number" min="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>ห้องน้ำ</label>
            <input
              {...register('bathrooms', { valueAsNumber: true })}
              type="number" min="0"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* ที่ตั้ง */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-5">ที่ตั้ง</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>จังหวัด *</label>
              <select {...register('province')} className={inputClass}>
                <option value="">เลือกจังหวัด</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {errors.province && <p className={errorClass}>{errors.province.message}</p>}
            </div>
            <div>
              <label className={labelClass}>เขต/อำเภอ *</label>
              <input
                {...register('district')}
                placeholder="เช่น วัฒนา, เมือง"
                className={inputClass}
              />
              {errors.district && <p className={errorClass}>{errors.district.message}</p>}
            </div>
          </div>
          <div>
            <label className={labelClass}>ที่อยู่เพิ่มเติม</label>
            <input
              {...register('address')}
              placeholder="ชื่อโครงการ, ซอย, ถนน"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Latitude (สำหรับแผนที่)</label>
              <input
                {...register('lat', { valueAsNumber: true })}
                type="number" step="any" placeholder="13.7563"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Longitude</label>
              <input
                {...register('lng', { valueAsNumber: true })}
                type="number" step="any" placeholder="100.5018"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </section>

      {/* รูปภาพ */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-5">รูปภาพ</h2>
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
            {images.map((url, i) => (
              <div key={url} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-xs bg-black/60
                    text-white px-1.5 py-0.5 rounded">
                    หลัก
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((u) => u !== url))}
                  className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white
                    rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity
                    flex items-center justify-center leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file" accept="image/*" multiple
          onChange={handleImageUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8
            text-center text-sm text-gray-400 hover:border-green-400
            hover:text-green-600 transition-colors disabled:opacity-50"
        >
          {uploading
            ? '⏳ กำลังอัพโหลด...'
            : '📷 คลิกหรือลากไฟล์มาวางที่นี่'}
        </button>
        <p className="text-xs text-gray-400 mt-2">
          รองรับ JPG, PNG, WEBP · รูปแรกจะเป็นรูปหลัก
        </p>
      </section>

      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-600
          text-sm rounded-xl px-4 py-3">
          ⚠️ {submitError}
        </div>
      )}

      <div className="flex items-center gap-3 pb-8">
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm
            font-medium hover:bg-green-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting
            ? 'กำลังบันทึก...'
            : propertyId
            ? 'บันทึกการแก้ไข'
            : 'เพิ่มทรัพย์สิน'}
        </button>
        <a
          href="/dashboard/properties"
          className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5"
        >
          ยกเลิก
        </a>
      </div>
    </form>
  )
}