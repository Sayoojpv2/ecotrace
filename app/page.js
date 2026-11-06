import Link from 'next/link'
import { ArrowRight, Leaf, ShieldCheck, FileText, TrendingUp, CheckCircle2, Coins, Database } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-green-100">

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-700" />
          <span className="text-xl font-extrabold tracking-tight text-gray-900">EcoTrace</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-green-700 transition">
            Handler Login
          </Link>
          <Link href="/signup" className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition shadow-md">
            Institution Access
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          The Future of Environmental Data
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight max-w-4xl mx-auto">
          Secure your compliance. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-500">Unlock your credit potential.</span>
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          EcoTrace is built on two core pillars: digitizing your environmental records for stress-free audits, and structuring that data to help you access the booming Carbon and EPR credit markets.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/signup" className="flex items-center justify-center gap-2 bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-green-800 transition shadow-lg shadow-green-900/20">
            Start Logging Records <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </main>

      {/* THE TWO PILLARS SECTION (Realistic & Grounded) */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-stretch">

          {/* Pillar 1: Documentation */}
          <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <Database className="h-7 w-7 text-blue-700" />
            </div>
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Pillar 01</h2>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Verifiable Record Keeping</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Institutions perform environmental activities but often lack structured proof. EcoTrace digitizes your actions and verifies waste pickups using a simple, secure <strong>OTP-based Digital Handshake</strong>.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm font-medium text-gray-700"><CheckCircle2 className="h-5 w-5 text-blue-500" /> Auto-generated compliance reports</li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-700"><CheckCircle2 className="h-5 w-5 text-blue-500" /> Time-stamped activity timelines</li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-700"><CheckCircle2 className="h-5 w-5 text-blue-500" /> Secure document & certificate vault</li>
            </ul>
          </div>

          {/* Pillar 2: Credit Enablement */}
          <div className="bg-gray-900 p-10 rounded-3xl border border-gray-800 shadow-xl shadow-green-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-900/30 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="w-14 h-14 bg-green-900/50 border border-green-700 rounded-2xl flex items-center justify-center mb-6">
              <Coins className="h-7 w-7 text-green-400" />
            </div>
            <h2 className="text-xs font-bold text-green-500 uppercase tracking-widest mb-2">Pillar 02</h2>
            <h3 className="text-3xl font-bold text-white mb-4">Credit-Ready Data</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Environmental credits require continuous, third-party verified historical data. We provide the infrastructure to organize and preserve your records to meet these strict certification standards over time.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm font-medium text-gray-300"><CheckCircle2 className="h-5 w-5 text-green-500" /> Build a continuous data history</li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-300"><CheckCircle2 className="h-5 w-5 text-green-500" /> Align with EPR documentation requirements</li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-300"><CheckCircle2 className="h-5 w-5 text-green-500" /> Maintain proof for future credit eligibility</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Broad Institutional Compliance Section & Services Card */}
      <section className="bg-white py-24 mt-12 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

                {/* Text Content */}
                <div>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                        Stop scrambling before <br/> <span className="text-green-700">compliance audits & accreditations.</span>
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        Whether it&apos;s regulatory inspections, ESG reporting, or institutional accreditations, organizations must show continuous proof of environmental practices like proper waste disposal and sustainability initiatives.
                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        Most institutions—from hospitals and schools to corporate campuses—struggle to compile this evidence, leading to stressful, last-minute documentation gathering. <strong>EcoTrace eliminates this entirely.</strong>
                    </p>
                    <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-xl shadow-sm">
                        <p className="text-green-900 font-medium text-lg">
                            We automatically maintain time-stamped records, third-party verifications, and compliance reports <em>throughout the year</em>. When auditors arrive, your complete environmental history is ready in one click.
                        </p>
                    </div>
                </div>

                {/* Actual Services UI Visual */}
                <div className="relative">
                    <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 shadow-2xl relative z-10">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">Platform Capabilities</h4>
                                <p className="text-xs text-gray-500 mt-1">End-to-End Infrastructure</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1.5 rounded-lg border border-blue-200">
                                System Active
                            </span>
                        </div>
                        <div className="space-y-6">

                            {/* Service 1 */}
                            <div className="flex gap-4 items-start bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="bg-blue-100 p-2 rounded-full mt-0.5"><FileText className="h-5 w-5 text-blue-600" /></div>
                                <div>
                                    <p className="font-bold text-gray-900">Secure Vault & Timelines</p>
                                    <p className="text-sm text-gray-500 mt-1">Store compliance documents, track all activities chronologically, and generate 1-click audit reports.</p>
                                </div>
                            </div>

                            {/* Service 2 */}
                            <div className="flex gap-4 items-start bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="bg-green-100 p-2 rounded-full mt-0.5"><Leaf className="h-5 w-5 text-green-600" /></div>
                                <div>
                                    <p className="font-bold text-gray-900">Streamlined Waste Recovery</p>
                                    <p className="text-sm text-gray-500 mt-1">Easily log waste details and broadcast pickup requests to local verified handlers instantly.</p>
                                </div>
                            </div>

                            {/* Service 3 */}
                            <div className="flex gap-4 items-start bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="bg-purple-100 p-2 rounded-full mt-0.5"><TrendingUp className="h-5 w-5 text-purple-600" /></div>
                                <div>
                                    <p className="font-bold text-gray-900">Live Market for Handlers</p>
                                    <p className="text-sm text-gray-500 mt-1">Handlers access a continuous stream of verified collection orders to scale their operations effortlessly.</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* Decorative Background Blur */}
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-green-400/20 rounded-full blur-3xl -z-10"></div>
                </div>

            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-12 text-center text-gray-400">
        <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center gap-2 mb-6">
                <Leaf className="h-5 w-5 text-green-500" />
                <span className="text-lg font-bold text-white tracking-tight">EcoTrace</span>
            </div>
            <p className="text-sm mb-2 text-gray-300">
                Building the infrastructure to prove environmental responsibility and unlock its financial value.
            </p>
            <p className="text-xs text-gray-600 max-w-2xl mx-auto mt-6 italic">
                Disclaimer: EcoTrace provides software infrastructure for data organization and verification. We do not directly issue Carbon or EPR credits, nor do we act as a regulatory authority. We prepare your historical data to be submitted to authorized credit agencies and future marketplaces.
            </p>
            <div className="mt-8 pt-8 border-t border-gray-800 text-xs">
                &copy; {new Date().getFullYear()} EcoTrace SaaS Platform. All rights reserved.
            </div>
        </div>
      </footer>

      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-400/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-blue-400/10 blur-[120px] rounded-full"></div>
      </div>
    </div>
  )
}