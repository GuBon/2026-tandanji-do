import { apiClient } from './apiClient.js'

export async function fetchPosts({ postType, page = 0, size = 20 } = {}) {
  const params = new URLSearchParams({ page, size })
  if (postType) params.set('postType', postType)
  const res = await apiClient(`/posts?${params}`)
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data
}

export async function createPost({ postType, title, content, imageUrl }) {
  const res = await apiClient('/posts', {
    method: 'POST',
    body: JSON.stringify({ postType, title, content, imageUrl: imageUrl ?? null }),
  })
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data
}

export async function fetchPost(postId) {
  const res = await apiClient(`/posts/${postId}`)
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data
}

export async function deletePost(postId) {
  const res = await apiClient(`/posts/${postId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(res.status)
}

export async function fetchPostLikeStatus(postId) {
  const res = await apiClient(`/posts/${postId}/likes`)
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data
}

export async function togglePostLike(postId) {
  const res = await apiClient(`/posts/${postId}/likes`, { method: 'POST' })
  if (!res.ok) throw new Error(res.status)
  const { data } = await res.json()
  return data
}
