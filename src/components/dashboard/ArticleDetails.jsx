import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Calendar, 
  User, 
  Tag, 
  Eye,
  Loader2,
  AlertTriangle,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { 
  useGetArticleByIdQuery,
  useDeleteArticleMutation,
  usePublishArticleMutation,
  useRejectArticleMutation
} from '../../store/api/articlesApi';
import { selectUser, selectUserRole } from '../../store/slices/authSlice';

const ArticleDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const { 
    data: article, 
    isLoading, 
    error 
  } = useGetArticleByIdQuery(id);

  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();
  const [publishArticle, { isLoading: isPublishing }] = usePublishArticleMutation();
  const [rejectArticle, { isLoading: isRejecting }] = useRejectArticleMutation();

  // Check permissions based on role
  const canEdit = userRole === 'REDACTEUR' || 
    (userRole === 'EDITEUR' && article?.authorId === user?.id);
  const canDelete = canEdit;
  const canPublish = userRole === 'EDITEUR' && article?.status !== 'VALIDE';
  const canReject = userRole === 'EDITEUR' && article?.status !== 'REJETE';

  const getStatusBadge = (status) => {
    const statusConfig = {
      'VALIDE': {
        label: 'Validé',
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: Check
      },
      'EN_ATTENTE_VALIDATION': {
        label: 'En attente de validation',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Eye
      },
      'REJETE': {
        label: 'Rejeté',
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: X
      }
    };

    const config = statusConfig[status] || statusConfig['EN_ATTENTE_VALIDATION'];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}>
        <IconComponent className="h-4 w-4 mr-2" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = () => {
    navigate(`/dashboard/articles/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteArticle(id).unwrap();
      navigate('/dashboard/articles', { 
        state: { message: 'Article supprimé avec succès!' }
      });
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handlePublish = async () => {
    try {
      await publishArticle(id).unwrap();
      // Article will be updated automatically due to RTK Query
    } catch (error) {
      console.error('Error publishing article:', error);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    
    try {
      await rejectArticle({ id, reason: rejectReason }).unwrap();
      setShowRejectModal(false);
      setRejectReason('');
      // Article will be updated automatically due to RTK Query
    } catch (error) {
      console.error('Error rejecting article:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Chargement de l'article...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-red-700 mb-4">
            Impossible de charger l'article. Il a peut-être été supprimé ou vous n'avez pas l'autorisation de le consulter.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Retour aux articles
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux articles
        </button>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">Détails de l'article</span>
      </div>

      {/* Article Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Cover Image */}
        {article.coverImage && (
          <div className="h-64 bg-gray-200">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {article.title}
              </h1>
              {getStatusBadge(article.status)}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              {/* REDACTEUR Actions */}
              {userRole === 'REDACTEUR' && canEdit && (
                <>
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isDeleting}
                    className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Supprimer
                  </button>
                </>
              )}

              {/* EDITEUR Actions */}
              {userRole === 'EDITEUR' && (
                <>
                  {canPublish && (
                    <button
                      onClick={handlePublish}
                      disabled={isPublishing}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {isPublishing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Publier
                    </button>
                  )}
                  {canReject && (
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={isRejecting}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Rejeter
                    </button>
                  )}
                  {canEdit && (
                    <button
                      onClick={handleEdit}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Article Meta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span>
                <strong>Auteur:</strong> {article.authorFirstName} {article.authorLastName}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>
                <strong>Créé le:</strong> {formatDate(article.createdAt)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-gray-400" />
              <span>
                <strong>Catégorie:</strong> {article.category}
              </span>
            </div>
          </div>

          {/* Last Updated */}
          {article.updatedAt && article.updatedAt !== article.createdAt && (
            <div className="text-sm text-gray-500 mb-4">
              <strong>Dernière modification:</strong> {formatDate(article.updatedAt)}
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contenu</h2>
        <div className="prose max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900">
                Supprimer l'article
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer "{article.title}" ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <MessageSquare className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900">
                Rejeter l'article
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Veuillez indiquer la raison du rejet de cet article.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors resize-vertical"
              rows={4}
              placeholder="Raison du rejet..."
            />
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleReject}
                disabled={isRejecting || !rejectReason.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isRejecting ? 'Rejet...' : 'Rejeter l\'article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetails;