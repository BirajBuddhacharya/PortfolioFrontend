import { redirect } from 'next/navigation';

export default function AdminAboutRedirect() {
  redirect('/admin/profile');
}
