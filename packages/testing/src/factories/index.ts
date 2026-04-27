// Factories de fixtures (tenant, user, role, etc.) à compléter au fil des features.
// Convention : chaque factory exporte `make<Entity>(overrides?)` qui retourne un objet typé.

export type FactoryOverrides<T> = Partial<T>;
