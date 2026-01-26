import type { ColumnDef } from '@tanstack/react-table';
import type { RowActionsConfig } from '../types';

import { RowActionsMenu } from '../components/row-actions-menu';

const createActionsColumn = <TData,>(config: RowActionsConfig<TData>): ColumnDef<TData> => {
  return {
    id: '_actions',
    header: config.columnHeader ?? '',
    enableSorting: false,
    enableHiding: false,
    size: 30,
    minSize: 30,
    maxSize: 30,
    cell: ({ row }) => (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <RowActionsMenu row={row.original} config={config} />
      </div>
    ),
  };
};

export { createActionsColumn };
