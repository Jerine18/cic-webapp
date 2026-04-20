'use client'

export default function CTASection() {
  return (
    <section id="request" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-umak-blue via-blue-600 to-blue-700 shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-umak-yellow opacity-20 rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl transform -translate-x-32 translate-y-32" />
          
          <div className="relative px-8 py-16 lg:px-16 lg:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-xs font-metropolis font-bold text-umak-yellow uppercase tracking-widest mb-6 block">
                Get Started
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-marcellus text-white mb-8 leading-tight">
                Ready to Submit
                <br />
                Your Request?
              </h2>
              <p className="text-lg sm:text-xl text-blue-100 font-metropolis mb-12 leading-relaxed max-w-2xl mx-auto">
                Start your document request now and experience streamlined processing with professional results.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => {
                    const event = new CustomEvent('startRequest')
                    window.dispatchEvent(event)
                  }}
                  className="inline-flex items-center justify-center px-8 py-4 bg-umak-yellow text-umak-blue rounded-lg hover:bg-yellow-400 transition-all font-bold font-metropolis text-sm uppercase tracking-wider shadow-lg hover:shadow-xl group"
                >
                  <span>Start Request</span>
                  <svg 
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <a
                  href="#about"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-lg hover:bg-white/20 transition-all font-bold font-metropolis text-sm uppercase tracking-wider backdrop-blur-sm"
                >
                  Learn More
                </a>
              </div>

              {/* Info Cards */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-marcellus text-umak-yellow mb-2">Step 1</div>
                  <div className="text-sm font-metropolis text-white">
                    Select your service type from available options
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-marcellus text-umak-yellow mb-2">Step 2</div>
                  <div className="text-sm font-metropolis text-white">
                    Fill out the request form with required details
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-marcellus text-umak-yellow mb-2">Step 3</div>
                  <div className="text-sm font-metropolis text-white">
                    Submit and track your request in the dashboard
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
