export class TreeData<T = any> {
  label?: string;
  data?: T;
  icon?: string;
  expandedIcon?: any;
  collapsedIcon?: any;
  children?: TreeData<T>[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: TreeData<T>;
  partialSelected?: boolean;
  style?: string;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  key?: string;
}
