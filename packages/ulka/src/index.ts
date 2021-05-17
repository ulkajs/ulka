import matter from 'gray-matter'

export const m = (str: string) => {
  return matter(str)
}
