import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Building2, Globe } from 'lucide-react';
import QuoteFormTrigger from './QuoteFormTrigger';

const ModularSolutionsSEO = () => {
    return (
        <section className="py-20 bg-slate-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                        Modular Solutions for Every Industry, <br className="hidden md:block" />
                        <span className="text-[#0A3D2A]">Delivered Across India</span>
                    </h2>
                    <div className="w-24 h-1.5 bg-[#0A3D2A] mx-auto rounded-full opacity-80"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-20">
                    {/* Left Column: Description */}
                    <div className="space-y-8 text-lg text-gray-600 leading-relaxed text-justify md:text-left">
                        <p>
                            From portable offices and container cafés to labour colonies and prefab classrooms, Saman Portable designs spaces that keep India’s projects moving. Each structure is built with <span className="font-semibold text-gray-800">PUF-panel insulation, ISI-certified steel, and ISO 9001:2015 quality systems</span>, ensuring performance in every climate and terrain.
                        </p>
                        <p>
                            Saman Portable continues to lead India’s shift toward sustainable, fast-track construction, offering modular buildings that save time, reduce carbon impact, and expand possibilities.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-2 pt-4 justify-center md:justify-start">
                            <Link href="/product" className="group inline-flex items-center text-[#0A3D2A] font-bold hover:text-[#145C41] transition-colors text-lg">
                                Explore our Portable Cabin Solutions
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Highlights */}
                    <div className="grid gap-8">
                        {/* Industry Sectors */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Industries We Serve</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Construction, Infrastructure, Manufacturing, Education, Healthcare, and Retail. Our units adapt easily to act as temporary site offices, security cabins, or permanent workspaces.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Locations */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-50 text-green-700 rounded-lg">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Pan-India Reach</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        With hubs in <span className="font-medium text-gray-900">Bangalore and Noida</span>, we deliver to Karnataka, Tamil Nadu, Telangana, Kerala, Maharashtra, West Bengal, and Delhi NCR strategies.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-[#0A3D2A] px-8 py-12 md:px-16 shadow-2xl">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                        <div>
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                Trusted by 500+ Companies
                            </h3>
                            <p className="text-green-100 text-lg opacity-90">
                                Delivering quality, reliability, and innovation in every cabin we build.
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <QuoteFormTrigger className="bg-white text-[#0A3D2A] hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all hover:scale-105 inline-flex items-center">
                                Request a Quote <ArrowRight className="ml-2 w-5 h-5" />
                            </QuoteFormTrigger>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ModularSolutionsSEO;
