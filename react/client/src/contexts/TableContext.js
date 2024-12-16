import React, { createContext, useContext, useState } from 'react';

const TableContext = createContext();

export function TableProvider({ children }) {
  const [currentTableId, setCurrentTableId] = useState(null);

  return (
    <TableContext.Provider value={{ currentTableId, setCurrentTableId }}>
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  return useContext(TableContext);
}