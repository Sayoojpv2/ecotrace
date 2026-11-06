'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import {
  ArrowLeft, Folder, FileCheck, ShieldCheck,
  Image as ImageIcon, Eye, X, Download, AlertCircle, FileText
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function DocumentVault() {
  const [verifiedLogs, setVerifiedLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFolder, setActiveFolder] = useState('verified_waste')
  const [selectedProof, setSelectedProof] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Safely fetch only collected logs
      const { data: logsData, error } = await supabase
        .from('activities')
        .select('*')
        .eq('institution_id', user.id)
        .eq('status', 'collected')
        .order('created_at', { ascending: false })

      if (error) {
          console.error("Error fetching logs:", error)
          setLoading(false)
          return
      }

      // 2. Manually fetch handler profiles to prevent Foreign Key crashes
      let enrichedLogs = []
      if (logsData) {
          enrichedLogs = await Promise.all(logsData.map(async (log) => {
              if (log.accepted_by) {
                  const { data: handlerData } = await supabase
                      .from('profiles')
                      .select('org_name, phone')
                      .eq('id', log.accepted_by)
                      .single()
                  return { ...log, profiles: handlerData }
              }
              return log
          }))
      }

      setVerifiedLogs(enrichedLogs)
      setLoading(false)
    }
    fetchData()
  }, [])

  // Helper to get the public URL of the uploaded photo
  const getPhotoUrl = (path) => {
    if (!path) return null
    const { data } = supabase.storage.from('verification_photos').getPublicUrl(path)
    return data.publicUrl
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-700 mb-4 transition font-medium text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <ShieldCheck className="h-8 w-8 text-green-600" /> Secure Document Vault
                </h1>
                <p className="text-gray-500 mt-2">Manage your environmental audit proofs, certificates, and compliance records.</p>
            </div>
            <button className="bg-gray-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-gray-800 transition flex items-center gap-2 shadow-sm">
                <FileText className="h-5 w-5" /> Upload External Document
            </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

        {/* Sidebar / Folders */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pl-2">Vault Folders</p>

            <button
                onClick={() => setActiveFolder('verified_waste')}
                className={`w-full flex items-center justify-between p-3 rounded-xl font-bold transition ${activeFolder === 'verified_waste' ? 'bg-green-100 text-green-800 border border-green-200' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                <div className="flex items-center gap-3">
                    <Folder className={`h-5 w-5 ${activeFolder === 'verified_waste' ? 'fill-green-200 text-green-700' : 'fill-gray-200 text-gray-400'}`} />
                    Verified Waste
                </div>
                <span className="text-xs bg-white px-2 py-0.5 rounded-full shadow-sm">{verifiedLogs.length}</span>
            </button>

            <button
                onClick={() => setActiveFolder('general')}
                className={`w-full flex items-center justify-between p-3 rounded-xl font-bold transition ${activeFolder === 'general' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                <div className="flex items-center gap-3">
                    <Folder className={`h-5 w-5 ${activeFolder === 'general' ? 'fill-blue-200 text-blue-700' : 'fill-gray-200 text-gray-400'}`} />
                    Audit Reports & MoUs
                </div>
            </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[600px]">

            {/* Folder Header */}
            <div className="bg-gray-50/50 border-b border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900">
                    {activeFolder === 'verified_waste' ? 'Auto-Generated Audit Proofs' : 'General Compliance Documents'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    {activeFolder === 'verified_waste'
                        ? 'These records are automatically generated and cryptographically locked when a handler completes the Digital Handshake.'
                        : 'Manually uploaded documents for your institution.'}
                </p>
            </div>

            {/* Folder Content */}
            <div className="p-6">
                {loading ? (
                    <p className="text-gray-400 text-center py-10">Loading secure vault...</p>
                ) : activeFolder === 'verified_waste' ? (

                    verifiedLogs.length === 0 ? (
                        <div className="text-center py-20">
                            <ShieldCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-gray-500 font-bold">No verified records yet</h3>
                            <p className="text-gray-400 text-sm mt-1">Records will appear here automatically after a successful pickup.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {verifiedLogs.map(log => (
                                <div key={log.id} className="border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition group bg-white">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-50 p-2 rounded-lg"><FileCheck className="h-6 w-6 text-green-600" /></div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">{log.type} Collection</h4>
                                                <p className="text-xs text-gray-500">{new Date(log.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Verified</span>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm text-gray-600 space-y-1 border border-gray-100">
                                        <p><span className="font-medium text-gray-900">Weight:</span> {log.collected_weight} kg</p>
                                        <p><span className="font-medium text-gray-900">Handler:</span> {log.profiles?.org_name || 'Verified Partner'}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedProof(log)}
                                            className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition flex justify-center items-center gap-2"
                                        >
                                            <Eye className="h-4 w-4" /> View Proof
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )

                ) : (
                    // General Documents Placeholder
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
                        <Folder className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-gray-500 font-bold">Folder Empty</h3>
                        <p className="text-gray-400 text-sm mt-1">Upload MoUs, ESG reports, and general compliance files here.</p>
                    </div>
                )}
            </div>
        </div>

      </div>

      {/* MODAL: The Actual "Audit Proof" Certificate Viewer */}
      {selectedProof && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative">

                {/* Modal Header */}
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

                    {/* The Photo Evidence */}
                    <div className="flex-1 space-y-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Photo Evidence</p>
                        <div className="bg-gray-200 w-full h-64 rounded-xl border border-gray-300 overflow-hidden flex items-center justify-center relative">
                            {selectedProof.photo_url ? (
                                <img
                                    src={getPhotoUrl(selectedProof.photo_url)}
                                    alt="Waste Verification"
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="text-center text-gray-400 p-4">
                                    <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                                    <p className="text-xs">Image missing or upload interrupted</p>
                                </div>
                            )}
                            {/* Watermark overlay */}
                            <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] p-2 rounded border border-white/10 font-mono">
                                <p>TIMESTAMP: {new Date(selectedProof.created_at).toISOString()}</p>
                                <p>VERIFIED BY: OTP DIGITAL HANDSHAKE</p>
                            </div>
                        </div>
                    </div>

                    {/* The Record Details */}
                    <div className="flex-1 space-y-6">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recovery Details</p>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500 text-sm">Category</span>
                                    <span className="font-bold text-gray-900">{selectedProof.type}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500 text-sm">Verified Weight</span>
                                    <span className="font-bold text-green-600 font-mono">{selectedProof.collected_weight} kg</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-sm">Segregation</span>
                                    <span className="font-bold text-gray-900">{selectedProof.segregation_rating}/5 Stars</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Handler Information</p>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                <p className="font-bold text-gray-900">{selectedProof.profiles?.org_name || 'Verified Handler'}</p>
                                <p className="text-sm text-gray-500">{selectedProof.profiles?.phone || 'Contact not provided'}</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Action */}
                <div className="bg-white border-t border-gray-200 p-4 flex justify-between items-center">
                    <p className="text-xs text-gray-400 flex items-center gap-1"><AlertCircle className="h-4 w-4"/> This document is valid for audit submission.</p>
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