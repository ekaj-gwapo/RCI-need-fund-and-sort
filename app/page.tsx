import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Lock, Eye, FileText } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-emerald-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
              T
            </div>
            <span className="text-3xl font-bold text-emerald-900">Report of Checks Issued</span>
          </div>
          <div className="flex items-center gap-6">
            {/* Logo placeholders - 3 logos */}
            <div className="flex items-center gap-4">
              {/* Logo 1 */}
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    <Image src="/logos/logo4.png" alt="Logo 4" width={64} height={64} />
  </div>
              {/* Logo 2 */}
               <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    <Image src="/logos/logo3.jpg" alt="Logo 4" width={64} height={64} />
  </div>
              {/* Logo 3 */}
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    <Image src="/logos/logo1.jpg" alt="Logo 3" width={64} height={64} />
  </div>
              <div className="w-16 h-16 rounded-full bg-white shadow-lg flex hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 items-center justify-center overflow-hidden">
    <Image src="/logos/logo2.png" alt="Logo 2" width={100} height={100} className="object-contain" />
  </div>
            </div>
            <Link href="/auth/login">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-lg">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full px-100 py-24 text-center overflow-hidden">
        <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('/bg.jpg')" }}
  />

  {/* White fade overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/1 to-white backdrop-blur-sm" />

  {/* Content */}
  <div className="relative z-10 space-y-6">
    <h1 className="text-5xl md:text-6xl font-bold text-emerald-900 leading-tight">
      Checked & Issued Reports System
    </h1>
    <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
      Track, review, and manage all checked and issued items in one place. Generate accurate reports and monitor transaction history with real-time updates.
    </p>
    <Link href="/auth/login" className="inline-block">
      <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
        Login Now <ArrowRight className="w-5 h-5" />
      </Button>
    </Link>
  </div>
</section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="w-full px-6">
          <h2 className="text-3xl font-bold text-emerald-900 text-center mb-12">
            Designed for Efficiency
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Entry User Card */}
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-emerald-900">Data Entry User</CardTitle>
                <CardDescription>Input and manage transaction data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-600">
                <p>✓ Enter transaction details including:</p>
                <ul className="ml-4 space-y-2 text-sm">
                  <li>• Bank name, payee, and address</li>
                  <li>• DV number and particulars</li>
                  <li>• Amount, date, and account code</li>
                  <li>• Debit/credit information</li>
                  <li>• Control number and remarks</li>
                </ul>
                <p className="pt-2">Secure and organized data management with comprehensive validation.</p>
              </CardContent>
            </Card>

            {/* Viewer User Card */}
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-emerald-900">Viewer User</CardTitle>
                <CardDescription>Access and analyze transaction records</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-600">
                <p>✓ Instant access to transaction data</p>
                <p>✓ Advanced sorting and filtering:</p>
                <ul className="ml-4 space-y-2 text-sm">
                  <li>• Sort by bank name</li>
                  <li>• Sort by fund</li>
                  <li>• Sort by date</li>
                  <li>• Sort by account code</li>
                </ul>
                <p className="pt-2">Real-time data synchronization and reporting capabilities.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Credentials Section */}
      <section className="bg-emerald-600 py-20">
        <div className="w-full px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Try It Now</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Entry User Demo */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-emerald-900">Data Entry User</CardTitle>
                <CardDescription>Input transaction data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email:</p>
                    <p className="text-lg font-mono text-gray-900">entry@demo.com</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Password:</p>
                    <p className="text-lg font-mono text-gray-900">Demo123456!</p>
                  </div>
                </div>
                <Link href="/auth/login" className="block">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Login as Entry User
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Viewer User Demo */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-emerald-900">Viewer User</CardTitle>
                <CardDescription>Access and report on data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email:</p>
                    <p className="text-lg font-mono text-gray-900">viewer@demo.com</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Password:</p>
                    <p className="text-lg font-mono text-gray-900">Demo123456!</p>
                  </div>
                </div>
                <Link href="/auth/login" className="block">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Login as Viewer User
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-emerald-50 py-20">
        <div className="w-full px-6">
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-emerald-900 mb-3">Enterprise Security</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Your data is protected with industry-leading security. We use role-based access control to ensure that viewers only see data assigned to them, and entry users maintain full control over their submissions.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Secure authentication</li>
                <li>✓ Role-based access control</li>
                <li>✓ Encrypted data transmission</li>
                <li>✓ Audit logging</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white py-8">
        <div className="w-full px-6 text-center text-gray-600">
          <p>© 2026 Transaction Hub. Built for modern financial workflows.</p>
        </div>
      </footer>
    </div>
  )
}
