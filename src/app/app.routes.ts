import { Routes } from '@angular/router';
import { DashboardPage } from './features/dashboard/pages/dashboard-page/dashboard-page';
import { CustomerManagementPage } from './features/dashboard/pages/customer-management-page/customer-management-page';
import { PlaceholderPage } from './features/dashboard/pages/placeholder-page/placeholder-page';

export const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    title: 'Dashboard | Northstar CRM',
  },
  {
    path: 'customers',
    component: CustomerManagementPage,
    title: 'Customers | Northstar CRM',
    data: { pageTitle: 'Customers' },
  },
  {
    path: 'reports',
    component: PlaceholderPage,
    title: 'Reports | Northstar CRM',
    data: { pageTitle: 'Reports', description: 'Your CRM reports will be available here.' },
  },
  {
    path: 'settings',
    component: PlaceholderPage,
    title: 'Settings | Northstar CRM',
    data: { pageTitle: 'Settings', description: 'Workspace settings will be available here.' },
  },
];
