import React from 'react';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { formatMessage } from 'umi/locale';
import SiderMenu from '@/components/SiderMenu';
import Authorized from '@/utils/Authorized';
import SettingDrawer from '@/components/SettingDrawer';
import logo from '../assets/logo.svg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import Exception403 from '../pages/Exception/403';

const { Content } = Layout;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  state = {
    rendering: true,
    isMobile: false,
    // menuData: this.getMenuData(),

    menuData: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        icon: 'dashboard',
        locale: 'menu.dashboard',
        children: [
          {
            path: '/dashboard/analysis',
            name: '分析页',
            exact: true,
            locale: 'menu.dashboard.analysis',
          },
          {
            path: '/dashboard/monitor',
            name: '监控页',
            exact: true,
            locale: 'menu.dashboard.monitor',
          },
          {
            path: '/dashboard/workplace',
            name: '工作台',
            exact: true,
            locale: 'menu.dashboard.workplace',
          },
        ],
      },
      {
        path: '/form',
        icon: 'form',
        name: '表单页',
        locale: 'menu.form',
        children: [
          {
            path: '/form/basic-form',
            name: '基础表单',
            // component: './Forms/BasicForm',
            exact: true,
            locale: 'menu.form.basicform',
          },
          {
            path: '/form/step-form',
            name: '分步表单',
            hideChildrenInMenu: true,
            locale: 'menu.form.stepform',
            children: [
              {
                path: '/form/step-form/info',
                name: '分步表单（填写转账信息）',
                exact: true,
                locale: 'menu.form.stepform.info',
              },
              {
                path: '/form/step-form/confirm',
                name: '分步表单（确认转账信息）',
                exact: true,
                locale: 'menu.form.stepform.confirm',
              },
              {
                path: '/form/step-form/result',
                name: '分步表单（完成）',
                exact: true,
                locale: 'menu.form.stepform.result',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: '高级表单',
            // authority: ['admin'],
            exact: true,
            locale: 'menu.form.advancedform',
          },
        ],
      },
      {
        path: '/list',
        icon: 'table',
        name: '列表页',
        locale: 'menu.list',
        children: [
          {
            path: '/list/table-list',
            name: '查询表格',
            exact: true,
            locale: 'menu.list.searchtable',
          },
          {
            path: '/list/basic-list',
            name: '标准列表',
            exact: true,
            locale: 'menu.list.basiclist',
          },
          {
            path: '/list/card-list',
            name: '卡片列表',
            exact: true,
            locale: 'menu.list.cardlist',
          },
          {
            path: '/list/search',
            name: '搜索列表',
            locale: 'menu.list.searchlist',
            children: [
              {
                path: '/list/search/articles',
                name: '搜索列表（文章）',
                exact: true,
                locale: 'menu.list.searchlist.articles',
              },
              {
                path: '/list/search/projects',
                name: '搜索列表（项目）',
                exact: true,
                locale: 'menu.list.searchlist.projects',
              },
              {
                path: '/list/search/applications',
                name: '搜索列表（应用）',
                exact: true,
                locale: 'menu.list.searchlist.applications',
              },
            ],
          },
        ],
      },
      {
        path: '/profile',
        name: '详情页',
        icon: 'profile',
        locale: 'menu.profile',
        children: [
          {
            path: '/profile/basic',
            name: '基础详情页',
            exact: true,
            locale: 'menu.profile.basic',
          },
          {
            path: '/profile/advanced',
            name: '高级详情页',
            authority: ['admin'],
            exact: true,
            locale: 'menu.profile.advanced',
          },
        ],
      },
      {
        name: '结果页',
        icon: 'check-circle-o',
        path: '/result',
        locale: 'menu.result',
        children: [
          {
            path: '/result/success',
            name: '成功页',
            exact: true,
            locale: 'menu.result.success',
          },
          {
            path: '/result/fail',
            name: '失败页',
            exact: true,
            locale: 'menu.result.fail',
          },
        ],
      },
      {
        name: '异常页',
        icon: 'warning',
        path: '/exception',
        locale: 'menu.exception',
        children: [
          {
            path: '/exception/403',
            name: '403',
            exact: true,
            locale: 'menu.exception.not-permission',
          },
          {
            path: '/exception/404',
            name: '404',
            exact: true,
            locale: 'menu.exception.not-find',
          },
          {
            path: '/exception/500',
            name: '500',
            exact: true,
            locale: 'menu.exception.server-error',
          },
          {
            path: '/exception/trigger',
            name: '触发错误',
            hideInMenu: true,
            exact: true,
            // locale: 'menu.exception.trigger',
          },
        ],
      },
      {
        name: '这是个人页',
        icon: 'user',
        path: '/account',
        locale: 'menu.account',
        children: [
          {
            path: '/account/center',
            name: '这是个人中心',
            // locale: 'menu.account.center',
            children: [],
          },
          {
            path: '/account/settings',
            name: '个人设置',
            // locale: 'menu.account.settings',
            children: [],
          },
        ],
      },
    ],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'setting/getSetting',
    });
    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false,
      });
    });
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        });
      }
    });
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    const { isMobile } = this.state;
    const { collapsed } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
    };
  }

  getMenuData() {
    const {
      route: { routes },
    } = this.props;
    return memoizeOneFormatter(routes);
  }

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(this.getMenuData());
    return routerMap;
  }

  matchParamsPath = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap).find(key =>
      pathToRegexp(key).test(pathname)
    );
    return this.breadcrumbNameMap[pathKey];
  };

  getPageTitle = pathname => {
    const currRouterData = this.matchParamsPath(pathname);

    if (!currRouterData) {
      return 'Ant Design Pro';
    }
    const message = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });
    return `${message} - Ant Design Pro`;
  };

  getLayoutStyle = () => {
    const { isMobile } = this.state;
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      margin: '24px 24px 0',
      paddingTop: fixedHeader ? 64 : 0,
    };
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  renderSettingDrawer() {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    const { rendering } = this.state;
    if ((rendering || process.env.NODE_ENV === 'production') && APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer />;
  }

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
    } = this.props;
    const { isMobile, menuData } = this.state;
    console.log('menuData: ', JSON.stringify(menuData));
    const isTop = PropsLayout === 'topmenu';
    const routerConfig = this.matchParamsPath(pathname);
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            Authorized={Authorized}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content style={this.getContentStyle()}>
            <Authorized
              authority={routerConfig && routerConfig.authority}
              noMatch={<Exception403 />}
            >
              {children}
            </Authorized>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        {this.renderSettingDrawer()}
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  ...setting,
}))(BasicLayout);
