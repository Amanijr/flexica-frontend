// Redirect for alternative misspelling `/vendorsDasboard` -> `/VendorDashboard`
import { redirect } from 'next/navigation';

export default function VendorsDasboardRedirect() {
  redirect('/VendorDashboard');
}
