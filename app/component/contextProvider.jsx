"use client"
import { createContext } from 'react';

export const ReportContext = createContext();

export const ReportComponentProvider = ({children, value}) => {
  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  )
}