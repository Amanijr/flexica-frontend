// components/dashboard/SalesView.tsx

import SalesTable from './SalesTable';
import { Sale } from './types';

interface SalesViewProps {
  sales: Sale[];
}

const SalesView = ({ sales }: SalesViewProps) => {
  return (
    <div className="space-y-6">
      <SalesTable sales={sales} />
    </div>
  );
};

export default SalesView;