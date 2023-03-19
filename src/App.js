import './App.css';
import React, { useState } from "react";
import makeData from './mock/makeData'
import RtTable from "./components/rt/rtTable";
import {SliderColumnFilter,NumberRangeColumnFilter,SelectColumnFilter,filterGreaterThan,fuzzyTextFilterFn} from "./components/rt/filters";

function App() {
  const [displayFilter,setDisplayFilter] = useState(false)
  const [displayColumns,setDisplayColumns] = useState(false)


    /* temp mock data ----- start */
    const columns = React.useMemo(
      () => [
        {
          Header: 'User List',
          columns: [
            {
              Header: 'First Name',
              accessor: 'firstName',
              minWidth: 150,
            },
            {
              Header: 'Last Name',
              accessor: 'lastName',
              minWidth: 150,
              // Use our custom `fuzzyText` filter on this column
              filter: 'fuzzyText',
            },
            {
              Header: 'Age',
              accessor: 'age',
              minWidth: 150,
              Filter: SliderColumnFilter,
              filter: 'equals',
            },
            {
              Header: 'Visits',
              accessor: 'visits',
              minWidth: 150,
              Filter: NumberRangeColumnFilter,
              filter: 'between',
            },
            {
              Header: 'Status',
              accessor: 'status',
              minWidth: 150,
              Filter: SelectColumnFilter,
              filter: 'includes',
            },
            {
              Header: 'Profile Progress',
              accessor: 'progress',
              minWidth: 150,
              Filter: SliderColumnFilter,
              filter: filterGreaterThan,
            }
          ]
        }
      ]
    )
    
  
    const mockData = React.useMemo(() => makeData(2000), [])
  
    /* temp mock data ----- end */

  filterGreaterThan.autoRemove = val => typeof val !== 'number'
  fuzzyTextFilterFn.autoRemove = val => !val

  return (
    <div className="App">
      <button onClick={() => {
                setDisplayFilter(!displayFilter)
              }}>Filter</button>
      <button onClick={() => {
                setDisplayColumns(!displayColumns)
              }}>Define Column</button>
      <div>
          <RtTable columns={columns} 
                    data={mockData} 
                    displayFilter={displayFilter} 
                    displayColumns = {displayColumns}
          />
      </div>

    </div>
  );
}

export default App;
