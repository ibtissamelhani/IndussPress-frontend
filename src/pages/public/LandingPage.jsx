import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ChevronLeft, ChevronRight, Eye, Loader2 } from 'lucide-react';
import { 
  useGetValidatedArticlesQuery, 
  useGetCategoriesQuery 
} from '../../store/api/articlesApi';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/footer';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    categoryId: '',
    authorName: '',
    startDate: '',
    endDate: ''
  });

  const pageSize = 6;

  // Fetch validated articles and categories
  const { 
    data: articlesResponse, 
    isLoading: articlesLoading, 
    error: articlesError 
  } = useGetValidatedArticlesQuery({ 
    page: currentPage, 
    size: pageSize 
  });

  const { 
    data: categoriesData, 
    isLoading: categoriesLoading 
  } = useGetCategoriesQuery();

  const articles = articlesResponse?.content || [];
  const totalPages = articlesResponse?.totalPages || 0;
  const totalElements = articlesResponse?.totalElements || 0;
  const categories = categoriesData?.content || [];

  // Filter articles based on search criteria
  const filteredArticles = articles.filter(article => {
    const matchesCategory = !filters.categoryId || article.categoryId === filters.categoryId;
    const matchesAuthor = !filters.authorName || 
      `${article.authorFirstName} ${article.authorLastName}`.toLowerCase().includes(filters.authorName.toLowerCase());
    const matchesDateRange = (!filters.startDate || new Date(article.createdAt) >= new Date(filters.startDate)) &&
      (!filters.endDate || new Date(article.createdAt) <= new Date(filters.endDate));
    
    return matchesCategory && matchesAuthor && matchesDateRange;
  });

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(0); // Reset to first page when filtering
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const handleArticleClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Non catégorisé';
  };

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

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters Section */}
        <section className="mb-12 bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtrer les articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.categoryId}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                disabled={categoriesLoading}
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Auteur</label>
              <input
                type="text"
                placeholder="Nom de l'auteur"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.authorName}
                onChange={(e) => handleFilterChange('authorName', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Articles Validés
            </h3>
            <p className="text-gray-600">
              {filteredArticles.length} sur {totalElements} articles
            </p>
          </div>

          {/* Loading State */}
          {articlesLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {articlesError && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
              <p className="text-gray-600">Impossible de charger les articles</p>
            </div>
          )}

          {/* Articles Grid */}
          {!articlesLoading && !articlesError && (
            <>
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
                  <p className="text-gray-600">Aucun article ne correspond à vos critères de recherche</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
                    <article 
                      key={article.id} 
                      className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      onClick={() => handleArticleClick(article.id)}
                    >
                      {/* Cover Image */}
                      <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-xl overflow-hidden">
                        {article.coverImage ? (
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white">
                            <Eye className="h-12 w-12" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(article.createdAt)}</span>
                          <span className="mx-2">•</span>
                          <User className="h-4 w-4 mr-1" />
                          <span>{article.authorFirstName} {article.authorLastName}</span>
                        </div>

                        <h4 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h4>

                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {article.content.substring(0, 150)}...
                        </p>

                        <div className="flex justify-between items-center">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium">
                            {getCategoryName(article.categoryId)}
                          </span>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                            Lire plus
                            <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="flex space-x-1">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = currentPage <= 2 ? i : currentPage - 2 + i;
                        if (pageNum >= totalPages) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              pageNum === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                          >
                            {pageNum + 1}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                      className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;