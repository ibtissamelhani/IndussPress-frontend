import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Filter, Search, Grid, List } from 'lucide-react';
import { selectUser, selectUserRole } from '../../store/slices/authSlice';
import ArticlesList from '../../components/dashboard/ArticlesList';
import ArticleForm from '../../components/dashboard/ArticleForm';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const Dashboard = () => {
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit'
  const [editingArticle, setEditingArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'

  const handleCreateNew = () => {
    setEditingArticle(null);
    setCurrentView('create');
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setCurrentView('edit');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setEditingArticle(null);
  };

  const handleFormSubmit = (formData) => {
   
    setCurrentView('list');
    setEditingArticle(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'create':
      case 'edit':
        return (
          <ArticleForm
            article={editingArticle}
            onSubmit={handleFormSubmit}
            onCancel={handleBackToList}
            userRole={userRole}
          />
        );
      default:
        return (
          <>
            

            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4 flex-1">
                 
                </div>

                <div className="flex items-center space-x-2">
                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Create Button (only for Rédacteur) */}
                  {userRole === 'REDACTEUR' && (
                    <button
                      onClick={handleCreateNew}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvel Article
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Articles List */}
            <ArticlesList
              searchTerm={searchTerm}
              viewMode={viewMode}
              userRole={userRole}
              onEditArticle={handleEditArticle}
            />
          </>
        );
    }
  };

  return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentView === 'create' ? 'Créer un Article' : 
               currentView === 'edit' ? 'Modifier l\'Article' : 
               'Tableau de Bord'}
            </h1>
            <p className="text-gray-600 mt-1">
              {currentView === 'list' && userRole === 'REDACTEUR' && 'Gérez vos articles et créez du contenu'}
              {currentView === 'list' && userRole === 'EDITEUR' && 'Supervisez tous les articles et validez le contenu'}
              {(currentView === 'create' || currentView === 'edit') && 'Remplissez les informations ci-dessous'}
            </p>
          </div>

          {/* Breadcrumb for form views */}
          {(currentView === 'create' || currentView === 'edit') && (
            <button
              onClick={handleBackToList}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              ← Retour à la liste
            </button>
          )}
        </div>

        {/* Content */}
        {renderContent()}
      </div>
  );
};

export default Dashboard;