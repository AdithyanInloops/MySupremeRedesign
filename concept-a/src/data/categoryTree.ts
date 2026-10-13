/**
 * Magento category tree (departments → sub-categories) as seeded for Concept B (concept-b/data/categories.json),
 * trimmed to the fields the All categories page needs. Field names match Magento GraphQL 1:1.
 */
import categoriesJson from './categories.json'

export type CategoryNode = {
  name: string
  url_key: string
  image: string | null
  product_count: number
  children: { name: string; url_key: string; product_count?: number | null }[]
}

export const categoryTree = categoriesJson as CategoryNode[]
