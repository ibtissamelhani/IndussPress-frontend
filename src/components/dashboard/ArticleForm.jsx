import React, { useState, useEffect } from 'react';
import { Save, Upload, X, AlertCircle, Loader2 } from 'lucide-react';
import { 
  useCreateArticleMutation, 
  useUpdateArticleMutation, 
  useGetCategoriesQuery 
} from '../../store/api/articlesApi';

const ArticleForm = ({ article = null, onSubmit, onCancel, userRole }) => {
  const isEditing = !!article;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    coverImage: '',
    status: 'EN_ATTENTE_VALIDATION'
  });

  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  // RTK Query hooks
  const [createArticle, { isLoading: isCreating }] = useCreateArticleMutation();
  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();

  const isSubmitting = isCreating || isUpdating;

  // Initialize form with article data if editing
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        content: article.content || '',
        categoryId: article.categoryId || '',
        coverImage: article.coverImage || '',
        status: article.status || 'EN_ATTENTE_VALIDATION'
      });
    }
  }, [article]);

  // Status options based on role
  const statusOptions = [
    { value: 'EN_ATTENTE_VALIDATION', label: 'En attente de validation' },
    { value: 'VALIDE', label: 'Validé' },
    { value: 'REJETE', label: 'Rejeté' }
  ];

  const filteredStatusOptions = userRole === 'REDACTEUR' 
    ? statusOptions.filter(option => option.value === 'EN_ATTENTE_VALIDATION')
    : statusOptions;

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Le titre doit contenir au moins 5 caractères';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Le contenu est obligatoire';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Le contenu doit contenir au moins 50 caractères';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'La catégorie est obligatoire';
    }
    
    if (!formData.status) {
      newErrors.status = 'Le statut est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        coverImage: 'Veuillez sélectionner une image valide'
      }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        coverImage: 'L\'image ne doit pas dépasser 5MB'
      }));
      return;
    }

    setIsUploading(true);
    
    try {
      // In a real app, you'd upload to your server or cloud storage
      // For now, we'll use a URL.createObjectURL for demo
      const imageUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        coverImage: imageUrl
      }));
      
      // Clear any previous error
      setErrors(prev => ({
        ...prev,
        coverImage: ''
      }));
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        coverImage: 'Erreur lors du téléchargement de l\'image'
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      coverImage: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (isEditing) {
        await updateArticle({ id: article.id, ...formData }).unwrap();
      } else {
        await createArticle(formData).unwrap();
      }
      
      onSubmit && onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (show toast, etc.)
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Entrez le titre de l'article..."
            />
            {errors.title && (
              <div className="mt-1 flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.title}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={categoriesLoading}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.categoryId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } ${categoriesLoading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              >
                <option value="">
                  {categoriesLoading ? 'Chargement...' : 'Sélectionnez une catégorie'}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.categoryId}
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Statut <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={userRole === 'REDACTEUR'}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.status ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } ${userRole === 'REDACTEUR' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              >
                {filteredStatusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.status}
                </div>
              )}
              {userRole === 'REDACTEUR' && (
                <p className="mt-1 text-sm text-gray-500">
                  Les nouveaux articles sont automatiquement en attente de validation
                </p>
              )}
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de couverture
            </label>
            
            {formData.coverImage ? (
              <div className="relative">
                <img
                  src={formData.coverImage}
                  alt="Cover"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-2">
                  {isUploading ? (
                    <Loader2 className="h-12 w-12 animate-spin" />
                  ) : (
                    <Upload className="h-12 w-12" />
                  )}
                </div>
                <div>
                  <label htmlFor="coverImage" className="cursor-pointer">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      {isUploading ? 'Téléchargement...' : 'Télécharger une image'}
                    </span>
                    <input
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF jusqu'à 5MB</p>
                </div>
              </div>
            )}
            {errors.coverImage && (
              <div className="mt-1 flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.coverImage}
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Contenu <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              rows={12}
              value={formData.content}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical ${
                errors.content ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Rédigez le contenu de votre article..."
            />
            {errors.content && (
              <div className="mt-1 flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.content}
              </div>
            )}
            <div className="mt-1 flex justify-between text-sm text-gray-500">
              <span>{formData.content.length} caractères</span>
              <span>{formData.content.length >= 50 ? '✓' : '⚠'} Minimum 50 caractères</span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? 'Mise à jour...' : 'Création...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Mettre à jour' : 'Publier l\'article'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleForm;