# Implement infinite scroll for a listing

Implement **infinite scroll** (load more on scroll) for a dashboard-style listing that today uses **`useQuery`** + **`page`/`limit`** in one shot — same UX shell as **`components/profile/notifications/index.tsx`** (sticky filters, scrollable card, **`ErrorState`**, list child).

## Before writing code

1. Read **`.cursor/skills/infinite-scroll-lists/SKILL.md`** and apply **`.cursor/rules/infinite-scroll-lists.mdc`** (TanStack Query v5 **`useInfiniteQuery`**, Paynah **`PaginationMeta`**). **Do not add `@tanstack/react-table`** unless this feature is explicitly a **data table / grid**; notifications-style screens stay **scroll + `flatMap` + list components**. Use the Table reference mirrors only when Table is in scope.
2. Confirm the list API returns **`{ data, meta }`** with **`meta`** matching **`paginationMetaSchema`** (`models/pagination-meta.ts`): **`total`**, **`page`**, **`limit`**, **`totalPages`**.

## Service / data layer

1. **Re-use the existing fetcher** (e.g. `getNotificationList`) if it already accepts **`page`** + **`limit`** and returns **`NotificationListData`** (or the domain equivalent). Do not duplicate HTTP logic.
2. Export a hook **`useGet…Infinite`** (or rename per domain) using **`useInfiniteQuery`** from **`@tanstack/react-query`**:
   - **`queryKey`:** must include **every filter/sort (and stable `limit`)** that should reset accumulated pages. **Do not** put the current **`page`** in the key in a way that splits cache per page — pagination is driven by **`pageParam`**. If the existing factory passes full params including **`page`**, introduce a variant (e.g. params without **`page`**, or a dedicated **`listInfinite`**) so the key only reflects “which list”, not “which page”.
   - **`queryFn`:** `({ pageParam }) => getList({ ...baseParams, page: pageParam, limit })`.
   - **`initialPageParam: 1`** (Paynah APIs are **1-based**; see skill).
   - **`getNextPageParam: (lastPage) =>`** `lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined`.
   - For filter changes without flashing empty rows, use **`placeholderData: keepPreviousData`** (same idea as `ProfileNotifications`).
3. **Types:** keep using **`z.infer`** types from **`@/models`**; the infinite hook’s page type is the same list payload type (e.g. **`NotificationListData`**).
4. **Prefetch:** if the route used **`prefetchQuery`** for a single page, align or add **`prefetchInfiniteQuery`** only if the app already patterns that way — do not invent server prefetch unless the feature needs it.

## UI / component layer (match notifications shell)

Use **`components/profile/notifications/index.tsx`** as the layout reference:

1. **Scroll root:** the **same** element as **`overflow-y-auto`** (e.g. **`CustomCard`**), or a single inner wrapper — attach **`ref`**, **`onScroll`**, and (recommended) **`useEffect`** calling the same “near bottom?” helper once after data updates (see skill; Table demo is just one reference for that pattern) so short first pages still fetch more.
2. **Flatten:** `const items = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data])`.
3. **Fetch more:** when within ~300–500px of bottom, call **`fetchNextPage()`** only if **`hasNextPage && !isFetching`** (official guide) **or** `flatData.length < (data?.pages?.[0]?.meta.total ?? 0)` for Paynah **`meta.total`**, without double-firing.
4. **States:** first load **`isPending`** (or **`status === 'pending'`**); append load **`isFetchingNextPage`**; optional subtle “refresh” copy when **`isFetching && !isFetchingNextPage`**.
5. Keep **sticky filters** (or toolbar), **`ErrorState`** + **`refetch`**, and existing copy / i18n patterns.
6. **Virtualization:** only add **`@tanstack/react-virtual`** when the user or product requires it. Prefer a **simple virtualized list** (div + **`useVirtualizer`**) for feeds; use the in-repo Table mirror **`reference-virtualized-infinite-scrolling-main.md`** only when implementing a **TanStack Table** grid.

## Mutations / invalidation

After actions that change list membership (read, delete, etc.), **`invalidateQueries`** for the infinite list key (or update cache with **`setQueryData`** preserving **`{ pages, pageParams }`** if doing a surgical update — see skill).

## Checklist

- [ ] **`useInfiniteQuery`** with **`initialPageParam: 1`** and **`getNextPageParam`** from **`meta.page` / `meta.totalPages`**
- [ ] Query key includes filters + **`limit`**, **not** a competing per-page key shape
- [ ] Scroll **`ref`** + threshold + **`!isFetching`** / **`hasNextPage`** guard
- [ ] **`flatMap`** pages → list props; loading / error / empty unchanged in spirit from the reference component
- [ ] **`keepPreviousData`** (or equivalent) when URL/filter params change
- [ ] No new barrels under **`services/<domain>/`**; follow existing import paths

## References in this repo

- Layout anchor: `components/profile/notifications/index.tsx`
- Pagination types: `models/pagination-meta.ts`, list models (e.g. `models/notification.ts`)
- Example service pattern: `services/notification/list.ts` → extend with infinite hook alongside or refactored per user request
- Query keys: `lib/query-keys.ts` (**`notificationQueryKeys.list`** pattern — adjust for infinite key shape)
- Server prefetch helper (if used): `lib/react-query/server.tsx` (`prefetchInfiniteQuery` when applicable)
