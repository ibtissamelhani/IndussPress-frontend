import Header from '../components/layout/Header';
import Footer from '../components/layout/footer';
import { Filter, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-100 to-blue-100 py-20 text-center">
                <div className="max-w-lg mx-auto">
                    <h1 className="text-3xl font-semibold text-gray-900  lg:text-4xl">
                        Welcome to IndussPress
                    </h1>

                    <p className="mt-6 text-gray-500 dark:text-gray-900">
                        Your industrial news management platform    </p>
                </div>

                <div className="flex justify-center mt-10">
                    <div id="default-carousel" className="relative  w-4/6" data-carousel="slide">
                        {/* Carousel wrapper */}
                        <div className="relative h-56 overflow-hidden rounded-lg md:h-96 ">
                            {/* Item 1 */}
                            <div className="hidden duration-700 ease-in-out" data-carousel-item>
                                <img
                                    src="https://images.unsplash.com/photo-1647510283846-ed174cc84a78?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                                    alt="Slide 1"
                                />
                            </div>
                            {/* Item 2 */}
                            <div className="hidden duration-700 ease-in-out" data-carousel-item>
                                <img
                                    src="https://images.unsplash.com/photo-1503694978374-8a2fa686963a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                                    alt="Slide 2"
                                />
                            </div>
                            {/* Item 3 */}
                            <div className="hidden duration-700 ease-in-out" data-carousel-item>
                                <img
                                    src="https://images.unsplash.com/photo-1503694978374-8a2fa686963a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                                    alt="Slide 3"
                                />
                            </div>
                            {/* Item 4 */}
                            <div className="hidden duration-700 ease-in-out" data-carousel-item>
                                <img
                                    src="https://plus.unsplash.com/premium_photo-1691223733678-095fee90a0a7?q=80&w=1221&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                                    alt="Slide 4"
                                />
                            </div>
                            {/* Item 5 */}
                            <div className="hidden duration-700 ease-in-out" data-carousel-item>
                                <img
                                    src="https://images.unsplash.com/photo-1476242906366-d8eb64c2f661?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                                    alt="Slide 5"
                                />
                            </div>
                        </div>
                    </div>

                </div>

            </section>

            {/* Filters */}
            <main className="max-w-7xl mx-auto px-4">
                <section className="mb-12 bg-white p-6 rounded-lg border shadow-sm">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Catégorie</label>
                            <select className="w-full border rounded px-3 py-2">
                                <option>Toutes les catégories</option>
                                <option>Politique</option>
                                <option>Économie</option>
                                <option>Technologie</option>
                                <option>Sport</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Auteur</label>
                            <select className="w-full border rounded px-3 py-2">
                                <option>Tous les auteurs</option>
                                <option>Jean Dupont</option>
                                <option>Marie Martin</option>
                                <option>Pierre Durand</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Date</label>
                            <input type="date" className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Date</label>
                            <input type="date" className="w-full border rounded px-3 py-2" />
                        </div>
                        <div className="flex items-end">
                            <button className="w-full bg-primary-600 text-white px-4 py-2 rounded">Rechercher</button>
                        </div>
                    </div>
                </section>

                {/* Article Cards */}
                <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">Derniers Articles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition">
                                <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                                <div className="p-6">
                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                        <Calendar size={16} className="mr-1" />
                                        <span>15 Juillet 2025</span>
                                        <span className="mx-2">•</span>
                                        <User size={16} className="mr-1" />
                                        <span>Auteur</span>
                                    </div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Titre exemple {i + 1}</h4>
                                    <p className="text-gray-600 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                    <div className="flex justify-between">
                                        <span className="bg-primary-100 text-primary-800 text-xs px-2.5 py-0.5 rounded">Technologie</span>
                                        <button className="text-primary-600 hover:text-primary-700 text-sm">Lire plus →</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="text-center mt-8">
                    <button className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-6 py-3 rounded-lg font-medium">
                        Charger plus d'articles
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;