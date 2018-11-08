import request from '@/utils/request';

export default async function queryMenus() {
  return request('/api/menus');
}
