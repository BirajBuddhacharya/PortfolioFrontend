"use client";

import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../lib/queryKeys";
import { ApiUrls } from "../lib/apiUrls";
import { api, type ApiResponse } from "../lib/apiClient";
import type { BlogPost } from "../types/blog";
import type { Tag } from "../types/tag";

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

const toListItem = (p: BlogPost) => ({
  id: p.id,
  title: p.title,
  excerpt: p.excerpt,
  coverImage: p.coverImage,
  tags: p.tags,
  date: formatDate(p.publishedAt ?? p.createdAt),
  readTime: `${p.readTime} min`,
});

export const useBlogPosts = () =>
  useQuery({
    queryKey: [QueryKeys.BLOG_POSTS],
    queryFn: async () => {
      const { data } = await api.get<
        ApiResponse<{ result: BlogPost[]; total: number }>
      >(ApiUrls.PUBLIC_BLOG_POSTS);
      return data.data.result.map(toListItem);
    },
  });

export const useBlogFeatured = () =>
  useQuery({
    queryKey: [QueryKeys.BLOG_POSTS],
    queryFn: async () => {
      const { data } = await api.get<
        ApiResponse<{ result: BlogPost[]; total: number }>
      >(ApiUrls.PUBLIC_BLOG_POSTS);
      return data.data.result.map(toListItem);
    },
    select: (posts) => posts[0],
  });

export const useBlogPostDetail = (slug: string) =>
  useQuery({
    queryKey: [QueryKeys.BLOG_POST_DETAIL, slug],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<BlogPost>>(
        ApiUrls.PUBLIC_BLOG_POST_DETAIL.replace(":slug", slug),
      );
      const p = data.data;
      return { ...toListItem(p), body: p.content };
    },
    enabled: !!slug,
  });

export const useBlogTags = () =>
  useQuery({
    queryKey: [QueryKeys.BLOG_TAGS],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Tag[]>>(ApiUrls.TAGS);
      return data.data;
    },
  });
