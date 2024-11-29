export interface CustomEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  recipeId?: string;
  duration?: number;
}
