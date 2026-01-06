import { Skeleton, Table } from '@chakra-ui/react';

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
};

const TableSkeleton = ({ rows = 5, columns = 4 }: TableSkeletonProps) => {
  return (
    <Table.Root size="sm">
      <Table.Header>
        <Table.Row>
          {Array.from({ length: columns }).map((_, index) => (
            <Table.ColumnHeader key={index}>
              <Skeleton height="20px" />
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <Table.Row key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Table.Cell key={colIndex}>
                <Skeleton height="20px" />
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export { TableSkeleton };
