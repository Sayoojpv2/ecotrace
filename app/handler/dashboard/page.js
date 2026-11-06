'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, Truck, History, FileText,
  ShieldCheck, Menu, X, LogOut, CheckCircle, MapPin,
  Star, Phone, Leaf, Download, Eye, Navigation,
  TrendingUp, Lock, UploadCloud, Loader2, ChevronDown, AlertCircle,
  User, Save, Camera, Image as ImageIcon
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function HandlerDashboard() {
  const router = useRouter()
  const [activeView, setActiveView] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)

  // Data State
  const [marketJobs, setMarketJobs] = useState([])
  const [myJobs, setMyJobs] = useState([])
  const [history, setHistory] = useState([])
  const [documents, setDocuments] = useState([])
  const [stats, setStats] = useState({ verifiedMonth: 0 })

  // Action State
  const [selectedJob, setSelectedJob] = useState(null)
  const [otp, setOtp] = useState('')
  const [weight, setWeight] = useState('')
  const [rating, setRating] = useState(5)
  const [verifying, setVerifying] = useState(false)

  // Photo & Document State
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const photoInputRef = useRef(null)
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  // 🟢 NEW: Vault Folder & Proof State
  const [activeDocFolder, setActiveDocFolder] = useState('verified_waste')
  const [selectedProof, setSelectedProof] = useState(null)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')
    setUserId(user.id)

    const now = new Date().toISOString()

    const { data: market } = await supabase
      .from('activities')
      .select('*, profiles!activities_institution_id_fkey(org_name, city, phone, overall_rating)')
      .eq('status', 'open')
      .is('accepted_by', null)
      .gt('expires_at', now)
      .order('created_at', { ascending: false })

    const { data: active } = await supabase
      .from('activities')
      .select('*, profiles!activities_institution_id_fkey(org_name, city, phone)')
      .eq('accepted_by', user.id)
      .neq('status', 'collected')
      .order('created_at', { ascending: false })

    // History contains all verified jobs (this will power the new Vault folder)
    const { data: past } = await supabase
      .from('activities')
      .select('*, profiles!activities_institution_id_fkey(org_name, city, phone)')
      .eq('accepted_by', user.id)
      .eq('status', 'collected')
      .order('created_at', { ascending: false })

    const { data: docs } = await supabase
      .from('handler_documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (market) setMarketJobs(market)
    if (active) setMyJobs(active)
    if (docs) setDocuments(docs)
    if (past) {
        setHistory(past)
        const currentMonth = new Date().getMonth()
        const monthVerifications = past.filter(item => new Date(item.created_at).getMonth() === currentMonth)
        setStats({ verifiedMonth: monthVerifications.length })
    }
    setLoading(false)
  }

  // 🟢 NEW: Get Photo URL Helper
  const getPhotoUrl = (path) => {
    if (!path) return null
    const { data } = supabase.storage.from('verification_photos').getPublicUrl(path)
    return data.publicUrl
  }

  const acceptJob = async (jobId) => {
    const { error } = await supabase
      .from('activities')
      .update({ accepted_by: userId, status: 'accepted' })
      .eq('id', jobId)
    if (error) alert(error.message)
    else { alert("Job Accepted!"); fetchData() }
  }

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0]
    if (file) { setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file)) }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!photoFile) return alert("Photo evidence is required for the audit trail.")
    setVerifying(true)

    const fileName = `${selectedJob.id}_${Date.now()}.jpg`
    const { error: uploadError } = await supabase.storage.from('verification_photos').upload(fileName, photoFile)

    if (uploadError) {
        alert("Failed to upload photo evidence: " + uploadError.message)
        setVerifying(false)
        return
    }

    const { data, error } = await supabase.rpc('verify_pickup_full', {
        p_activity_id: selectedJob.id,
        p_otp_input: otp.trim(),
        p_rating: rating,
        p_weight: parseInt(weight)
    })

    if (error || data === false) {
        alert("Verification Failed! Check OTP.")
    } else {
        await supabase.from('activities').update({ photo_url: fileName }).eq('id', selectedJob.id)
        alert("Pickup Verified Successfully & Proof Saved!")
        setSelectedJob(null); setOtp(''); setWeight(''); setRating(5); setPhotoFile(null); setPhotoPreview(null)
        fetchData(); setActiveView('history')
    }
    setVerifying(false)
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fileName = `${userId}/${Date.now()}_${file.name}`

    const { error: uploadError } = await supabase.storage.from('handler_docs').upload(fileName, file)
    if (uploadError) { alert("Storage Error: " + uploadError.message); setUploading(false); return }

    const { error: dbError } = await supabase
      .from('handler_documents')
      .insert([{ user_id: userId, name: file.name, type: 'PDF', status: 'Verified', file_path: fileName }])

    if (dbError) alert("Database Error: " + dbError.message)
    else { alert("Document Uploaded Successfully!"); fetchData() }
    setUploading(false)
  }

  const openDocument = (path) => {
      if (!path) return alert("Error: File path not found.")
      const { data } = supabase.storage.from('handler_docs').getPublicUrl(path)
      if (data) window.open(data.publicUrl, '_blank')
  }

  // --- VIEWS ---
  const DashboardView = () => (
    <div className="space-y-8 animate-in fade-in">
        <div>
            <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-green-500/50 transition">
                    <p className="text-gray-400 text-xs font-bold uppercase">Jobs Completed (This Month)</p>
                    <h3 className="text-4xl font-bold text-green-400 mt-2">{stats.verifiedMonth}</h3>
                    <p className="text-xs text-gray-500 mt-1">Successfully Verified</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-blue-500/50 transition">
                    <p className="text-gray-400 text-xs font-bold uppercase">Active Route</p>
                    <h3 className="text-4xl font-bold text-blue-400 mt-2">{myJobs.length}</h3>
                    <p className="text-xs text-gray-500 mt-1">Jobs in progress</p>
                </div>
            </div>
        </div>

        <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Navigation className="text-green-500" /> My Active Route</h2>
            {myJobs.length === 0 ? (
                 <div className="bg-gray-800/50 border border-gray-700 border-dashed rounded-xl p-8 text-center text-gray-500">
                    <p>No active jobs. Pick one from the market below!</p>
                 </div>
            ) : (
                <div className="grid gap-4">
                    {myJobs.map(job => (
                        <div key={job.id} className="bg-green-900/10 p-5 rounded-xl border border-green-500/50 shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div><h3 className="font-bold text-xl text-white">{job.profiles?.org_name}</h3><p className="text-green-400 text-xs font-bold uppercase mt-1">● In Progress</p></div>
                                <a href={`tel:${job.profiles?.phone}`} className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 text-green-400"><Phone className="h-5 w-5" /></a>
                            </div>
                            <button onClick={() => { setSelectedJob(job); setWeight(job.weight); }} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-500 flex items-center justify-center gap-2 transition transform active:scale-95">
                                <CheckCircle className="h-5 w-5" /> Verify & Collect
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Truck className="text-blue-500" /> Live Market Feed</h2>
                {marketJobs.length > 0 && <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">{marketJobs.length} New</span>}
            </div>
            {marketJobs.length === 0 ? (
                <div className="text-center py-10 opacity-50 bg-gray-800 rounded-xl border border-gray-700"><p>No new requests nearby.</p></div>
            ) : (
                <div className="grid gap-4">
                    {marketJobs.map(job => (
                        <div key={job.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg relative overflow-hidden group hover:border-blue-500 transition">
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">expires soon</div>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-lg text-white">{job.profiles?.org_name}</h3>
                                    <p className="text-gray-400 text-xs flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {job.profiles?.city}</p>
                                    <div className="flex items-center gap-1 mt-2 bg-gray-900 w-fit px-2 py-1 rounded text-xs font-bold text-yellow-400"><span>{job.profiles?.overall_rating || 'New'}</span><Star className="h-3 w-3 fill-yellow-400" /></div>
                                </div>
                                <span className="bg-blue-900/50 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-800 uppercase">{job.type}</span>
                            </div>
                            <div className="bg-gray-900/50 p-3 rounded-lg mb-4 text-center">
                                <span className="block text-gray-500 text-xs">Est. Weight</span>
                                <span className="font-mono font-bold text-white text-lg">{job.weight} kg</span>
                                {job.description && <p className="text-xs text-gray-400 mt-1 italic">&quot;{job.description}&quot;</p>}
                            </div>
                            <button onClick={() => acceptJob(job.id)} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-500 transition shadow-lg">Accept Pickup</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  )

  const ReportsView = () => {
    const [selectedMonth, setSelectedMonth] = useState('February 2026')
    const reportDate = new Date().toLocaleDateString()
    const reportId = `H-RPT-${Math.floor(1000 + Math.random() * 9000)}`
    const totalPickups = history.length
    const totalWeight = history.reduce((sum, item) => sum + (item.collected_weight || 0), 0)
    const uniqueClients = [...new Set(history.map(item => item.profiles?.org_name))].length

    return (
      <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800 absolute inset-0 overflow-y-auto print:bg-white print:p-0 print:static print:z-50">
        <div className="max-w-5xl mx-auto mb-6 print:hidden">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Collection Operations Reports</h1>
                    <p className="text-gray-500 mt-1">Generate verified waste recovery documentation.</p>
                </div>
                <button onClick={() => window.print()} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-800 transition shadow-sm shadow-green-900/10"><Download className="h-4 w-4" /> Download PDF</button>
            </div>
        </div>
        <div className="max-w-5xl mx-auto bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 flex flex-wrap gap-4 items-end print:hidden">
            <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Report Month</label>
                <div className="relative">
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-3 pl-4 pr-10 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-500"><option>February 2026</option><option>January 2026</option></select>
                    <ChevronDown className="absolute right-3 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
            </div>
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition">Generate Report</button>
        </div>
        <div className="max-w-4xl mx-auto bg-white shadow-xl border border-gray-100 min-h-[1000px] p-12 relative text-left print:shadow-none print:border-none print:w-full print:max-w-none print:p-8">
            <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6"><div><h2 className="text-3xl font-bold text-gray-900">{selectedMonth} Collection Report</h2><p className="text-gray-500 mt-2">Generated for Handler ID: <span className="font-bold text-gray-900">{userId?.split('-')[0] || 'Unknown'}</span></p></div><div className="text-right"><p className="text-sm text-gray-400">Date: {reportDate}</p><p className="text-sm text-gray-400">Report ID: #{reportId}</p></div></div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8 text-xs text-gray-500 leading-relaxed flex gap-3 print:bg-gray-100"><AlertCircle className="h-4 w-4 shrink-0 text-gray-400" /><p>This report is an EcoTrace-generated verification record of waste collection activities. It serves as proof of recovery for EPR compliance and audit purposes. EcoTrace facilitates the data recording but does not act as the certifying authority.</p></div>
            <div className="grid grid-cols-3 gap-4 mb-10"><div className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm print:border-gray-300"><p className="text-xs font-bold text-gray-400 uppercase">Total Pickups</p><p className="text-2xl font-bold text-gray-900">{totalPickups}</p></div><div className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm print:border-gray-300"><p className="text-xs font-bold text-gray-400 uppercase">Clients Served</p><p className="text-2xl font-bold text-blue-700">{uniqueClients}</p></div><div className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm print:border-gray-300"><p className="text-xs font-bold text-gray-400 uppercase">Total Weight</p><p className="text-2xl font-bold text-green-700">{totalWeight} kg</p></div></div>
            <div className="overflow-hidden mb-10"><table className="w-full text-left"><thead className="border-b-2 border-gray-100"><tr><th className="py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th><th className="py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Client (Institution)</th><th className="py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th><th className="py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Weight</th></tr></thead><tbody className="divide-y divide-gray-50">{history.map((item) => (<tr key={item.id} className="group hover:bg-gray-50 transition print:break-inside-avoid"><td className="py-4 text-sm font-medium text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td><td className="py-4 text-sm font-bold text-gray-800">{item.profiles?.org_name}</td><td className="py-4 text-sm text-gray-500">{item.type}</td><td className="py-4 text-right font-mono text-green-700 font-bold">{item.collected_weight} kg</td></tr>))}</tbody></table></div>
            <div className="absolute bottom-12 left-12 right-12 border-t border-gray-100 pt-6 flex justify-between items-center text-xs text-gray-400"><p>Generated by EcoTrace • Verified Handler Record</p><p>Page 1 of 1</p></div>
        </div>
      </div>
    )
  }

  // Profile editor. Restored during the 2026-11 recovery: the Feb-17 working copy
  // removed this component but kept the "Edit Profile" nav item and the
  // <ProfileView /> render, which threw a ReferenceError. Restored from commit
  // a53ae65, with one change: only editable fields are sent in the update, so
  // the client never writes back `role` or other protected columns.
  const ProfileView = () => {
    const [profile, setProfile] = useState({ org_name: '', phone: '', city: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        async function fetchProfile() {
            const { data } = await supabase.from('profiles').select('org_name, phone, city').eq('id', userId).single()
            if (data) setProfile(data)
        }
        if (userId) fetchProfile()
    }, [userId])

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        const { error } = await supabase
            .from('profiles')
            .update({ org_name: profile.org_name, phone: profile.phone, city: profile.city })
            .eq('id', userId)
        if (error) alert("Error saving profile")
        else alert("Profile updated successfully!")
        setSaving(false)
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 max-w-2xl">
                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2">Organization / Handler Name</label>
                        <input type="text" value={profile.org_name || ''} onChange={e => setProfile({...profile, org_name: e.target.value})} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-green-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">Phone Number</label>
                            <input type="text" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-green-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">City</label>
                            <input type="text" value={profile.city || ''} onChange={e => setProfile({...profile, city: e.target.value})} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-green-500 outline-none" />
                        </div>
                    </div>
                    <button type="submit" disabled={saving} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition">
                        {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    )
  }

  // 🟢 UPDATED: Document Vault for Handlers (Tabs added)
  const DocumentsView = () => (
      <div className="space-y-6 animate-in slide-in-from-right-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">My Document Vault</h2>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,application/pdf" />
            <button onClick={() => fileInputRef.current.click()} disabled={uploading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition">{uploading ? <Loader2 className="h-4 w-4 animate-spin"/> : <UploadCloud className="h-4 w-4" />} {uploading ? 'Uploading...' : 'Upload File'}</button>
          </div>

          {/* Folder Tabs */}
          <div className="flex gap-4 border-b border-gray-800 pb-4">
              <button
                  onClick={() => setActiveDocFolder('verified_waste')}
                  className={`px-5 py-2.5 rounded-lg font-bold transition text-sm flex items-center gap-2 ${activeDocFolder === 'verified_waste' ? 'bg-green-900/40 text-green-400 border border-green-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                  <ShieldCheck className="h-4 w-4" /> Collection Proofs <span className="bg-gray-800 px-2 py-0.5 rounded-full text-xs">{history.length}</span>
              </button>
              <button
                  onClick={() => setActiveDocFolder('general')}
                  className={`px-5 py-2.5 rounded-lg font-bold transition text-sm flex items-center gap-2 ${activeDocFolder === 'general' ? 'bg-blue-900/40 text-blue-400 border border-blue-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                  <FileText className="h-4 w-4" /> My Certificates <span className="bg-gray-800 px-2 py-0.5 rounded-full text-xs">{documents.length}</span>
              </button>
          </div>

          {/* Folder Content */}
          <div className="mt-6">
              {activeDocFolder === 'verified_waste' ? (
                  // Verified Collections Folder
                  history.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-800 rounded-xl p-10 text-center"><p className="text-gray-500">No verified collections yet.</p></div>
                  ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                          {history.map(item => (
                              <div key={item.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 hover:border-green-500/50 transition flex flex-col justify-between group">
                                  <div>
                                      <div className="flex justify-between items-start mb-3">
                                          <div className="flex items-center gap-3">
                                              <div className="bg-green-900/50 p-2 rounded-lg"><ShieldCheck className="h-5 w-5 text-green-500" /></div>
                                              <div>
                                                  <h4 className="font-bold text-white text-sm">{item.profiles?.org_name || 'Institution'}</h4>
                                                  <p className="text-xs text-gray-400 mt-0.5">{new Date(item.created_at).toLocaleString()}</p>
                                              </div>
                                          </div>
                                          <span className="bg-green-900/50 text-green-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Verified</span>
                                      </div>
                                      <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 text-sm text-gray-300">
                                          <p><span className="font-medium text-gray-500">Collection:</span> {item.collected_weight} kg of {item.type}</p>
                                      </div>
                                  </div>
                                  <button onClick={() => setSelectedProof(item)} className="mt-4 w-full bg-gray-900 text-gray-400 hover:text-white py-2 rounded-lg text-sm font-bold border border-gray-700 hover:bg-gray-700 transition flex justify-center items-center gap-2">
                                      <Eye className="h-4 w-4" /> View Audit Proof
                                  </button>
                              </div>
                          ))}
                      </div>
                  )
              ) : (
                  // General Uploaded Documents Folder
                  <div className="grid gap-4">
                      {documents.length === 0 ? (
                          <div className="border-2 border-dashed border-gray-800 rounded-xl p-10 text-center"><p className="text-gray-500">No certificates uploaded yet.</p><button onClick={() => fileInputRef.current.click()} className="text-blue-500 hover:text-blue-400 text-sm mt-2 font-bold">Upload PCB License or MoU</button></div>
                      ) : documents.map(doc => (
                          <div key={doc.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center group hover:border-blue-500/50 transition">
                              <div className="flex items-center gap-4">
                                  <div className="bg-gray-900 p-3 rounded-lg"><FileText className="h-6 w-6 text-blue-500" /></div>
                                  <div>
                                      <h4 className="font-bold text-white truncate max-w-[200px]">{doc.name}</h4>
                                      <p className="text-xs text-gray-400">Uploaded on {new Date(doc.created_at).toLocaleDateString()}</p>
                                  </div>
                              </div>
                              <button onClick={() => openDocument(doc.file_path)} className="text-gray-400 hover:text-white p-2 bg-gray-900 rounded-lg hover:bg-blue-600 transition" title="View Document">
                                <Eye className="h-5 w-5" />
                              </button>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      </div>
  )

  const CreditsView = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4">
        <h2 className="text-2xl font-bold text-white">Carbon & EPR Credit Readiness</h2>
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 text-center relative overflow-hidden">
            <div className="relative z-10"><div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30"><TrendingUp className="h-10 w-10 text-green-500" /></div><h3 className="text-2xl font-bold text-white mb-2">Credit Market Enablement</h3><span className="bg-blue-900/30 text-blue-400 border border-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">System In Development</span><p className="text-gray-400 max-w-lg mx-auto leading-relaxed mt-4 text-sm">EcoTrace is building the infrastructure to connect verified waste records with authorized Carbon and EPR certification bodies.<br/><br/><span className="text-gray-300 italic">Note: Credit eligibility typically requires a minimum of 6–12 months of consistent, verified data history.</span></p><div className="mt-8 flex justify-center gap-4"><button className="text-white bg-green-700 font-bold text-sm px-6 py-3 rounded-lg hover:bg-green-600 transition shadow-lg shadow-green-900/20">Register for Enablement</button><button className="text-gray-500 font-bold text-sm border border-gray-700 px-6 py-3 rounded-lg cursor-not-allowed flex items-center gap-2"><Lock className="h-4 w-4" /> Market Not Yet Live</button></div></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700"><ShieldCheck className="h-8 w-8 text-blue-500 mb-4" /><h4 className="font-bold text-white mb-2">Build Data History</h4><p className="text-xs text-gray-400 leading-relaxed">Start verifying pickups now. A solid, uninterrupted history of digital records is the first requirement for future credit applications.</p></div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700"><Leaf className="h-8 w-8 text-green-500 mb-4" /><h4 className="font-bold text-white mb-2">EPR Compliance</h4><p className="text-xs text-gray-400 leading-relaxed">Maintain organized recovery records aligned with Extended Producer Responsibility (EPR) documentation requirements.</p></div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700"><TrendingUp className="h-8 w-8 text-yellow-500 mb-4" /><h4 className="font-bold text-white mb-2">Value Participation</h4><p className="text-xs text-gray-400 leading-relaxed">Handlers with consistent, verified records may become eligible to participate in the value generated once the marketplace activates.</p></div>
        </div>
    </div>
  )

  const HistoryView = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4">
        <h2 className="text-2xl font-bold text-white">Collection History</h2>
        <div className="space-y-4">
             {history.map(item => (
                <div key={item.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                    <div><h4 className="font-bold text-white">{item.profiles?.org_name}</h4><div className="flex gap-1 mt-1">{[...Array(item.segregation_rating || 0)].map((_,i)=><Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400"/>)}</div></div>
                    <div className="text-right"><span className="block font-bold text-green-400">{item.collected_weight} kg</span><span className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</span></div>
                </div>
            ))}
        </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 font-sans flex text-gray-100">
      {isSidebarOpen && (<div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>)}

      <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-gray-950 border-r border-gray-800 p-6 flex flex-col justify-between transform transition-transform z-50 print:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div>
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-2xl font-bold text-green-500 flex items-center gap-2"><Leaf className="h-6 w-6" /> EcoTrace</h1>
                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400"><X /></button>
            </div>
            <nav className="space-y-2">
                <NavBtn icon={LayoutDashboard} label="Dashboard" id="dashboard" active={activeView} set={setActiveView} close={() => setIsSidebarOpen(false)} />
                <NavBtn icon={History} label="History" id="history" active={activeView} set={setActiveView} close={() => setIsSidebarOpen(false)} />
                <NavBtn icon={FileText} label="Reports" id="reports" active={activeView} set={setActiveView} close={() => setIsSidebarOpen(false)} />
                <NavBtn icon={ShieldCheck} label="Documents" id="documents" active={activeView} set={setActiveView} close={() => setIsSidebarOpen(false)} />
                <NavBtn icon={TrendingUp} label="Credit Readiness" id="credits" active={activeView} set={setActiveView} close={() => setIsSidebarOpen(false)} />
                <NavBtn icon={User} label="Edit Profile" id="profile" active={activeView} set={setActiveView} close={() => setIsSidebarOpen(false)} />
            </nav>
        </div>
        <button onClick={async () => { await supabase.auth.signOut(); router.push('/login') }} className="flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 transition"><LogOut className="h-5 w-5" /> Sign Out</button>
      </aside>

      <main className="flex-1 overflow-y-auto h-screen">
        <div className="md:hidden bg-gray-950 p-4 flex items-center justify-between border-b border-gray-800 sticky top-0 z-30 print:hidden">
            <h1 className="text-xl font-bold text-green-500">EcoTrace Handler</h1>
            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-300"><Menu /></button>
        </div>
        <div className={activeView === 'reports' ? "w-full h-full p-0 print:w-full print:p-0" : "p-6 md:p-10 max-w-4xl mx-auto"}>
            {loading ? <p className="text-gray-500 text-center mt-10">Loading EcoTrace...</p> : (
                <>
                    {activeView === 'dashboard' && <DashboardView />}
                    {activeView === 'history' && <HistoryView />}
                    {activeView === 'reports' && <ReportsView />}
                    {activeView === 'documents' && <DocumentsView />}
                    {activeView === 'credits' && <CreditsView />}
                    {activeView === 'profile' && <ProfileView />}
                </>
            )}
        </div>
      </main>

      {/* VERIFY COLLECTION MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-md">
            <div className="bg-gray-800 w-full max-w-sm rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-white mb-6">Verify Collection</h3>
                <form onSubmit={handleVerify} className="space-y-6">
                    <div><input type="text" required placeholder="OTP Code" maxLength={4} value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-black border border-gray-600 rounded-lg p-4 text-center text-3xl font-mono text-white tracking-widest focus:ring-2 focus:ring-green-500 outline-none" /></div>
                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center">
                        <label className="block text-gray-400 text-xs font-bold uppercase mb-3">Audit Proof (Required)</label>
                        <input type="file" accept="image/*" capture="environment" ref={photoInputRef} onChange={handlePhotoCapture} className="hidden" />
                        {photoPreview ? (
                            <div className="relative w-full h-32 mb-2 rounded-lg overflow-hidden border border-gray-600">
                                <img src={photoPreview} alt="Evidence" className="object-cover w-full h-full" />
                                <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(null); }} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"><X className="h-4 w-4"/></button>
                            </div>
                        ) : (
                            <button type="button" onClick={() => photoInputRef.current.click()} className="w-full bg-gray-800 border-2 border-dashed border-gray-600 text-gray-300 py-6 rounded-lg hover:border-green-500 hover:text-green-400 transition flex flex-col items-center gap-2">
                                <Camera className="h-8 w-8" />
                                <span className="text-sm font-bold">Take Photo Evidence</span>
                            </button>
                        )}
                    </div>
                    <div><label className="block text-gray-400 text-xs font-bold uppercase mb-2">Final Weight (kg)</label><input type="number" required value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-green-500" /></div>
                    <div>
                        <label className="block text-gray-400 text-xs font-bold uppercase mb-2 text-center">Segregation Quality</label>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none transform transition hover:scale-110">
                                    <Star className={`h-8 w-8 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => { setSelectedJob(null); setPhotoFile(null); setPhotoPreview(null); }} className="flex-1 bg-gray-700 py-3 rounded-lg text-white">Cancel</button>
                        <button type="submit" disabled={verifying || !photoFile} className="flex-1 bg-green-600 py-3 rounded-lg text-white font-bold disabled:opacity-50 flex justify-center items-center gap-2">
                            {verifying ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Complete'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* 🟢 NEW: AUDIT PROOF VIEWER MODAL (Matches Institution Side) */}
      {selectedProof && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative text-gray-900">
                <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <ShieldCheck className="h-6 w-6 text-green-400" /> Digital Handshake Record
                        </h3>
                        <p className="text-gray-400 text-xs mt-1 font-mono">ID: {selectedProof.id}</p>
                    </div>
                    <button onClick={() => setSelectedProof(null)} className="text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full transition"><X className="h-5 w-5" /></button>
                </div>

                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 bg-gray-50">
                    <div className="flex-1 space-y-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Photo Evidence</p>
                        <div className="bg-gray-200 w-full h-64 rounded-xl border border-gray-300 overflow-hidden flex items-center justify-center relative">
                            {selectedProof.photo_url ? (
                                <img src={getPhotoUrl(selectedProof.photo_url)} alt="Verification" className="object-cover w-full h-full" />
                            ) : (
                                <div className="text-center text-gray-400 p-4">
                                    <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                    <p className="text-xs">Image missing or upload interrupted</p>
                                </div>
                            )}
                            <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] p-2 rounded border border-white/10 font-mono">
                                <p>TIMESTAMP: {new Date(selectedProof.created_at).toISOString()}</p>
                                <p>VERIFIED BY: OTP DIGITAL HANDSHAKE</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recovery Details</p>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500 text-sm">Category</span><span className="font-bold text-gray-900">{selectedProof.type}</span></div>
                                <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500 text-sm">Verified Weight</span><span className="font-bold text-green-600 font-mono">{selectedProof.collected_weight} kg</span></div>
                                <div className="flex justify-between"><span className="text-gray-500 text-sm">Segregation</span><span className="font-bold text-gray-900">{selectedProof.segregation_rating}/5 Stars</span></div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Institution Information</p>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                <p className="font-bold text-gray-900">{selectedProof.profiles?.org_name || 'Institution'}</p>
                                <p className="text-sm text-gray-500">{selectedProof.profiles?.phone || 'Contact not provided'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border-t border-gray-200 p-4 flex justify-between items-center">
                    <p className="text-xs text-gray-400 flex items-center gap-1"><AlertCircle className="h-4 w-4"/> Valid for EPR submission.</p>
                    <button onClick={() => window.print()} className="text-green-700 bg-green-50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-100 transition">
                        <Download className="h-4 w-4" /> Save as PDF
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  )
}

const NavBtn = ({ icon: Icon, label, id, active, set, close, alert }) => (
    <button onClick={() => { set(id); close(); }} className={`flex items-center gap-3 w-full p-3 rounded-lg font-medium transition relative ${active === id ? 'bg-green-900/20 text-green-400 border border-green-900' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}>
        <Icon className="h-5 w-5" /> {label}
        {alert && <span className="absolute right-3 top-3 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
    </button>
)