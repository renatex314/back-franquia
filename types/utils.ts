export type GetByFieldsProps<T> = {[key in keyof T]?: number | string};
export type Dropdown = Array<{ value: number | string, label: string }>;