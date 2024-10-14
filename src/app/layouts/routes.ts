import { RouteInfo } from "../models/util/routes.model";

export const ADMIN_ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '' },
    { path: 'user-profile', title: 'User Profile', icon: 'ni-single-02 text-yellow', class: '' },
    { path: 'tables', title: 'Tables', icon: 'ni-bullet-list-67 text-red', class: '' },
    { path: 'icons', title: 'Icons', icon: 'ni-planet text-blue', class: '' },
    { path: 'maps', title: 'Maps', icon: 'ni-pin-3 text-orange', class: '' }
];

export const STUDENT_ROUTES: RouteInfo[] = [
    { path: 'products', title: 'Products', icon: 'ni-bullet-list-67 text-red', class: '' },
    { path: 'transactions', title: 'Transactions', icon: 'ni-single-copy-04 text-blue', class: '' },
    { path: 'shoppingcart', title: 'Shopping Cart', icon: 'ni-cart text-blue', class: '' },
    { path: 'user-profile', title: 'User Profile', icon: 'ni-single-02 text-yellow', class: '' }
];

export const CUSTODIAN_ROUTES: RouteInfo[] = [
    { path: 'orders', title: 'Orders', icon: 'ni-basket text-yellow', class: '' },
    { path: 'transactions', title: 'Transactions', icon: 'ni-single-copy-04 text-blue', class: '' },
    { path: 'products', title: 'Products', icon: 'ni-app text-red', class: '' },
    { path: 'user-profile', title: 'User Profile', icon: 'ni-single-02 text-yellow', class: '' }
];

export const ACCOUNTANT_ROUTES: RouteInfo[] = [
    { path: 'transactions', title: 'Transactions', icon: 'ni-single-copy-04 text-blue', class: '' },
    { path: 'user-profile', title: 'User Profile', icon: 'ni-single-02 text-yellow', class: '' }
];