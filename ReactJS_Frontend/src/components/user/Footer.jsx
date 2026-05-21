import React from 'react';

const Footer = () => {
    return (
        <div className="w-full mt-16 pt-12 pb-8 border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-[#e6efff] rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
                    <div className="md:w-1/2">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Join the UTEShop Community</h3>
                        <p className="text-sm text-gray-600">Stay updated with early access to new drops, enterprise deals, and tech insights. No spam, just pure utility.</p>
                    </div>
                    <div className="md:w-1/2 flex gap-3 w-full">
                        <input type="email" placeholder="Enter your work email" className="flex-1 px-4 py-3 bg-transparent rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                        <button className="bg-[#0057b7] text-white px-6 py-3 rounded-md font-semibold text-sm hover:bg-blue-700 transition whitespace-nowrap">Subscribe</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-gray-100 pt-12">
                    <div className="flex flex-col items-center">
                        <div className="text-[#0057b7] mb-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg></div>
                        <h4 className="font-bold text-sm text-gray-900 mb-1">Free Logistics</h4>
                        <p className="text-xs text-gray-500">Enterprise-grade shipping on all orders.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-[#0057b7] mb-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div>
                        <h4 className="font-bold text-sm text-gray-900 mb-1">Guaranteed Authenticity</h4>
                        <p className="text-xs text-gray-500">Direct partnerships with global brands.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-[#0057b7] mb-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div>
                        <h4 className="font-bold text-sm text-gray-900 mb-1">24/7 Expert Help</h4>
                        <p className="text-xs text-gray-500">Human support for your technical needs.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-[#0057b7] mb-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg></div>
                        <h4 className="font-bold text-sm text-gray-900 mb-1">Secure Transactions</h4>
                        <p className="text-xs text-gray-500">Encrypted, multi-tenant payment gateway.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
