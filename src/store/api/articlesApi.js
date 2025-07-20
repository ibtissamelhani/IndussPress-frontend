import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('content-type', 'application/json');
    return headers;
  },
});

export const articlesApi = createApi({
  reducerPath: 'articlesApi',
  baseQuery,
  tagTypes: ['Article', 'Category'],
  endpoints: (builder) => ({
    // Get all articles (for Editeur)
    getAllArticles: builder.query({
      query: ({ page = 0, size = 10 }) => `/articles/All?page=${page}&size=${size}`,
      providesTags: ['Article'],
    }),
    
    // Get current user's articles (for Redacteur)
    getMyArticles: builder.query({
      query: ({ page = 0, size = 10 }) => `/articles/my-articles?page=${page}&size=${size}`,
      providesTags: ['Article'],
    }),
    
    // Get validated articles only (for public view)
    getValidatedArticles: builder.query({
      query: ({ page = 0, size = 10 }) => `/articles?page=${page}&size=${size}`,
      providesTags: ['Article'],
    }),
    
    // Get article by ID
    getArticleById: builder.query({
      query: (id) => `/articles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Article', id }],
    }),
    
    // Create new article
    createArticle: builder.mutation({
      query: (articleData) => ({
        url: '/articles',
        method: 'POST',
        body: articleData,
      }),
      invalidatesTags: ['Article'],
    }),
    
    // Update article
    updateArticle: builder.mutation({
      query: ({ id, ...articleData }) => ({
        url: `/articles/${id}`,
        method: 'PUT',
        body: articleData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Article', id }, 'Article'],
    }),
    
    // Delete article
    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `/articles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Article'],
    }),
    
    // Publish article (Editeur only)
    publishArticle: builder.mutation({
      query: (id) => ({
        url: `/articles/${id}/publish`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Article', id }, 'Article'],
    }),
    
    // Reject article (Editeur only)
    rejectArticle: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/articles/${id}/reject`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Article', id }, 'Article'],
    }),
    
    // Get categories for dropdown
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    
    // Get article statistics
    getArticleStats: builder.query({
      query: () => '/articles/stats',
      providesTags: ['Article'],
    }),
  }),
});

export const {
  useGetAllArticlesQuery,
  useGetMyArticlesQuery,
  useGetValidatedArticlesQuery,
  useGetArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  usePublishArticleMutation,
  useRejectArticleMutation,
  useGetCategoriesQuery,
  useGetArticleStatsQuery,
} = articlesApi;