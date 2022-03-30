import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilStar,
  cilUser,
  cilRestaurant,
  cilHome,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const Nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavTitle,
    name: 'Users',
  },
  {
    component: CNavItem,
    name: 'Customers',
    to: '/customers',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Order',
    to: '/order',
    icon: <CIcon icon={cilRestaurant} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Delivery',
        to: '/order/delivery',
      },
      {
        component: CNavItem,
        name: 'Reservation',
        to: '/order/reservation',
      },
      {
        component: CNavItem,
        name: 'Dine in',
        to: '/order/dinein',
      },
      {
        component: CNavItem,
        name: 'Pickup',
        to: '/order/pickup',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Branches',
    to: '/branches',
    icon: <CIcon icon={cilRestaurant} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Menu',
  },
  {
    component: CNavItem,
        name: 'Categories',
        to: '/menu',
    icon: <CIcon icon={cilRestaurant} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
        name: 'Menu Items',
        to: '/items',
    icon: <CIcon icon={cilRestaurant} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Mobile App',
  },
  {
    component: CNavTitle,
    name: 'Extras',
  },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
    ],
  },
]

export default Nav
