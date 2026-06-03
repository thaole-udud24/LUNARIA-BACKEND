import request from '../base/request'; 
import type { DashboardResponse } from './types';
export async function getDashboardData() {
  return request<DashboardResponse>('/api/admin/dashboard', {
    method: 'GET',
  });
}