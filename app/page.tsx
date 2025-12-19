import Link from "next/link"
import { FileText, CheckCircle, Send, TrendingUp, Users, Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: FileText,
    title: "Professional Invoices",
    description: "Create beautiful, branded invoices in minutes with customizable templates and line items.",
  },
  {
    icon: Send,
    title: "Send & Track",
    description: "Email invoices directly to clients and track when they're viewed and paid.",
  },
  {
    icon: TrendingUp,
    title: "Financial Insights",
    description: "Monitor your revenue, outstanding payments, and cash flow with real-time dashboards.",
  },
  {
    icon: Users,
    title: "Client Management",
    description: "Keep all your client information organized in one place for faster invoicing.",
  },
  {
    icon: CheckCircle,
    title: "Payment Status",
    description: "Track invoice statuses from draft to sent to paid with clear visual indicators.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Your data is protected with enterprise-grade security and daily backups.",
  },
]

const stats = [
  { value: "10,000+", label: "Invoices Created" },
  { value: "2,500+", label: "Active Businesses" },
  { value: "$5M+", label: "Payments Processed" },
  { value: "99.9%", label: "Uptime" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-500 rounded flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-navy-900">InvoiceFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-navy-700 hover:text-navy-900 font-medium transition-colors">
                Sign In
              </Link>
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-900 tracking-tight text-balance">
              Professional invoicing for modern businesses
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 text-pretty">
              Create, send, and track invoices effortlessly. Get paid faster with billing tools designed for SMEs and
              freelancers.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8">
                <Link href="/login">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-navy-200 text-navy-700 hover:bg-navy-50 bg-transparent"
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
                <div className="mt-2 text-navy-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900">Everything you need to manage billing</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features to streamline your invoicing workflow and keep your finances organized.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-white border border-gray-200 rounded-lg hover:border-navy-200 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-navy-700" />
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-900 rounded-2xl p-8 sm:p-12 lg:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-balance">
              Ready to streamline your invoicing?
            </h2>
            <p className="mt-4 text-lg text-navy-300 max-w-2xl mx-auto">
              Join thousands of businesses using InvoiceFlow to get paid faster and manage their finances with ease.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8">
                <Link href="/login">
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-navy-900">InvoiceFlow</span>
            </div>
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} InvoiceFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
