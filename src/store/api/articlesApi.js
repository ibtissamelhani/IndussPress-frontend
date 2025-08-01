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
    
    // Update article status (Editeur only)
    updateArticleStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/articles/${id}/status?status=${status}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Article', id }, 'Article'],
    }),
    
    // Get categories for dropdown
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    
     // Filter articles with dynamic criteria
    filterArticles: builder.query({
      query: ({ filters = {}, page = 0, size = 6 }) => ({
        url: `/articles/filter?page=${page}&size=${size}`,
        method: 'POST',
        body: filters,
      }),
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
  useUpdateArticleStatusMutation,
  useGetCategoriesQuery,
  useFilterArticlesQuery,
  useGetArticleStatsQuery,
} = articlesApi;