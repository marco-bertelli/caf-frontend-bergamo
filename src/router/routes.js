import { t } from 'boot/i18n'
import { USER_ROLES } from 'src/utils/const'
import Blank from 'layouts/Blank'
import Users from 'pages/users/Users'
import Header from 'components/layout/Header'
import Sidebar from 'components/layout/Sidebar'
import User from 'pages/users/User'
import Clients from 'pages/clients/Clients'
import Client from 'pages/clients/Client'
import Articles from 'pages/articles/Articles'
import Article from 'pages/articles/Article'
import Receipts from 'pages/receipts/Receipts'
import Receipt from 'pages/receipts/Receipt'
import ReceiptGroups from 'pages/receipts/ReceiptGroups'
import ReceiptGroup from 'pages/receipts/ReceiptGroup'
import Offices from 'pages/offices/Offices'
import Office from 'pages/offices/Office'
import Dashboard from 'pages/dashboard/Dashboard'

const Layout = {
  components: {
    default: Users,
    header: Header,
    sidebar: Sidebar
  },
  props: {
    sidebar: {
      items: [
        {
          text: t('common.dashboard'),
          routeName: 'dashboard',
          role: [USER_ROLES.ADMIN],
          icon: 'fas fa-home'
        },
        {
          text: t('users.entityPlural'),
          routeName: 'users',
          role: [USER_ROLES.ADMIN],
          icon: 'fas fa-user'
        },
        {
          text: t('clients.entityPlural'),
          routeName: 'clients',
          role: [USER_ROLES.ADMIN, USER_ROLES.USER],
          icon: 'fas fa-user-tag'
        },
        {
          text: t('articles.entityPlural'),
          routeName: 'articles',
          role: [USER_ROLES.ADMIN, USER_ROLES.USER],
          icon: 'fas fa-sitemap'
        },
        {
          text: t('offices.entityPlural'),
          routeName: 'offices',
          role: [USER_ROLES.ADMIN],
          icon: 'fas fa-building'
        },
        {
          text: t('receipts.entityPlural'),
          routeName: 'receipts',
          role: [USER_ROLES.ADMIN, USER_ROLES.USER],
          icon: 'fas fa-file-invoice'
        }
      ]
    }
  }
}

const loginRoute = {
  path: '/login',
  name: 'login',
  component: () => import('layouts/Login.vue')
}

const mainRoutes = {
  path: '/',
  component: () => import('layouts/Layout.vue'),
  redirect: '/',
  children: [
    {
      path: 'dashboard',
      name: 'dashboard',
      components: { ...Layout.components, default: Dashboard },
      props: Layout.props
    },
    {
      path: 'users',
      name: 'users',
      components: { ...Layout.components, default: Users },
      props: Layout.props
    },
    {
      path: 'users/:id',
      name: 'usersDetail',
      components: { ...Layout.components, default: User },
      props: Layout.props
    },
    {
      path: 'clients',
      name: 'clients',
      components: { ...Layout.components, default: Clients },
      props: Layout.props
    },
    {
      path: 'clients/:id',
      name: 'clientsDetail',
      components: { ...Layout.components, default: Client },
      props: Layout.props
    },
    {
      path: 'articles',
      name: 'articles',
      components: { ...Layout.components, default: Articles },
      props: Layout.props
    },
    {
      path: 'articles/:id',
      name: 'articlesDetail',
      components: { ...Layout.components, default: Article },
      props: Layout.props
    },
    {
      path: 'receipts',
      name: 'receipts',
      components: { ...Layout.components, default: Receipts },
      props: Layout.props
    },
    {
      path: 'offices',
      name: 'offices',
      components: { ...Layout.components, default: Offices },
      props: Layout.props
    },
    {
      path: 'offices/:id',
      name: 'officesDetail',
      components: { ...Layout.components, default: Office },
      props: Layout.props
    },
    {
      path: 'receipts/:id',
      components: { ...Layout.components, default: Receipt },
      props: Layout.props,
      children: [
        {
          name: 'receiptsDetail',
          path: '',
          components: { default: ReceiptGroups }
        },
        {
          name: 'receiptGroups',
          path: 'receiptGroups/:receiptGroupId',
          components: { default: ReceiptGroup }
        }
      ]
    }
  ]
}

const routes = [
  {
    name: 'entry',
    path: '',
    component: Blank,
    children: [mainRoutes]
  },
  loginRoute,
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorPageNotFound.vue')
  }
]
export default routes
