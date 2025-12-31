
import React, { useState, useRef } from 'react'
import { Upload, XCircle } from 'lucide-react'
import ModalWrapper from '../../modal-wrapper'
import { EditProfileModalProps } from '../../../types/modules/user'

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onUpdateUser, onClose }) => {
  const [editName, setEditName] = useState(user.name)
  const [editAvatar, setEditAvatar] = useState(user.avatarUrl || '')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editName.trim()) { setError('Display Name is required'); return; }
    onUpdateUser({ name: editName.trim(), avatarUrl: editAvatar })
    onClose()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { setError('Image must be less than 2MB'); return; }
      setError('')
      const reader = new FileReader()
      reader.onloadend = () => setEditAvatar(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <ModalWrapper onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSaveProfile} className="space-y-10 pb-10">
        <div className="flex flex-col items-center gap-6 mt-4">
          <div className="w-28 h-28 rounded-[2.5rem] bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-primary shadow-2xl relative">
            {editAvatar ? <img src={editAvatar} alt="Preview" className="w-full h-full object-cover scale-110" /> : <span className="text-5xl font-black text-primary">{editName.charAt(0)}</span>}
          </div>
          <div className="w-full">
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-3 block">Avatar Source</label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input title="Avatar URL" type="text" value={editAvatar} onChange={(e) => setEditAvatar(e.target.value)} placeholder="HTTPS URL..." className="w-full bg-gray-50 dark:bg-dark border border-gray-100 dark:border-gray-800 rounded-2xl px-5 pr-10 py-4 text-sm focus:border-primary outline-none" />
                {editAvatar && (
                  <button title='Close' type="button" onClick={() => setEditAvatar('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <XCircle size={16} />
                  </button>
                )}
              </div>
              <input placeholder='Upload Avatar' type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <button title='Upload' type="button" onClick={() => fileInputRef.current?.click()} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl text-secondary active:scale-90"><Upload size={22} /></button>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1 block">Display Name</label>
          <input placeholder='Input Display Name' type="text" value={editName} onChange={(e) => { setEditName(e.target.value); setError(''); }} className={`w-full bg-gray-50 dark:bg-dark border rounded-2xl px-5 py-5 font-black text-xl focus:outline-none ${error ? 'border-red-500' : 'border-gray-100 dark:border-gray-800 focus:border-primary'}`} />
        </div>
        <button type="submit" className="w-full bg-primary text-dark font-black py-5 rounded-[2rem] shadow-2xl active:scale-95 transition-all text-lg">Save Changes</button>
      </form>
    </ModalWrapper>
  )
}

export default EditProfileModal
