import {
  CircleEllipsisIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ClipboardCopyIcon,
  ArrowDownUpIcon,
  ArrowDownAZIcon,
  ArrowUpZAIcon,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { Props as BaseProps } from '@/components';
import Request from '@/components/request';
import Cell from '@/components/table/cell';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BaseError } from '@/errors';
import { Endpoint } from '@/types';
import {
  Document,
  Content,
  SORT,
  Sort,
  TableColumn,
  Schema,
  RequestValue,
} from '@/types/oas';
import {
  extractTableColumns,
  getTableRows,
  mergeTableSortRequestValue,
} from '@/utils/oas';
import { UseBaseReturn } from '../../hooks/useBase';
import { UseDescendantsReturn } from '../../hooks/useDescendants';
import { ActionIcon } from '../../parts/action';

type Data = Record<string, any>;

type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Content;
  base: UseBaseReturn;
  descendants: UseDescendantsReturn;
  onDescendantOperationSuccess: OperationsProps['onOperationSuccess'];
  onDescendantOperationFail: OperationsProps['onOperationFail'];
  sortState: [
    Record<string, Sort>,
    React.Dispatch<React.SetStateAction<Record<string, Sort>>>
  ];
};
const ContentTable: React.FC<Props> = ({
  endpoint,
  document,
  content,
  base,
  descendants,
  onDescendantOperationSuccess,
  onDescendantOperationFail,
  sortState,
}) => {
  const [sorts, setSorts] = sortState;
  const columns = useMemo<TableColumn[]>(() => {
    const extractTableColumnsResult = extractTableColumns(document, content);
    if (extractTableColumnsResult.isFailure()) {
      return [];
    }
    const tableColumns = extractTableColumnsResult.value;
    return tableColumns
      .map((column) => ({
        ...column,
        sort: sorts[column.key] || SORT.NONE,
      }))
      .filter((column) => {
        if (!base.filter.enabled) {
          return false;
        }
        return !base.filter.listOmitted.includes(column.key);
      });
  }, [document, content, base, sorts]);

  const dataSource = useMemo<Data[]>(
    () => getTableRows(document, content, base.data),
    [document, content, base]
  );

  const renderActions = useCallback<NonNullable<(data: Data) => JSX.Element>>(
    (data) => {
      return (
        <Operations
          endpoint={endpoint}
          document={document}
          descendants={descendants}
          data={data}
          onOperationSuccess={onDescendantOperationSuccess}
          onOperationFail={onDescendantOperationFail}
        />
      );
    },
    [
      endpoint,
      document,
      descendants,
      onDescendantOperationSuccess,
      onDescendantOperationFail,
    ]
  );

  const handleRequestSortChange = useCallback(
    (key: TableColumn['key'], sort: Sort) => {
      const newSorts = {
        ...sorts,
        [key]: sort,
      };
      setSorts(newSorts);
      const requestValue = mergeTableSortRequestValue(
        document,
        base.request,
        base.requestValue,
        newSorts
      );
      base.fetch(requestValue);
    },
    [document, base, sorts]
  );

  return (
    <div className="border-b border-x">
      <div className="overflow-x-auto">
        <Table className="relative">
          <TableHeader>
            <TableRow>
              {columns.map((column) => {
                if (!column.isSortable) {
                  return <TableHead key={column.key}>{column.name}</TableHead>;
                }
                return (
                  <TableHead key={column.key}>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2"
                      onClick={() => {
                        switch (column.sort) {
                          case SORT.ASC:
                            handleRequestSortChange(column.key, SORT.DESC);
                            break;
                          case SORT.DESC:
                            handleRequestSortChange(column.key, SORT.NONE);
                            break;
                          case SORT.NONE:
                            handleRequestSortChange(column.key, SORT.ASC);
                            break;
                          default:
                            break;
                        }
                      }}
                    >
                      <span>{column.name}</span>
                      {column.sort === SORT.NONE && (
                        <ArrowDownUpIcon className="size-4 text-muted-foreground" />
                      )}
                      {column.sort === SORT.ASC && (
                        <ArrowDownAZIcon className="size-4" />
                      )}
                      {column.sort === SORT.DESC && (
                        <ArrowUpZAIcon className="size-4" />
                      )}
                    </Button>
                  </TableHead>
                );
              })}
              {0 < descendants.length && (
                <TableHead className="text-right sticky right-0 bg-background" />
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataSource.map((data, rowIndex) => (
              <TableBodyRow
                key={rowIndex}
                columns={columns}
                data={data}
                descendants={descendants}
                renderActions={renderActions}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default ContentTable;

const TableBodyRow: React.FC<{
  columns: TableColumn[];
  data: Data;
  descendants: UseDescendantsReturn;
  renderActions: NonNullable<(data: Data) => JSX.Element>;
}> = ({ columns, data, descendants, renderActions }) => {
  const [dateSheetOpen, setDateSheetOpen] = useState(false);
  return (
    <>
      <TableRow
        className="cursor-pointer"
        onClick={() => setDateSheetOpen(true)}
      >
        {columns.map((column) => (
          <TableCell key={column.key} className="max-w-[400px]">
            <Cell schema={column.schema} value={data[column.key]} />
          </TableCell>
        ))}
        {0 < descendants.length && (
          <TableCell
            className="text-right sticky right-0 bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            {renderActions(data)}
          </TableCell>
        )}
      </TableRow>
      <Sheet open={dateSheetOpen} onOpenChange={setDateSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Data</SheetTitle>
          </SheetHeader>
          <RowData rowData={data} columns={columns} />
        </SheetContent>
      </Sheet>
    </>
  );
};

type OperationsProps = {
  endpoint: Endpoint;
  document: Document;
  descendants: UseDescendantsReturn;
  data: any;
  onOperationSuccess: (data: any) => void;
  onOperationFail: (error: BaseError) => void;
};
const Operations: React.FC<OperationsProps> = ({
  endpoint,
  document,
  descendants,
  data,
  onOperationSuccess,
  onOperationFail,
}) => {
  const [selectedDescendant, setSelectedDescendant] =
    useState<UseDescendantsReturn[number]>();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleRequestSubmit = useCallback(
    async (requestValue: RequestValue) => {
      if (!selectedDescendant) {
        return;
      }
      setOpen(false);
      setIsPending(true);
      const { data, error } = await selectedDescendant.fetch(requestValue);
      setIsPending(false);
      if (data) {
        onOperationSuccess(data);
      }
      if (error) {
        onOperationFail(error);
      }
    },
    [selectedDescendant, onOperationSuccess, onOperationFail]
  );

  function getLabel(descendant: UseDescendantsReturn[number]): string {
    const { operation } = descendant.request;
    if (operation.summary) {
      return operation.summary;
    }
    return operation.operationId || descendant.request.method;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8">
            <CircleEllipsisIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {descendants.map((descendant, idx) => (
            <DropdownMenuItem
              key={idx}
              onSelect={() => {
                setSelectedDescendant(descendant);
                setOpen(true);
              }}
              disabled={isPending}
            >
              <ActionIcon method={descendant.request.method} />
              {getLabel(descendant)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          {selectedDescendant && (
            <>
              <SheetHeader>
                <SheetTitle>{getLabel(selectedDescendant)}</SheetTitle>
              </SheetHeader>
              <Request
                endpoint={endpoint}
                document={document}
                request={selectedDescendant.request}
                defaultValues={selectedDescendant.getDefaultValues(data)}
                onSubmit={handleRequestSubmit}
                className="h-full"
              />
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

const RowData: React.FC<
  BaseProps & {
    rowData: Data;
    columns: TableColumn[];
  }
> = ({ rowData, columns }) => {
  return (
    <div className="px-10 py-10 flex flex-col h-full w-full">
      <div className="flex-1 overflow-scroll space-y-10">
        {Object.keys(rowData).map((objectKey, index) => (
          <Accordion
            key={index}
            schema={columns.find((column) => column.key === objectKey)?.schema}
            data={rowData}
            objectKey={objectKey}
          />
        ))}
      </div>
    </div>
  );
};

const Accordion: React.FC<
  BaseProps & {
    schema?: Schema;
    data: Data;
    objectKey: string;
  }
> = ({ schema, data, objectKey }) => {
  const [isOpened, setIsOpened] = useState<boolean>(true);
  const handleCopyClick = useCallback(() => {
    globalThis.navigator.clipboard.writeText(data[objectKey]);
  }, [data, objectKey]);

  const displayValue = (value: string | number | boolean) => {
    switch (typeof value) {
      case 'string':
        return value;
      case 'number':
        return value.toLocaleString();
      case 'boolean':
        return String(value).toUpperCase();
    }
  };

  const previewValue = (value: string | number | boolean) => {
    switch (schema?.format) {
      case 'uri-image':
        return (
          <>
            {typeof value === 'string' && (
              <div className="size-96">
                <img
                  className="block size-full object-contain"
                  src={value}
                  alt={objectKey}
                />
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="inline-flex items-center gap-1 whitespace-nowrap">
        <Button
          variant="ghost"
          className="mr-0 ml-auto"
          onClick={() => {
            setIsOpened((prev) => !prev);
          }}
        >
          {isOpened ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
        </Button>
        <div className="text-sm">
          <span className="font-bold">{objectKey}</span>
          {schema?.description && (
            <span className="ml-2 text-muted-foreground">
              {schema.description}
            </span>
          )}
        </div>
      </div>
      {isOpened && (
        <div className="ml-5 pl-4 border-l border-border flex flex-col items-start space-y-4">
          {data[objectKey] && typeof data[objectKey] === 'object' ? (
            Object.keys(data[objectKey]).map((childObjectKey, index) => (
              <Accordion
                key={index}
                schema={schema?.properties?.[childObjectKey]}
                data={data[objectKey]}
                objectKey={childObjectKey}
              />
            ))
          ) : (
            <>
              <div className="bg-muted/50 rounded-lg px-2.5 p-3 inline-flex items-center whitespace-nowrap mr-5">
                <span className="mr-2 text-xs">
                  {displayValue(data[objectKey])}
                </span>
                <Button
                  variant="ghost"
                  className="mr-0 ml-auto"
                  onClick={handleCopyClick}
                >
                  <ClipboardCopyIcon className="h-4 w-4" />
                </Button>
              </div>
              {previewValue(data[objectKey])}
            </>
          )}
        </div>
      )}
    </div>
  );
};
