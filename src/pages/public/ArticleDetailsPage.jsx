import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  Share2, 
  BookOpen,
  Clock,
  Loader2,
  AlertTriangle 
} from 'lucide-react';
import { useGetArticleByIdQuery, useGetCategoriesQuery } from '../../store/api/articlesApi';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/footer';

const ArticleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { 
    data: article, 
    isLoading, 
    error 
  } = useGetArticleByIdQuery(id);

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.content || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Non catégorisé';
  };

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.content.substring(0, 200) + '...',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Chargement de l'article...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Article introuvable</h1>
            <p className="text-gray-600 mb-8">
              L'article que vous recherchez n'existe pas ou n'est plus disponible.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Only show validated articles to public
  if (article.status !== 'VALIDE') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Article non disponible</h1>
            <p className="text-gray-600 mb-8">
              Cet article n'est pas encore validé pour la publication publique.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux articles
          </button>
        </div>

        {/* Article Header */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Cover Image */}
          {article.coverImage && (
            <div className="h-96 bg-gray-200">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="p-8 lg:p-12">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{article.authorFirstName} {article.authorLastName}</span>
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {getCategoryName(article.categoryId)}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{getReadingTime(article.content)} min de lecture</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            </div>

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {article.authorFirstName} {article.authorLastName}
                      </h3>
                      <p className="text-sm text-gray-600">Auteur</p>
                    </div>
                  </div>
                </div>

                
              </div>
            </div>

            {/* Article Metadata */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations sur l'article</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Date de publication:</span>
                  <span className="ml-2 text-gray-600">{formatDate(article.createdAt)}</span>
                </div>
                {article.updatedAt && article.updatedAt !== article.createdAt && (
                  <div>
                    <span className="font-medium text-gray-700">Dernière mise à jour:</span>
                    <span className="ml-2 text-gray-600">{formatDate(article.updatedAt)}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Catégorie:</span>
                  <span className="ml-2 text-gray-600">{getCategoryName(article.categoryId)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Temps de lecture:</span>
                  <span className="ml-2 text-gray-600">{getReadingTime(article.content)} minutes</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Navigation Back */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Découvrir plus d'articles
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetailsPage;