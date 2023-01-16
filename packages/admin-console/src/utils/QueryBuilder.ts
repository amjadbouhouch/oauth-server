/**
 * Example
 * ```typescript
 * const queryBuilder = new QueryBuilder();
 * const params = queryBuilder.setPage(2).setLimit(10)
 *                .setQueryParam('category',"test")
 *                .setSort('firstName', -1).build();
 *```
 *
 */
export class QueryBuilder {
  private params: { [x: string]: string } = {}
  private page?: number
  private limit?: number
  private sort?: [string, 1 | -1]
  private url?: string
  private query?: string

  /**
   *
   */
  setPage(page: number) {
    if (page < 0) {
      throw new Error('page should be gt 0')
    }
    this.page = page
    return this
  }

  /**
   *
   */
  setLimit(limit: number) {
    if (limit < 0 || limit > 100) {
      throw new Error('limit not correct')
    }
    this.limit = limit
    return this
  }
  /**
   *
   */
  setQueryParam(key: string, value: string | string[]) {
    const parsedValue = Array.isArray(value)
      ? value.join(',').trim()
      : value.toString().trim()
    this.params[key] = parsedValue
    return this
  }
  /**
   *
   * @param key name of the key that will sort with
   * @param direction `1` for "asc" or `-1` for `desc`
   */
  setSort(key: string, direction: 1 | -1 = 1) {
    this.sort = [key, direction]
    return this
  }

  setUrl(url: string) {
    this.url = url
    return this
  }
  /**
   *
   */
  build() {
    let query = ``
    if (this.params) {
      Object.keys(this.params).forEach((key, index) => {
        const value = this.params[key]
        query += `&${key}=${value}`
      })
    }
    if (this.sort) {
      const [sorter, direction] = this.sort
      query += `&sort=${sorter}&direction=${direction}`
    }
    if (this.page) query += `&page=${this.page}`
    if (this.limit) query += `&limit=${this.limit}`
    if (query.length) {
      // first character
      query = query.replace('&', '')
    }
    this.query = query
    if (this.url) return this.url + '?' + this.query
    return this.query
  }
}
