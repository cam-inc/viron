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
import { Props as BaseProps } from '~/components';
import Cell from '~/components/table/cell';
import { Button } from '~/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { COLOR_SYSTEM, Endpoint } from '~/types';
import {
  Document,
  Content,
  SORT,
  Sort,
  TableColumn,
  Schema,
} from '~/types/oas';
import {
  extractTableColumns,
  getTableRows,
  mergeTableSortRequestValue,
} from '~/utils/oas';
import { UseBaseReturn } from '../../hooks/useBase';
import { UseDescendantsReturn } from '../../hooks/useDescendants';
import Descendant, { Props as DescendantProps } from '../../parts/descendant';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type Data = Record<string, any>;

type Props = {
  endpoint: Endpoint;
  document: Document;
  content: Content;
  base: UseBaseReturn;
  descendants: UseDescendantsReturn;
  onDescendantOperationSuccess: DescendantProps['onOperationSuccess'];
  onDescendantOperationFail: DescendantProps['onOperationFail'];
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
                <TableHead className="text-right sticky right-0 bg-thm-background" />
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataSource.map((data, rowIndex) => (
              <Sheet key={rowIndex}>
                <SheetTrigger asChild>
                  <TableRow className="cursor-pointer">
                    {columns.map((column) => {
                      if (column.schema.type === 'object') {
                        console.dir(data[column.key], { depth: null });
                        return (
                          <TableCell key={column.key}>
                            {data[column.key] ? (
                              <Popover>
                                <PopoverTrigger
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2 space-x-0.5"
                                  >
                                    Show Details
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-fit max-w-[100vw]">
                                  <pre className="bg-muted p-3 rounded-md overflow-auto text-sm">
                                    <code>
                                      {JSON.stringify(
                                        data[column.key],
                                        null,
                                        2
                                      )}
                                    </code>
                                  </pre>
                                </PopoverContent>
                              </Popover>
                            ) : null}
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={column.key}>
                          <Cell
                            on={COLOR_SYSTEM.BACKGROUND}
                            schema={column.schema}
                            value={data[column.key]}
                          />
                        </TableCell>
                      );
                    })}
                    {0 < descendants.length && (
                      <TableCell className="text-right sticky right-0 bg-thm-background">
                        {renderActions(data)}
                      </TableCell>
                    )}
                  </TableRow>
                </SheetTrigger>

                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Data</SheetTitle>
                  </SheetHeader>
                  <RowData
                    on={COLOR_SYSTEM.BACKGROUND}
                    rowData={data}
                    columns={columns}
                  />
                </SheetContent>
              </Sheet>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default ContentTable;

type OperationsProps = {
  endpoint: Endpoint;
  document: Document;
  descendants: UseDescendantsReturn;
  data: DescendantProps['data'];
  onOperationSuccess: DescendantProps['onOperationSuccess'];
  onOperationFail: DescendantProps['onOperationFail'];
};
const Operations: React.FC<OperationsProps> = ({
  endpoint,
  document,
  descendants,
  data,
  onOperationSuccess,
  onOperationFail,
}) => {
  return (
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
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <Descendant
              endpoint={endpoint}
              document={document}
              descendant={descendant}
              data={data}
              onOperationSuccess={onOperationSuccess}
              onOperationFail={onOperationFail}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const RowData: React.FC<
  BaseProps & {
    rowData: Data;
    columns: TableColumn[];
  }
> = ({ on, rowData, columns }) => {
  return (
    <div className="px-10 py-10 flex flex-col h-full w-full">
      <div className="flex-1 overflow-scroll space-y-10">
        {Object.keys(rowData).map((objectKey, index) => (
          <Accordion
            key={index}
            on={on}
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
> = ({ on, schema, data, objectKey }) => {
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
        <div className={`text-sm text-thm-on-${on}`}>
          <span className="font-bold">{objectKey}</span>
          {schema?.description && (
            <span className="ml-2 text-thm-on-surface-low">
              {schema.description}
            </span>
          )}
        </div>
      </div>
      {isOpened && (
        <div className="ml-5 pl-4 border-l border-thm-on-surface-slight flex flex-col items-start space-y-4">
          {data[objectKey] && typeof data[objectKey] === 'object' ? (
            Object.keys(data[objectKey]).map((childObjectKey, index) => (
              <Accordion
                key={index}
                on={on}
                schema={schema?.properties?.[childObjectKey]}
                data={data[objectKey]}
                objectKey={childObjectKey}
              />
            ))
          ) : (
            <>
              <div className="bg-thm-on-background-slight rounded-lg px-2.5 p-3 inline-flex items-center whitespace-nowrap mr-5">
                <span className={`mr-2 text-xs text-thm-on-${on}`}>
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
