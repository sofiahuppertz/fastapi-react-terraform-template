import { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = '' }: TableProps) {
  return (
    <thead className={className} style={{ backgroundColor: '#F0F1F1' }}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '' }: TableProps) {
  return (
    <tbody className={className}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '' }: TableProps) {
  return (
    <tr className={`border-b last:border-0 hover:bg-opacity-50 transition-colors ${className}`} style={{ borderColor: '#CACDCF' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F1F1'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '' }: TableProps) {
  return (
    <th className={`px-6 py-4 text-left text-sm font-semibold font-satoshi ${className}`} style={{ color: '#5B5D5F' }}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = '' }: TableProps) {
  return (
    <td className={`px-6 py-4 text-sm font-satoshi ${className}`} style={{ color: '#3A3C3D' }}>
      {children}
    </td>
  );
}