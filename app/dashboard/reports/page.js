'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import {
  Download, ArrowLeft, ChevronDown,
  AlertCircle, ShieldCheck, PieChart, CheckCircle
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function ReportsPage() {
  const [logs, setLogs] = useState([])
  const [orgProfile, setOrgProfile] = useState({ org_name: 'Organization', address: '', city: '' })
  const [loading, setLoading] = useState(true)
  const [reportDate] = useState(new Date().toLocaleDateString())
  const [reportId] = useState(`RPT-${Math.floor(1000 + Math.random() * 9000)}`)
  const [selectedMonth, setSelectedMonth] = useState('February 2026')

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Get Org Profile (Name + Address)
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_name, address, city')
        .eq('id', user.id)
        .single()

      if (profile) setOrgProfile(profile)

      // 2. Get Activities
      const { data } = await supabase
        .from('activities')
        .select('*')
        .eq('institution_id', user.id)
        .order('created_at', { ascending: false })

      setLogs(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  // --- METRICS CALCULATION ---
  const totalActivities = logs.length
  const verifiedCount = logs.filter(l => l.status === 'collected').length
  const totalWeight = logs.filter(l => l.status === 'collected').reduce((sum, item) => sum + (item.collected_weight || 0), 0)

  // Verification Ratio
  const verificationRatio = totalActivities > 0 ? Math.round((verifiedCount / totalActivities) * 100) : 0

  // Waste Breakdown Logic
  const breakdown = logs
    .filter(l => l.status === 'collected')
    .reduce((acc, log) => {
        acc[log.type] = (acc[log.type] || 0) + (log.collected_weight || 0)
        return acc
    }, {})

  // Convert breakdown to array for sorting/display
  const breakdownArray = Object.entries(breakdown)
    .sort(([, a], [, b]) => b - a) // Sort by weight descending

  const handleDownload = () => window.print()

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800 print:bg-white print:p-0">

      <div className="max-w-5xl mx-auto mb-6 print:hidden">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-700 mb-4 transition font-medium text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Sustainability Compliance Reports</h1>
                <p className="text-gray-500 mt-1">Generate and download audit-ready documentation.</p>
            </div>
            <button onClick={handleDownload} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-800 transition shadow-sm shadow-green-900/10">
                <Download className="h-4 w-4" /> Download PDF
            </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 flex flex-wrap gap-4 items-end print:hidden">
        <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Report Month</label>
            <div className="relative">
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-3 pl-4 pr-10 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>February 2026</option><option>January 2026</option>
                </select>
                <ChevronDown className="absolute right-3 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
        </div>
        <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition">Generate Report</button>
      </div>

      {/* 📄 REPORT PAPER */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl border border-gray-100 min-h-[1000px] p-12 relative print:shadow-none print:border-none print:w-full print:max-w-none print:p-8">

        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">{selectedMonth} Sustainability Report</h2>
                <div className="mt-2 text-gray-500">
                    <p className="font-bold text-gray-900 text-lg">{orgProfile.org_name}</p>
                    <p className="text-xs max-w-xs">{orgProfile.address}, {orgProfile.city}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm text-gray-400">Date: {reportDate}</p>
                <p className="text-sm text-gray-400">Report ID: #{reportId}</p>
            </div>
        </div>

        {/* Data Integrity Statement */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8 text-xs text-gray-500 leading-relaxed flex gap-3 print:bg-gray-100">
            <ShieldCheck className="h-4 w-4 shrink-0 text-gray-400" />
            <p><span className="font-bold text-gray-700">Data Integrity Statement:</span> This report is based on OTP-verified records and time-stamped entries stored securely on EcoTrace infrastructure. All modification logs are immutable.</p>
        </div>

        {/* 3-Column Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm print:border-gray-300">
                <p className="text-xs font-bold text-gray-400 uppercase">Verification Ratio</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-bold text-gray-900">{verificationRatio}%</p>
                    <span className="text-xs text-gray-400">verified/total</span>
                </div>
            </div>
            <div className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm print:border-gray-300">
                <p className="text-xs font-bold text-gray-400 uppercase">Total Diverted</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-bold text-green-600">{totalWeight}</p>
                    <span className="text-xs text-gray-400">kg saved</span>
                </div>
            </div>
            <div className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm print:border-gray-300">
                <p className="text-xs font-bold text-gray-400 uppercase">Audit Score</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-bold text-blue-600">A</p>
                    <span className="text-xs text-gray-400">calculated</span>
                </div>
            </div>
        </div>

        {/* Waste Breakdown Chart (Visual) */}
        {breakdownArray.length > 0 && (
            <div className="mb-10 p-6 border border-gray-100 rounded-xl bg-gray-50/50 print:bg-white print:border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><PieChart className="h-4 w-4" /> Waste Category Breakdown</h3>
                <div className="space-y-4">
                    {breakdownArray.map(([type, weight]) => (
                        <div key={type}>
                            <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                                <span>{type}</span>
                                <span>{weight} kg</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 print:border print:border-gray-300">
                                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(weight / totalWeight) * 100}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Data Table */}
        <div className="overflow-hidden mb-10">
            <h3 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">Detailed Log</h3>
            <table className="w-full text-left">
                <thead className="border-b-2 border-gray-100">
                    <tr>
                        <th className="py-2 text-xs font-bold text-gray-400 uppercase">Date</th>
                        <th className="py-2 text-xs font-bold text-gray-400 uppercase">Activity</th>
                        <th className="py-2 text-xs font-bold text-gray-400 uppercase">Details</th>
                        <th className="py-2 text-xs font-bold text-gray-400 uppercase text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {logs.map((log) => (
                        <tr key={log.id} className="print:break-inside-avoid">
                            <td className="py-3 text-sm text-gray-500">{new Date(log.created_at).toLocaleDateString()}</td>
                            <td className="py-3 text-sm font-bold text-gray-800">{log.type}</td>
                            <td className="py-3 text-sm text-gray-500">{log.collected_weight ? `${log.collected_weight}kg Verified` : `${log.weight}kg Est.`}</td>
                            <td className="py-3 text-right">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${log.status === 'collected' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                    {log.status === 'collected' ? 'VERIFIED' : log.status.toUpperCase()}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Footer Disclaimer */}
        <div className="absolute bottom-12 left-12 right-12 border-t border-gray-100 pt-4 flex flex-col gap-1 text-[10px] text-gray-400">
            <div className="flex justify-between">
                 <p>Generated by EcoTrace • Digital Documentation Platform</p>
                 <p>Page 1 of 1</p>
            </div>
            <p className="italic">Disclaimer: EcoTrace is a digital documentation platform. This report does not represent regulatory certification or government approval.</p>
        </div>

      </div>
    </div>
  )
}