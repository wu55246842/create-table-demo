import React from 'react'
import { useTable, useSortBy, useFilters, useColumnOrder,useRowSelect,
  usePagination,useBlockLayout,useResizeColumns} from 'react-table'
import {DefaultColumnFilter} from './filters'



export default function UdTable({ columns, data, displayFilter, displayColumns}) {
    const defaultColumn = React.useMemo(
      () => ({
        // Let's set up our default Filter UI
        Filter: DefaultColumnFilter,
      }),
      []
    )
  
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      visibleColumns,
      prepareRow,
      page,
      allColumns,
      getToggleHideAllColumnsProps,
  
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      selectedFlatRows,
      state,
      state: {pageIndex, pageSize, selectedRowIds },
      
    } = useTable(
      {
        columns,
        data,
        defaultColumn,
      },
      useResizeColumns,
      useBlockLayout,
      useColumnOrder,
      useFilters,
      useSortBy,
      usePagination,
      useRowSelect,
      hooks => {
        hooks.visibleColumns.push(columns => [
          // Let's make a column for selection
          {
            id: 'selection',
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllPageRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ])

        hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
          // fix the parent group of the selection button to not be resizable
          const selectionGroupHeader = headerGroups[0].headers[0]
          selectionGroupHeader.canResize = false
        })
      }
    )
  
    const firstPageRows = rows.slice(0, 10)
  
    const spring = React.useMemo(
      () => ({
        type: 'spring',
        damping: 50,
        stiffness: 100,
      }),
      []
    )


    const IndeterminateCheckbox = React.forwardRef(
        ({ indeterminate, ...rest }, ref) => {
          const defaultRef = React.useRef()
          const resolvedRef = ref || defaultRef
      
          React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
          }, [resolvedRef, indeterminate])
      
          return (
            <>
              <input type="checkbox" ref={resolvedRef} {...rest} />
            </>
          )
        }
      )

  


    return (
      <>
        {displayColumns?<div style={{color:'black'}}>
          <div>
            <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Toggle All
          </div>
          {allColumns.map(column => (
            <div key={column.id}>
              <label>
                <input type="checkbox" {...column.getToggleHiddenProps()} />{' '}
                {column.id}
              </label>
            </div>
          ))}
          <br />
        </div>:''}
        
        <table {...getTableProps()} className="table">
          <thead>
            {headerGroups.map((headerGroup, i) => (
              i!==0?(
              <tr {...headerGroup.getHeaderGroupProps()} className="tr">
                {headerGroup.headers.map(column => (
                  <th className="th"
                    {...column.getHeaderProps({
                      layouttransition: spring,
                      style: {
                        minWidth: column.minWidth,
                      },
                    })}
                  >
                    <div {...column.getSortByToggleProps()}>
                      {column.render('Header')}

                      {/* Use column.getResizerProps to hook up the events correctly */}
                      {column.canResize && (
                        <div
                          {...column.getResizerProps()}
                          className={`resizer ${
                            column.isResizing ? 'isResizing' : ''
                          }`}
                        />
                      )}

                      {/* column sort */}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </div>

                    {displayFilter?<div>{column.canFilter ? column.render('Filter') : null}</div>:''}
                  </th>
                ))}
              </tr>):''
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row)
                return (
                  <tr className="tr"
                    {...row.getRowProps({
                      layouttransition: spring,
                      exit: { opacity: 0, maxHeight: 0 },
                    })}
                  >
                    {row.cells.map((cell, i) => {
                      return (
                        <td className="td"
                          {...cell.getCellProps({
                            layouttransition: spring,
                          })}
                        >
                          {cell.render('Cell')}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
          </tbody>
        </table>
  
        

        {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div style={{color:'black'}}>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>






        <br></br>
  
        <pre style={{color:'black'}}>
          <code>
            {JSON.stringify(
              {
                selectedRowIds: selectedRowIds,
                'selectedFlatRows[].original': selectedFlatRows.map(
                  d => d.original
                ),
              },
              null,
              2
            )}
          </code>
        </pre>

        <pre style={{color:'black'}}>
          <code>{JSON.stringify(state, null, 2)}</code>
        </pre>
      </>
    )
  }