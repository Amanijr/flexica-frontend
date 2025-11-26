// Redirect for common misspelling `/venderdasboard` -> `/VendorDashboard`
import { redirect } from 'next/navigation';

export default function VenderRedirect() {
  redirect('/VendorDashboard');
}
